import { useRouter } from "expo-router";
import { Text } from "react-native";

// import { SignInScreen } from "@beeto/auth/native";

export default function SignIn() {
  const router = useRouter();
  return (
    <Text>Ciao</Text>
    // <SignInScreen
    //   onSignIn={() => router.replace("/")}
    //   onSignOut={() => router.replace("/sign-in")}
    // />
  );
}
