import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@beeto/eslint-config/base";
import { nextjsConfig } from "@beeto/eslint-config/nextjs";
import { reactConfig } from "@beeto/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
