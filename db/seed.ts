import { config } from "dotenv";
config({ path: ".env.local" });

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import fetch, { RequestInit as NodeFetchRequestInit } from "node-fetch";
import https from "node:https";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import sampleData from "./sample-data";

const databaseUrl = process.env.DATABASE_URL_SUPABASE;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in .env.local");
}

/**
 * Handles special characters in database passwords by URL-encoding them.
 */
function getConnectionString(url: string) {
  try {
    new URL(url);
    return url;
  } catch (e) {
    const match = url.match(/(postgres(?:ql)?:\/\/)([^:]+):(.+)(@.+)/);
    if (match) {
      const [_, proto, user, pass, rest] = match;
      return `${proto}${user}:${encodeURIComponent(pass)}${rest}`;
    }
    return url;
  }
}

const pool = new Pool({
  connectionString: getConnectionString(databaseUrl),
});
const db = drizzle(pool, { schema });

async function main() {
  try {
    console.log("Seeding database...");

    // Clear existing data
    await db.delete(schema.users);
    await db.delete(schema.product);

    // Insert users
    console.log("Inserting users...");
    await db.insert(schema.users).values(sampleData.users);

    // Insert products
    console.log("Inserting products...");
    await db.insert(schema.product).values(sampleData.products);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

main();
