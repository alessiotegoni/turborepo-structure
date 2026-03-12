import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
} from "@beeto/db/queries";
import { insertEventSchema } from "@beeto/features/events/validators";

import { createSuccess } from "../helpers";
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
    .mutation(async ({ input, ctx }) => {
      await createEvent({
        ...input,
        creatorId: ctx.user.id,
      });

      return createSuccess(null, "Evento creato con successo!");
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input: eventId }) => {
      await deleteEvent(eventId);

      return createSuccess(null, "Evento eliminato con successo!");
    }),
} satisfies TRPCRouterRecord;
