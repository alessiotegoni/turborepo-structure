"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@beeto/api/web/react";
import { toast } from "@beeto/ui/web";

export function useEvent() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: events } = useQuery(trpc.event.all.queryOptions());

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createEvent = useMutation({
    ...trpc.event.create.mutationOptions({
      onSuccess: () => {
        toast.success("Event Created");
        queryClient.invalidateQueries(trpc.event.all.pathFilter());
        setTitle("");
        setDescription("");
      },
    }),
  });

  const deleteEvent = useMutation({
    ...trpc.event.delete.mutationOptions({
      onSuccess: () => {
        toast.danger("Event Deleted");
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
