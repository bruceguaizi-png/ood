import { type SKU } from "@/lib/types";

export const APP_NAME = "O.O.D";
export const APP_TAGLINE = "Object of Desire";
export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const ENTERTAINMENT_DISCLAIMER =
  "For entertainment and self-reflection only. O.O.D does not provide medical, legal, financial, or mental health advice.";

export const DEEP_DIVE_SKUS: Record<
  "relationship" | "career" | "money" | "healing" | "bundle" | "wallpaper",
  SKU
> = {
  relationship: {
    code: "crossover-relationship",
    title: "Relationship Deep Dive",
    price: 799,
    currency: "USD",
    deliveryMode: "instant_digital",
  },
  career: {
    code: "crossover-career",
    title: "Career Deep Dive",
    price: 799,
    currency: "USD",
    deliveryMode: "instant_digital",
  },
  money: {
    code: "crossover-money",
    title: "Money Deep Dive",
    price: 799,
    currency: "USD",
    deliveryMode: "instant_digital",
  },
  healing: {
    code: "crossover-healing",
    title: "Healing & Personality Deep Dive",
    price: 799,
    currency: "USD",
    deliveryMode: "instant_digital",
  },
  bundle: {
    code: "crossover-bundle",
    title: "Cross-Over Bundle",
    price: 1999,
    currency: "USD",
    deliveryMode: "instant_digital",
  },
  wallpaper: {
    code: "signal-wallpaper",
    title: "Signal Wallpaper Add-On",
    price: 499,
    currency: "USD",
    deliveryMode: "instant_digital",
  },
};

export const DEMO_EMAIL = "ritual@ood.aura";

export const TRACKING_EVENTS = {
  landingView: "landing_view",
  quizStart: "quiz_start",
  quizComplete: "quiz_complete",
  previewView: "preview_view",
  emailGateComplete: "email_gate_complete",
  crossoverReportGenerated: "crossover_report_generated",
  checkoutStart: "checkout_start",
  paymentSuccess: "payment_success",
  reportOpen: "report_open",
  shareClick: "share_click",
  repeatPurchase: "repeat_purchase",
} as const;
