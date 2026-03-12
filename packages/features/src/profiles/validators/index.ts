import type { z } from "zod/v4";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { profiles } from "@beeto/db/schema";

export const insertProfileSchema = createInsertSchema(profiles);
export const updateProfileSchema = createUpdateSchema(profiles);

export type InsertUser = z.infer<typeof insertProfileSchema>;
export type UpdateUser = z.infer<typeof updateProfileSchema>;
