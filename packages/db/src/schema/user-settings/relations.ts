import { relations } from "drizzle-orm";

import { profiles } from "../profiles/schema";
import { userSettings } from "./schema";

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  profile: one(profiles, {
    fields: [userSettings.userId],
    references: [profiles.id],
  }),
}));
