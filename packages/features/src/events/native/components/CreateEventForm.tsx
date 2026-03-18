import React from "react";
import { View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import type { InsertEvent } from "@beeto/db/validators";
import { useUser } from "@beeto/auth/native/providers";
import { insertEventSchema } from "@beeto/db/validators";
import { Button, Input, Label } from "@beeto/ui/native/components";
import { FormField, SubmitButton } from "@beeto/ui/native/components/extended";

import { useEvent } from "../hooks";

// Componente FormField pre-tipizzato per InsertEvent.
// TName viene inferito automaticamente dalla prop `name` in ogni campo.
const Field = FormField.typed<InsertEvent>();

export function CreateEventForm() {
  const { user } = useUser();

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      creatorId: user?.id,
      startsAt: new Date(),
    },
  });

  const { createEventOptions } = useEvent({ onEventCreated: form.reset });

  return (
    <FormProvider {...form}>
      <View className="gap-5">
        <Field
          name="title"
          render={({ field }) => (
            <>
              <Label>Titolo</Label>
              <Input {...field} onChangeText={field.onChange} />
            </>
          )}
        />
        <Field
          name="description"
          render={({ field }) => (
            <>
              <Label>Descrizione</Label>
              <Input
                {...field}
                onChangeText={field.onChange}
                value={field.value ?? undefined}
              />
            </>
          )}
        />

        <SubmitButton variant="primary" mutationOptions={createEventOptions}>
          <Button.Label>Crea</Button.Label>
        </SubmitButton>
      </View>
    </FormProvider>
  );
}
