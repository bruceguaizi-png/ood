import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { ServiceCard } from "@/components/service-card";
import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";
import { divinationServices } from "@/lib/site-content";

export default function DivinationPage() {
  return (
    <Shell className="space-y-12" activeHref="/divination">
      <PageHero
        eyebrow="Ritual gates"
        title="Not every question needs the same altar."
        body="Choose the gate by mood, urgency, and the kind of answer you want returned."
        side={
          <div className="space-y-3 text-sm leading-7 text-stone-300">
            <p>Open gate: Manifest Receipt</p>
            <p>Side omens: Tarot / Destiny Chart</p>
            <p>Sealed gate: Deep Bazi Reading</p>
          </div>
        }
      />

      <section className="grid gap-5 lg:grid-cols-4">
        {divinationServices.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <RitualCard className="space-y-4">
          <SectionLabel>Main gate</SectionLabel>
          <h2 className="text-balance font-serif text-3xl text-stone-50">Start with the live ritual</h2>
          <p className="text-sm leading-7 text-stone-300">
            Birth data in. Preview opens. Paid receipt unlocks after the first sign lands.
          </p>
          <Link
            href="/quiz"
            className="inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
          >
            Open the live gate
          </Link>
        </RitualCard>

        <RitualCard className="space-y-4">
          <SectionLabel>Artifact preview</SectionLabel>
          <h2 className="text-balance font-serif text-3xl text-stone-50">Inspect the omen object</h2>
          <p className="text-sm leading-7 text-stone-300">
            Open a sample report to feel the output: the page, the PDF, and the shareable card.
          </p>
          <Link
            href="/report/demo-report?email=ritual%40ood.aura"
            className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
          >
            View sample artifact
          </Link>
        </RitualCard>
      </section>
    </Shell>
  );
}
