import { CartItem, ShippingAddress } from "@/types";
import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  integer,
  jsonb,
  decimal,
  numeric,
  primaryKey,
  uuid,
  boolean,
  text,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().default("No_Name"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", { precision: 6 }),
  image: varchar("image", { length: 255 }),
  address: jsonb("address").$type<ShippingAddress>(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull().default("user"),
  paymentMethod: varchar("payment_method", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id), // should be made nullable for guests
  sessionCartId: varchar("session_cart_id", { length: 255 }).notNull(),
  items: jsonb("items").$type<CartItem[]>().notNull().default([]),
  itemsPrice: numeric("items_price", { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  shippingPrice: numeric("shipping_price", {
    precision: 12,
    scale: 2,
  }).notNull(),
  taxPrice: numeric("tax_price", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const account = pgTable(
  "account",
  {
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refreshToken: varchar("refresh_token", { length: 255 }),
    accessToken: varchar("access_token", { length: 255 }),
    expiresAt: integer("expires_at"),
    scope: varchar("scope", { length: 255 }),
    idToken: varchar("id_token", { length: 255 }),
    sessionState: varchar("session_state", { length: 255 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
  ],
);

export const session = pgTable("session", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expires: timestamp("expires", { precision: 6 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const product = pgTable("product", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 255 }).notNull(),
  images: text("images").array().notNull(), // String array
  brand: varchar("brand", { length: 255 }).notNull(),
  description: text("description").notNull(),
  stock: integer("stock").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).default("0").notNull(),
  rating: numeric("rating", { precision: 12, scale: 3 }).default("0").notNull(),
  numReviews: integer("num_reviews").default(0).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  banner: varchar("banner", { length: 255 }),
  createdAt: timestamp("created_at", { precision: 6 }).defaultNow().notNull(),
});

export const order = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  shippingAddress: jsonb("shipping_address").$type<ShippingAddress>().notNull(),
  paymentMethod: varchar("payment_method", { length: 255 }).notNull(),
  paymentResult: jsonb("payment_result"),
  itemsPrice: numeric("items_price", { precision: 12, scale: 2 }).notNull(),
  shippingPrice: numeric("shipping_price", {
    precision: 12,
    scale: 2,
  }).notNull(),
  taxPrice: numeric("tax_price", { precision: 12, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
  isPaid: boolean("is_paid").default(false).notNull(),
  paidAt: timestamp("paid_at", { precision: 6 }),
  isDelivered: boolean("is_delivered").default(false).notNull(),
  deliveredAt: timestamp("delivered_at", { precision: 6 }),
  createdAt: timestamp("created_at", { precision: 6 }).defaultNow().notNull(),
});

export const orderItems = pgTable(
  "order_item",
  {
    orderId: uuid("order_id")
      .references(() => order.id, { onDelete: "cascade" })
      .notNull(),
    productId: uuid("product_id")
      .references(() => product.id)
      .notNull(),
    qty: integer("qty").notNull(),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    image: varchar("image", { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "orderitems_orderId_productId_pk",
      columns: [table.orderId, table.productId],
    }),
  ],
);

export const verificationToken = pgTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { precision: 6 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.identifier, table.token] }), // Composite PK
  ],
);

// Define relations for the order

// 1. Define relatiosn for the User
export const userRelations = relations(users, ({ many }) => ({
  carts: many(cart),
  accounts: many(account),
  sessions: many(session),
  orders: many(order),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(users, {
    fields: [session.userId],
    references: [users.id],
  }),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(users, {
    fields: [order.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(order, {
    fields: [orderItems.orderId],
    references: [order.id],
  }),
  product: one(product, {
    fields: [orderItems.productId],
    references: [product.id],
  }),
}));
