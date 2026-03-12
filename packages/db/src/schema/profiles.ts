import { relations } from "drizzle-orm";
import {
  date,
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

import { bookmarks } from "./bookmarks";
import { creatorProfiles } from "./creator-profiles";
import { eventCommunications } from "./event-communications";
import { events } from "./events";
import { payments } from "./payments";
import { pushTokens } from "./push-tokens";
import { subscriptions } from "./subscriptions";
import { tickets } from "./tickets";
import { userCategories } from "./user-categories";
import { userSettings } from "./user-settings";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid().primaryKey().notNull(),
    email: text().notNull(),
    name: text(),
    surname: text(),
    avatarUrl: text("avatar_url"),
    gender: text(),
    bio: text(),
    role: text().default("user").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    phone: text(),
    dateOfBirth: date("date_of_birth"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
      name: "profiles_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  tickets: many(tickets),
  supabaseUser: one(authUsers, {
    fields: [profiles.id],
    references: [authUsers.id],
  }),
  creatorProfiles: many(creatorProfiles),
  userSettings: many(userSettings),
  subscriptions: many(subscriptions),
  payments: many(payments),
  events: many(events),
  eventCommunications: many(eventCommunications),
  userCategories: many(userCategories),
  bookmarks: many(bookmarks),
  pushTokens: many(pushTokens),
}));

export type Profile = typeof profiles.$inferSelect;

export const usersInAuthRelations = relations(authUsers, ({ many }) => ({
  profiles: many(profiles),
}));
