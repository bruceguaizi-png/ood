import { NextResponse } from "next/server";

import { MANIFEST_RECEIPT_SKU } from "@/lib/constants";
import { createCheckoutSession } from "@/lib/server/payments";
import { createOrder, getSession, updateOrder } from "@/lib/server/store";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { checkoutSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid checkout payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const turnstile = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstile.ok) {
    return NextResponse.json({ error: "Bot verification failed" }, { status: 400 });
  }

  const session = await getSession(parsed.data.intakeSessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const provisionalOrder = await createOrder({
    intakeSessionId: parsed.data.intakeSessionId,
    email: parsed.data.email,
    stripeSessionId: `pending_${parsed.data.intakeSessionId}`,
    sku: MANIFEST_RECEIPT_SKU,
  });

  const checkout = await createCheckoutSession({
    intakeSessionId: parsed.data.intakeSessionId,
    orderId: provisionalOrder.id,
    email: parsed.data.email,
  });

  await updateOrder(provisionalOrder.id, {
    stripeSessionId: checkout.stripeSessionId,
  });

  return NextResponse.json({
    orderId: provisionalOrder.id,
    checkoutUrl: checkout.checkoutUrl,
    stripeSessionId: checkout.stripeSessionId,
  });
}
