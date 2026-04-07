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

  return (
    <Shell className="space-y-10">
      <div className="space-y-4">
        <SectionLabel>Quick Summary</SectionLabel>
        <h1 className="font-serif text-5xl text-stone-50 sm:text-6xl">
          {profile.identity.name}&apos;s core reading
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-stone-300">
          Start with what matters. Your base profile has already surfaced the three directions most
          worth paying attention to.
        </p>
      </div>

      <RitualCard className="space-y-4">
        <p className="text-xs uppercase tracking-[0.24em] text-pink-200/75">Core conclusion</p>
        <h2 className="font-serif text-4xl text-stone-50">{profile.coreConclusion}</h2>
      </RitualCard>

      <section className="grid gap-5 lg:grid-cols-3">
        {profile.topInsights.map((insight) => (
          <RitualCard key={insight.title} className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">{insight.title}</p>
            <p className="text-sm leading-7 text-stone-300">{insight.body}</p>
          </RitualCard>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/tracks/${session.id}`}
          className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
        >
          Show me the best next track
        </Link>
        <Link
          href={`/report/${session.reportId ?? "demo-report"}?email=${encodeURIComponent(session.email ?? "ritual@ood.aura")}`}
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
        >
          View the full artifact example
        </Link>
      </div>
    </Shell>
  );
}
