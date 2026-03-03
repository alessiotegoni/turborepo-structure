import { createClient } from "@supabase/supabase-js";

import { supabaseEnv } from "../env";

const env = supabaseEnv();

export function createAdminClient() {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
