import { relations } from "drizzle-orm/relations";
import { authUsers } from "drizzle-orm/supabase";

import {
  bookmarks,
  categories,
  creatorProfiles,
  eventCommunications,
  events,
  payments,
  profiles,
  pushTokens,
  subscriptionPlans,
  subscriptions,
  tickets,
  ticketTypes,
  userCategories,
  userSettings,
} from "./schema";

export const ticketTypesRelations = relations(ticketTypes, ({ one, many }) => ({
  event: one(events, {
    fields: [ticketTypes.eventId],
    references: [events.id],
  }),
  tickets: many(tickets),
}));

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

export const creatorProfilesRelations = relations(
  creatorProfiles,
  ({ one }) => ({
    profile: one(profiles, {
      fields: [creatorProfiles.userId],
      references: [profiles.id],
    }),
  }),
);

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  profile: one(profiles, {
    fields: [userSettings.userId],
    references: [profiles.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  subscriptionPlan: one(subscriptionPlans, {
    fields: [subscriptions.planId],
    references: [subscriptionPlans.id],
  }),
  profile: one(profiles, {
    fields: [subscriptions.userId],
    references: [profiles.id],
  }),
}));

export const subscriptionPlansRelations = relations(
  subscriptionPlans,
  ({ many }) => ({
    subscriptions: many(subscriptions),
  }),
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  profile: one(profiles, {
    fields: [payments.userId],
    references: [profiles.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  events: many(events),
  userCategories: many(userCategories),
}));

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

export const userCategoriesRelations = relations(userCategories, ({ one }) => ({
  category: one(categories, {
    fields: [userCategories.categoryId],
    references: [categories.id],
  }),
  profile: one(profiles, {
    fields: [userCategories.userId],
    references: [profiles.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  event: one(events, {
    fields: [bookmarks.eventId],
    references: [events.id],
  }),
  profile: one(profiles, {
    fields: [bookmarks.userId],
    references: [profiles.id],
  }),
}));

export const pushTokensRelations = relations(pushTokens, ({ one }) => ({
  profile: one(profiles, {
    fields: [pushTokens.userId],
    references: [profiles.id],
  }),
}));
