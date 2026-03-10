import type { MutationOptions } from "@tanstack/react-query";
import type { ButtonRootProps } from "heroui-native";
import { useEffect, useEffectEvent } from "react";
import { Alert } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useMutation } from "@tanstack/react-query";
import { Button, Spinner, useToast } from "heroui-native";

import type { SuccessResponse } from "@beeto/api/helpers";

type ActionButtonProps<
  TData extends SuccessResponse<unknown>,
  TError extends { message: string },
  TVariables,
> = ButtonRootProps & {
  mutationOptions: MutationOptions<TData, TError, TVariables>;
  variables?: TVariables;
  loadingText?: string;
  requireAreYouSure?: boolean;
  areYouSureTitle?: string;
  areYouSureDescription?: string;
  displayToast?: boolean;
};

export function ActionButton<
  TData extends SuccessResponse<unknown>,
  TError extends { message: string },
  TVariables,
>({
  mutationOptions,
  variables,
  loadingText = "Caricamento",
  requireAreYouSure = false,
  areYouSureTitle = "Sei sicuro?",
  areYouSureDescription = "Questa azione non può essere annullata",
  displayToast = true,
  className,
  isDisabled,
  children,
  ...props
}: ActionButtonProps<TData, TError, TVariables>) {
  const { toast } = useToast();

  const { isPending, mutateAsync, isSuccess, data, isError, error } =
    useMutation(mutationOptions);

  const onSuccess = useEffectEvent((data: TData) => {
    if (!displayToast) return;
    toast.show({
      variant: "success",
      label: data.message,
      actionLabel: "Chiudi",
      onActionPress: ({ hide }) => hide(),
    });
  });

  const onError = useEffectEvent((error: TError) => {
    if (!displayToast) return;
    toast.show({
      variant: "danger",
      label: error.message,
      actionLabel: "Chiudi",
      onActionPress: ({ hide }) => hide(),
    });
  });

  useEffect(() => {
    if (isSuccess) onSuccess(data);
  }, [data]);

  useEffect(() => {
    if (isError) onError(error);
  }, [error]);

  const performAction = () => mutateAsync(variables as TVariables);

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
      {isPending ? (
        <Spinner entering={FadeIn.delay(50)} />
      ) : (
        <Animated.View entering={FadeIn.delay(50)} exiting={FadeOut}>
          {children}
        </Animated.View>
      )}
    </Button>
  );
}
