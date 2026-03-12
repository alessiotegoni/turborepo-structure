import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  doublePrecision,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const ticketTypes = pgTable(
  "ticket_types",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    eventId: uuid("event_id").notNull(),
    name: text().notNull(),
    priceCents: integer("price_cents").default(0).notNull(),
    maxQuantity: integer("max_quantity"),
    isFree: boolean("is_free").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_ticket_types_event").using(
      "btree",
      table.eventId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "ticket_types_event_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const tickets = pgTable(
  "tickets",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid("user_id").notNull(),
    eventId: uuid("event_id").notNull(),
    ticketTypeId: uuid("ticket_type_id").notNull(),
    checkedIn: boolean("checked_in").default(false).notNull(),
    checkedInAt: timestamp("checked_in_at", {
      withTimezone: true,
      mode: "date",
    }),
    stripePaymentId: text("stripe_payment_id"),
    amountPaidCents: integer("amount_paid_cents").default(0).notNull(),
    status: text().default("active").notNull(),
    refundStatus: text("refund_status"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_tickets_event").using(
      "btree",
      table.eventId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_tickets_status").using(
      "btree",
      table.status.asc().nullsLast().op("text_ops"),
    ),
    index("idx_tickets_user").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "tickets_event_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.ticketTypeId],
      foreignColumns: [ticketTypes.id],
      name: "tickets_ticket_type_id_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "tickets_user_id_fkey",
    }).onDelete("cascade"),
    unique("tickets_user_id_event_id_key").on(table.userId, table.eventId),
  ],
);

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

export const userSettings = pgTable(
  "user_settings",
  {
    userId: uuid("user_id").primaryKey().notNull(),
    pushNotifications: boolean("push_notifications").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "user_settings_user_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: text().notNull(),
    iconUrl: text("icon_url"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("categories_name_key").on(table.name)],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid("user_id").notNull(),
    planId: uuid("plan_id").notNull(),
    stripeSubscriptionId: text("stripe_subscription_id"),
    status: text().default("active").notNull(),
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
      mode: "date",
    }),
    currentPeriodEnd: timestamp("current_period_end", {
      withTimezone: true,
      mode: "date",
    }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_subscriptions_status").using(
      "btree",
      table.status.asc().nullsLast().op("text_ops"),
    ),
    index("idx_subscriptions_user").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.planId],
      foreignColumns: [subscriptionPlans.id],
      name: "subscriptions_plan_id_fkey",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "subscriptions_user_id_fkey",
    }).onDelete("cascade"),
    unique("subscriptions_stripe_subscription_id_key").on(
      table.stripeSubscriptionId,
    ),
  ],
);

export const subscriptionPlans = pgTable(
  "subscription_plans",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    name: text().notNull(),
    stripePriceId: text("stripe_price_id").notNull(),
    priceCents: integer("price_cents").notNull(),
    interval: text().default("month").notNull(),
    features: jsonb().default({}),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("subscription_plans_stripe_price_id_key").on(table.stripePriceId),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    userId: uuid("user_id").notNull(),
    type: text().notNull(),
    stripePaymentId: text("stripe_payment_id"),
    amountCents: integer("amount_cents").notNull(),
    status: text().default("pending").notNull(),
    metadata: jsonb().default({}),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_payments_stripe").using(
      "btree",
      table.stripePaymentId.asc().nullsLast().op("text_ops"),
    ),
    index("idx_payments_user").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "payments_user_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const events = pgTable(
  "events",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    creatorId: uuid("creator_id").notNull(),
    title: text().notNull(),
    description: text(),
    eventType: text("event_type").default("onsite").notNull(),
    eventLink: text("event_link"),
    address: text(),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    startsAt: timestamp("starts_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true, mode: "date" }),
    coverImageUrl: text("cover_image_url"),
    categoryId: uuid("category_id"),
    status: text().default("draft").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_events_category").using(
      "btree",
      table.categoryId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_events_creator").using(
      "btree",
      table.creatorId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_events_location").using(
      "btree",
      table.latitude.asc().nullsLast().op("float8_ops"),
      table.longitude.asc().nullsLast().op("float8_ops"),
    ),
    index("idx_events_starts_at").using(
      "btree",
      table.startsAt.asc().nullsLast().op("timestamptz_ops"),
    ),
    index("idx_events_status").using(
      "btree",
      table.status.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "events_category_id_fkey",
    }),
    foreignKey({
      columns: [table.creatorId],
      foreignColumns: [profiles.id],
      name: "events_creator_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const eventCommunications = pgTable(
  "event_communications",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    eventId: uuid("event_id").notNull(),
    senderId: uuid("sender_id").notNull(),
    channel: text().default("push").notNull(),
    subject: text(),
    body: text().notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_communications_event").using(
      "btree",
      table.eventId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "event_communications_event_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.senderId],
      foreignColumns: [profiles.id],
      name: "event_communications_sender_id_fkey",
    }).onDelete("cascade"),
  ],
);

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

export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: uuid("user_id").notNull(),
    eventId: uuid("event_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("idx_bookmarks_event").using(
      "btree",
      table.eventId.asc().nullsLast().op("uuid_ops"),
    ),
    index("idx_bookmarks_user").using(
      "btree",
      table.userId.asc().nullsLast().op("uuid_ops"),
    ),
    foreignKey({
      columns: [table.eventId],
      foreignColumns: [events.id],
      name: "bookmarks_event_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "bookmarks_user_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.eventId],
      name: "bookmarks_pkey",
    }),
  ],
);

export const pushTokens = pgTable(
  "push_tokens",
  {
    userId: uuid("user_id").notNull(),
    token: text().notNull(),
    deviceType: text("device_type"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: "push_tokens_user_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.token],
      name: "push_tokens_pkey",
    }),
  ],
);
