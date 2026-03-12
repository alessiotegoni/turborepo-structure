import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { events } from "./events";
import { profiles } from "./profiles";

export const eventCommunications = pgTable(
  "event_communications",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    eventId: uuid("event_id").notNull(),
    senderId: uuid("sender_id").notNull(),
    channel: text().default("push").notNull(),
    subject: text(),
    body: text().notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_communications_event").using(
      "btree",
      table.eventId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "event_communications_event_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.senderId],
      foreignColumns: [profiles.id],
      name: "event_communications_sender_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const eventCommunicationsRelations = relations(
  eventCommunications,
  ({ one }) => ({
    event: one(events, {
      fields: [eventCommunications.eventId],
      references: [events.id],
    }),
    profile: one(profiles, {
      fields: [eventCommunications.senderId],
      references: [profiles.id],
    }),
  }),
);

export type EventCommunication = typeof eventCommunications.$inferSelect;
