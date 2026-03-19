import { relations } from "drizzle-orm";

import { events } from "../events/schema";
import { profiles } from "../profiles/schema";
import { ticketTypes } from "../ticket-types/schema";
import { tickets } from "./schema";

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
