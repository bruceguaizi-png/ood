import { type SKU } from "@/lib/types";

export const APP_NAME = "O.O.D";
export const APP_TAGLINE = "Object of Desire";
export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const ENTERTAINMENT_DISCLAIMER =
  "For entertainment and self-reflection only. O.O.D does not provide medical, legal, financial, or mental health advice.";

export const MANIFEST_RECEIPT_SKU: SKU = {
  code: "manifest-receipt",
  title: "Manifest Receipt",
  price: 299,
  currency: "USD",
  deliveryMode: "instant_digital",
};

export const DEMO_EMAIL = "ritual@ood.aura";

export const TRACKING_EVENTS = {
  landingView: "landing_view",
  quizStart: "quiz_start",
  quizComplete: "quiz_complete",
  previewView: "preview_view",
  checkoutStart: "checkout_start",
  paymentSuccess: "payment_success",
  reportOpen: "report_open",
  shareClick: "share_click",
  repeatPurchase: "repeat_purchase",
} as const;
