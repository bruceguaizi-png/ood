import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";

const cardDetails = {
  star: {
    title: "The Star",
    summary: "You do not need more force. You need a cleaner signal and one brave reveal.",
    recommendation: "Open a confidence ritual or a lighter shareable report.",
    companionProduct: "Manifest Receipt",
  },
  strength: {
    title: "Strength",
    summary: "Momentum comes from directness. The clean sentence is the ritual.",
    recommendation: "Buy the live receipt or stage a signal-driven artifact.",
    companionProduct: "Aura Amulet",
  },
  wheel: {
    title: "Wheel of Fortune",
    summary: "The opening is already moving. Your task is to step in before delay hardens.",
    recommendation: "Choose a fast artifact and treat movement as the answer.",
    companionProduct: "Ritual Starter Bundle",
  },
} as const;

type CardResultPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CardResultPage({ params }: CardResultPageProps) {
  const { slug } = await params;
  const detail = cardDetails[slug as keyof typeof cardDetails];
  if (!detail) notFound();

  return (
    <Shell className="space-y-12" activeHref="/">
      <PageHero
        eyebrow="Card result"
        title={detail.title}
        body={detail.summary}
        side={
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-pink-200/75">Companion drop</p>
            <p className="font-serif text-4xl text-stone-50">{detail.companionProduct}</p>
            <p className="text-sm leading-7 text-stone-300">{detail.recommendation}</p>
          </div>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/75">Reading</p>
          <p className="text-sm leading-7 text-stone-300">{detail.summary}</p>
        </RitualCard>
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Next step</p>
          <p className="text-sm leading-7 text-stone-300">{detail.recommendation}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
            >
              Open full ritual
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Browse drops
            </Link>
          </div>
        </RitualCard>
      </section>
    </Shell>
  );
}
