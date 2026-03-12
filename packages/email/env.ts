/* eslint-disable turbo/no-undeclared-env-vars */
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const emailEnv = () =>
  createEnv({
    server: {
      SENDGRID_API_KEY: z.string().min(1).optional(),
      SENDGRID_FROM_EMAIL: z.email().optional(),
    },
    client: {},
    clientPrefix: "NEXT_PUBLIC_",
    runtimeEnv: {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL,
    },
    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
