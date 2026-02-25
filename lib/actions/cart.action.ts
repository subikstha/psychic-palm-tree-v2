"use server";

import { auth } from "@/auth";
import db from "@/db";
import { cart } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { convertToPlainObject } from "../utils";

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) throw new Error("No session cart id found");

  const session = await auth();
  const userId = session?.user?.id ? session.user.id : undefined;

  //   Get cart from the data base
  try {
    const data = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId ? userId : sessionCartId));
    return convertToPlainObject(data);
  } catch (error) {
    console.error("Error getting cart data", error);
  }
}
