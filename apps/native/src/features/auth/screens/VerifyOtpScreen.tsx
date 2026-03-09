import { AppState, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "@beeto/auth/native/hooks";
import { useUser } from "@beeto/auth/native/providers";
import { supabase } from "@beeto/supabase/native";
import { Button, InputOTP } from "@beeto/ui/native";

export function VerifyOtpScreen() {
  const router = useRouter();

  const { verifyOtpOptions } = useAuth({
    onOtpVerified: () => router.replace("/(public)/events"),
  });

  return (
    <View className="bg-background flex-1 items-center justify-center p-6">
      <View className="bg-content1 w-full max-w-sm gap-4 rounded-xl p-6 shadow-md">
        <Text className="text-foreground mb-4 text-center text-3xl font-bold">
          Verifica codice
        </Text>

        <View className="gap-4">
          <InputOTP maxLength={6} value={token} onChange={setToken}>
            <InputOTP.Group>
              <InputOTP.Slot index={0} />
              <InputOTP.Slot index={1} />
              <InputOTP.Slot index={2} />
            </InputOTP.Group>
            <InputOTP.Separator />
            <InputOTP.Group>
              <InputOTP.Slot index={3} />
              <InputOTP.Slot index={4} />
              <InputOTP.Slot index={5} />
            </InputOTP.Group>
          </InputOTP>
          <ActionButton
            mutationOptions={verifyOtpOptions}
            successMessage="Login effettuato con successo!"
          >
            <Button.Label>Verifica codice</Button.Label>
          </ActionButton>
          <Button variant="ghost">Back</Button>
        </View>
      </View>
    </View>
  );
}

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
