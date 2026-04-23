import { NextResponse } from "next/server";

import { env } from "@/lib/server/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "ood-paid-beta",
    environment: env.nodeEnv,
    url: env.appUrl,
    timestamp: new Date().toISOString(),
  });
}
