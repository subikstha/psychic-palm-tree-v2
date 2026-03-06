"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.action";
import { insertOrderSchema, shippingAddressSchema } from "../validators";
import { cart, order, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import db from "@/db";
import { CartItem } from "@/types";

// Create order and order items
export async function createOrder() {
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

      // Create the order items from the cart items
      for (const item of userCart.items as CartItem[]) {
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
