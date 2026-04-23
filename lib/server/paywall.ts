import { getOrder, getSession } from "@/lib/server/store";

import { type Order } from "@/lib/types";

export type PaidFeatureSlug =
  | "relationship-deep-dive"
  | "career-deep-dive"
  | "money-deep-dive"
  | "healing-deep-dive"
  | "bundle";

const skuCodeByFeature: Record<PaidFeatureSlug, Order["sku"]["code"]> = {
  "relationship-deep-dive": "crossover-relationship",
  "career-deep-dive": "crossover-career",
  "money-deep-dive": "crossover-money",
  "healing-deep-dive": "crossover-healing",
  bundle: "crossover-bundle",
};

function isPaidOrder(order: Order | null) {
  return Boolean(order && order.paymentStatus === "paid");
}

export async function getSessionPaywallState(sessionId: string) {
  const session = await getSession(sessionId);
  if (!session) return null;

  const latestPaidOrder = session.latestPaidOrderId
    ? await getOrder(session.latestPaidOrderId)
    : null;

  return {
    session,
    hasAnyPaidOrder: isPaidOrder(latestPaidOrder),
    latestPaidOrder,
  };
}

export async function canAccessPaidFeature(input: {
  sessionId: string;
  feature: PaidFeatureSlug;
}) {
  const state = await getSessionPaywallState(input.sessionId);
  if (!state) return { allowed: false, reason: "missing_session" as const };

  if (!state.latestPaidOrder || state.latestPaidOrder.paymentStatus !== "paid") {
    return { allowed: false, reason: "payment_required" as const, state };
  }

  const expectedSkuCode = skuCodeByFeature[input.feature];
  const paidSkuCode = state.latestPaidOrder.sku.code;

  const allowed =
    paidSkuCode === expectedSkuCode || paidSkuCode === "crossover-bundle";

  return {
    allowed,
    reason: allowed ? ("paid" as const) : ("different_product" as const),
    state,
  };
}
