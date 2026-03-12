import { Alert } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { Button, Spinner } from "heroui-native";

import type { MutationButtonProps, SuccessResponse } from "./types";
import { useMutation } from "../../../../hooks/use-mutation";

type ActionButtonProps<
  TData extends SuccessResponse<unknown>,
  TError extends { message: string },
  TVariables,
> = MutationButtonProps<TData, TError, TVariables> & {
  variables: TVariables;
  loadingText?: string;
  requireAreYouSure?: boolean;
  areYouSureTitle?: string;
  areYouSureDescription?: string;
  showToast?: boolean;
};

export function ActionButton<
  TData extends SuccessResponse<unknown>,
  TError extends { message: string },
  TVariables,
>({
  mutationOptions,
  variables,
  loadingText,
  requireAreYouSure = false,
  areYouSureTitle = "Sei sicuro?",
  areYouSureDescription = "Questa azione non può essere annullata",
  showToast = true,
  className,
  isDisabled,
  children,
  ...props
}: ActionButtonProps<TData, TError, TVariables>) {
  const { isPending, mutateAsync } = useMutation(mutationOptions, {
    showToast,
  });

  const performAction = () => mutateAsync(variables);

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
        onPress: () => {
          void performAction();
        },
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
        <Animated.View
          entering={FadeIn}
          style={{ flexDirection: "row", gap: 10 }}
        >
          <Spinner />
          {loadingText && <Button.Label>{loadingText}...</Button.Label>}
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn}>{children}</Animated.View>
      )}
    </Button>
  );
}
