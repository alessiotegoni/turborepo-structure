import { relations } from "drizzle-orm";

import { events } from "../events/schema";
import { tickets } from "../tickets/schema";
import { ticketTypes } from "./schema";

export const ticketTypesRelations = relations(ticketTypes, ({ one, many }) => ({
  event: one(events, {
    fields: [ticketTypes.eventId],
    references: [events.id],
  }),
  tickets: many(tickets),
}));
