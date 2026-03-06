"use server";

import { auth } from "@/auth";
import db from "@/db";
import { cart, product } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { CartItem } from "@/types";
import { cartItemSchema, inserCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("No session cart id found");

  const session = await auth();
  const userId = session?.user?.id ? session.user.id : undefined;
  console.log("Session cart id and user id", sessionCartId, userId);
  const idToCheck = userId ? userId : sessionCartId;
  console.log("ID to check", idToCheck);

  //   Get cart from the data base
  try {
    const [data] = await db
      .select()
      .from(cart)
      .where(
        userId
          ? eq(cart.userId, userId)
          : eq(cart.sessionCartId, sessionCartId),
      );
    console.log("Cart data from server action", data);
    return convertToPlainObject(data);
  } catch (error) {
    console.error("Error getting cart data", error);
  }
}

export async function addItemToCart(data: CartItem) {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("Cart session not found");

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get Cart
  const existingCart = await getMyCart();

  // Parse and validate item
  const item = cartItemSchema.parse(data);

  // Find product from db
  const [productInDb] = await db
    .select()
    .from(product)
    .where(eq(product.id, data.productId)); // Order matters here, we need to specify the column to match as the first parameter

  if (!product) throw new Error("No product found");

  // If there is no cart associated with this user then we need to create a cart
  if (!existingCart) {
    // Need to create a new cart object
    const newCart = inserCartSchema.parse({
      userId: userId,
      items: [item],
      sessionCartId: sessionCartId,
      ...calcPrice([item]),
    });

    await db.insert(cart).values(newCart);

    // Revalidate the product page
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} added to cart`,
    };
  } else {
    // This means we need to update the cart items in the cart
    // Check if item is already in cart
    const existItem = (existingCart.items as CartItem[]).find(
      (x) => x.productId === item.productId,
    );

    if (existItem) {
      // Check Stock
      if (productInDb.stock < existItem.qty + 1) {
        throw new Error("Not enough stock");
      }

      // Increase Quantity
      (existingCart.items as CartItem[]).find(
        (x) => x.productId === item.productId,
      )!.qty = existItem.qty + 1;
    } else {
      // If item does not exist in cart
      // Check stock
      if (productInDb.stock < 1) throw new Error("Not Enough Stock");

      // Add item to the cart.items
      existingCart.items.push(item);
    }

    // Save to DB
    await db
      .update(cart)
      .set({ items: existingCart.items, ...calcPrice(existingCart.items) })
      .where(eq(cart.id, existingCart.id));

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} ${existItem ? "updated in" : "added to"} cart`,
    };
  }
}

export async function removeItemFromCart(productId: string) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Cart session not found");

    // Get Product
    const [productInDb] = await db
      .select()
      .from(product)
      .where(eq(product.id, productId));

    if (!productInDb) throw new Error("Product not found");

    // Get user cart
    const cartData = await getMyCart();

    if (!cartData) throw new Error("Cart not found");

    // Check for item
    const exist = (cartData.items as CartItem[]).find(
      (x) => x.productId === productId,
    );
    if (!exist) throw new Error("Item not found");

    // Check if only one in quantity
    if (exist.qty === 1) {
      // Remove from cart
      cartData.items = (cartData.items as CartItem[]).filter(
        (x) => x.productId !== exist.productId,
      );
    } else {
      // Decrease the quantity
      (cartData.items as CartItem[]).find(
        (x) => x.productId === productId,
      )!.qty = exist.qty - 1;
    }

    // Update database
    await db
      .update(cart)
      .set({
        items: cartData.items,
        ...calcPrice(cartData.items as CartItem[]),
      })
      .where(eq(cart.id, cartData.id));

    revalidatePath(`/product/${productInDb.slug}`);

    return {
      success: true,
      message: `${productInDb.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: await formatError(error) };
  }
}
