import { z } from "zod";

import { type ReportRecord } from "@/lib/types";

export type AiMessage = {
  role: "system" | "user";
  content: string;
};

export type ReportDomain =
  | "relationship"
  | "career"
  | "growth"
  | "health"
  | "bundle";

export type AiTaskId =
  | "western-preview"
  | "eastern-preview"
  | "crossover-report"
  | "deep-dive-relationship"
  | "deep-dive-career"
  | "deep-dive-growth"
  | "deep-dive-health"
  | "deep-dive-bundle";

export const reportSectionSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});

export type ReportSection = z.infer<typeof reportSectionSchema>;

export const previewNarrativeSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().min(1),
  keyConclusions: z.array(z.string().min(1)).min(2).max(5),
});

export type PreviewNarrative = z.infer<typeof previewNarrativeSchema>;

export const crossoverNarrativeSchema = z.object({
  headline: z.string().min(1),
  summary: z.string().min(1),
  sections: z.array(reportSectionSchema).length(7),
  resonance: z.string().min(1),
  tension: z.string().min(1),
  personalityPattern: z.string().min(1),
  currentTimingSignal: z.string().min(1),
  nextMove: z.string().min(1),
  shareCaption: z.string().min(1),
  signalRelationship: z.string().min(1).max(220),
  signalCareer: z.string().min(1).max(220),
  signalGrowth: z.string().min(1).max(220),
  signalHealth: z.string().min(1).max(220),
});

export type CrossoverNarrative = z.infer<typeof crossoverNarrativeSchema>;

export const deepDiveNarrativeSchema = z.object({
  headline: z.string().min(1),
  summary: z.string().min(1),
  sections: z.array(reportSectionSchema).min(4).max(6),
  followUpQuestion: z.string().min(1),
  shareCaption: z.string().min(1),
  actionFocus: z.string().min(1),
  caution: z.string().min(1),
  mantra: z.string().min(1),
});

export type DeepDiveNarrative = z.infer<typeof deepDiveNarrativeSchema>;

export const aiTaskOutputSchemas = {
  "western-preview": previewNarrativeSchema,
  "eastern-preview": previewNarrativeSchema,
  "crossover-report": crossoverNarrativeSchema,
  "deep-dive-relationship": deepDiveNarrativeSchema,
  "deep-dive-career": deepDiveNarrativeSchema,
  "deep-dive-growth": deepDiveNarrativeSchema,
  "deep-dive-health": deepDiveNarrativeSchema,
  "deep-dive-bundle": deepDiveNarrativeSchema,
} as const satisfies Record<AiTaskId, z.ZodTypeAny>;

export type AiTaskOutput<TTask extends AiTaskId> = z.infer<(typeof aiTaskOutputSchemas)[TTask]>;

export type AiReportContext = {
  reportId: string;
  reportKind: ReportRecord["kind"];
  user: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthCity: string;
  };
  baseProfile: {
    coreType: string;
    dominantElement: string;
    weakestElement: string;
    supportElement: string;
    seasonalTone: string;
    dayPhase: string;
    archetype: string;
    coreConclusion: string;
    todaySignal: string;
  };
  westernPreview: {
    title: string;
    teaser: string;
    detailSummary: string;
    personalityHook: string;
    graphicLabel: string;
  };
  easternPreview: {
    title: string;
    teaser: string;
    detailSummary: string;
    personalityHook: string;
    graphicLabel: string;
  };
  order: {
    skuCode?: string;
    skuTitle?: string;
    domain?: ReportDomain;
  };
};

export type AiTaskRequest<TTask extends AiTaskId = AiTaskId> = {
  taskId: TTask;
  promptId: string;
  messages: AiMessage[];
  schema: (typeof aiTaskOutputSchemas)[TTask];
  context: AiReportContext;
};

export type AiProviderResult<T> = {
  object: T;
  model: string;
  provider: string;
  rawText?: string;
};

export type AiProvider = {
  generateObject<T>(request: {
    taskId: AiTaskId;
    promptId: string;
    messages: AiMessage[];
    schema: z.ZodSchema<T>;
    context: AiReportContext;
  }): Promise<AiProviderResult<T>>;
};

export type GeneratedReportBundle = {
  reportId: string;
  kind: ReportRecord["kind"];
  provider: {
    id: string;
    model: string;
    mode: "mock" | "live";
  };
  generatedAt: string;
  promptVersion: string;
  context: AiReportContext;
  westernPreview?: PreviewNarrative;
  easternPreview?: PreviewNarrative;
  crossover?: CrossoverNarrative;
  deepDive?: DeepDiveNarrative & {
    domain: ReportDomain;
  };
};
