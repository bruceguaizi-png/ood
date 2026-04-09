import { NextResponse } from "next/server";

import { generateCrossoverReportFromSession, generateReportFromOrder } from "@/lib/server/generate-report";
import { getOrder, getReportByOrderId, getReportBySessionAndKind, getSession } from "@/lib/server/store";
import { generateReportSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");
  const sessionId = url.searchParams.get("sessionId");

  if (!orderId && !sessionId) {
    return NextResponse.json({ error: "orderId or sessionId is required" }, { status: 400 });
  }

  if (sessionId) {
    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const report = await getReportBySessionAndKind(sessionId, "crossover_base");
    if (report) {
      return NextResponse.json({ report, status: report.status });
    }

    return NextResponse.json({ status: session.stage });
  }

  const order = await getOrder(orderId!);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const report = await getReportByOrderId(orderId!);
  if (report) {
    return NextResponse.json({ report, status: report.status });
  }

  return NextResponse.json({ status: order.reportStatus });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = generateReportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const report = parsed.data.sessionId
    ? await generateCrossoverReportFromSession(parsed.data.sessionId, "")
    : await generateReportFromOrder(parsed.data.orderId!);
  return NextResponse.json({
    reportId: report.id,
    status: report.status,
  });
}
