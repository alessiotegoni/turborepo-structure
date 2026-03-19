import { relations } from "drizzle-orm";

import { profiles } from "../profiles/schema";
import { creatorProfiles } from "./schema";

export const creatorProfilesRelations = relations(
  creatorProfiles,
  ({ one }) => ({
    profile: one(profiles, {
      fields: [creatorProfiles.userId],
      references: [profiles.id],
    }),
  }),
);
