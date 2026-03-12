import type { z } from "zod/v4";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

import { users } from "@beeto/db/schema";

export const insertUserSchema = createInsertSchema(users);
export const updateUserSchema = createUpdateSchema(users);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
