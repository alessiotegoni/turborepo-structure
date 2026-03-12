import { useEffect, useEffectEvent } from "react";
import { useMutation as useTanstackMutation } from "@tanstack/react-query";
import type { MutationOptions } from "@tanstack/react-query";
import { useToast } from "heroui-native";

import type { SuccessResponse } from "@beeto/api/helpers";

interface UseMutationConfig {
  /** Se true, mostra un toast automatico su successo e su errore. @default true */
  showToast?: boolean;
}

/**
 * Wrappa `useMutation` di TanStack Query aggiungendo toast automatici
 * su successo e su errore.
 *
 * @param mutationOptions - Le opzioni della mutation (es. `trpc.event.create.mutationOptions()`)
 * @param config - Configurazioni opzionali del comportamento dell'hook
 *
 * @example
 * // Con button (ActionButton / SubmitButton lo usano internamente)
 * const { mutateAsync, isPending } = useMutation(
 *   trpc.event.delete.mutationOptions(),
 *   { showToast: false },
 * );
 *
 * @example
 * // Standalone — mutazione senza button, es. on mount o on event
 * const { mutateAsync } = useMutation(trpc.event.create.mutationOptions());
 */
export function useMutation<
  TData extends SuccessResponse<unknown>,
  TError extends { message: string },
  TVariables,
>(
  mutationOptions: MutationOptions<TData, TError, TVariables>,
  { showToast = true }: UseMutationConfig = {},
) {
  const { toast } = useToast();

  const mutation = useTanstackMutation(mutationOptions);
  const { isSuccess, data, isError, error } = mutation;

  // useEffectEvent crea un handler stabile che legge sempre i valori più
  // aggiornati senza essere una dipendenza degli useEffect sottostanti.
  const handleSuccess = useEffectEvent((successData: TData) => {
    if (!showToast) return;

    toast.show({
      variant: "success",
      label: successData.message,
      actionLabel: "Chiudi",
      onActionPress: ({ hide }) => hide(),
    });
  });

  const handleError = useEffectEvent((mutationError: TError) => {
    if (!showToast) return;

    toast.show({
      variant: "danger",
      label: mutationError.message,
      actionLabel: "Chiudi",
      onActionPress: ({ hide }) => hide(),
    });
  });

  useEffect(() => {
    if (isSuccess) handleSuccess(data);
  }, [isSuccess, data]);

  useEffect(() => {
    if (isError) handleError(error);
  }, [isError, error]);

  return mutation;
}
