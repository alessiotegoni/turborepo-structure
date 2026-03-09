"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@beeto/auth/web/hooks";
import {
  Button,
  FieldError,
  Form,
  Input,
  InputOTP,
  Label,
  TextField,
} from "@beeto/ui/web";

export function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  const { signInWithOtp, verifyOtp } = useAuth({
    onSignIn: () => router.replace("/"),
  });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = await signInWithOtp.mutateAsync({ email });
    setStep("otp");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) return;
    await verifyOtp.mutateAsync({ email, token });
  };

  return (
    <div className="bg-background text-foreground flex h-screen w-full items-center justify-center">
      <div className="bg-content1 rounded-large shadow-medium w-full max-w-md p-8">
        <h1 className="mb-6 text-center text-3xl font-bold">Sign In</h1>
        {step === "email" ? (
          <Form
            className="border-border bg-surface w-full max-w-md space-y-4 rounded-lg border p-6"
            onSubmit={handleSendOtp}
          >
            <TextField className="flex flex-col">
              <Label className="text-sm font-medium">Email</Label>
              <Input
                className="border-border/60 rounded-full"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldError className="text-xs" />
            </TextField>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </Form>
        ) : (
          <Form className="flex flex-col gap-4" onSubmit={handleVerify}>
            <InputOTP maxLength={6} onChange={setToken}>
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
            <Button type="submit">verify</Button>
            <Button variant="secondary" onPress={() => setStep("email")}>
              Back
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
