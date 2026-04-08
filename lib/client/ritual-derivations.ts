"use client";

import { type ActiveSessionSnapshot } from "@/lib/client/active-session";
import { type ElementKey } from "@/lib/types";

function hash(input: string) {
  let total = 0;
  for (const char of input) total = (total * 31 + char.charCodeAt(0)) % 1000003;
  return total;
}

function rankedElements(snapshot: ActiveSessionSnapshot): [ElementKey, number][] {
  const values: [ElementKey, number][] = [
    ["metal", snapshot.elementDistribution.metal],
    ["wood", snapshot.elementDistribution.wood],
    ["water", snapshot.elementDistribution.water],
    ["fire", snapshot.elementDistribution.fire],
    ["earth", snapshot.elementDistribution.earth],
  ];
  return values.sort((a, b) => b[1] - a[1]);
}

const cardVariants = {
  star: {
    title: "The Star",
    accent: "rose current",
    summaryByElement: {
      metal: "Your signal brightens when precision becomes hope instead of pressure.",
      wood: "Growth returns the moment you believe the path is still opening.",
      water: "Gentleness is not weakness here. It is your clearest channel.",
      fire: "Your momentum works best when it shines instead of burns.",
      earth: "Faith becomes practical when you let the future feel reachable again.",
    },
    recommendationByElement: {
      metal: "Open a cleaner, future-facing ritual and let clarity lead.",
      wood: "Choose a growth ritual that turns movement into direction.",
      water: "Favor reflective outputs and calm artifact forms.",
      fire: "Use this opening to move with confidence, not force.",
      earth: "Pick the track that restores steadiness without stopping motion.",
    },
    companionProductByElement: {
      metal: "Manifest Receipt",
      wood: "Energy Wallpaper",
      water: "Aura Amulet",
      fire: "Manifest Receipt",
      earth: "Ritual Starter Bundle",
    },
  },
  strength: {
    title: "Strength",
    accent: "fire current",
    summaryByElement: {
      metal: "Control becomes power only when you stop over-editing the instinct.",
      wood: "The next move asks for disciplined courage, not scattered force.",
      water: "Soft power is still power. Hold the line without hardening.",
      fire: "You do not need more heat. You need cleaner direction for it.",
      earth: "Steady courage beats dramatic effort in this cycle.",
    },
    recommendationByElement: {
      metal: "Choose a ritual that turns judgment into direct action.",
      wood: "Pick the path that makes your energy useful, not just intense.",
      water: "Use a supportive ritual that helps courage feel safe.",
      fire: "Open the live receipt and move while the field is hot.",
      earth: "Choose the track that rewards consistency over spectacle.",
    },
    companionProductByElement: {
      metal: "Manifest Receipt",
      wood: "Ritual Starter Bundle",
      water: "Aura Amulet",
      fire: "Manifest Receipt",
      earth: "Aura Amulet",
    },
  },
  wheel: {
    title: "Wheel of Fortune",
    accent: "gold current",
    summaryByElement: {
      metal: "Timing is moving faster than your instinct to wait for certainty.",
      wood: "The path is already shifting. Your work is to step with it.",
      water: "A subtle change is already underway, even if it is not loud yet.",
      fire: "Momentum favors action now, not another round of hesitation.",
      earth: "Change is asking for trust, not total control.",
    },
    recommendationByElement: {
      metal: "Pick the track that rewards decisive timing.",
      wood: "Choose the route that turns change into visible growth.",
      water: "Use a gentle but responsive ritual while the signal is changing.",
      fire: "Take the fast path and treat motion itself as feedback.",
      earth: "Choose a ritual that helps you move without losing footing.",
    },
    companionProductByElement: {
      metal: "Manifest Receipt",
      wood: "Energy Wallpaper",
      water: "Aura Amulet",
      fire: "Ritual Starter Bundle",
      earth: "Ritual Starter Bundle",
    },
  },
} as const;

const elementGuides = {
  metal: {
    title: "Metal dominant",
    summary: "Your profile sharpens through precision. Cleaner signals land faster for you than louder ones.",
    recommendation: "Choose a ritual that clarifies direction and strips away drag.",
    accent: "metal channel",
    companionProduct: "Manifest Receipt",
  },
  wood: {
    title: "Wood dominant",
    summary: "Your field grows through direction. Movement matters most when it has a clear path.",
    recommendation: "Open a ritual that turns potential into a visible route forward.",
    accent: "wood channel",
    companionProduct: "Energy Wallpaper",
  },
  water: {
    title: "Water dominant",
    summary: "Your field reads emotional and timing signals early. Subtle shifts matter here.",
    recommendation: "Use calmer, more reflective outputs that reduce noise.",
    accent: "water channel",
    companionProduct: "Aura Amulet",
  },
  fire: {
    title: "Fire dominant",
    summary: "Your profile wants motion, declaration, and visible energy flow.",
    recommendation: "Choose the fast ritual path and act before the signal cools.",
    accent: "fire channel",
    companionProduct: "Manifest Receipt",
  },
  earth: {
    title: "Earth dominant",
    summary: "Your field stabilizes through grounding, rhythm, and repeatable structure.",
    recommendation: "Choose a ritual that makes the day feel held and coherent.",
    accent: "earth channel",
    companionProduct: "Ritual Starter Bundle",
  },
} as const;

export function deriveCardResult(snapshot: ActiveSessionSnapshot) {
  const seed = hash(
    `${snapshot.sessionId}|${snapshot.name}|${snapshot.coreType}|card|${snapshot.dominantElement}`,
  );
  const options = ["star", "strength", "wheel"] as const;
  const slug = options[seed % options.length];
  const variant = cardVariants[slug];
  const element = snapshot.dominantElement;

  return {
    kind: "card" as const,
    slug,
    title: variant.title,
    summary: variant.summaryByElement[element],
    accent: variant.accent,
    recommendation: variant.recommendationByElement[element],
    companionProduct: variant.companionProductByElement[element],
    nextHref: `/tests/card/${slug}?sessionId=${snapshot.sessionId}`,
    sessionId: snapshot.sessionId,
    sourceProfileCoreType: snapshot.coreType,
    sourceDominantElement: element,
    generatedAt: new Date().toISOString(),
  };
}

export function deriveElementResult(snapshot: ActiveSessionSnapshot) {
  const [dominant] = rankedElements(snapshot);
  const detail = elementGuides[dominant[0]];

  return {
    kind: "element" as const,
    slug: dominant[0],
    title: detail.title,
    summary: detail.summary,
    accent: detail.accent,
    recommendation: detail.recommendation,
    companionProduct: detail.companionProduct,
    nextHref: `/tests/element/${dominant[0]}?sessionId=${snapshot.sessionId}`,
    sessionId: snapshot.sessionId,
    sourceProfileCoreType: snapshot.coreType,
    sourceDominantElement: dominant[0],
    generatedAt: new Date().toISOString(),
  };
}
