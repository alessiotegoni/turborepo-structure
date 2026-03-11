import { useQueryClient } from "@tanstack/react-query";

import { trpc } from "@beeto/api/native";

export function useEvent() {
  const queryClient = useQueryClient();

  const createEventOptions = trpc.event.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.event.all.pathFilter());
    },
  });

  const deleteEventOptions = trpc.event.delete.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.event.all.pathFilter());
    },
  });

  return {
    createEventOptions,
    deleteEventOptions,
  };
}
