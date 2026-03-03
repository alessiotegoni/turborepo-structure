import Stripe from "stripe";

import { stripeEnv } from "../env";

const env = stripeEnv();

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

export const createCheckoutSession = async ({
  userId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    client_reference_id: userId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    line_items: [
      {
        price: "price_dummy", // You can customize or pass as arg
        quantity: 1,
      },
    ],
  });
};
