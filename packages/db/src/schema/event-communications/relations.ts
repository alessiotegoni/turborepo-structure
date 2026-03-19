import { relations } from "drizzle-orm";

import { events } from "../events/schema";
import { profiles } from "../profiles/schema";
import { eventCommunications } from "./schema";

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
