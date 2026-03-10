import type { MutationOptions } from "@tanstack/react-query";
import type { ButtonRootProps } from "heroui-native";
import { Alert } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { useMutation } from "@tanstack/react-query";
import { Button, Spinner, useToast } from "heroui-native";

type ActionButtonProps<
  TData = unknown,
  TError = Error,
  TVariables = void,
> = ButtonRootProps & {
  mutationOptions: MutationOptions<TData, TError, TVariables>;
  variables?: TVariables;
  successMessage: string;
  loadingText?: string;
  requireAreYouSure?: boolean;
  areYouSureTitle?: string;
  areYouSureDescription?: string;
  displayToast?: boolean;
};

export function ActionButton<
  TData = unknown,
  TError = Error,
  TVariables = void,
>({
  mutationOptions,
  variables,
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
}: ActionButtonProps<TData, TError, TVariables>) {
  const { toast } = useToast();

  const { isPending, mutateAsync } = useMutation(mutationOptions);

  async function performAction() {
    try {
      await mutateAsync(variables as TVariables);
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
