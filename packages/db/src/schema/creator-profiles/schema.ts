import { sql } from "drizzle-orm";
import {
  foreignKey,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { profiles } from "../profiles/schema";

export const creatorProfiles = pgTable(
  "creator_profiles",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid("user_id").notNull(),
    vatNumber: text("vat_number"),
    companyName: text("company_name"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "creator_profiles_user_id_fkey",
    }).onDelete("cascade"),
    unique("creator_profiles_user_id_key").on(table.userId),
  ],
);

export type CreatorProfile = typeof creatorProfiles.$inferSelect;
