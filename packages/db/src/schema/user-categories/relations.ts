import { relations } from "drizzle-orm";

import { categories } from "../categories/schema";
import { profiles } from "../profiles/schema";
import { userCategories } from "./schema";

export const userCategoriesRelations = relations(userCategories, ({ one }) => ({
  category: one(categories, {
    fields: [userCategories.categoryId],
    references: [categories.id],
  }),
  profile: one(profiles, {
    fields: [userCategories.userId],
    references: [profiles.id],
  }),
}));
