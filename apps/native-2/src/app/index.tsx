import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import { Card } from "@beeto/ui/native";

export default function Index() {
  return (
    <SafeAreaView>
      <View className="p-5">
        <Card>
          <Card.Header>
            <Text>Beeto</Text>
            <Link href="/(public)/events">Vedi eventi</Link>
            <Link href="/(auth)/sign-in">Vedi signin</Link>
          </Card.Header>
          <Card.Body>
            <Card.Title>Title</Card.Title>
            <Card.Description>Description</Card.Description>
          </Card.Body>
        </Card>
      </View>
    </SafeAreaView>
  );
}
