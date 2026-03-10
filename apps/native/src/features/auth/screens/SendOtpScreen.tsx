import React from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useAuth } from "@beeto/auth/native/hooks";
import { Button, Input } from "@beeto/ui/native";
import { ActionButton } from "@beeto/ui/native/components";

export function SendOtpScreen() {
  const router = useRouter();

  const { sendOtpOptions, email, setEmail } = useAuth({
    onOtpSent: () => router.replace(`/(auth)/verify-otp?email=${email}`),
  });

  return (
    <View className="bg-background flex-1 items-center justify-center p-6">
      <View className="bg-content1 w-full max-w-sm gap-4 rounded-xl p-6 shadow-md">
        <Text className="text-foreground mb-4 text-center text-3xl font-bold">
          Login
        </Text>

        <View className="gap-4">
          <Input
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <ActionButton
            mutationOptions={sendOtpOptions}
            data={{ email }}
            successMessage="Codice inviato!"
          >
            <Button.Label>Invia Codice</Button.Label>
          </ActionButton>
        </View>
      </View>
    </View>
  );
}
