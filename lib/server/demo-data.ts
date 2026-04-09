import { buildBaseProfile } from "@/lib/server/base-profile";
import { buildBranchPreviewPair, buildCrossoverReport } from "@/lib/server/ritual";
import { DEEP_DIVE_SKUS, DEMO_EMAIL, ENTERTAINMENT_DISCLAIMER } from "@/lib/constants";
import { type IntakeSession, type Order, type ReportRecord } from "@/lib/types";

export function makeDemoSession(): IntakeSession {
  const baseProfile = buildBaseProfile({
    name: "Aster",
    birthDate: "1998-09-17",
    birthTime: "06:18",
    birthCity: "Seoul",
    consentEntertainmentDisclaimer: true,
  });
  const branchPreview = buildBranchPreviewPair(baseProfile);

  return {
    id: "demo-session",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Aster",
    birthDate: "1998-09-17",
    birthTime: "06:18",
    birthCity: "Seoul",
    stage: "crossover_generated",
    registeredAt: new Date().toISOString(),
    consentEntertainmentDisclaimer: true,
    email: DEMO_EMAIL,
    baseProfile,
    branchPreview,
    crossoverReportId: "demo-report",
    latestPaidOrderId: "demo-order",
  };
}

export function makeDemoOrder(): Order {
  return {
    id: "demo-order",
    intakeSessionId: "demo-session",
    reportId: "demo-report",
    email: DEMO_EMAIL,
    sku: DEEP_DIVE_SKUS.relationship,
    stripeSessionId: "demo_stripe_session",
    paymentStatus: "paid",
    reportStatus: "ready",
    reportKind: "deep_dive",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function makeDemoReport(): ReportRecord {
  const session = makeDemoSession();
  return {
    id: "demo-report",
    intakeSessionId: "demo-session",
    email: DEMO_EMAIL,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    kind: "crossover_base",
    status: "ready",
    disclaimer: ENTERTAINMENT_DISCLAIMER,
    elementProfile: session.baseProfile.elementDistribution,
    crossover: buildCrossoverReport(session.baseProfile, session.branchPreview),
    assets: [
      { kind: "html", url: "/api/report/demo-report/download?kind=html" },
      { kind: "png", url: "/api/report/demo-report/download?kind=png" },
      { kind: "pdf", url: "/api/report/demo-report/download?kind=pdf" },
    ],
  };
}
