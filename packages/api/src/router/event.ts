import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
} from "@beeto/db/queries/events";
import { insertEventSchema } from "@beeto/features/events/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

export const eventRouter = {
  all: publicProcedure.query(getEvents),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return getEventById(input.id);
    }),

  create: protectedProcedure
    .input(insertEventSchema)
    .mutation(({ input, ctx }) => {
      return createEvent({
        ...input,
        createdBy: ctx.user.id,
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ input }) => {
    return deleteEvent(input);
  }),
} satisfies TRPCRouterRecord;
