import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";
import { getSession } from "@/lib/server/store";
import { deriveCardResult } from "@/lib/client/ritual-derivations";
import { type ActiveSessionSnapshot } from "@/lib/client/active-session";

type CardResultPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sessionId?: string }>;
};

export default async function CardResultPage({ params, searchParams }: CardResultPageProps) {
  const { slug } = await params;
  const { sessionId } = await searchParams;
  if (!sessionId) notFound();

  const session = await getSession(sessionId);
  if (!session) notFound();

  const snapshot: ActiveSessionSnapshot = {
    sessionId: session.id,
    name: session.name,
    email: session.email,
    coreType: session.baseProfile.coreType,
    dominantElement: session.baseProfile.profileRationale.dominantElement,
    weakestElement: session.baseProfile.profileRationale.weakestElement,
    elementDistribution: {
      metal: session.baseProfile.elementDistribution.metal,
      wood: session.baseProfile.elementDistribution.wood,
      water: session.baseProfile.elementDistribution.water,
      fire: session.baseProfile.elementDistribution.fire,
      earth: session.baseProfile.elementDistribution.earth,
    },
    createdAt: session.createdAt,
  };
  const detail = deriveCardResult(snapshot);
  if (detail.slug !== slug) notFound();

  return (
    <Shell className="space-y-12" activeHref="/">
      <PageHero
        eyebrow="Card result"
        title={detail.title}
        body={detail.summary}
        side={
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-pink-200/75">Companion drop</p>
            <p className="font-serif text-4xl text-stone-50">{detail.companionProduct}</p>
            <p className="text-sm leading-7 text-stone-300">{detail.recommendation}</p>
          </div>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">Reading</p>
          <p className="text-sm leading-7 text-stone-300">{detail.summary}</p>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-stone-300">
            Derived from your base profile: <span className="font-medium text-stone-100">{detail.sourceProfileCoreType}</span>
          </div>
        </RitualCard>
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Next step</p>
          <p className="text-sm leading-7 text-stone-300">{detail.recommendation}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
            >
              Open full ritual
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Browse drops
            </Link>
          </div>
        </RitualCard>
      </section>
    </Shell>
  );
}
