import { relations } from "drizzle-orm";

import { events } from "../events/schema";
import { userCategories } from "../user-categories/schema";
import { categories } from "./schema";

export const categoriesRelations = relations(categories, ({ many }) => ({
  events: many(events),
  userCategories: many(userCategories),
}));
