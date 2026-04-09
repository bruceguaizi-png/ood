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
        <SectionLabel>Paid Deep Dives</SectionLabel>
        <h1 className="text-balance font-serif text-5xl text-stone-50 sm:text-6xl">
          Choose the next paid lens.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-stone-300">
          The cross-over report is free. These deep dives turn one question into a more focused
          paid interpretation.
        </p>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Your profile snapshot</p>
        <div className="mt-3 font-serif text-3xl text-stone-50">{profile.coreType}</div>
        <p className="mt-2 text-sm leading-7 text-stone-300">{profile.todaySignal}</p>
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        {[
          {
            title: "Relationship Deep Dive",
            body: "How your eastern structure and western timing behave inside attraction, intimacy, and emotional reciprocity.",
            cta: "Unlock Relationship",
          },
          {
            title: "Career Deep Dive",
            body: "How your inner pattern and public signal combine around work, visibility, and execution.",
            cta: "Unlock Career",
          },
          {
            title: "Money Deep Dive",
            body: "How your value pattern, exchange behavior, and timing distortions show up around money.",
            cta: "Unlock Money",
          },
          {
            title: "Healing & Personality Deep Dive",
            body: "How the two systems explain your coping pattern, self-protection, and personality contradictions.",
            cta: "Unlock Healing",
          },
        ].map((track) => (
          <RitualCard key={track.title} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-serif text-3xl text-stone-50">{track.title}</p>
              <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200">
                paid
              </div>
            </div>
            <p className="text-sm leading-7 text-stone-300">{track.body}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
              >
                {track.cta}
              </Link>
              <Link
                href="/shop?product=ritual-bundle"
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
              >
                View Bundle
              </Link>
            </div>
          </RitualCard>
        ))}
      </section>
    </Shell>
  );
}
