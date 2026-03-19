import { relations } from "drizzle-orm";

import { profiles } from "../profiles/schema";
import { payments } from "./schema";

export const paymentsRelations = relations(payments, ({ one }) => ({
  profile: one(profiles, {
    fields: [payments.userId],
    references: [profiles.id],
  }),
}));
