import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { desc, eq } from "@beeto/db";
import { posts } from "@beeto/db/schema";
import { insertPostSchema } from "@beeto/features/posts";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: desc(posts.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(insertPostSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(posts).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(posts).where(eq(posts.id, input));
  }),
} satisfies TRPCRouterRecord;
