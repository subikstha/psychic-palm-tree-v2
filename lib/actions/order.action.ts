"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { convertToPlainObject, formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.action";
import { insertOrderSchema, shippingAddressSchema } from "../validators";
import { cart, order, orderItems, product } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import db from "@/db";
import { CartItem, PaymentResult, PaymentResult } from "@/types";
import { paypal } from "../paypal";
import { revalidatePath } from "next/cache";

// Create order and order items
export async function createOrder() {
  console.log("Create order server action called");
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const userCart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    if (!userCart || userCart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    // Create the order object that we want to submit
    const orderToSubmit = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: userCart.itemsPrice,
      taxPrice: userCart.taxPrice,
      shippingPrice: userCart.shippingPrice,
      totalPrice: userCart.totalPrice,
    });

    // Create a transaction to create order and order items
    const insertedOrderId = await db.transaction(async (tx) => {
      // Create the order
      const [insertedOrder] = await tx
        .insert(order)
        .values(orderToSubmit)
        .returning();

      // Create the order items from the cart items and update stock
      for (const item of userCart.items as CartItem[]) {
        // Check stock
        const [productInDb] = await tx
          .select({ stock: product.stock })
          .from(product)
          .where(eq(product.id, item.productId));

        if (!productInDb || productInDb.stock < item.qty) {
          throw new Error(`Insufficient stock for ${item.name}`);
        }

        // Decrement stock
        await tx
          .update(product)
          .set({ stock: productInDb.stock - item.qty })
          .where(eq(product.id, item.productId));

        // Insert order item
        await tx.insert(orderItems).values({
          ...item,
          price: item.price,
          orderId: insertedOrder.id,
        });
      }

      // Clear user cart
      await tx
        .update(cart)
        .set({
          items: [],
          totalPrice: "0",
          taxPrice: "0",
          shippingPrice: "0",
          itemsPrice: "0",
        })
        .where(eq(cart.id, userCart.id));

      return insertedOrder.id; // The whole transaction is returning this
    });

    if (!insertedOrderId) throw new Error("Order could not be created");
    console.log("inserted order id", insertedOrderId);
    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error; // ? Why check this
    return {
      success: false,
      message: await formatError(error),
    };
  }
}

export async function getOrderById(orderId: string) {
  const data = await db.query.order.findFirst({
    where: eq(order.id, orderId),
    with: {
      orderItems: true,
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
  });

  return convertToPlainObject(data);
}

// Create a new paypal order
export async function createPayPalOrder(orderId: string) {
  try {
    // Get order from database
    const orderData = await db.query.order.findFirst({
      where: eq(order.id, orderId),
    });
    if (orderData) {
      // Create a new paypal order
      const paypalOrder = await paypal.createOrder(
        Number(orderData.totalPrice),
      );

      // Update the order with the paypalOrder
      await db
        .update(order)
        .set({
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            pricePaid: 0,
          },
        })
        .where(eq(order.id, orderId));

      return {
        success: true,
        message: "Item order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Approve paypal order and update order to paid
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string },
) {
  try {
    // Get order from database
    const orderData = await db.query.order.findFirst({
      where: eq(order.id, orderId),
    });
    if (!orderData) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);

    if (
      !captureData ||
      captureData.id !== (orderData.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in paypal payment");
    }

    //Update the order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0].payments.captures[0].amount.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Your order has been paid",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  const orderData = await db.query.order.findFirst({
    where: eq(order.id, orderId),
    with: {
      orderItems: true,
    },
  });

  if (!orderData) throw new Error("Order not found");

  // First check to see if it is paid
  if (orderData.isPaid) throw new Error("Order is already paid");

  // Transaction to update order and account for product stock
  await db.transaction(async (tx) => {
    // Iterate over the products and update the stock
    for (const item of orderData.orderItems) {
      await tx
        .update(product)
        .set({
          stock: sql`${product.stock} - ${item.qty}`, // This ensures the subtraction happens at the database level
        })
        .where(eq(product.id, item.productId));
    }

    // Update the order to paid
    await tx
      .update(order)
      .set({
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      })
      .where(eq(order.id, orderId));
  });

  // Get updated order after transaction
  const updatedOrder = await db.query.order.findFirst({
    where: eq(order.id, orderId),
    with: {
      orderItems: true,
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!updatedOrder) throw new Error("Order not found");
}
