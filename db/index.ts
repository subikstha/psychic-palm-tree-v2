import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
import fetch, { RequestInit as NodeFetchRequestInit } from "node-fetch";
import https from "node:https";
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import { remember } from "@epic-web/remember";

import * as schema from "./schema";

const agent = new https.Agent({ family: 4 });
neonConfig.fetchFunction = (
  url: URL | string,
  options?: RequestInit | object,
) => {
  console.log("DB: Custom fetch called for:", url);
  const fetchOptions = { ...options, agent } as Record<string, unknown>;
  if (fetchOptions.body === null) delete fetchOptions.body;
  return fetch(url.toString(), fetchOptions as NodeFetchRequestInit);
};

console.log("DB: Initializing database client...");
const client = remember("dbPool_v2", () => {
  console.log("DB: Creating new neon client with DATABASE_URL");
  return neon(process.env.DATABASE_URL!);
});
export const db = drizzle(client, { schema });

export default db;
