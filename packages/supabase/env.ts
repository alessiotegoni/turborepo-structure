import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const supabaseEnv = () =>
  createEnv({
    server: {
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
      DATABASE_URL: z.url(),
    },
    client: {
      NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    },
    clientPrefix: "NEXT_PUBLIC_",
    runtimeEnv: {
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      DATABASE_URL: process.env.DATABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
