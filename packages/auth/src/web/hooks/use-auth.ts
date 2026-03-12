"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@beeto/api/web/react";
import { supabase } from "@beeto/supabase/client";
import { toast } from "@beeto/ui/web";

interface UseAuthOptions {
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function useAuth({ onSignIn, onSignOut }: UseAuthOptions = {}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const signInWithOtp = useMutation({
    ...trpc.auth.signInWithOtp.mutationOptions({
      onSuccess: () => {
        toast.success("Email inviata!");
      },
      onError: (err) => {
        toast.danger(`Errore: ${err.message}`);
      },
    }),
  });

  const verifyOtp = useMutation({
    ...trpc.auth.verifyOtp.mutationOptions({
      onSuccess: async ({ data }) => {
        const session = data.session;
        if (session) {
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });
          queryClient.invalidateQueries(trpc.auth.getUser.pathFilter());
        }
        onSignIn?.();
        toast.success("Accesso eseguito!");
      },
      onError: () => {
        toast.danger("Errore");
      },
    }),
  });

  const signOut = useMutation({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.auth.getUser.pathFilter());
      onSignOut?.();
      toast.success("Disconnesso!");
    },
    onError: () => {
      toast.danger("Errore");
    },
  });

  return { signInWithOtp, verifyOtp, signOut };
}
