import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { events } from "@beeto/db/schema";

export const insertEventSchema = createInsertSchema(events, {
  title: z.string().min(5, "Il titolo deve avere almeno 5 caratteri"),
});
export const updateEventSchema = createUpdateSchema(events);

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type UpdateEvent = z.infer<typeof updateEventSchema>;
