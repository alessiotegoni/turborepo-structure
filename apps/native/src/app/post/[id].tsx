import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useGlobalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "@beeto/api/native";

export default function Post() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  const { data } = useQuery(trpc.post.byId.queryOptions({ id }));

  if (!data) return null;

  const post = data as { title: string; content: string };

  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: post.title }} />
      <View className="h-full w-full p-4">
        <Text className="text-primary py-2 text-3xl font-bold">
          {post.title}
        </Text>
        <Text className="text-foreground py-4">{post.content}</Text>
      </View>
    </SafeAreaView>
  );
}
