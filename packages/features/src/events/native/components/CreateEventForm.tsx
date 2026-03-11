import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { useUser } from "@beeto/auth/native/providers";
import { Button, Input, Label } from "@beeto/ui/native";
import { FormField, SubmitButton } from "@beeto/ui/native/components";

import { InsertEvent, insertEventSchema } from "../../validators";
import { useEvent } from "../hooks";

// Componente FormField pre-tipizzato per InsertEvent.
// TName viene inferito automaticamente dalla prop `name` in ogni campo.
const Field = FormField.typed<InsertEvent>();

export function CreateEventForm() {
  const { user } = useUser();
  const { createEventOptions } = useEvent();

  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      createdBy: user!.id,
    },
  });

  return (
    <FormProvider {...form}>
      <Field
        name="title"
        render={({ field }) => (
          <>
            <Label>Titolo</Label>
            <Input {...field} />
          </>
        )}
      />
      <Field
        name="description"
        render={({ field }) => (
          <>
            <Label>Descrizione</Label>
            <Input {...field} value={field.value ?? undefined} />
          </>
        )}
      />

      <SubmitButton variant="primary" mutationOptions={createEventOptions}>
        <Button.Label>Crea</Button.Label>
      </SubmitButton>
    </FormProvider>
  );
}
