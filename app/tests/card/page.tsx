import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";

export default function CardTestPage() {
  return (
    <Shell className="space-y-12" activeHref="/">
      <PageHero
        eyebrow="Card test"
        title="The card draw is a tiny ritual, not a signup form."
        body="Use this surface when users want immediate energy feedback. One card, one short interpretation, one next action."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {["The Star", "Strength", "Wheel of Fortune"].map((card) => (
          <RitualCard key={card} className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-pink-200/75">Card option</p>
            <h2 className="font-serif text-4xl text-stone-50">{card}</h2>
            <p className="text-sm leading-7 text-stone-300">
              Click from the homepage to randomly route into one of these result states.
            </p>
          </RitualCard>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
        >
          Return to entry space
        </Link>
        <Link
          href="/quiz"
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
        >
          Open full ritual
        </Link>
      </div>
    </Shell>
  );
}
