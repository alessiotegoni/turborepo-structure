"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@beeto/api/web/react";
import { toast } from "@beeto/ui/web";
import { supabase } from "@beeto/supabase/client";

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
      onSuccess: async (data) => {
        if (data?.session) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
          queryClient.invalidateQueries(trpc.auth.getUser.pathFilter())
        }
        onSignIn?.();
        toast.success("Accesso eseguito!");
      },
      onError: (err) => {
        toast.danger("Errore");
      },
    }),
  });

  const signOut = useMutation({
    mutationFn: supabase.auth.signOut,
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.auth.getUser.pathFilter());
      onSignOut?.();
      toast.success("Disconnesso!");
    },
      onError: (err) => {
      toast.danger("Errore");
    },
  });

  return { signInWithOtp, verifyOtp, signOut };
}
