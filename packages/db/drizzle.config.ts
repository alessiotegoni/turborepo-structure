import type { Config } from "drizzle-kit";

import { supabaseEnv } from "@beeto/supabase/env.web";

const env = supabaseEnv();

export default {
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: { url: env.DIRECT_URL },
  casing: "snake_case",
} satisfies Config;
