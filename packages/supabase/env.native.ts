import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const supabaseEnvNative = () =>
  createEnv({
    client: {
      EXPO_PUBLIC_SUPABASE_URL: z.string().min(1),
      EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    },
    clientPrefix: "EXPO_PUBLIC_",
    runtimeEnv: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
