import "../styles.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@beeto/api/native";
import { HeroUINativeProvider } from "@beeto/ui/native";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <HeroUINativeProvider>
        <QueryClientProvider client={queryClient}>
          <Stack />
        </QueryClientProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
