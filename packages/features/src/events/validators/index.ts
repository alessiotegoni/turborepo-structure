import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod/v4";

import { events } from "@beeto/db/schema";

export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
export const updateEventSchema = createUpdateSchema(events);

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = z.infer<typeof selectEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
