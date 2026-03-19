import { relations } from "drizzle-orm";

import { profiles } from "../profiles/schema";
import { subscriptionPlans } from "../subscription-plans/schema";
import { subscriptions } from "./schema";

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
