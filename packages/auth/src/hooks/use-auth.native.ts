import { useMutation, useQueryClient } from "@tanstack/react-query";

import { trpc } from "@beeto/api/native";
import { supabase } from "@beeto/supabase/native";
import { useToast } from "@beeto/ui/native";

interface UseAuthOptions {
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function useAuth({ onSignIn, onSignOut }: UseAuthOptions = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const signInWithOtp = useMutation({
    ...trpc.auth.signInWithOtp.mutationOptions({
      onSuccess: () => {
        toast.show({
          variant: "success",
          label: "Codice inviato!",
          description: "E' stato inviato un codice alla tua casella di posta",
          actionLabel: "Chiudi",
          onActionPress: ({ hide }) => hide(),
        });
      },
      onError: () => {
        toast.show("Errore durante l'invio");
      },
    }),
  });

  const verifyOtp = useMutation({
    ...trpc.auth.verifyOtp.mutationOptions({
      onSuccess: async (data) => {
        if (data?.session) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
        }
        await queryClient.invalidateQueries(trpc.auth.getUser.pathFilter());
        toast.show({
          variant: "success",
          label: "Login effettuato con successo!",
          actionLabel: "Chiudi",
          onActionPress: ({ hide }) => hide(),
        });
        onSignIn?.();
      },
      onError: () => {
        toast.show({
          variant: "danger",
          label: "Codice non valido o scaduto!",
          actionLabel: "Chiudi",
          onActionPress: ({ hide }) => hide(),
        });
      },
    }),
  });

  const signOut = useMutation({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.auth.getUser.pathFilter());
      toast.show({ label: "Disconnesso", variant: "danger" });
      onSignOut?.();
    },
    onError: () => {
      toast.show("Errore durante la disconnessione");
    },
  });

  return { signInWithOtp, verifyOtp, signOut };
}
