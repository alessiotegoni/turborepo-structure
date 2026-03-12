import type { FieldValues } from "react-hook-form";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { Button, Spinner } from "heroui-native";
import { useFormContext } from "react-hook-form";

import type { MutationButtonProps, SuccessResponse } from "./types";
import { useMutation } from "../../../../hooks/use-mutation";

type SubmitButtonProps<
  TData extends SuccessResponse<unknown>,
  TError extends { message: string },
  TVariables extends FieldValues,
> = MutationButtonProps<TData, TError, TVariables>;

/**
 * Button di submit integrato con react-hook-form.
 * Usa `form.handleSubmit` per validare il form prima di chiamare la mutation,
 * passando i valori del form come variabili.
 *
 * Deve essere usato all'interno di un `<FormProvider>`.
 *
 * @example
 * <FormProvider {...form}>
 *   <Field name="title" render={...} />
 *   <SubmitButton mutationOptions={createEventOptions}>
 *     <Button.Label>Crea</Button.Label>
 *   </SubmitButton>
 * </FormProvider>
 */
export function SubmitButton<
  TData extends SuccessResponse<unknown>,
  TError extends { message: string },
  TVariables extends FieldValues,
>({
  mutationOptions,
  loadingText,
  showToast = true,
  className,
  isDisabled,
  children,
  ...props
}: SubmitButtonProps<TData, TError, TVariables>) {
  const form = useFormContext<TVariables>();

  const { isPending, mutateAsync } = useMutation(mutationOptions, {
    showToast,
  });

  const onSubmit = (values: TVariables) => mutateAsync(values);

  const handlePress = () => form.handleSubmit(onSubmit)();

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
