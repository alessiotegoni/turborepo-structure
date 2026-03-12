import { defineConfig } from "eslint/config";

import { baseConfig } from "@beeto/eslint-config/base";
import { reactConfig } from "@beeto/eslint-config/react";

export default defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  baseConfig,
  reactConfig,
);
