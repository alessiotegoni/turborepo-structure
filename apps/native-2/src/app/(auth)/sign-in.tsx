import { useRouter } from "expo-router";
import { SignInScreen } from "@beeto/auth/native";

export default function SignIn() {
  const router = useRouter();
  return (
    <SignInScreen
      onSignIn={() => router.replace("/")}
      onSignOut={() => router.replace("/sign-in")}
    />
  );
}
