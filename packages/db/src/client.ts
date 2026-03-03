import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { supabaseEnv } from "@beeto/supabase/env";

import * as schema from "./schema/index";

const env = supabaseEnv();
const client = postgres(env.DATABASE_URL);

export const db = drizzle({
  client,
  schema,
});
