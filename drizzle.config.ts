import { config } from "dotenv";
config({ path: ".env.local" });
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts", // your Drizzle tables
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // and this will be defined after we import dotenv/config
  },
  verbose: true,
  strict: true,
});
