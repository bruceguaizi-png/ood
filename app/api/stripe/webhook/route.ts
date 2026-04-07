import { NextResponse } from "next/server";

import { env, hasStripe } from "@/lib/server/env";
import { generateReportFromOrder } from "@/lib/server/generate-report";
import { getOrderByStripeSessionId } from "@/lib/server/store";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!hasStripe() || !env.stripeWebhookSecret || !signature) {
    return NextResponse.json({
      received: true,
      mode: "mock",
      note: "Stripe webhook secret not configured. Local beta skips verification.",
    });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(env.stripeSecretKey ?? "");
  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid webhook signature",
      },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const order = await getOrderByStripeSessionId(session.id);
    if (order) {
      await generateReportFromOrder(order.id);
    }
  }

  return NextResponse.json({ received: true });
}
