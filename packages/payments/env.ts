import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const stripeEnv = () =>
  createEnv({
    server: {
      STRIPE_SECRET_KEY: z.string().min(1),
      STRIPE_WEBHOOK_SECRET: z.string().min(1),
    },
    client: {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    },
    clientPrefix: "NEXT_PUBLIC_",
    runtimeEnv: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    },
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
