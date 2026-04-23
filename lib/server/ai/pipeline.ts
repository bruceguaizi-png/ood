import { DEEP_DIVE_SKUS } from "@/lib/constants";
import { createAiProvider } from "@/lib/server/ai/provider";
import { AI_PROMPT_VERSION, buildTaskRequest } from "@/lib/server/ai/catalog";
import { readReportBundle, writeReportBundle } from "@/lib/server/ai/bundle-store";
import {
  type AiReportContext,
  type GeneratedReportBundle,
  type ReportDomain,
} from "@/lib/server/ai/types";
import { type IntakeSession, type Order, type ReportRecord } from "@/lib/types";

function mapOrderDomain(order?: Order | null): ReportDomain | undefined {
  switch (order?.sku.code) {
    case DEEP_DIVE_SKUS.relationship.code:
      return "relationship";
    case DEEP_DIVE_SKUS.career.code:
      return "career";
    case DEEP_DIVE_SKUS.money.code:
      return "growth";
    case DEEP_DIVE_SKUS.healing.code:
      return "health";
    case DEEP_DIVE_SKUS.bundle.code:
      return "bundle";
    default:
      return undefined;
  }
}

function deepDiveTaskFromDomain(domain: ReportDomain | undefined) {
  switch (domain) {
    case "relationship":
      return "deep-dive-relationship" as const;
    case "career":
      return "deep-dive-career" as const;
    case "growth":
      return "deep-dive-growth" as const;
    case "health":
      return "deep-dive-health" as const;
    case "bundle":
    default:
      return "deep-dive-bundle" as const;
  }
}

export function buildAiReportContext(input: {
  reportId: string;
  reportKind: ReportRecord["kind"];
  session: IntakeSession;
  order?: Order | null;
}): AiReportContext {
  const { session, order, reportId, reportKind } = input;

  return {
    reportId,
    reportKind,
    user: {
      name: session.name,
      birthDate: session.birthDate,
      birthTime: session.birthTime ?? "unknown",
      birthCity: session.birthCity ?? "unknown",
    },
    baseProfile: {
      coreType: session.baseProfile.coreType,
      dominantElement: session.baseProfile.profileRationale.dominantElement,
      weakestElement: session.baseProfile.profileRationale.weakestElement,
      supportElement: session.baseProfile.profileRationale.supportElement,
      seasonalTone: session.baseProfile.profileRationale.seasonalTone,
      dayPhase: session.baseProfile.profileRationale.dayPhase,
      archetype: session.baseProfile.elementDistribution.archetype,
      coreConclusion: session.baseProfile.coreConclusion,
      todaySignal: session.baseProfile.todaySignal,
    },
    westernPreview: {
      title: session.branchPreview.western.title,
      teaser: session.branchPreview.western.teaser,
      detailSummary: session.branchPreview.western.detailSummary,
      personalityHook: session.branchPreview.western.personalityHook,
      graphicLabel: session.branchPreview.western.graphicLabel,
    },
    easternPreview: {
      title: session.branchPreview.eastern.title,
      teaser: session.branchPreview.eastern.teaser,
      detailSummary: session.branchPreview.eastern.detailSummary,
      personalityHook: session.branchPreview.eastern.personalityHook,
      graphicLabel: session.branchPreview.eastern.graphicLabel,
    },
    order: {
      skuCode: order?.sku.code,
      skuTitle: order?.sku.title,
      domain: mapOrderDomain(order),
    },
  };
}

function providerMode(provider: string): "mock" | "live" {
  return provider === "mock" ? "mock" : "live";
}

export async function generateAiBundle(input: {
  reportId: string;
  kind: ReportRecord["kind"];
  session: IntakeSession;
  order?: Order | null;
}) {
  const existing = await readReportBundle(input.reportId);
  if (existing) return existing;

  const provider = createAiProvider();
  const context = buildAiReportContext({
    reportId: input.reportId,
    reportKind: input.kind,
    session: input.session,
    order: input.order,
  });

  const westernRequest = buildTaskRequest("western-preview", context);
  const easternRequest = buildTaskRequest("eastern-preview", context);
  const westernResult = await provider.generateObject(westernRequest);
  const easternResult = await provider.generateObject(easternRequest);

  const bundle: GeneratedReportBundle = {
    reportId: input.reportId,
    kind: input.kind,
    provider: {
      id: westernResult.provider,
      model: westernResult.model,
      mode: providerMode(westernResult.provider),
    },
    generatedAt: new Date().toISOString(),
    promptVersion: AI_PROMPT_VERSION,
    context,
    westernPreview: westernResult.object,
    easternPreview: easternResult.object,
  };

  if (input.kind === "crossover_base") {
    const crossoverResult = await provider.generateObject(
      buildTaskRequest("crossover-report", context),
    );
    bundle.provider = {
      id: crossoverResult.provider,
      model: crossoverResult.model,
      mode: providerMode(crossoverResult.provider),
    };
    bundle.crossover = crossoverResult.object;
  } else {
    const taskId = deepDiveTaskFromDomain(context.order.domain);
    const deepDiveResult = await provider.generateObject(buildTaskRequest(taskId, context));
    bundle.provider = {
      id: deepDiveResult.provider,
      model: deepDiveResult.model,
      mode: providerMode(deepDiveResult.provider),
    };
    bundle.deepDive = {
      ...deepDiveResult.object,
      domain: context.order.domain ?? "bundle",
    };
  }

  await writeReportBundle(bundle);
  return bundle;
}
