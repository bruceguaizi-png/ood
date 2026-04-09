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

export type BranchSystem = "eastern" | "western";

export type SessionStage =
  | "basic_tested"
  | "preview_unlocked"
  | "email_captured"
  | "crossover_generated"
  | "deep_dive_started";

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

export type BranchPreview = {
  system: BranchSystem;
  title: string;
  visualKey: string;
  teaser: string;
  detailSummary: string;
  personalityHook: string;
  graphicLabel: string;
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
  profileRationale: {
    dominantElement: ElementKey;
    weakestElement: ElementKey;
    supportElement: ElementKey;
    seasonalTone: "spring" | "summer" | "autumn" | "winter";
    dayPhase: "dawn" | "day" | "dusk" | "night" | "unknown";
    tensionPair: [ElementKey, ElementKey];
  };
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

export type CrossoverReport = {
  eastern: BranchPreview;
  western: BranchPreview;
  synthesisTitle: string;
  synthesisSummary: string;
  resonance: string;
  tension: string;
  personalityPattern: string;
  currentTimingSignal: string;
  nextMove: string;
  shareCaption: string;
};

export type SKU = {
  code:
    | "crossover-relationship"
    | "crossover-career"
    | "crossover-money"
    | "crossover-healing"
    | "crossover-bundle"
    | "signal-wallpaper";
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
  stage: SessionStage;
  registeredAt?: string;
  consentEntertainmentDisclaimer: boolean;
  email?: string;
  baseProfile: BaseProfile;
  branchPreview: {
    eastern: BranchPreview;
    western: BranchPreview;
  };
  crossoverReportId?: string;
  latestPaidOrderId?: string;
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
  reportKind: "deep_dive";
  createdAt: string;
  updatedAt: string;
};

export type ReportRecord = {
  id: string;
  intakeSessionId: string;
  orderId?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  kind: "crossover_base" | "deep_dive";
  status: ReportStatus;
  elementProfile: ElementProfile;
  crossover?: CrossoverReport;
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
