import { NextResponse } from "next/server";

import { TRACKING_EVENTS } from "@/lib/constants";
import { generateCrossoverReportFromSession } from "@/lib/server/generate-report";
import { captureServerEvent } from "@/lib/server/posthog";
import { getSession, updateSession } from "@/lib/server/store";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { intakeRegisterSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = intakeRegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid registration payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const turnstile = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstile.ok) {
    return NextResponse.json({ error: "Bot verification failed" }, { status: 400 });
  }

  const session = await getSession(parsed.data.sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const updatedSession = await updateSession(session.id, {
    email: parsed.data.email,
    stage: "email_captured",
    registeredAt: new Date().toISOString(),
  });

  const report = await generateCrossoverReportFromSession(session.id, parsed.data.email);

  await captureServerEvent(parsed.data.email, TRACKING_EVENTS.emailGateComplete, {
    sessionId: session.id,
    reportId: report.id,
  });

  return NextResponse.json({
    session: updatedSession,
    reportId: report.id,
    stage: "crossover_generated",
  });
}
