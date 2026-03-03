"use client";

import React, { useState } from "react";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  InputOTP,
  Label,
  TextField,
} from "@beeto/ui/web";

import { useAuth } from "../../../hooks/use-auth.web";

interface SignInScreenProps {
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function SignInScreen({ onSignIn, onSignOut }: SignInScreenProps = {}) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const { signInWithOtp, verifyOtp } = useAuth({ onSignIn, onSignOut });

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = await signInWithOtp.mutateAsync({ email });

    if (res.success) {
      setStep("otp");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !token) return;
    console.log("email", email);
    console.log("token", token);
    
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
            <TextField>
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
            <Button type="submit">
              verify
            </Button>
            <Button variant="secondary" onPress={() => setStep("email")}>
              Back
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}

function EmailForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });
    alert(`Form submitted with: ${JSON.stringify(data, null, 2)}`);
  };
  return (
    <Form
      className="flex w-96 flex-col gap-4"
      render={(props) => <form {...props} data-custom="foo" />}
      onSubmit={onSubmit}
    >
      <TextField
        isRequired
        name="email"
        type="email"
        validate={(value) => {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "Please enter a valid email address";
          }
          return null;
        }}
      >
        <Label>Email</Label>
        <Input placeholder="john@example.com" />
        <FieldError />
      </TextField>
      <TextField
        isRequired
        minLength={8}
        name="password"
        type="password"
        validate={(value) => {
          if (value.length < 8) {
            return "Password must be at least 8 characters";
          }
          if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter";
          }
          if (!/[0-9]/.test(value)) {
            return "Password must contain at least one number";
          }
          return null;
        }}
      >
        <Label>Password</Label>
        <Input placeholder="Enter your password" />
        <Description>
          Must be at least 8 characters with 1 uppercase and 1 number
        </Description>
        <FieldError />
      </TextField>
      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
    </Form>
  );
}
