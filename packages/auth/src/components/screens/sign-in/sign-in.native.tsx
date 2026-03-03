import React, { useState } from "react";
import { Text, View } from "react-native";

import { Button, Input } from "@beeto/ui/native";

import { useAuth } from "../../../hooks/use-auth.native";

interface SignInScreenProps {
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function SignInScreen({ onSignIn, onSignOut }: SignInScreenProps = {}) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const { signInWithOtp, verifyOtp } = useAuth({ onSignIn, onSignOut });

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
            <Input
              placeholder="Enter the 6-digit code"
              value={token}
              onChangeText={setToken}
              keyboardType="number-pad"
            />
            <Button variant="primary" onPress={handleVerify}>
              Verify Code
            </Button>
            <Button variant="ghost" onPress={() => setStep("email")}>
              Back
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}
