import { NextResponse } from "next/server";

import { buildBaseProfile } from "@/lib/server/base-profile";
import { buildBranchPreviewPair } from "@/lib/server/ritual";
import { createSession } from "@/lib/server/store";
import { verifyTurnstile } from "@/lib/server/turnstile";
import { intakeSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = intakeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid intake payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const turnstile = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstile.ok) {
    return NextResponse.json({ error: "Bot verification failed" }, { status: 400 });
  }

  const baseProfile = buildBaseProfile(parsed.data);
  const branchPreview = buildBranchPreviewPair(baseProfile);
  const session = await createSession(parsed.data, baseProfile, branchPreview);

  return NextResponse.json({
    sessionId: session.id,
    baseProfile: session.baseProfile,
    branchPreview: session.branchPreview,
    stage: session.stage,
  });
}
