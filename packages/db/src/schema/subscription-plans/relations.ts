import { relations } from "drizzle-orm";

import { subscriptions } from "../subscriptions/schema";
import { subscriptionPlans } from "./schema";

export const subscriptionPlansRelations = relations(
  subscriptionPlans,
  ({ many }) => ({
    subscriptions: many(subscriptions),
  }),
);
