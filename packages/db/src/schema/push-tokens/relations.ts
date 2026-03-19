import { relations } from "drizzle-orm";

import { profiles } from "../profiles/schema";
import { pushTokens } from "./schema";

export const pushTokensRelations = relations(pushTokens, ({ one }) => ({
  profile: one(profiles, {
    fields: [pushTokens.userId],
    references: [profiles.id],
  }),
}));
