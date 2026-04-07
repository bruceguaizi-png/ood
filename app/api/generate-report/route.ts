import { NextResponse } from "next/server";

import { generateReportFromOrder } from "@/lib/server/generate-report";
import { getOrder, getReportByOrderId } from "@/lib/server/store";
import { generateReportSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const order = await getOrder(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const report = await getReportByOrderId(orderId);
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

  const report = await generateReportFromOrder(parsed.data.orderId);
  return NextResponse.json({
    reportId: report.id,
    status: report.status,
  });
}
