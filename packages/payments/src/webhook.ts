import type Stripe from "stripe";

import { eq } from "@beeto/db";
import { db } from "@beeto/db/client";
import { subscriptions } from "@beeto/db/schema";

import { stripeEnv } from "../env";
import { stripe } from "./index";

const env = stripeEnv();

export const handleStripeWebhook = async (body: string, sig: string) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = session.client_reference_id;
      const stripeCustomerId = session.customer as string;
      const stripeSubscriptionId = session.subscription as string;

      if (!userId) {
        throw new Error("Missing client_reference_id in session");
      }

      await db.insert(subscriptions).values({
        userId,
        stripeCustomerId,
        stripeSubscriptionId,
        status: "active",
        active: true,
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await db
        .update(subscriptions)
        .set({ status: subscription.status, active: false })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await db
        .update(subscriptions)
        .set({ status: subscription.status })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { success: true };
};
