import { NextResponse } from "next/server";

import { readGeneratedAsset } from "@/lib/server/assets";
import { getReport } from "@/lib/server/store";

type DownloadRouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: DownloadRouteProps) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const kind = (url.searchParams.get("kind") ?? "html") as "html" | "pdf" | "png";
  const file = await readGeneratedAsset(id, kind);

  const headers = new Headers();
  headers.set(
    "Content-Type",
    kind === "pdf"
      ? "application/pdf"
      : kind === "png"
        ? "image/svg+xml"
        : "text/html; charset=utf-8",
  );
  headers.set(
    "Content-Disposition",
    `inline; filename="${id}.${kind === "png" ? "svg" : kind}"`,
  );

  return new NextResponse(file, { headers });
}
