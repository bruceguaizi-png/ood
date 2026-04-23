import { NextResponse } from "next/server";

import { readReportBundle } from "@/lib/server/ai/bundle-store";
import { getCurrentUser } from "@/lib/server/auth";
import { canAccessReport } from "@/lib/server/report-access";
import { getReport } from "@/lib/server/store";

type ReportRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: ReportRouteProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await getReport(id);
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (!canAccessReport(report, user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bundle = await readReportBundle(id);

  return NextResponse.json({ report, bundle });
}
