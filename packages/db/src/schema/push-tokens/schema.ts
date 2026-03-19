import {
  foreignKey,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { profiles } from "../profiles/schema";

export const pushTokens = pgTable(
  "push_tokens",
  {
    userId: uuid("user_id").notNull(),
    token: text().notNull(),
    deviceType: text("device_type"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "push_tokens_user_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.token],
      name: "push_tokens_pkey",
    }),
  ],
);

export type PushToken = typeof pushTokens.$inferSelect;
