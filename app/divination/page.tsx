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
        eyebrow="Divination layer"
        title="Move between fast rituals, richer charts, and collectible outcomes."
        body="This section is where users can actually test flows: one live paid receipt flow, lighter demo readings, and future deeper services staged behind clear product surfaces."
        side={
          <div className="space-y-3 text-sm leading-7 text-stone-300">
            <p>Live now: Manifest Receipt</p>
            <p>Demo now: Tarot + destiny chart examples</p>
            <p>Next: Deeper bazi and subscription-style rituals</p>
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
          <SectionLabel>Interactive flow</SectionLabel>
          <h2 className="font-serif text-3xl text-stone-50">Run the live product path</h2>
          <p className="text-sm leading-7 text-stone-300">
            Start with birth data intake, get a free preview, then unlock the paid manifest receipt.
          </p>
          <Link
            href="/quiz"
            className="inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
          >
            Open live flow
          </Link>
        </RitualCard>

        <RitualCard className="space-y-4">
          <SectionLabel>Reports & downloads</SectionLabel>
          <h2 className="font-serif text-3xl text-stone-50">Inspect the artifact output</h2>
          <p className="text-sm leading-7 text-stone-300">
            Open the demo report to verify how HTML, PDF, and share-card style delivery looks.
          </p>
          <Link
            href="/report/demo-report?email=ritual%40ood.aura"
            className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
          >
            View demo report
          </Link>
        </RitualCard>
      </section>
    </Shell>
  );
}
