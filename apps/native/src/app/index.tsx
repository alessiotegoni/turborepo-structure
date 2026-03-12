import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

import { Button, Card } from "@beeto/ui/native/components";

export default function Index() {
  return (
    <SafeAreaView>
      <ThemeSwitcher />
      <View className="p-5">
        <Card>
          <Card.Header>
            <Text className="text-primary font-urbanist-bold text-2xl">
              Beeto
            </Text>
            <Link href="/(public)/events">Vedi eventi</Link>
            <Link href="/(auth)/send-otp">Vedi signin</Link>
          </Card.Header>
          <Card.Body>
            <Card.Title>Title</Card.Title>
            <Card.Description>Description</Card.Description>
          </Card.Body>
        </Card>
        <Button variant="primary">test</Button>
      </View>
    </SafeAreaView>
  );
}
