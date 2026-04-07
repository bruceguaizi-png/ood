import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";

export default function ElementTestPage() {
  return (
    <Shell className="space-y-12" activeHref="/">
      <PageHero
        eyebrow="Element test"
        title="A lighter quiz for people who want a category before a commitment."
        body="This route acts as the dedicated result space for the faster element test. It should feel closer to a playful classifier than a long spiritual explanation."
      />

      <section className="grid gap-5 lg:grid-cols-5">
        {["Metal", "Wood", "Water", "Fire", "Earth"].map((element) => (
          <RitualCard key={element} className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">Element lane</p>
            <h2 className="font-serif text-3xl text-stone-50">{element}</h2>
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
          href="/shop"
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
        >
          Open related drops
        </Link>
      </div>
    </Shell>
  );
}
