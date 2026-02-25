"use server";

import db from "@/db";
import { product } from "@/db/schema";
import { LATEST_PRODUCTS_LIMIT } from "../constants";
import { convertToPlainObject } from "../utils";

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
