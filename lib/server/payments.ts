import Stripe from "stripe";

import { MANIFEST_RECEIPT_SKU } from "@/lib/constants";
import { env, hasStripe } from "@/lib/server/env";
import { absoluteUrl } from "@/lib/utils";

let stripe: Stripe | null = null;

function getStripe() {
  if (!hasStripe()) return null;
  if (!stripe) stripe = new Stripe(env.stripeSecretKey ?? "");
  return stripe;
}

export async function createCheckoutSession(input: {
  intakeSessionId: string;
  orderId: string;
  email: string;
}) {
  const client = getStripe();

  if (!client || !env.stripePriceId) {
    return {
      provider: "mock" as const,
      stripeSessionId: `mock_checkout_${input.orderId}`,
      checkoutUrl: absoluteUrl(
        `/checkout/success?session_id=mock_checkout_${input.orderId}&order_id=${input.orderId}&mock=1`,
      ),
    };
  }

  const session = await client.checkout.sessions.create({
    mode: "payment",
    customer_email: input.email,
    line_items: [{ price: env.stripePriceId, quantity: 1 }],
    metadata: {
      intakeSessionId: input.intakeSessionId,
      orderId: input.orderId,
      sku: MANIFEST_RECEIPT_SKU.code,
    },
    success_url: absoluteUrl(
      `/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${input.orderId}`,
    ),
    cancel_url: absoluteUrl(`/preview/${input.intakeSessionId}?canceled=1`),
  });

  return {
    provider: "stripe" as const,
    stripeSessionId: session.id,
    checkoutUrl: session.url ?? absoluteUrl(`/checkout/success?session_id=${session.id}`),
  };
}

export async function confirmMockPayment(orderId: string) {
  return {
    provider: "mock",
    orderId,
  };
}
