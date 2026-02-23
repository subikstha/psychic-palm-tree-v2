import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { remember } from "@epic-web/remember";

import * as schema from "./schema";

const client = remember("dbPool", () => neon(process.env.DATABASE_URL!));
export const db = drizzle(client, { schema });

export default db;
