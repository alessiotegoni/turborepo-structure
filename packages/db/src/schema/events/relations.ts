import { relations } from "drizzle-orm";

import { bookmarks } from "../bookmarks/schema";
import { categories } from "../categories/schema";
import { eventCommunications } from "../event-communications/schema";
import { profiles } from "../profiles/schema";
import { ticketTypes } from "../ticket-types/schema";
import { tickets } from "../tickets/schema";
import { events } from "./schema";

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
