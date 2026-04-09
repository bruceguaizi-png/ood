import Link from "next/link";

import { AmuletGenerator } from "@/components/amulet-generator";
import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";

const collectionItems = [
  {
    title: "Signal Wallpaper",
    summary: "An optional post-report visual add-on derived from your cross-over resonance.",
    status: "Demo collectible",
  },
  {
    title: "Aura Amulet Prototype",
    summary: "A collectible object that can evolve from branch emphasis and missing-element logic.",
    status: "Prototype good",
  },
  {
    title: "Cross-Over Share Card",
    summary: "The first shareable artifact produced by the free combined report.",
    status: "Live export",
  },
] as const;

export default function CollectionPage() {
  return (
    <Shell className="space-y-12" activeHref="/collection">
      <PageHero
        eyebrow="Collection Lab"
        title="The reading should leave something visible behind."
        body="This layer holds the optional visual residue: share cards, wallpapers, and collectible prototypes."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        {collectionItems.map((item) => (
          <RitualCard key={item.title} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{item.status}</p>
            <h2 className="text-balance font-serif text-3xl text-stone-50">{item.title}</h2>
            <p className="text-sm leading-7 text-stone-300">{item.summary}</p>
          </RitualCard>
        ))}
      </section>

      <RitualCard className="space-y-5">
        <SectionLabel>Playable Lab</SectionLabel>
        <h2 className="text-balance font-serif text-4xl text-stone-50">Aura amulet generator</h2>
        <p className="text-sm leading-7 text-stone-300">
          Build a prototype object from a name, a wish, and an element channel.
        </p>
        <AmuletGenerator />
      </RitualCard>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <RitualCard className="space-y-4">
          <SectionLabel>Live Object</SectionLabel>
          <p className="text-sm leading-7 text-stone-300">
            The current report flow already exports a share card and PDF. That makes it the first
            collectible object in the archive.
          </p>
          <Link
            href="/report/demo-report?email=ritual%40ood.aura"
            className="inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
          >
            Open Live Collectible Output
          </Link>
        </RitualCard>

        <RitualCard className="space-y-4">
          <SectionLabel>Next Drop</SectionLabel>
          <p className="text-sm leading-7 text-stone-300">
            Next phase: owned downloads, aura goods, and a stronger return loop built around ritual
            objects.
          </p>
        </RitualCard>
      </section>
    </Shell>
  );
}
