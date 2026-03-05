import { authRouter } from "./router/auth";
import { eventRouter } from "./router/event";
import { stripeRouter } from "./router/stripe";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  event: eventRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
