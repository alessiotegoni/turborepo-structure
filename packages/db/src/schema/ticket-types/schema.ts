import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { events } from "../events/schema";

export const ticketTypes = pgTable(
  "ticket_types",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    eventId: uuid("event_id").notNull(),
    name: text().notNull(),
    priceCents: integer("price_cents").default(0).notNull(),
    maxQuantity: integer("max_quantity"),
    isFree: boolean("is_free").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_ticket_types_event").using(
      "btree",
      table.eventId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "ticket_types_event_id_fkey",
    }).onDelete("cascade"),
  ],
);

export type TicketType = typeof ticketTypes.$inferSelect;
