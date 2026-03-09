import { ScrollView, Text, View } from "react-native";

import { useUser } from "@beeto/auth/native/providers";
import { useEventList } from "@beeto/features/events/native/hooks";
import { Button, Input } from "@beeto/ui/native";

export function EventListScreen() {
  const { user } = useUser();
  const {
    events,
    title,
    setTitle,
    description,
    setDescription,
    createEvent,
    deleteEvent,
  } = useEventList();

  return (
    <ScrollView className="bg-background flex-1 p-6">
      <Text className="text-foreground mb-6 text-3xl font-bold">Events</Text>

      {user && (
        <View className="mb-6 gap-4">
          <Input placeholder="Title" value={title} onChangeText={setTitle} />
          <Input
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <Button
            variant="primary"
            onPress={() =>
              createEvent.mutate({ title, description, createdBy: user.id })
            }
          >
            Create
          </Button>
        </View>
      )}

      <View className="gap-4">
        {events.map((e) => (
          <View
            key={e.id}
            className="bg-content1 flex-row items-center justify-between rounded-lg p-4 shadow-sm"
          >
            <View>
              <Text className="text-foreground text-xl font-bold">
                {e.title}
              </Text>
              <Text className="text-foreground text-sm">{e.description}</Text>
            </View>
            <Button variant="danger" onPress={() => deleteEvent.mutate(e.id)}>
              Delete
            </Button>
          </View>
        ))}
        {events.length === 0 && (
          <Text className="text-foreground">No events found</Text>
        )}
      </View>
    </ScrollView>
  );
}
