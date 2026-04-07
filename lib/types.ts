export const focusThemes = [
  "love",
  "career",
  "money",
  "confidence",
  "healing",
] as const;

export type FocusTheme = (typeof focusThemes)[number];
export const trackKinds = [
  "fandom-relationship",
  "personal-growth",
  "fortune-upgrade",
  "goal-alignment",
] as const;

export type TrackKind = (typeof trackKinds)[number];

export type ElementKey = "metal" | "wood" | "water" | "fire" | "earth";

export type ElementProfile = {
  metal: number;
  wood: number;
  water: number;
  fire: number;
  earth: number;
  archetype: string;
  palette: {
    base: string;
    accent: string;
    glow: string;
  };
};

export type BaseChartVisual = {
  chartType: "hexagram";
  dominantElement: ElementKey;
  ringOrder: ElementKey[];
  glowLabel: string;
};

export type QuickInsight = {
  title: string;
  body: string;
};

export type RecommendedTrack = {
  kind: TrackKind;
  title: string;
  why: string;
  preview: string;
  cta: string;
};

export type BaseProfile = {
  identity: {
    name: string;
    birthday: string;
    birthTime?: string;
    birthLocation?: string;
  };
  chartType: BaseChartVisual["chartType"];
  chartVisual: BaseChartVisual;
  coreType: string;
  elementDistribution: ElementProfile;
  todaySignal: string;
  coreConclusion: string;
  topInsights: QuickInsight[];
  recommendedTracks: RecommendedTrack[];
};

export type ManifestReceipt = {
  date: string;
  theme: FocusTheme;
  energyScore: number;
  tarotCard: string;
  action: string;
  caution: string;
  mantra: string;
  summary: string;
  shareCaption: string;
};

export type SKU = {
  code: "manifest-receipt";
  title: string;
  price: number;
  currency: "USD";
  deliveryMode: "instant_digital";
};

export type PaymentStatus =
  | "pending"
  | "requires_payment"
  | "paid"
  | "failed"
  | "canceled";

export type ReportStatus =
  | "not_started"
  | "queued"
  | "generating"
  | "ready"
  | "failed";

export type DeliveryAsset = {
  kind: "html" | "pdf" | "png";
  url: string;
};

export type IntakePayload = {
  name: string;
  birthDate: string;
  birthTime?: string;
  birthCity?: string;
  consentEntertainmentDisclaimer: boolean;
  email?: string;
  turnstileToken?: string;
};

export type IntakeSession = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  birthDate: string;
  birthTime?: string;
  birthCity?: string;
  consentEntertainmentDisclaimer: boolean;
  email?: string;
  baseProfile: BaseProfile;
  reportId?: string;
  latestOrderId?: string;
};

export type Order = {
  id: string;
  intakeSessionId: string;
  reportId?: string;
  email: string;
  sku: SKU;
  stripeSessionId: string;
  paymentStatus: PaymentStatus;
  reportStatus: ReportStatus;
  createdAt: string;
  updatedAt: string;
};

export type ReportRecord = {
  id: string;
  intakeSessionId: string;
  orderId: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: ReportStatus;
  elementProfile: ElementProfile;
  receipt?: ManifestReceipt;
  disclaimer: string;
  assets: DeliveryAsset[];
  error?: string;
};

export type CheckoutResponse = {
  orderId: string;
  checkoutUrl: string;
  stripeSessionId: string;
};

export type GenerateReportResponse = {
  reportId: string;
  status: ReportStatus;
};

export type PublicReportResponse = {
  report: ReportRecord | null;
};
