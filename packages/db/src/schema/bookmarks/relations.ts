import { relations } from "drizzle-orm";

import { events } from "../events/schema";
import { profiles } from "../profiles/schema";
import { bookmarks } from "./schema";

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
