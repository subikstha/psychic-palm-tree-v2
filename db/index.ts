import dns from "node:dns";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { remember } from "@epic-web/remember";

dns.setDefaultResultOrder("ipv4first");

/**
 * Handles special characters in database passwords by URL-encoding them.
 */
function getConnectionString(url: string | undefined) {
  if (!url) return undefined;
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

const pool = remember("dbPool_v2", () => {
  return new Pool({
    connectionString: getConnectionString(process.env.DATABASE_URL_SUPABASE),
    max: 10, // Good for direct connection
  });
});

export const db = drizzle(pool, { schema });

export default db;
