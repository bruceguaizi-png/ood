import Link from "next/link";

import { EmailHistoryForm } from "@/components/email-history-form";
import { RitualHero } from "@/components/ritual-hero";
import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { ServiceCard } from "@/components/service-card";
import { Shell } from "@/components/shell";
import { TrackView } from "@/components/track-view";
import { MANIFEST_RECEIPT_SKU, TRACKING_EVENTS } from "@/lib/constants";
import { divinationServices } from "@/lib/site-content";
import { currency } from "@/lib/utils";

export default function Home() {
  return (
    <Shell className="space-y-14" activeHref="/">
      <TrackView event={TRACKING_EVENTS.landingView} />

      <RitualHero livePrice={currency(MANIFEST_RECEIPT_SKU.price)} />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Primary entry", value: "Start the reading" },
          { label: "Primary asset", value: "Base profile" },
          { label: "Quick result", value: "One core line + 3 insights" },
          { label: "Next step", value: "4 recommended tracks" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-xs uppercase tracking-[0.26em] text-stone-400">{item.label}</p>
            <p className="mt-3 font-serif text-2xl text-stone-50">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <RitualCard className="space-y-5">
          <SectionLabel>What Happens First</SectionLabel>
          <div className="space-y-3">
            {[
              "Enter your name, birthday, birth time, and birth city",
              "We generate your hexagram base profile first",
              "You get one core conclusion and three key insights",
              "Then you continue into the track that fits best",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-sm text-stone-100">
                  {index + 1}
                </div>
                <div className="text-sm text-stone-200">{item}</div>
              </div>
            ))}
          </div>
        </RitualCard>

        <RitualCard className="space-y-5">
          <SectionLabel>Supporting Entry Points</SectionLabel>
          <p className="text-sm leading-7 text-stone-300">
            Demo reports, history, and the shop still exist, but they should not land in the
            user&apos;s head before &quot;start my base profile reading.&quot;
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/report/demo-report?email=ritual%40ood.aura"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Open demo report
            </Link>
            <Link
              href="/me/history?email=ritual%40ood.aura"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Open history
            </Link>
          </div>
        </RitualCard>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <SectionLabel>Main Tracks</SectionLabel>
            <h2 className="mt-2 font-serif text-4xl text-stone-50">
              Get your base profile first, then follow the track that fits best
            </h2>
          </div>
          <Link href="/divination" className="text-sm text-cyan-200">
            View all tracks
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-4">
          {divinationServices.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <RitualCard className="space-y-5">
          <SectionLabel>Lightweight Add-Ons</SectionLabel>
          <p className="text-sm leading-7 text-stone-300">
            Card draws and the element quiz are no longer parallel homepage entry points. They
            belong after the base profile as lighter supporting signals.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tests/card/star"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Card draw demo
            </Link>
            <Link
              href="/tests/element/water"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Element quiz demo
            </Link>
          </div>
        </RitualCard>

        <RitualCard className="space-y-5">
          <SectionLabel>Return Entry</SectionLabel>
          <p className="text-sm leading-7 text-stone-300">
            Once a user already has a profile and artifacts, history and profile become the places
            they return to keep exploring.
          </p>
          <EmailHistoryForm />
        </RitualCard>
      </section>
    </Shell>
  );
}
