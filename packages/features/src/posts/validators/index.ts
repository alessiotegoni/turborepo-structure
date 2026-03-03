import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { posts } from "@beeto/db/schema";

export const insertPostSchema = createInsertSchema(posts);
export const updatePostSchema = createUpdateSchema(posts);

export type InsertPost = z.infer<typeof insertPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;
