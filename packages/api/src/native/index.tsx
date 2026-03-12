import { Platform } from "react-native";
import Constants from "expo-constants";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@beeto/api";
import { supabase } from "@beeto/supabase/native";

/**
 * Get the base URL for the API.
 * In development, we try to detect the host IP to allow physical devices to connect.
 */
/* eslint-disable turbo/no-undeclared-env-vars */
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Detect the host IP from Expo Constants (works with physical devices)
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];

  if (localhost) {
    return `http://${localhost}:4000`;
  }

  // Fallback for Android Emulator
  if (Platform.OS === "android") {
    return "http://10.0.2.2:4000";
  }

  // Fallback for iOS Simulator or when hostUri is unavailable
  return "http://localhost:4000";
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === "development" ||
          (opts.direction === "down" && opts.result instanceof Error),
        colorMode: "ansi",
      }),
      httpBatchLink({
        transformer: superjson,
        url: `${getBaseUrl()}/api/trpc`,
        async headers() {
          const headers = new Headers();
          headers.set("x-trpc-source", "expo-react");

          const { data } = await supabase.auth.getSession();
          if (data.session) {
            headers.set("Authorization", `Bearer ${data.session.access_token}`);
          }

          return headers;
        },
      }),
    ],
  }),
  queryClient,
});

export type { RouterInputs, RouterOutputs } from "@beeto/api";
