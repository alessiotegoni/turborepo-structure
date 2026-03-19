import {
  foreignKey,
  index,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { events } from "../events/schema";
import { profiles } from "../profiles/schema";

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: uuid("user_id").notNull(),
    eventId: uuid("event_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_bookmarks_event").using(
      "btree",
      table.eventId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_bookmarks_user").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "bookmarks_event_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "bookmarks_user_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.eventId],
      name: "bookmarks_pkey",
    }),
  ],
);

export type Bookmark = typeof bookmarks.$inferSelect;
