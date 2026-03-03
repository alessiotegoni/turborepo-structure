import { baseConfig, restrictEnvAccess } from "@beeto/eslint-config/base";
import { nextjsConfig } from "@beeto/eslint-config/nextjs";
import { reactConfig } from "@beeto/eslint-config/react";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
