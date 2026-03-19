import {
  date,
  foreignKey,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid().primaryKey().notNull(),
    email: text().notNull(),
    name: text(),
    surname: text(),
    avatarUrl: text("avatar_url"),
    gender: text(),
    bio: text(),
    role: text().default("user").notNull(),
    stripeCustomerId: text("stripe_customer_id"),
    phone: text(),
    dateOfBirth: date("date_of_birth"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
      name: "profiles_id_fkey",
    }).onDelete("cascade"),
  ],
);

export type Profile = typeof profiles.$inferSelect;
