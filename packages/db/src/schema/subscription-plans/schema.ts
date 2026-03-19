import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const subscriptionPlans = pgTable(
  "subscription_plans",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: text().notNull(),
    stripePriceId: text("stripe_price_id").notNull(),
    priceCents: integer("price_cents").notNull(),
    interval: text().default("month").notNull(),
    features: jsonb().default({}),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("subscription_plans_stripe_price_id_key").on(table.stripePriceId),
  ],
);

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
