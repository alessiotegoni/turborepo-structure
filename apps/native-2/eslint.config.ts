import { baseConfig } from "@beeto/eslint-config/base";
import { reactConfig } from "@beeto/eslint-config/react";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  baseConfig,
  reactConfig,
);
