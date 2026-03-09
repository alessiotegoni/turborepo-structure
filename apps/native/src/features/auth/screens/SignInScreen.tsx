import React, { useState } from "react";
import { AppState, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "@beeto/auth/native/hooks";
import { useUser } from "@beeto/auth/native/providers";
import { supabase } from "@beeto/supabase/native";
import { Button, Input, InputOTP } from "@beeto/ui/native";

export function SignInScreen() {
  const router = useRouter();
  const { user } = useUser();

  const { signInWithOtp, verifyOtp, signOut } = useAuth({
    onSignIn: () => router.replace("/"),
    onSignOut: () => router.replace("/sign-in"),
  });

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  const handleSendOtp = async () => {
    if (!email) return;
    await signInWithOtp.mutateAsync({ email });
    setStep("otp");
  };

  const handleVerify = async () => {
    if (!email || !token) return;
    await verifyOtp.mutateAsync({ email, token });
  };

  return (
    <View className="bg-background flex-1 items-center justify-center p-6">
      <View className="bg-content1 w-full max-w-sm gap-4 rounded-xl p-6 shadow-md">
        <Text className="text-foreground mb-4 text-center text-3xl font-bold">
          Sign In
        </Text>

        {step === "email" ? (
          <View className="gap-4">
            <Input
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Button variant="primary" onPress={handleSendOtp}>
              Send OTP
            </Button>
          </View>
        ) : (
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
            <Button variant="primary" onPress={handleVerify}>
              Verify Code
            </Button>
            <Button variant="ghost" onPress={() => setStep("email")}>
              Back
            </Button>
          </View>
        )}
        {user && (
          <Button variant="danger" onPress={() => signOut.mutateAsync()}>
            Sign Out
          </Button>
        )}
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
