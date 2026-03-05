import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { supabaseEnv } from "../env.web";

const env = supabaseEnv();

export async function createClient(headers: Headers) {
  const cookieString = headers.get("cookie") ?? "";
  const parsedCookies = parseCookieHeader(cookieString);

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parsedCookies.filter(
            (c): c is { name: string; value: string } =>
              typeof c.value === "string",
          );
        },
        setAll(cookiesToSet) {
          // ignore setter on backend
        },
      },
    },
  );
}
