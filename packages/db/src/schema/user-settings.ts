import { relations } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { profiles } from "./profiles";

export const userSettings = pgTable(
  "user_settings",
  {
    userId: uuid("user_id").primaryKey().notNull(),
    pushNotifications: boolean("push_notifications").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "user_settings_user_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  profile: one(profiles, {
    fields: [userSettings.userId],
    references: [profiles.id],
  }),
}));

export type UserSettings = typeof userSettings.$inferSelect;
