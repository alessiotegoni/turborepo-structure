import { useState } from "react";
import { mutationOptions, useQueryClient } from "@tanstack/react-query";

import { trpc } from "@beeto/api/native";
import { supabase } from "@beeto/supabase/native";

interface useAuthProps {
  onOtpSent?: () => void;
  onOtpVerified?: () => void;
  onSignOut?: () => void;
  initialEmail?: string;
}

export function useAuth({
  onOtpSent,
  onOtpVerified,
  onSignOut,
  initialEmail = "",
}: useAuthProps = {}) {
  const queryClient = useQueryClient();

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState("");

  const sendOtpOptions = trpc.auth.signInWithOtp.mutationOptions({
    onSuccess: onOtpSent,
  });

  const verifyOtpOptions = trpc.auth.verifyOtp.mutationOptions({
    onSuccess: async ({ data }) => {
      if (data?.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }
      await queryClient.invalidateQueries(trpc.auth.getUser.pathFilter());
      onOtpVerified?.();
    },
  });

  const signOutOptions = mutationOptions({
    mutationFn: () => supabase.auth.signOut(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.auth.getUser.pathFilter());
      onSignOut?.();
    },
  });

  return {
    sendOtpOptions,
    verifyOtpOptions,
    signOutOptions,
    email,
    setEmail,
    token,
    setToken,
  };
}
