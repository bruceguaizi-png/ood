import { getOrder, getReport, getSession } from "@/lib/server/store";

export async function getCheckoutContext(input: {
  orderId?: string | null;
  sessionId?: string | null;
  reportId?: string | null;
}) {
  const order = input.orderId ? await getOrder(input.orderId) : null;
  const session =
    input.sessionId && !order
      ? await getSession(input.sessionId)
      : order
        ? await getSession(order.intakeSessionId)
        : null;
  const report =
    input.reportId ? await getReport(input.reportId) : order?.reportId ? await getReport(order.reportId) : null;

  return {
    order,
    session,
    report,
  };
}
