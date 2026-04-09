import { nanoid } from "nanoid";

import { ENTERTAINMENT_DISCLAIMER, TRACKING_EVENTS } from "@/lib/constants";
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
    email,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    kind: "crossover_base",
    status: "generating",
    elementProfile: session.baseProfile.elementDistribution,
    disclaimer: ENTERTAINMENT_DISCLAIMER,
    crossover: buildCrossoverReport(session.baseProfile, session.branchPreview),
    assets: existing?.assets ?? [],
  };

  await createOrUpdateReport(draft);

  try {
    const readyDraft: ReportRecord = {
      ...draft,
      status: "ready",
    };

    const generated = await generateReportAssets(readyDraft);
    readyDraft.assets = generated.assets;

    await createOrUpdateReport(readyDraft);
    await updateSession(session.id, {
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
    email: order.email,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    kind: "deep_dive",
    status: "generating",
    elementProfile: session.baseProfile.elementDistribution,
    disclaimer: ENTERTAINMENT_DISCLAIMER,
    assets: existing?.assets ?? [],
  };

  await createOrUpdateReport(draft);

  try {
    const receipt = buildManifestReceipt(
      {
        name: session.name,
        birthDate: session.birthDate,
        birthTime: session.birthTime,
        birthCity: session.birthCity,
        consentEntertainmentDisclaimer: session.consentEntertainmentDisclaimer,
        email: session.email,
      },
      session.baseProfile.elementDistribution,
    );

    const readyDraft: ReportRecord = {
      ...draft,
      status: "ready",
      receipt,
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
