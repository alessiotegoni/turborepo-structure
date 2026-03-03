import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  signInWithOtp: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await ctx.supabase.auth.signInWithOtp({
        email: input.email,
      });
      console.log(error);
      
      if (error) throw error;
      return { success: true };
    }),

  verifyOtp: publicProcedure
    .input(z.object({ email: z.string().email(), token: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase.auth.verifyOtp({
        email: input.email,
        token: input.token,
        type: "email",
      });
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
