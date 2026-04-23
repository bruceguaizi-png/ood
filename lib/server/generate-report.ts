import { nanoid } from "nanoid";

import { ENTERTAINMENT_DISCLAIMER, TRACKING_EVENTS } from "@/lib/constants";
import { generateAiBundle } from "@/lib/server/ai/pipeline";
import { generateReportAssets } from "@/lib/server/assets";
import { sendReceiptEmail } from "@/lib/server/email";
import { captureServerEvent } from "@/lib/server/posthog";
import { buildCrossoverReport, buildManifestReceipt } from "@/lib/server/ritual";
import {
  createOrUpdateReport,
  getOrder,
  getReportByOrderId,
  getReportBySessionAndKind,
  getSession,
  updateSession,
  updateOrder,
} from "@/lib/server/store";
import { type ReportRecord } from "@/lib/types";

export async function generateCrossoverReportFromSession(sessionId: string, email: string) {
  const session = await getSession(sessionId);
  if (!session) throw new Error("Intake session not found");

  const existing = await getReportBySessionAndKind(session.id, "crossover_base");
  if (existing?.status === "ready" && existing.assets.length > 0) return existing;

  const reportId = existing?.id ?? `rpt_${nanoid(12)}`;
  const draft: ReportRecord = {
    id: reportId,
    intakeSessionId: session.id,
    userId: session.userId,
    email,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    kind: "crossover_base",
    status: "generating",
    elementProfile: session.baseProfile.elementDistribution,
    disclaimer: ENTERTAINMENT_DISCLAIMER,
    crossover: buildCrossoverReport(session.baseProfile, session.branchPreview),
    narrative: undefined,
    assets: existing?.assets ?? [],
  };

  await createOrUpdateReport(draft);

  try {
    const bundle = await generateAiBundle({
      reportId,
      kind: "crossover_base",
      session,
    });

    const readyDraft: ReportRecord = {
      ...draft,
      status: "ready",
      domain: bundle.deepDive?.domain,
      narrative: bundle.crossover
        ? {
            headline: bundle.crossover.headline,
            summary: bundle.crossover.summary,
            sections: bundle.crossover.sections,
            shareCaption: bundle.crossover.shareCaption,
          }
        : draft.narrative,
      followUpQuestion: undefined,
      crossover: bundle.crossover
        ? {
            eastern: session.branchPreview.eastern,
            western: session.branchPreview.western,
            synthesisTitle: bundle.crossover.headline,
            synthesisSummary: bundle.crossover.summary,
            resonance: bundle.crossover.resonance,
            tension: bundle.crossover.tension,
            personalityPattern: bundle.crossover.personalityPattern,
            currentTimingSignal: bundle.crossover.currentTimingSignal,
            nextMove: bundle.crossover.nextMove,
            shareCaption: bundle.crossover.shareCaption,
          }
        : draft.crossover,
    };

    const generated = await generateReportAssets(readyDraft);
    readyDraft.assets = generated.assets;

    await createOrUpdateReport(readyDraft);
    await updateSession(session.id, {
      userId: session.userId,
      email,
      stage: "crossover_generated",
      crossoverReportId: readyDraft.id,
    });

    await captureServerEvent(email, TRACKING_EVENTS.crossoverReportGenerated, {
      sessionId: session.id,
      reportId: readyDraft.id,
    });

    return readyDraft;
  } catch (error) {
    const failed: ReportRecord = {
      ...draft,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    await createOrUpdateReport(failed);
    return failed;
  }
}

export async function generateReportFromOrder(orderId: string) {
  const existing = await getReportByOrderId(orderId);
  if (existing?.status === "ready" && existing.assets.length > 0) return existing;

  const order = await getOrder(orderId);
  if (!order) throw new Error("Order not found");

  const session = await getSession(order.intakeSessionId);
  if (!session) throw new Error("Intake session not found");

  await updateOrder(order.id, {
    paymentStatus: "paid",
    reportStatus: "generating",
  });

  const reportId = existing?.id ?? `rpt_${nanoid(12)}`;
  const draft: ReportRecord = {
    id: reportId,
    intakeSessionId: session.id,
    orderId: order.id,
    userId: order.userId ?? session.userId,
    email: order.email,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    kind: "deep_dive",
    status: "generating",
    elementProfile: session.baseProfile.elementDistribution,
    disclaimer: ENTERTAINMENT_DISCLAIMER,
    narrative: undefined,
    assets: existing?.assets ?? [],
  };

  await createOrUpdateReport(draft);

  try {
    const bundle = await generateAiBundle({
      reportId,
      kind: "deep_dive",
      session,
      order,
    });

    const receipt = buildManifestReceipt(
      {
        name: session.name,
        birthDate: session.birthDate,
        birthTime: session.birthTime,
        birthCity: session.birthCity,
        consentEntertainmentDisclaimer: session.consentEntertainmentDisclaimer,
      },
      session.baseProfile.elementDistribution,
    );

    const readyDraft: ReportRecord = {
      ...draft,
      status: "ready",
      domain: bundle.deepDive?.domain,
      followUpQuestion: bundle.deepDive?.followUpQuestion,
      narrative: bundle.deepDive
        ? {
            headline: bundle.deepDive.headline,
            summary: bundle.deepDive.summary,
            sections: bundle.deepDive.sections,
            shareCaption: bundle.deepDive.shareCaption,
          }
        : draft.narrative,
      receipt: {
        ...receipt,
        action: bundle.deepDive?.actionFocus ?? receipt.action,
        caution: bundle.deepDive?.caution ?? receipt.caution,
        mantra: bundle.deepDive?.mantra ?? receipt.mantra,
        summary: bundle.deepDive?.summary ?? receipt.summary,
        shareCaption: bundle.deepDive?.shareCaption ?? receipt.shareCaption,
      },
    };

    const generated = await generateReportAssets(readyDraft);
    readyDraft.assets = generated.assets;

    await createOrUpdateReport(readyDraft);
    await updateOrder(order.id, {
      reportId: readyDraft.id,
      paymentStatus: "paid",
      reportStatus: "ready",
    });

    await sendReceiptEmail({
      to: order.email,
      reportId: readyDraft.id,
      mantra: receipt.mantra,
    });

    await captureServerEvent(order.email, TRACKING_EVENTS.paymentSuccess, {
      reportId: readyDraft.id,
      orderId: order.id,
      theme: receipt.theme,
    });

    return readyDraft;
  } catch (error) {
    const failed: ReportRecord = {
      ...draft,
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    await createOrUpdateReport(failed);
    await updateOrder(order.id, {
      paymentStatus: "paid",
      reportStatus: "failed",
    });

    return failed;
  }
}
