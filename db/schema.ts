import {
  pgTable,
  varchar,
  timestamp,
  integer,
  jsonb,
  decimal,
  numeric,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().default("No_Name"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { precision: 6 }),
  image: varchar("image", { length: 255 }),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cart = pgTable("cart", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  userId: integer("userId")
    .references(() => users.id)
    .notNull(),
  sessionCartId: varchar("sessionCartId", { length: 255 }).notNull(),
  items: jsonb(),
  itemsPrice: numeric("itemsPrice", { precision: 12, scale: 2 }),
  totalPrice: numeric("itemsPrice", { precision: 12, scale: 2 }),
  shippingPrice: numeric("itemsPrice", { precision: 12, scale: 2 }),
  taxPrice: numeric("itemsPrice", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
