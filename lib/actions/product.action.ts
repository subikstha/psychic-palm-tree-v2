"use server";

import db from "@/db";
import { product } from "@/db/schema";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { convertToPlainObject } from "../utils";
import { eq } from "drizzle-orm";

export async function getLatestProducts() {
  try {
    const data = await db
      .select()
      .from(product)
      .limit(LATEST_PRODUCTS_LIMIT)
      .orderBy(product.name);

    return convertToPlainObject(data);
  } catch (error) {
    console.error("error", error);
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const [data] = await db
      .select()
      .from(product)
      .where(eq(product.slug, slug));
    return convertToPlainObject(data);
  } catch (error) {
    console.error("Error getting product by slug", error);
  }
}
