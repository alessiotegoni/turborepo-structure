import "../styles.css";

import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  Urbanist_300Light,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/urbanist";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@beeto/api/native";
import { UserProvider } from "@beeto/auth/native/providers";
import { UIProvider } from "@beeto/ui/native/components";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Urbanist_300Light,
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

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
