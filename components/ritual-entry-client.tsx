"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { writeTestResultDetail } from "@/lib/client/ritual-bag";

const cardResults = [
  {
    slug: "star",
    title: "The Star",
    summary: "You do not need more force. You need a cleaner signal and one brave reveal.",
    accent: "rose current",
    recommendation: "Open a confidence ritual or a lighter shareable report.",
    nextHref: "/tests/card/star",
    companionProduct: "Manifest Receipt",
  },
  {
    slug: "strength",
    title: "Strength",
    summary: "Momentum today comes from saying the direct thing before you decorate it.",
    accent: "fire current",
    recommendation: "Buy the live receipt or stage a signal-driven artifact.",
    nextHref: "/tests/card/strength",
    companionProduct: "Aura Amulet",
  },
  {
    slug: "wheel",
    title: "Wheel of Fortune",
    summary: "The opening is already moving. Your job is to step in before overthinking slows it down.",
    accent: "gold current",
    recommendation: "Choose a fast artifact and treat movement as the answer.",
    nextHref: "/tests/card/wheel",
    companionProduct: "Ritual Starter Bundle",
  },
] as const;

const elementResults = [
  {
    slug: "water",
    title: "Water dominant",
    summary: "You read subtle shifts well. Your next ritual should reduce noise, not add more stimulation.",
    accent: "water channel",
    recommendation: "Open calm, reflective outputs and collectible keepsakes.",
    nextHref: "/tests/element/water",
    companionProduct: "Aura Amulet",
  },
  {
    slug: "fire",
    title: "Fire dominant",
    summary: "Your field wants motion. A fast ritual artifact will feel more true than a long explanation.",
    accent: "fire channel",
    recommendation: "Choose quick outputs that can be acted on immediately.",
    nextHref: "/tests/element/fire",
    companionProduct: "Manifest Receipt",
  },
  {
    slug: "wood",
    title: "Wood dominant",
    summary: "You grow through direction. Choose a ritual that turns potential into a visible path.",
    accent: "wood channel",
    recommendation: "Favor generative artifacts and future-facing products.",
    nextHref: "/tests/element/wood",
    companionProduct: "Energy Wallpaper",
  },
  {
    slug: "metal",
    title: "Metal dominant",
    summary: "You sharpen by editing. Pick the ritual that makes your signal cleaner, not louder.",
    accent: "metal channel",
    recommendation: "Open cleaner, more concise artifacts like the live receipt.",
    nextHref: "/tests/element/metal",
    companionProduct: "Manifest Receipt",
  },
  {
    slug: "earth",
    title: "Earth dominant",
    summary: "You regulate by grounding. Choose the artifact that makes your day feel more held.",
    accent: "earth channel",
    recommendation: "Pick rituals that feel held, repeatable, and ownable.",
    nextHref: "/tests/element/earth",
    companionProduct: "Ritual Starter Bundle",
  },
];

export function RitualEntryClient() {
  const router = useRouter();

  function drawCard() {
    const result = cardResults[Math.floor(Math.random() * cardResults.length)];
    writeTestResultDetail({
      kind: "card",
      slug: result.slug,
      title: result.title,
      summary: result.summary,
      accent: result.accent,
      recommendation: result.recommendation,
      nextHref: result.nextHref,
      companionProduct: result.companionProduct,
    });
    router.push(result.nextHref);
  }

  function runElementQuiz() {
    const result = elementResults[Math.floor(Math.random() * elementResults.length)];
    writeTestResultDetail({
      kind: "element",
      slug: result.slug,
      title: result.title,
      summary: result.summary,
      accent: result.accent,
      recommendation: result.recommendation,
      nextHref: result.nextHref,
      companionProduct: result.companionProduct,
    });
    router.push(result.nextHref);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <button
        type="button"
        onClick={drawCard}
        className="group rounded-[32px] border border-pink-300/20 bg-[radial-gradient(circle_at_top,rgba(255,166,221,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 text-left transition hover:border-pink-200/35 hover:bg-[radial-gradient(circle_at_top,rgba(255,166,221,0.22),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]"
      >
        <p className="text-xs uppercase tracking-[0.24em] text-pink-200/80">Entry one</p>
        <h3 className="mt-3 font-serif text-4xl text-stone-50">Draw a card</h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-stone-300">
          Fastest route into the site. One click, one card, one instant reading, then route users
          into a report, service, or product.
        </p>
        <div className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition group-hover:bg-white/8">
          Pull my signal
        </div>
      </button>

      <div className="rounded-[32px] border border-cyan-300/18 bg-[radial-gradient(circle_at_top,rgba(126,227,255,0.15),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Entry two</p>
        <h3 className="mt-3 font-serif text-4xl text-stone-50">Element quiz</h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-stone-300">
          A lighter self-test that feels like a game, not a form. Good for users who want an
          instant category and product recommendation before they commit to a full ritual.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runElementQuiz}
            className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
          >
            Run the quiz
          </button>
          <Link
            href="/quiz"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
          >
            Open full ritual
          </Link>
        </div>
      </div>
    </div>
  );
}
