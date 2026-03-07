import { config } from "dotenv";
config({ path: ".env.local" });
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import fetch, { RequestInit as NodeFetchRequestInit } from "node-fetch";
import https from "node:https";

const agent = new https.Agent({ family: 4 });
const customFetch = (url: URL | string, options?: RequestInit | object) => {
  const fetchOptions = { ...options, agent } as Record<string, unknown>;
  if (fetchOptions.body === null) delete fetchOptions.body;
  return fetch(url.toString(), fetchOptions as NodeFetchRequestInit);
};

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

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

const db = drizzle(pool);

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
