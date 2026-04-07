import Link from "next/link";
import { notFound } from "next/navigation";

import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";
import { TrackView } from "@/components/track-view";
import { TRACKING_EVENTS } from "@/lib/constants";
import { getSession } from "@/lib/server/store";

type PreviewPageProps = {
  params: Promise<{ session: string }>;
  searchParams: Promise<{ canceled?: string }>;
};

export default async function PreviewPage({
  params,
  searchParams,
}: PreviewPageProps) {
  const { session: sessionId } = await params;
  const { canceled } = await searchParams;
  const session = await getSession(sessionId);

  if (!session) notFound();

  const profile = session.baseProfile.elementDistribution;
  const baseProfile = session.baseProfile;
  const bars = [
    ["Metal", profile.metal],
    ["Wood", profile.wood],
    ["Water", profile.water],
    ["Fire", profile.fire],
    ["Earth", profile.earth],
  ] as const;

  return (
    <Shell className="space-y-8">
      <TrackView
        event={TRACKING_EVENTS.previewView}
        properties={{ sessionId: session.id, archetype: baseProfile.coreType }}
      />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <RitualCard className="space-y-6">
          <SectionLabel>Your Base Profile</SectionLabel>
          <div className="space-y-3">
            <h1 className="font-serif text-4xl text-stone-50 sm:text-5xl">{baseProfile.coreType}</h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-300">{baseProfile.coreConclusion}</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
            <div className="grid place-items-center gap-4">
              <div className="relative flex h-72 w-72 items-center justify-center">
                <div className="absolute inset-0 rotate-45 rounded-[32px] border border-pink-200/18" />
                <div className="absolute inset-10 rotate-45 rounded-[24px] border border-cyan-200/18" />
                <div className="absolute inset-20 rotate-45 rounded-[18px] border border-white/12" />
                <div className="z-10 text-center">
                  <div className="text-xs uppercase tracking-[0.24em] text-stone-400">
                    Hexagram base profile
                  </div>
                  <div className="mt-3 font-serif text-3xl text-stone-50">{baseProfile.chartVisual.glowLabel}</div>
                  <div className="mt-2 text-sm text-stone-300">{baseProfile.todaySignal}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {bars.map(([label, value]) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-stone-300">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-pink-300/15 bg-pink-300/8 p-5">
            <p className="text-sm uppercase tracking-[0.26em] text-pink-200/80">
              Your signal for today
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-200">{baseProfile.todaySignal}</p>
          </div>
        </RitualCard>

        <RitualCard className="space-y-5">
          <SectionLabel>Next Step</SectionLabel>
          <div className="space-y-3">
            <h2 className="font-serif text-3xl text-stone-50">Open your quick summary first</h2>
            <p className="text-sm leading-7 text-stone-300">
              Start with one core conclusion and three directions worth exploring next. The point is
              to confirm the reading feels true before asking you to go deeper.
            </p>
          </div>

          {canceled ? (
            <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              You left the old checkout flow, but your base profile is still saved here. You can
              continue into the quick summary now.
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/summary/${session.id}`}
              className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
            >
              View my core reading
            </Link>
            <Link href="/quiz" className="inline-flex items-center text-sm text-cyan-200 transition hover:text-cyan-100">
              Start over
            </Link>
          </div>
        </RitualCard>
      </div>
    </Shell>
  );
}
