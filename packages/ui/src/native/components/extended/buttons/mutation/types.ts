import type { MutationOptions } from "@tanstack/react-query";
import type { ButtonRootProps } from "heroui-native";

import type { SuccessResponse } from "../../../../hooks/use-mutation";

export type { SuccessResponse };

export type MutationButtonProps<
  TData extends SuccessResponse<unknown>,
  TError extends { message: string },
  TVariables,
> = ButtonRootProps & {
  mutationOptions: MutationOptions<TData, TError, TVariables>;
  loadingText?: string;
  showToast?: boolean;
};
