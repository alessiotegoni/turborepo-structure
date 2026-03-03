import type { Config } from "drizzle-kit";

import { supabaseEnv } from "@beeto/supabase/env";

const env = supabaseEnv();

export default {
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: { url: process.env.DIRECT_URL || env.DATABASE_URL },
  casing: "snake_case",
} satisfies Config;
