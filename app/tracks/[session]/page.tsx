import Link from "next/link";
import { notFound } from "next/navigation";

import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";
import { getSession } from "@/lib/server/store";

type TracksPageProps = {
  params: Promise<{ session: string }>;
};

export default async function TracksPage({ params }: TracksPageProps) {
  const { session: sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) notFound();

  const profile = session.baseProfile;

  return (
    <Shell className="space-y-10">
      <div className="space-y-4">
        <SectionLabel>Recommended Next Tracks</SectionLabel>
        <h1 className="font-serif text-5xl text-stone-50 sm:text-6xl">
          Based on your base profile, these are the directions most likely to click first.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-stone-300">
          This is not a restart. It is the continuation of the profile you just generated.
        </p>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Your profile snapshot</p>
        <div className="mt-3 font-serif text-3xl text-stone-50">{profile.coreType}</div>
        <p className="mt-2 text-sm leading-7 text-stone-300">{profile.todaySignal}</p>
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        {profile.recommendedTracks.map((track) => (
          <RitualCard key={track.kind} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-serif text-3xl text-stone-50">{track.title}</p>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200">
                recommended
              </div>
            </div>
            <p className="text-sm leading-7 text-stone-300">{track.why}</p>
            <p className="text-sm leading-7 text-stone-400">{track.preview}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/divination`}
                className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
              >
                {track.cta}
              </Link>
              <Link
                href="/tests/card/star"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
              >
                Draw a card
              </Link>
            </div>
          </RitualCard>
        ))}
      </section>
    </Shell>
  );
}
