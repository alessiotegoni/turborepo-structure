import { KeyboardAvoidingView } from "react-native";
import { HeroUINativeConfig, HeroUINativeProvider } from "heroui-native";

export function UIProvider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUINativeProvider config={config}>{children}</HeroUINativeProvider>
  );
}

const config: HeroUINativeConfig = {
  devInfo: {
    stylingPrinciples: false,
  },
  toast: {
    // Global toast configuration (used as defaults for all toasts)
    defaultProps: {
      variant: "default",
      placement: "top",
      isSwipeable: true,
      animation: true,
    },
    // Insets for spacing from screen edges (added to safe area insets)
    insets: {},
    // Maximum number of visible toasts before opacity starts fading
    maxVisibleToasts: 3,
    // Custom wrapper function to wrap the toast content
    contentWrapper: (children) => (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={24}>
        {children}
      </KeyboardAvoidingView>
    ),
  },
};
