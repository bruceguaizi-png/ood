import Link from "next/link";
import { notFound } from "next/navigation";

import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";
import { getSession } from "@/lib/server/store";

type SummaryPageProps = {
  params: Promise<{ session: string }>;
};

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { session: sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) notFound();

  const profile = session.baseProfile;
  const previews = [session.branchPreview.eastern, session.branchPreview.western];

  return (
    <Shell className="space-y-10">
      <div className="space-y-4">
        <SectionLabel>Unlocked Branches</SectionLabel>
        <h1 className="text-balance font-serif text-5xl text-stone-50 sm:text-6xl">
          The branch details are now open.
        </h1>
        <p className="max-w-3xl text-pretty text-lg leading-8 text-stone-300">
          You have seen the teasers. This layer expands the Eastern and Western readings before you
          open the full cross-over synthesis.
        </p>
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        {previews.map((preview) => (
          <RitualCard key={preview.system} className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">
              {preview.system}
            </p>
            <h2 className="text-balance font-serif text-4xl text-stone-50">{preview.title}</h2>
            <p className="text-sm leading-7 text-stone-300">{preview.detailSummary}</p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-stone-300">
              {preview.personalityHook}
            </div>
          </RitualCard>
        ))}
      </section>

      <RitualCard className="space-y-4">
        <p className="text-xs uppercase tracking-[0.24em] text-pink-200/75">Cross-over key</p>
        <h2 className="text-balance font-serif text-4xl text-stone-50">{profile.coreConclusion}</h2>
        <p className="text-sm leading-7 text-stone-300">
          The combined report is where these two systems stop sitting side by side and start
          speaking to each other.
        </p>
      </RitualCard>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/report/${session.crossoverReportId ?? "demo-report"}?email=${encodeURIComponent(session.email ?? "ritual@ood.aura")}`}
          className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
        >
          Open The Cross-Over Report
        </Link>
        <Link
          href={`/tracks/${session.id}`}
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
        >
          Explore Paid Deep Dives
        </Link>
      </div>
    </Shell>
  );
}
