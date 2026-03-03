import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { createCheckoutSession } from "@beeto/payments";

import { protectedProcedure } from "../trpc";

export const stripeRouter = {
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const checkoutSession = await createCheckoutSession({
        userId: ctx.user.id,
        successUrl: input.successUrl,
        cancelUrl: input.cancelUrl,
      });

      return {
        url: checkoutSession.url,
      };
    }),
} satisfies TRPCRouterRecord;
