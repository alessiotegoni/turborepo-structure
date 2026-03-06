import "../styles.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@beeto/api/native";
import { UserProvider } from "@beeto/auth/native";
import { UIProvider } from "@beeto/ui/native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <UIProvider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <Stack />
          </UserProvider>
        </QueryClientProvider>
      </UIProvider>
    </GestureHandlerRootView>
  );
}
