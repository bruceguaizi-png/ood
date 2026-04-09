import Link from "next/link";
import { notFound } from "next/navigation";

import { EmailUnlockForm } from "@/components/email-unlock-form";
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

  const baseProfile = session.baseProfile;
  const previews = [session.branchPreview.eastern, session.branchPreview.western];

  return (
    <Shell className="space-y-8">
      <TrackView
        event={TRACKING_EVENTS.previewView}
        properties={{ sessionId: session.id, archetype: baseProfile.coreType }}
      />

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <RitualCard className="space-y-6">
          <SectionLabel>Dual Preview</SectionLabel>
          <div className="space-y-3">
            <h1 className="text-balance font-serif text-4xl text-stone-50 sm:text-5xl">
              Two systems. One signal.
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-stone-300">
              The basic test opened both your Eastern and Western previews. Each one gives a real
              hook, but the deeper detail stays behind the unlock gate.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {previews.map((preview, index) => (
              <div
                key={preview.system}
                className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5"
              >
                <div className="relative mb-5 flex min-h-[220px] items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                  <div
                    className={
                      index === 0
                        ? "absolute h-44 w-44 rotate-45 rounded-[28px] border border-cyan-200/16 motion-safe:animate-[orbitSpin_16s_linear_infinite]"
                        : "absolute h-44 w-44 rounded-full border border-amber-200/18 motion-safe:animate-[orbitSpin_18s_linear_infinite]"
                    }
                  />
                  <div
                    className={
                      index === 0
                        ? "absolute h-28 w-28 rotate-45 rounded-[18px] border border-pink-200/15"
                        : "absolute h-28 w-28 rounded-full border border-cyan-200/15"
                    }
                  />
                  {index === 1 ? (
                    <div className="absolute h-24 w-24 rotate-[30deg] border border-white/12" />
                  ) : null}
                  <div className="z-10 text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
                      {preview.graphicLabel}
                    </p>
                    <p className="mt-3 text-balance font-serif text-3xl text-stone-50">
                      {preview.title}
                    </p>
                  </div>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone-400">
                  {preview.system}
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-100">{preview.teaser}</p>
                <p className="mt-3 text-sm leading-7 text-stone-400">{preview.personalityHook}</p>
              </div>
            ))}
          </div>
        </RitualCard>

        <RitualCard className="space-y-5">
          <SectionLabel>Email Gate</SectionLabel>
          <div className="space-y-3">
            <h2 className="text-balance font-serif text-3xl text-stone-50">
              Unlock the full cross-over reading.
            </h2>
            <p className="text-sm leading-7 text-stone-300">
              Register with your email to open both branch details and generate the combined report
              that synthesizes them.
            </p>
          </div>

          {canceled ? (
            <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              You left the old checkout flow, but this signal is still saved. Continue from here.
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["East", "Preview open"],
              ["West", "Preview open"],
              ["Next", "Cross-over report"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
                  {label}
                </p>
                <p className="mt-3 font-serif text-2xl text-stone-50">{value}</p>
              </div>
            ))}
          </div>

          <EmailUnlockForm
            sessionId={session.id}
            name={session.name}
            coreType={baseProfile.coreType}
            dominantElement={baseProfile.profileRationale.dominantElement}
            weakestElement={baseProfile.profileRationale.weakestElement}
            elementDistribution={baseProfile.elementDistribution}
          />

          <div className="flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center text-sm text-cyan-200 transition hover:text-cyan-100"
            >
              Restart the ritual
            </Link>
          </div>
        </RitualCard>
      </div>
    </Shell>
  );
}
