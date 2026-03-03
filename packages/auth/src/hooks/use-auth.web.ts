"use client";

import { useMutation } from "@tanstack/react-query";

import { useTRPC } from "@beeto/api/web/react";
import { toast } from "@beeto/ui/web";

interface UseAuthOptions {
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function useAuth({ onSignIn, onSignOut }: UseAuthOptions = {}) {
  const trpc = useTRPC();

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
      onSuccess: () => {
        onSignIn?.();
        toast.success("Accesso eseguito!");
      },
      onError: (err) => {
        toast.danger("Errore");
      },
    }),
  });

  const signOut = useMutation({
    ...trpc.auth.signOut.mutationOptions({
      onSuccess: () => {
        onSignOut?.();
        toast.success("Email inviata!");
      },
      onError: (err) => {
        toast.danger("Errore");
      },
    }),
  });

  return { signInWithOtp, verifyOtp, signOut };
}
