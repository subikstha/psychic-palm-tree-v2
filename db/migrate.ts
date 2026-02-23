import { config } from "dotenv";
config({ path: ".env.local" });
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import fetch from "node-fetch";
import https from "node:https";

const agent = new https.Agent({ family: 4 });
const customFetch = (url: any, options: any) =>
  fetch(url, { ...options, agent });

import { migrate } from "drizzle-orm/neon-http/migrator";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";

// Use node-fetch for HTTP requests since global fetch is failing in this environment
neonConfig.fetchFunction = customFetch;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in .env.local");
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

const main = async () => {
  try {
    console.log("Applying migrations...");
    await migrate(db, { migrationsFolder: "./db/migrations" });
    console.log("Migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

main();
