import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { sendAuthEmail } from "@beeto/email";
import { createAdminClient } from "@beeto/supabase/admin";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  signInWithOtp: publicProcedure
    .input(z.object({ email: z.email() }))
    .mutation(async ({ input, ctx }) => {
      // 1. Generate link & OTP from Supabase via admin client
      const supabase = createAdminClient();
      const { data, error } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: input.email,
      });

      if (error) {
        console.error("Error generating magic link:", error);
        throw error;
      }

      // 2. Send custom email wrapper
      if (data.properties?.action_link) {
        const sendResult = await sendAuthEmail({
          to: input.email,
          url: data.properties.action_link,
          otp: data.properties.email_otp,
          isAlreadySignedIn: !!ctx.user
        });

        if (!sendResult.success) {
          throw new Error("Impossibile inviare l'email di autenticazione");
        }
      }

      return { success: true };
    }),

  verifyOtp: publicProcedure
    .input(z.object({ email: z.email(), token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase.auth.verifyOtp({
        email: input.email,
        token: input.token,
        type: "magiclink",
      });
      console.log(data, error);

      if (error) throw error;
      return data;
    }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    const { error } = await ctx.supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  }),

  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
} satisfies TRPCRouterRecord;
