import { useMutation, useQueryClient } from "@tanstack/react-query";

import { trpc } from "@beeto/api/native";
import { createClient } from "@beeto/supabase/native";
import { useToast } from "@beeto/ui/native";

interface UseAuthOptions {
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function useAuth({ onSignIn, onSignOut }: UseAuthOptions = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const signInWithOtp = useMutation({
    ...trpc.auth.signInWithOtp.mutationOptions({
      onSuccess: () => {
        toast.show({ label: "Email inviata!" });
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
        toast.show("Accesso effettuato");
        onSignIn?.();
      },
      onError: () => {
        toast.show("Codice non valido");
      },
    }),
  });

  const signOut = useMutation({
    ...trpc.auth.signOut.mutationOptions({
      onSuccess: async () => {
        await supabase.auth.signOut();
        await queryClient.invalidateQueries(trpc.auth.getUser.pathFilter());
        toast.show("Disconnesso");
        onSignOut?.();
      },
      onError: () => {
        toast.show("Errore durante la disconnessione");
      },
    }),
  });

  return { signInWithOtp, verifyOtp, signOut };
}
