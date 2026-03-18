import type { z } from "zod/v4";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { profiles } from "../schema";

export const insertProfileSchema = createInsertSchema(profiles);
export const updateProfileSchema = createUpdateSchema(profiles);

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
