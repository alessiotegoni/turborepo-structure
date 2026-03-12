import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { profiles } from "./profiles";

export const payments = pgTable(
  "payments",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid("user_id").notNull(),
    type: text().notNull(),
    stripePaymentId: text("stripe_payment_id"),
    amountCents: integer("amount_cents").notNull(),
    status: text().default("pending").notNull(),
    metadata: jsonb().default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_payments_stripe").using(
      "btree",
      table.stripePaymentId.asc().nullsLast().op("text_ops"),
    ),
    index("idx_payments_user").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "payments_user_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  profile: one(profiles, {
    fields: [payments.userId],
    references: [profiles.id],
  }),
}));

export type Payment = typeof payments.$inferSelect;
