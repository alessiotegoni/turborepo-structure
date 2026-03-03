"use client";

import { useRouter } from "next/navigation";

import { SignInScreen } from "@beeto/auth/web";

export default function SignInPage() {
  const router = useRouter();
  return (
    <SignInScreen
      onSignIn={() => router.push("/")}
      onSignOut={() => router.push("/sign-in")}
    />
  );
}
