import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createUser, getUserByEmail } from "@beeto/db/queries/users";
import { sendAuthEmail } from "@beeto/email";
import { createAdminClient } from "@beeto/supabase/admin";

import { createSuccess } from "../helpers";
import { publicProcedure } from "../trpc";

export const authRouter = {
  signInWithOtp: publicProcedure
    .input(z.object({ email: z.email("Email non valida") }))
    .mutation(async ({ input, ctx }) => {
      // 1. Generate link & OTP from Supabase via admin client
      const supabase = createAdminClient();
      const { data, error } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: input.email,
      });

      if (error) {
        console.error("Error generating magic link:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Errore durante la generazione del link di accesso",
        });
      }

      // 2. Send custom email wrapper
      if (data.properties.action_link) {
        const sendResult = await sendAuthEmail({
          to: input.email,
          url: data.properties.action_link,
          otp: data.properties.email_otp,
          isAlreadySignedIn: !!ctx.user,
        });

        if (!sendResult.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Impossibile inviare l'email di autenticazione",
          });
        }
      }

      return createSuccess(
        null,
        "Email di autenticazione inviata correttamente",
      );
    }),

  verifyOtp: publicProcedure
    .input(z.object({ email: z.email(), token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await getUserByEmail(input.email);

      const { data, error } = await ctx.supabase.auth.verifyOtp({
        email: input.email,
        token: input.token,
        type: user ? "magiclink" : "signup",
      });

      if (!data.user || error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Codice non valido o scaduto",
        });
      }

      if (!user) {
        await createUser({
          id: data.user.id,
          email: input.email,
        });
      }

      return createSuccess(data, "Codice verificato con successo!");
    }),

  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
} satisfies TRPCRouterRecord;
