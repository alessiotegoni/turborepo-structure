import { relations, sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { events } from "./events";
import { profiles } from "./profiles";
import { ticketTypes } from "./ticket-types";

export const tickets = pgTable(
  "tickets",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid("user_id").notNull(),
    eventId: uuid("event_id").notNull(),
    ticketTypeId: uuid("ticket_type_id").notNull(),
    checkedIn: boolean("checked_in").default(false).notNull(),
    checkedInAt: timestamp("checked_in_at", {
      withTimezone: true,
      mode: "date",
    }),
    stripePaymentId: text("stripe_payment_id"),
    amountPaidCents: integer("amount_paid_cents").default(0).notNull(),
    status: text().default("active").notNull(),
    refundStatus: text("refund_status"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_tickets_event").using(
      "btree",
      table.eventId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_tickets_status").using(
      "btree",
      table.status.asc().nullsLast().op("text_ops"),
    ),
    index("idx_tickets_user").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "tickets_event_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.ticketTypeId],
      foreignColumns: [ticketTypes.id],
      name: "tickets_ticket_type_id_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "tickets_user_id_fkey",
    }).onDelete("cascade"),
    unique("tickets_user_id_event_id_key").on(table.userId, table.eventId),
  ],
);

export const ticketsRelations = relations(tickets, ({ one }) => ({
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),
  ticketType: one(ticketTypes, {
    fields: [tickets.ticketTypeId],
    references: [ticketTypes.id],
  }),
  profile: one(profiles, {
    fields: [tickets.userId],
    references: [profiles.id],
  }),
}));

export type Ticket = typeof tickets.$inferSelect;
