import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";

const elementDetails = {
  metal: {
    title: "Metal dominant",
    summary: "Your instinct is to sharpen. Choose rituals that clarify and refine.",
    recommendation: "Open cleaner, more concise artifacts like the live receipt.",
    companionProduct: "Manifest Receipt",
  },
  wood: {
    title: "Wood dominant",
    summary: "You grow through direction. Pick rituals that turn potential into path.",
    recommendation: "Favor generative artifacts and future-facing products.",
    companionProduct: "Energy Wallpaper",
  },
  water: {
    title: "Water dominant",
    summary: "You read subtle shifts well. Your rituals work best when they reduce noise.",
    recommendation: "Open calm, reflective outputs and collectible keepsakes.",
    companionProduct: "Aura Amulet",
  },
  fire: {
    title: "Fire dominant",
    summary: "Motion and declaration are your best accelerants.",
    recommendation: "Choose quick outputs that can be acted on immediately.",
    companionProduct: "Manifest Receipt",
  },
  earth: {
    title: "Earth dominant",
    summary: "You stabilize through structure and repetition.",
    recommendation: "Pick rituals that feel held, repeatable, and ownable.",
    companionProduct: "Ritual Starter Bundle",
  },
} as const;

type ElementResultPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ElementResultPage({ params }: ElementResultPageProps) {
  const { slug } = await params;
  const detail = elementDetails[slug as keyof typeof elementDetails];
  if (!detail) notFound();

  return (
    <Shell className="space-y-12" activeHref="/">
      <PageHero
        eyebrow="Element result"
        title={detail.title}
        body={detail.summary}
        side={
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">Suggested artifact</p>
            <p className="font-serif text-4xl text-stone-50">{detail.companionProduct}</p>
            <p className="text-sm leading-7 text-stone-300">{detail.recommendation}</p>
          </div>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">Element reading</p>
          <p className="text-sm leading-7 text-stone-300">{detail.summary}</p>
        </RitualCard>
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Next step</p>
          <p className="text-sm leading-7 text-stone-300">{detail.recommendation}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
            >
              Open shop
            </Link>
            <Link
              href="/quiz"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Open full ritual
            </Link>
          </div>
        </RitualCard>
      </section>
    </Shell>
  );
}
