import type { MutationOptions } from "@tanstack/react-query";
import type { ButtonRootProps } from "heroui-native";

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export type MutationButtonProps<
  TData extends SuccessResponse<unknown>,
  TError extends { message: string },
  TVariables,
> = ButtonRootProps & {
  mutationOptions: MutationOptions<TData, TError, TVariables>;
  loadingText?: string;
  showToast?: boolean;
};
