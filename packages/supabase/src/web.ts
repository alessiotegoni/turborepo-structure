import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "../env";

const env = supabaseEnv();

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
