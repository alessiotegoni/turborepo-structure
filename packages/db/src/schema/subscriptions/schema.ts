import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { profiles } from "../profiles/schema";
import { subscriptionPlans } from "../subscription-plans/schema";

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid("user_id").notNull(),
    planId: uuid("plan_id").notNull(),
    stripeSubscriptionId: text("stripe_subscription_id"),
    status: text().default("active").notNull(),
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
      mode: "date",
    }),
    currentPeriodEnd: timestamp("current_period_end", {
      withTimezone: true,
      mode: "date",
    }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_subscriptions_status").using(
      "btree",
      table.status.asc().nullsLast().op("text_ops"),
    ),
    index("idx_subscriptions_user").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.planId],
      foreignColumns: [subscriptionPlans.id],
      name: "subscriptions_plan_id_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "subscriptions_user_id_fkey",
    }).onDelete("cascade"),
    unique("subscriptions_stripe_subscription_id_key").on(
      table.stripeSubscriptionId,
    ),
  ],
);

export type Subscription = typeof subscriptions.$inferSelect;
