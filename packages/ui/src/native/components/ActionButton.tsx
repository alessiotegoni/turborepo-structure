"use client";

import type { MutationOptions } from "@tanstack/react-query";
import type { ButtonRootProps } from "heroui-native";
import { Alert } from "react-native";
import { FadeIn, LinearTransition } from "react-native-reanimated";
import { useMutation } from "@tanstack/react-query";
import { Button, Spinner, useToast } from "heroui-native";

type ActionButtonProps = ButtonRootProps & {
  mutationOptions: MutationOptions;
  successMessage: string;
  loadingText?: string;
  requireAreYouSure?: boolean;
  areYouSureTitle?: string;
  areYouSureDescription?: string;
  displayToast?: boolean;
};

export default function ActionButton({
  mutationOptions,
  successMessage = "Operazione effettuata con successo",
  loadingText = "Caricamento",
  requireAreYouSure = false,
  areYouSureTitle = "Sei sicuro?",
  areYouSureDescription = "Questa azione non può essere annullata",
  displayToast = true,
  className,
  isDisabled,
  children,
  ...props
}: ActionButtonProps) {
  const { toast } = useToast();

  const { isPending, mutateAsync } = useMutation(mutationOptions);

  async function performAction() {
    try {
      await mutateAsync();
      if (displayToast) {
        toast.show({
          variant: "success",
          label: successMessage,
          actionLabel: "Chiudi",
          onActionPress: ({ hide }) => hide(),
        });
      }
    } catch (error: any) {
      if (displayToast) {
        toast.show({
          variant: "danger",
          label: error.message || "Si è verificato un errore",
          actionLabel: "Chiudi",
          onActionPress: ({ hide }) => hide(),
        });
      }
    }
  }

  function handlePress() {
    if (!requireAreYouSure) {
      performAction();
      return;
    }

    Alert.alert(areYouSureTitle, areYouSureDescription, [
      { text: "Annulla", style: "cancel" },
      {
        text: "Conferma",
        style: "destructive",
        onPress: performAction,
      },
    ]);
  }

  return (
    <Button
      layout={LinearTransition.springify()}
      isDisabled={isPending || isDisabled}
      className={className}
      onPress={handlePress}
      {...props}
    >
      <Spinner isLoading={isPending} entering={FadeIn.delay(50)} />
      {!isPending && children}
    </Button>
  );
}
