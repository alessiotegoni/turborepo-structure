/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod/v4";

import { db } from "@beeto/db/client";
import { getUserByEmail } from "@beeto/db/queries/users";
import { createClient } from "@beeto/supabase/server";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

type ContextType = {
  headers: Headers;
};

export const createTRPCContext = async ({ headers }: ContextType) => {
  const supabase = await createClient(headers);

  let user = null;
  const authHeader = headers.get("Authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      user = data?.user ?? null;
    }
  } else {
    // Fallback for browser calls using standard cookies
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  }

  const dbUser = user && user.email ? await getUserByEmail(user.email) : null;
  console.log("Logged user:", user?.id ?? "null", dbUser ?? "null");

  return {
    user:
      user && dbUser
        ? {
            ...user,
            db: dbUser,
          }
        : null,
    supabase,
    db,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  /**
   * L'errorFormatter formatta l'errore prima di spedirlo al frontend.
   * - 'error': l'errore originale (tecnico) avvenuto sul server.
   * - 'shape': l'oggetto JSON finale che il client riceverà effettivamente.
   * Qui modifichiamo la 'shape' per mostrare messaggi leggibili all'utente.
   */
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      message:
        error.cause instanceof ZodError
          ? error.cause.issues
              .map((issue) => {
                const path = issue.path.join(".");
                return path ? `${path}: ${issue.message}` : issue.message;
              })
              .join("; ")
          : shape.message,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError
            ? z.flattenError(error.cause as ZodError<Record<string, unknown>>)
            : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        // infers the `user` as non-nullable
        user: ctx.user,
      },
    });
  });
