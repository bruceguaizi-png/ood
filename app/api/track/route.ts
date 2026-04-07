import { NextResponse } from "next/server";

import { captureServerEvent } from "@/lib/server/posthog";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    distinctId?: string;
    event?: string;
    properties?: Record<string, unknown>;
  };

  if (!body.distinctId || !body.event) {
    return NextResponse.json({ error: "distinctId and event are required" }, { status: 400 });
  }

  const result = await captureServerEvent(body.distinctId, body.event, body.properties);
  return NextResponse.json({ ok: true, result });
}
