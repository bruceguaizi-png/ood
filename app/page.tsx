import Link from "next/link";

import { QuickIntake } from "@/components/quick-intake";
import { Shell } from "@/components/shell";
import { TrackView } from "@/components/track-view";
import { TRACKING_EVENTS } from "@/lib/constants";

export default function Home() {
  return (
    <Shell className="space-y-10" activeHref="/" navMode="minimal">
      <TrackView event={TRACKING_EVENTS.landingView} />

      <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(95,230,255,0.18),transparent_26%),radial-gradient(circle_at_85%_10%,rgba(255,190,148,0.14),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="pointer-events-none absolute left-[-8%] top-[14%] h-52 w-52 rounded-full border border-cyan-200/10 motion-safe:animate-[floatDrift_10s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute right-[12%] top-[8%] h-80 w-80 rounded-full border border-white/8" />
        <div className="pointer-events-none absolute right-[16%] top-[14%] h-52 w-52 rounded-full border border-amber-200/10 motion-safe:animate-[glowPulse_6s_ease-in-out_infinite]" />

        <div className="relative grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-[11px] uppercase tracking-[0.42em] text-cyan-100/78">
              O.O.D / Oracle Chamber
            </p>
            <h1 className="max-w-xl text-balance font-serif text-6xl leading-[0.88] text-stone-50 sm:text-7xl lg:text-8xl">
              Begin with the signal.
            </h1>
            <p className="max-w-lg text-pretty text-base leading-8 text-stone-300 sm:text-lg">
              No wall of lore. No crowded menu. Enter the essentials and let the first omen arrive.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Live Gate", "Open now"],
                ["Input", "Name / date / email"],
                ["Output", "Signal first"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-400">
                    {label}
                  </p>
                  <p className="mt-3 text-balance font-serif text-2xl text-stone-50">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-stone-300">
              <Link
                href="/divination"
                className="rounded-full border border-white/10 px-4 py-2 transition hover:border-cyan-200/25 hover:bg-white/8"
              >
                Explore the gates
              </Link>
              <Link
                href="/report/demo-report?email=ritual%40ood.aura"
                className="rounded-full border border-white/10 px-4 py-2 transition hover:border-cyan-200/25 hover:bg-white/8"
              >
                View a sample artifact
              </Link>
            </div>
          </div>

          <QuickIntake />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Signal", "A fast reading opens first."],
          ["Archive", "The wider universe appears after the omen."],
          ["Depth", "Full ritual paths stay ready when you want more."],
        ].map(([label, text]) => (
          <div
            key={label}
            className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-stone-400">
              {label}
            </p>
            <p className="mt-3 text-balance font-serif text-3xl text-stone-50">{text}</p>
          </div>
        ))}
      </section>
    </Shell>
  );
}
