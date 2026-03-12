import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

import { Button, Card, Surface } from "@beeto/ui/native/components";

export default function Index() {
  return (
    <SafeAreaView>
      <ThemeSwitcher />
      <View className="p-5">
        <Card>
          <Card.Header>
            <Text className="text-primary text-2xl font-urbanist-bold">Beeto</Text>
            <Link href="/(public)/events">Vedi eventi</Link>
            <Link href="/(auth)/send-otp">Vedi signin</Link>
          </Card.Header>
          <Card.Body>
            <Card.Title>Title</Card.Title>
            <Card.Description>Description</Card.Description>
          </Card.Body>
        </Card>
        <Button variant="primary">test</Button>
        <View className="gap-4">
          <Surface variant="default" className="gap-2">
            <Text className="text-foreground">Surface Content</Text>
            <Text className="text-muted">
              This is a default surface variant. It uses bg-surface styling.
            </Text>
          </Surface>

          <Surface variant="secondary" className="gap-2">
            <Text className="text-foreground">Surface Content</Text>
            <Text className="text-muted">
              This is a secondary surface variant. It uses bg-surface-secondary
              styling.
            </Text>
          </Surface>

          <Surface variant="tertiary" className="gap-2">
            <Text className="text-foreground">Surface Content</Text>
            <Text className="text-muted">
              This is a tertiary surface variant. It uses bg-surface-tertiary
              styling.
            </Text>
          </Surface>
        </View>
      </View>
    </SafeAreaView>
  );
}
