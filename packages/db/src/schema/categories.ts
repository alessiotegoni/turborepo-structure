import { relations, sql } from "drizzle-orm";
import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

import { events } from "./events";
import { userCategories } from "./user-categories";

export const categories = pgTable(
  "categories",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: text().notNull(),
    iconUrl: text("icon_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("categories_name_key").on(table.name)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  events: many(events),
  userCategories: many(userCategories),
}));

export type Category = typeof categories.$inferSelect;
