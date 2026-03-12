import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { categories } from "./categories";
import { profiles } from "./profiles";

export const userCategories = pgTable(
  "user_categories",
  {
    userId: uuid("user_id").notNull(),
    categoryId: uuid("category_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_user_categories_category").using(
      "btree",
      table.categoryId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_user_categories_user").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "user_categories_category_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "user_categories_user_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.categoryId],
      name: "user_categories_pkey",
    }),
  ],
);

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

export type UserCategory = typeof userCategories.$inferSelect;
