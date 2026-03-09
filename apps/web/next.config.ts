import { NextConfig } from "next";
import "./src/env"

const config: NextConfig = {
  typedRoutes: true,

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@beeto/api", "@beeto/auth", "@beeto/db", "@beeto/ui"],

  /** We already do linting and typechecking as separate tasks in CI */
  typescript: { ignoreBuildErrors: true },
};

export default config;
