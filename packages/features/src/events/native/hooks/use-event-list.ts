import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { trpc } from "@beeto/api/native";
import { useToast } from "@beeto/ui/native";

export function useEventList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: events } = useSuspenseQuery(trpc.event.all.queryOptions());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createEvent = useMutation({
    ...trpc.event.create.mutationOptions({
      onSuccess: () => {
        toast.show("Event created");
        queryClient.invalidateQueries(trpc.event.all.pathFilter());
        setTitle("");
        setDescription("");
      },
    }),
  });

  const deleteEvent = useMutation({
    ...trpc.event.delete.mutationOptions({
      onSuccess: () => {
        toast.show("Event deleted");
        queryClient.invalidateQueries(trpc.event.all.pathFilter());
      },
    }),
  });

  return {
    events,
    title,
    setTitle,
    description,
    setDescription,
    createEvent,
    deleteEvent,
  };
}
