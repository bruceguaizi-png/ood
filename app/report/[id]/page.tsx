import Link from "next/link";
import { notFound } from "next/navigation";

import { ReportStatusPoller } from "@/components/report-status-poller";
import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { ShareButton } from "@/components/share-button";
import { Shell } from "@/components/shell";
import { TrackView } from "@/components/track-view";
import { TRACKING_EVENTS } from "@/lib/constants";
import { generateReportFromOrder } from "@/lib/server/generate-report";
import { getReport } from "@/lib/server/store";

type ReportPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ email?: string }>;
};

export default async function ReportPage({ params, searchParams }: ReportPageProps) {
  const { id } = await params;
  const { email } = await searchParams;
  let report = await getReport(id);

  if (!report) notFound();

  if (report.status === "ready" && report.assets.length === 0) {
    report = await generateReportFromOrder(report.orderId);
  }

  const permitted = email ? email.toLowerCase() === report.email.toLowerCase() : true;
  const receipt = report.receipt;

  return (
    <Shell className="space-y-8">
      <TrackView
        event={TRACKING_EVENTS.reportOpen}
        properties={{ reportId: report.id, theme: receipt?.theme }}
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <RitualCard className="space-y-6">
          <SectionLabel>Manifest receipt</SectionLabel>
          <div className="space-y-3">
            <h1 className="font-serif text-4xl text-stone-50 sm:text-5xl">
              {receipt?.theme
                ? `${receipt.theme.charAt(0).toUpperCase()}${receipt.theme.slice(1)} Ritual`
                : "Receipt pending"}
            </h1>
            <p className="text-lg leading-8 text-stone-300">
              {receipt?.summary ??
                "Your report is still rendering. Leave this tab open and it will refresh itself."}
            </p>
          </div>

          <ReportStatusPoller
            reportId={report.id}
            initialStatus={report.status}
          />

          {report.status === "failed" ? (
            <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
              Generation failed. Manual support fallback is allowed in this beta.
            </div>
          ) : null}

          {receipt ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Today's pull", receipt.tarotCard],
                ["Energy score", `${receipt.energyScore}/100`],
                ["Best move today", receipt.action],
                ["Avoid today", receipt.caution],
                ["Mantra", receipt.mantra],
                ["Archetype", report.elementProfile.archetype],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-stone-400">
                    {label}
                  </div>
                  <div className="mt-3 text-base leading-7 text-stone-100">{value}</div>
                </div>
              ))}
            </div>
          ) : null}
        </RitualCard>

        <div className="space-y-6">
          <RitualCard className="space-y-4">
            <SectionLabel>Access</SectionLabel>
            <p className="text-sm leading-7 text-stone-300">
              {permitted
                ? "This beta link is open because the provided email matches the delivery record."
                : "Open this page from the delivery email for auto-verified access."}
            </p>
            <div className="space-y-2 text-sm text-stone-400">
              <p>Email: {report.email}</p>
              <p>Status: {report.status}</p>
              <p>Date: {receipt?.date ?? "Pending"}</p>
            </div>
          </RitualCard>

          <RitualCard className="space-y-4">
            <SectionLabel>Downloads</SectionLabel>
            <div className="flex flex-wrap gap-3">
              {report.assets.map((asset) => (
                <Link
                  key={asset.kind}
                  href={asset.url}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
                >
                  Download {asset.kind.toUpperCase()}
                </Link>
              ))}
            </div>
            {receipt ? <ShareButton text={receipt.shareCaption} /> : null}
          </RitualCard>

          <RitualCard className="space-y-4">
            <SectionLabel>History</SectionLabel>
            <Link
              href={`/me/history?email=${encodeURIComponent(report.email)}`}
              className="inline-flex rounded-full bg-pink-200 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-pink-100"
            >
              Open my full history
            </Link>
          </RitualCard>
        </div>
      </div>
    </Shell>
  );
}
