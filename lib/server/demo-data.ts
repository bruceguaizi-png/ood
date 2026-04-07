import { buildBaseProfile } from "@/lib/server/base-profile";
import { MANIFEST_RECEIPT_SKU, DEMO_EMAIL, ENTERTAINMENT_DISCLAIMER } from "@/lib/constants";
import { type IntakeSession, type Order, type ReportRecord } from "@/lib/types";

export function makeDemoSession(): IntakeSession {
  const baseProfile = buildBaseProfile({
    name: "Aster",
    birthDate: "1998-09-17",
    birthTime: "06:18",
    birthCity: "Seoul",
    consentEntertainmentDisclaimer: true,
    email: DEMO_EMAIL,
  });

  return {
    id: "demo-session",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: "Aster",
    birthDate: "1998-09-17",
    birthTime: "06:18",
    birthCity: "Seoul",
    consentEntertainmentDisclaimer: true,
    email: DEMO_EMAIL,
    baseProfile,
    reportId: "demo-report",
    latestOrderId: "demo-order",
  };
}

export function makeDemoOrder(): Order {
  return {
    id: "demo-order",
    intakeSessionId: "demo-session",
    reportId: "demo-report",
    email: DEMO_EMAIL,
    sku: MANIFEST_RECEIPT_SKU,
    stripeSessionId: "demo_stripe_session",
    paymentStatus: "paid",
    reportStatus: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function makeDemoReport(): ReportRecord {
  return {
    id: "demo-report",
    intakeSessionId: "demo-session",
    orderId: "demo-order",
    email: DEMO_EMAIL,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "ready",
    disclaimer: ENTERTAINMENT_DISCLAIMER,
    elementProfile: makeDemoSession().baseProfile.elementDistribution,
    receipt: {
      date: "April 8, 2026",
      theme: "confidence",
      energyScore: 88,
      tarotCard: "Strength",
      action: "Say the direct thing first. Your cleanest sentence opens the room.",
      caution: "Do not over-style the truth to feel more acceptable.",
      mantra: "I become more radiant when I stop shrinking the signal.",
      summary:
        "Your field is running hot with fire and metal tonight, which means momentum follows decisiveness. This is a clean day to ask, pitch, post, or choose.",
      shareCaption:
        "Today’s O.O.D receipt says my power returns the second I stop negotiating with fear.",
    },
    assets: [
      { kind: "html", url: "/api/report/demo-report/download?kind=html" },
      { kind: "png", url: "/api/report/demo-report/download?kind=png" },
      { kind: "pdf", url: "/api/report/demo-report/download?kind=pdf" },
    ],
  };
}
