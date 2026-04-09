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

  if (report.kind === "deep_dive" && report.orderId && report.status === "ready" && report.assets.length === 0) {
    report = await generateReportFromOrder(report.orderId);
  }

  const permitted = email ? email.toLowerCase() === report.email.toLowerCase() : true;
  const receipt = report.receipt;
  const crossover = report.crossover;

  return (
    <Shell className="space-y-8">
      <TrackView
        event={TRACKING_EVENTS.reportOpen}
        properties={{ reportId: report.id, kind: report.kind }}
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <RitualCard className="space-y-6">
          <SectionLabel>{report.kind === "crossover_base" ? "Cross-Over Report" : "Deep Dive Report"}</SectionLabel>
          <div className="space-y-3">
            <h1 className="text-balance font-serif text-4xl text-stone-50 sm:text-5xl">
              {report.kind === "crossover_base"
                ? crossover?.synthesisTitle ?? "Cross-over report pending"
                : receipt?.theme
                  ? `${receipt.theme.charAt(0).toUpperCase()}${receipt.theme.slice(1)} Deep Dive`
                  : "Deep dive pending"}
            </h1>
            <p className="text-pretty text-lg leading-8 text-stone-300">
              {report.kind === "crossover_base"
                ? crossover?.synthesisSummary ??
                  "Your cross-over report is still rendering. Leave this page open and it will refresh itself."
                : receipt?.summary ??
                  "Your report is still rendering. Leave this page open and it will refresh itself."}
            </p>
          </div>

          {report.kind === "crossover_base" && crossover ? (
            <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,194,153,0.14),transparent_26%),radial-gradient(circle_at_bottom,rgba(111,232,255,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Resonance", crossover.resonance],
                  ["Tension", crossover.tension],
                  ["Personality", crossover.personalityPattern],
                  ["Timing", crossover.currentTimingSignal],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="font-mono text-xs uppercase tracking-[0.22em] text-stone-400">
                      {label}
                    </div>
                    <div className="mt-3 text-sm leading-7 text-stone-100">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {report.kind === "deep_dive" && receipt ? (
            <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,194,153,0.14),transparent_26%),radial-gradient(circle_at_bottom,rgba(111,232,255,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                  <div className="absolute h-52 w-52 rounded-full border border-amber-200/18 motion-safe:animate-[orbitSpin_18s_linear_infinite]" />
                  <div className="absolute h-36 w-36 rounded-full border border-cyan-200/16 motion-safe:animate-[orbitSpin_12s_linear_infinite_reverse]" />
                  <div className="absolute h-24 w-24 rounded-full border border-white/12" />
                  <div className="z-10 text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
                      Today&apos;s pull
                    </p>
                    <p className="mt-3 text-balance font-serif text-3xl text-stone-50">
                      {receipt.tarotCard}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <ReportStatusPoller
            reportId={report.id}
            initialStatus={report.status}
          />

          {report.status === "failed" ? (
            <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
              Generation failed. Manual support fallback is allowed in this beta.
            </div>
          ) : null}

          {report.kind === "crossover_base" && crossover ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Eastern", crossover.eastern.title],
                ["Western", crossover.western.title],
                ["Next move", crossover.nextMove],
                ["Share line", crossover.shareCaption],
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

          {report.kind === "deep_dive" && receipt ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Theme", receipt.theme],
                ["Energy score", `${receipt.energyScore}/100`],
                ["Best move", receipt.action],
                ["Avoid", receipt.caution],
                ["Share line", receipt.shareCaption],
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
            <div className="tabular-nums space-y-2 text-sm text-stone-400">
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
            {report.kind === "crossover_base" && crossover ? (
              <ShareButton text={crossover.shareCaption} />
            ) : null}
            {report.kind === "deep_dive" && receipt ? <ShareButton text={receipt.shareCaption} /> : null}
          </RitualCard>

          <RitualCard className="space-y-4">
            <SectionLabel>History</SectionLabel>
            <Link
              href={`/me/history?email=${encodeURIComponent(report.email)}`}
              className="inline-flex rounded-full bg-pink-200 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-pink-100"
            >
              Open My Full History
            </Link>
          </RitualCard>
        </div>
      </div>
    </Shell>
  );
}
