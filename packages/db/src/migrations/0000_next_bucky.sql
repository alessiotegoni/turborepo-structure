-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "ticket_types" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"max_quantity" integer,
	"is_free" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"ticket_type_id" uuid NOT NULL,
	"checked_in" boolean DEFAULT false NOT NULL,
	"checked_in_at" timestamp with time zone,
	"stripe_payment_id" text,
	"amount_paid_cents" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"refund_status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tickets_user_id_event_id_key" UNIQUE("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"surname" text,
	"avatar_url" text,
	"gender" text,
	"bio" text,
	"role" text DEFAULT 'user' NOT NULL,
	"stripe_customer_id" text,
	"phone" text,
	"date_of_birth" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_profiles" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"vat_number" text,
	"company_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "creator_profiles_user_id_key" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"push_notifications" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"icon_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"stripe_subscription_id" text,
	"status" text DEFAULT 'active' NOT NULL,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_stripe_subscription_id_key" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"stripe_price_id" text NOT NULL,
	"price_cents" integer NOT NULL,
	"interval" text DEFAULT 'month' NOT NULL,
	"features" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_plans_stripe_price_id_key" UNIQUE("stripe_price_id")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"stripe_payment_id" text,
	"amount_cents" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"event_type" text DEFAULT 'onsite' NOT NULL,
	"event_link" text,
	"address" text,
	"latitude" double precision,
	"longitude" double precision,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"cover_image_url" text,
	"category_id" uuid,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_communications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"channel" text DEFAULT 'push' NOT NULL,
	"subject" text,
	"body" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_categories" (
	"user_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_categories_pkey" PRIMARY KEY("user_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"user_id" uuid NOT NULL,
	"event_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_pkey" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "push_tokens" (
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"device_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "push_tokens_pkey" PRIMARY KEY("user_id","token")
);
--> statement-breakpoint
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_type_id_fkey" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."ticket_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_profiles" ADD CONSTRAINT "creator_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_communications" ADD CONSTRAINT "event_communications_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_communications" ADD CONSTRAINT "event_communications_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_categories" ADD CONSTRAINT "user_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_categories" ADD CONSTRAINT "user_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_tokens" ADD CONSTRAINT "push_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ticket_types_event" ON "ticket_types" USING btree ("event_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_tickets_event" ON "tickets" USING btree ("event_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_tickets_status" ON "tickets" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_tickets_user" ON "tickets" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_subscriptions_status" ON "subscriptions" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_subscriptions_user" ON "subscriptions" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_payments_stripe" ON "payments" USING btree ("stripe_payment_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_payments_user" ON "payments" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_events_category" ON "events" USING btree ("category_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_events_creator" ON "events" USING btree ("creator_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_events_location" ON "events" USING btree ("latitude" float8_ops,"longitude" float8_ops);--> statement-breakpoint
CREATE INDEX "idx_events_starts_at" ON "events" USING btree ("starts_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_events_status" ON "events" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "idx_communications_event" ON "event_communications" USING btree ("event_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_user_categories_category" ON "user_categories" USING btree ("category_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_user_categories_user" ON "user_categories" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_bookmarks_event" ON "bookmarks" USING btree ("event_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_bookmarks_user" ON "bookmarks" USING btree ("user_id" uuid_ops);
*/