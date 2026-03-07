import { config } from "dotenv";
config({ path: ".env.local" });

export default {
  schema: "./db/schema.ts", // your Drizzle tables
  out: "./db/migrations",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },

  verbose: true,
  strict: true,
};
