import { queryClient, trpc } from "@beeto/api/native";

interface useEventProps {
  onEventCreated?: () => void;
}

export function useEvent({ onEventCreated }: useEventProps = {}) {
  const createEventOptions = trpc.event.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.event.all.pathFilter());
      onEventCreated?.();
    },
  });

  const deleteEventOptions = trpc.event.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.event.all.pathFilter());
    },
  });

  return { createEventOptions, deleteEventOptions };
}
