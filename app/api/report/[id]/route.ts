import { NextResponse } from "next/server";

import { getReport } from "@/lib/server/store";

type ReportRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: ReportRouteProps) {
  const { id } = await params;
  const report = await getReport(id);

  return NextResponse.json({ report });
}
