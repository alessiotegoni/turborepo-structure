import { relations, sql } from "drizzle-orm";
import {
  doublePrecision,
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { bookmarks } from "./bookmarks";
import { categories } from "./categories";
import { eventCommunications } from "./event-communications";
import { profiles } from "./profiles";
import { ticketTypes } from "./ticket-types";
import { tickets } from "./tickets";

export const events = pgTable(
  "events",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    creatorId: uuid("creator_id").notNull(),
    title: text().notNull(),
    description: text(),
    eventType: text("event_type").default("onsite").notNull(),
    eventLink: text("event_link"),
    address: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    startsAt: timestamp("starts_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true, mode: "string" }),
    coverImageUrl: text("cover_image_url"),
    categoryId: uuid("category_id"),
    status: text().default("draft").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_events_category").using(
      "btree",
      table.categoryId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_events_creator").using(
      "btree",
      table.creatorId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_events_location").using(
      "btree",
      table.latitude.asc().nullsLast().op("float8_ops"),
      table.longitude.asc().nullsLast().op("float8_ops"),
    ),
    index("idx_events_starts_at").using(
      "btree",
      table.startsAt.asc().nullsLast().op("timestamptz_ops"),
    ),
    index("idx_events_status").using(
      "btree",
      table.status.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "events_category_id_fkey",
    }),
    foreignKey({
      columns: [table.creatorId],
      foreignColumns: [profiles.id],
      name: "events_creator_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const eventsRelations = relations(events, ({ one, many }) => ({
  ticketTypes: many(ticketTypes),
  tickets: many(tickets),
  category: one(categories, {
    fields: [events.categoryId],
    references: [categories.id],
  }),
  profile: one(profiles, {
    fields: [events.creatorId],
    references: [profiles.id],
  }),
  eventCommunications: many(eventCommunications),
  bookmarks: many(bookmarks),
}));

export type Event = typeof events.$inferSelect;
