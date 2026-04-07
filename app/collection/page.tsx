import Link from "next/link";

import { AmuletGenerator } from "@/components/amulet-generator";
import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";

const collectionItems = [
  {
    title: "Aura Amulet Prototype",
    summary: "A collectible generated from missing-element compensation logic.",
    status: "Demo collectible",
  },
  {
    title: "Energy Wallpaper Draft",
    summary: "A visual asset seeded from your dominant palette and current theme.",
    status: "Prototype good",
  },
  {
    title: "Receipt Share Card",
    summary: "The lightweight collectible artifact already produced by the paid ritual flow.",
    status: "Live export",
  },
] as const;

export default function CollectionPage() {
  return (
    <Shell className="space-y-12" activeHref="/collection">
      <PageHero
        eyebrow="Collection"
        title="Where ritual outputs become things you keep."
        body="This section turns readings into retained artifacts: collectibles, wallpapers, and downloadable aura objects that make the product feel like an IP universe instead of a single quiz."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {collectionItems.map((item) => (
          <RitualCard key={item.title} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{item.status}</p>
            <h2 className="font-serif text-3xl text-stone-50">{item.title}</h2>
            <p className="text-sm leading-7 text-stone-300">{item.summary}</p>
          </RitualCard>
        ))}
      </section>

      <RitualCard className="space-y-5">
        <SectionLabel>Playable demo</SectionLabel>
        <h2 className="font-serif text-4xl text-stone-50">Aura amulet generator</h2>
        <p className="text-sm leading-7 text-stone-300">
          This is a prototype interaction surface for collectible generation. It gives the site a
          second thing users can actually play with besides the report flow.
        </p>
        <AmuletGenerator />
      </RitualCard>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <RitualCard className="space-y-4">
          <SectionLabel>Try it with a real artifact</SectionLabel>
          <p className="text-sm leading-7 text-stone-300">
            The current report flow already exports a share card and PDF, which makes it the first
            practical collectible surface in the product.
          </p>
          <Link
            href="/report/demo-report?email=ritual%40ood.aura"
            className="inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
          >
            Open live collectible output
          </Link>
        </RitualCard>

        <RitualCard className="space-y-4">
          <SectionLabel>Future direction</SectionLabel>
          <p className="text-sm leading-7 text-stone-300">
            In the next phase, this module becomes the home for owned downloads, generated aura goods,
            and a stronger retention loop around aesthetic collectibles.
          </p>
        </RitualCard>
      </section>
    </Shell>
  );
}
