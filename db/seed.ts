import { config } from "dotenv";
config({ path: ".env.local" });

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import fetch, { RequestInit as NodeFetchRequestInit } from "node-fetch";
import https from "node:https";

import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";
import sampleData from "./sample-data";

const agent = new https.Agent({ family: 4 });
neonConfig.fetchFunction = (
  url: URL | string,
  options?: NodeFetchRequestInit | object,
) => {
  return fetch(url.toString(), {
    ...options,
    agent,
  } as NodeFetchRequestInit);
};

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in .env.local");
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

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
