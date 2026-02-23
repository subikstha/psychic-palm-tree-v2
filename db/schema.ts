import { pgTable, varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default("No_Name"),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", { precision: 6 }),
  image: varchar("image", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
