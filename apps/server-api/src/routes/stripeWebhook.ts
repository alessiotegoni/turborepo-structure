import type { Request, Response } from "express";

import { handleStripeWebhook } from "@beeto/payments/webhook";

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  if (!sig || typeof sig !== "string") {
    res.status(400).send("Webhook Error: Missing stripe-signature");
    return;
  }

  try {
    // req.body should be a Buffer because of express.raw({ type: "application/json" })
    await handleStripeWebhook(req.body, sig);
    res.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
