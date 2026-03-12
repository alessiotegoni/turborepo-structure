import { ScrollView, Text, View } from "react-native";
import { useSuspenseQuery } from "@tanstack/react-query";

import { trpc } from "@beeto/api/native";
import { useUser } from "@beeto/auth/native/providers";
import { CreateEventForm } from "@beeto/features/events/native/components";
import { useEvent } from "@beeto/features/events/native/hooks";
import { Button } from "@beeto/ui/native/components";
import { ActionButton } from "@beeto/ui/native/components/extended";

export function EventListScreen() {
  const { user } = useUser();
  const { data: events } = useSuspenseQuery(trpc.event.all.queryOptions());

  const { deleteEventOptions } = useEvent();

  return (
    <ScrollView className="bg-background flex-1 p-6">
      <Text className="text-foreground mb-6 text-3xl font-bold">Events</Text>

      {user && <CreateEventForm />}

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
            <ActionButton
              variant="danger"
              mutationOptions={deleteEventOptions}
              variables={e.id}
              requireAreYouSure
              areYouSureDescription="I rimborsi sono a carico dell'event creator"
            >
              <Button.Label>Elimina</Button.Label>
            </ActionButton>
          </View>
        ))}
        {events.length === 0 && (
          <Text className="text-foreground">No events found</Text>
        )}
      </View>
    </ScrollView>
  );
}
