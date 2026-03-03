import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { desc, eq } from "@beeto/db";
import { events } from "@beeto/db/schema";
import { insertEventSchema } from "@beeto/features/events";

import { protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.events.findMany({
      orderBy: desc(events.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.events.findFirst({
        where: eq(events.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(insertEventSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(events).values({ ...input, createdBy: ctx.user.id });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(events).where(eq(events.id, input));
  }),
} satisfies TRPCRouterRecord;
