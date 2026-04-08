import { format } from "date-fns";

import { type ElementProfile, type FocusTheme, type IntakePayload, type ManifestReceipt } from "@/lib/types";

const paletteMap = {
  metal: { base: "#111827", accent: "#d3d7df", glow: "#fafafa" },
  wood: { base: "#07170f", accent: "#6dde88", glow: "#cfffe0" },
  water: { base: "#061229", accent: "#57ccff", glow: "#9ae6ff" },
  fire: { base: "#220711", accent: "#ff4db8", glow: "#ffc3ea" },
  earth: { base: "#181108", accent: "#d9a96a", glow: "#f3d6af" },
} as const;

type PaletteKey = keyof typeof paletteMap;
type ElementScoreEntry = [PaletteKey, number];

const archetypes = [
  "The Magnetic Builder",
  "The Velvet Instigator",
  "The Soft Strategist",
  "The Luminous Operator",
  "The Ritual Architect",
];

const tarotCards = [
  "Strength",
  "The Star",
  "The Magician",
  "The Sun",
  "Wheel of Fortune",
  "The Empress",
];

const themeCopy: Record<
  FocusTheme,
  { teaser: string; action: string; caution: string; mantra: string }
> = {
  love: {
    teaser: "Romance opens when your signal gets simpler, not louder.",
    action: "Make one warm move without trying to control the outcome.",
    caution: "Do not perform mystery when what you want is intimacy.",
    mantra: "I attract what can actually meet me.",
  },
  career: {
    teaser: "Your field sharpens around decisive work and visible output.",
    action: "Ship the clean version before perfection starts acting like fear.",
    caution: "Do not bury your strongest thought inside politeness.",
    mantra: "My work becomes magnetic when it is unmistakable.",
  },
  money: {
    teaser: "Abundance improves when you stop hiding the exchange.",
    action: "Name your price, boundary, or ask in literal language today.",
    caution: "Do not confuse delay with sophistication.",
    mantra: "Value moves faster when I stop apologizing for it.",
  },
  confidence: {
    teaser: "Your glow returns the second you stop rehearsing for permission.",
    action: "Lead with the sentence you usually save for last.",
    caution: "Do not shrink the signal to make other people comfortable.",
    mantra: "My power becomes visible when I stop editing it down.",
  },
  healing: {
    teaser: "Recovery today looks like softness with structure.",
    action: "Choose one protective ritual and actually let it count.",
    caution: "Do not confuse self-abandonment with flexibility.",
    mantra: "Rest is not retreat. It is repair.",
  },
};

function hash(input: string) {
  let total = 0;
  for (const char of input) total = (total * 31 + char.charCodeAt(0)) % 100000;
  return total;
}

function normalize(value: number, min = 32, max = 88) {
  return min + (value % (max - min));
}

function seasonOffsets(birthDate: string) {
  const month = Number(birthDate.split("-")[1] ?? 0);
  if ([3, 4, 5].includes(month)) {
    return { wood: 12, fire: 4, earth: 3, metal: -6, water: -4 };
  }
  if ([6, 7, 8].includes(month)) {
    return { wood: 2, fire: 12, earth: 6, metal: -5, water: -8 };
  }
  if ([9, 10, 11].includes(month)) {
    return { wood: -6, fire: -2, earth: 3, metal: 12, water: 4 };
  }
  return { wood: -4, fire: -7, earth: 2, metal: 3, water: 12 };
}

function dayOffsets(birthDate: string) {
  const day = Number(birthDate.split("-")[2] ?? 0);
  return {
    metal: (day * 3) % 11,
    wood: (day * 5) % 13,
    water: (day * 7) % 17,
    fire: (day * 11) % 19,
    earth: (day * 13) % 23,
  };
}

function timeOffsets(birthTime?: string) {
  if (!birthTime) {
    return { metal: 0, wood: 0, water: 0, fire: 0, earth: 0 };
  }

  const [hourRaw, minuteRaw] = birthTime.split(":");
  const hour = Number(hourRaw ?? 0);
  const minute = Number(minuteRaw ?? 0);
  const bucket = (hour * 60 + minute) % 24;

  if (bucket < 6) return { metal: 1, wood: -1, water: 9, fire: -3, earth: 2 };
  if (bucket < 12) return { metal: 0, wood: 8, water: 1, fire: 3, earth: 2 };
  if (bucket < 18) return { metal: 2, wood: 1, water: -2, fire: 9, earth: 3 };
  return { metal: 6, wood: -1, water: 4, fire: 0, earth: 5 };
}

export function buildElementProfile(payload: IntakePayload): ElementProfile {
  const seed = hash(
    [
      payload.name,
      payload.birthDate,
      payload.birthTime ?? "",
      payload.birthCity ?? "",
    ].join("|"),
  );

  const season = seasonOffsets(payload.birthDate);
  const day = dayOffsets(payload.birthDate);
  const time = timeOffsets(payload.birthTime);

  const metal = normalize(seed + 11 + season.metal + day.metal + time.metal);
  const wood = normalize(seed + 29 + season.wood + day.wood + time.wood);
  const water = normalize(seed + 47 + season.water + day.water + time.water);
  const fire = normalize(seed + 67 + season.fire + day.fire + time.fire);
  const earth = normalize(seed + 89 + season.earth + day.earth + time.earth);

  const scores: ElementScoreEntry[] = [
    ["metal", metal] as ElementScoreEntry,
    ["wood", wood] as ElementScoreEntry,
    ["water", water] as ElementScoreEntry,
    ["fire", fire] as ElementScoreEntry,
    ["earth", earth] as ElementScoreEntry,
  ];
  const sorted = scores.sort((a, b) => b[1] - a[1]);

  const palette = paletteMap[sorted[0][0] as keyof typeof paletteMap];
  const archetype = archetypes[seed % archetypes.length];

  return { metal, wood, water, fire, earth, archetype, palette };
}

export function buildPreviewTeaser(payload: IntakePayload, profile: ElementProfile) {
  const theme: FocusTheme = profile.fire >= profile.water ? "confidence" : "healing";
  const copy = themeCopy[theme];
  return `${copy.teaser} Your dominant pattern right now is ${profile.archetype.toLowerCase()}.`;
}

export function buildManifestReceipt(
  payload: IntakePayload & { focusTheme?: FocusTheme },
  profile: ElementProfile,
): ManifestReceipt {
  const theme: FocusTheme = payload.focusTheme ?? (profile.water > profile.fire ? "healing" : "confidence");
  const seed = hash(`${payload.birthDate}-${theme}-${profile.archetype}`);
  const card = tarotCards[seed % tarotCards.length];
  const themeCopyBlock = themeCopy[theme];
  const energyScore = Math.round(
    (profile.metal + profile.wood + profile.water + profile.fire + profile.earth) / 5,
  );

  return {
    date: format(new Date(), "MMMM d, yyyy"),
    theme,
    energyScore,
    tarotCard: card,
    action: themeCopyBlock.action,
    caution: themeCopyBlock.caution,
    mantra: themeCopyBlock.mantra,
    summary: `${profile.archetype} energy leads today. ${themeCopyBlock.teaser} ${themeCopyBlock.action}`,
    shareCaption: `My O.O.D receipt for today: ${themeCopyBlock.mantra}`,
  };
}
