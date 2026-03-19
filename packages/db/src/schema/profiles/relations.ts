import { relations } from "drizzle-orm";
import { authUsers } from "drizzle-orm/supabase";

import { bookmarks } from "../bookmarks/schema";
import { creatorProfiles } from "../creator-profiles/schema";
import { eventCommunications } from "../event-communications/schema";
import { events } from "../events/schema";
import { payments } from "../payments/schema";
import { pushTokens } from "../push-tokens/schema";
import { subscriptions } from "../subscriptions/schema";
import { tickets } from "../tickets/schema";
import { userCategories } from "../user-categories/schema";
import { userSettings } from "../user-settings/schema";
import { profiles } from "./schema";

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

export const usersInAuthRelations = relations(authUsers, ({ many }) => ({
  profiles: many(profiles),
}));
