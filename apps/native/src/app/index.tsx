import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import { Card } from "heroui-native";

export default function IndexScreen() {
  return (
    <SafeAreaView>
      <Text>Beeto</Text>
      <Link href="/(public)/events">Vedi eventi</Link>
      {/* <Card>
        <Card.Header>
          <Text>Beeto</Text>
          <Link href="/(public)/events">Vedi eventi</Link>
        </Card.Header>
        <Card.Body>
          <Card.Title>Title</Card.Title>
          <Card.Description>Description</Card.Description>
        </Card.Body>
      </Card> */}
    </SafeAreaView>
  );
}
