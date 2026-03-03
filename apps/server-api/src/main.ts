import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";

import { appRouter, createTRPCContext } from "@beeto/api";

import { stripeWebhookHandler } from "./routes/stripeWebhook.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ credentials: true }));

// Stripe Webhook needs the raw body to verify signature
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

// Add express.json() middleware for all other routes
app.use(express.json());

// tRPC API setup
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: async ({ req }) => {
      const headers = new Headers();

      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === "string") {
          headers.set(key, value);
        } else if (Array.isArray(value)) {
          for (const v of value) {
            headers.append(key, v);
          }
        }
      }
      console.log(Array.from(headers.entries()));

      return createTRPCContext({ headers });
    },
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  }),
);

app.listen(port, () => {
  console.log(`🚀 Standalone backend started on http://localhost:${port}`);
  console.log(`📡 tRPC endpoint at http://localhost:${port}/api/trpc`);
});
