import {
  type BaseChartVisual,
  type BaseProfile,
  type ElementKey,
  type IntakePayload,
  type QuickInsight,
  type RecommendedTrack,
} from "@/lib/types";
import { buildElementProfile } from "@/lib/server/ritual";

const trackTemplates: Record<
  RecommendedTrack["kind"],
  Omit<RecommendedTrack, "why">
> = {
  "fandom-relationship": {
    kind: "fandom-relationship",
    title: "Relationship and attraction",
    preview: "See how you read connection, how you move closer, and what emotional tension is most active right now.",
    cta: "Open relationship track",
  },
  "personal-growth": {
    kind: "personal-growth",
    title: "Personal growth",
    preview: "Find the recurring behavior loop most likely to stall you and the inner switch most worth adjusting.",
    cta: "Open growth track",
  },
  "fortune-upgrade": {
    kind: "fortune-upgrade",
    title: "Fortune upgrade",
    preview: "Turn today's signal into a practical direction, a caution, and a move that strengthens the day.",
    cta: "Open fortune track",
  },
  "goal-alignment": {
    kind: "goal-alignment",
    title: "Goal alignment",
    preview: "Map the profile's momentum, friction, and timing into a concrete way of moving real goals forward.",
    cta: "Open goal track",
  },
};

function dominantElement(
  profile: ReturnType<typeof buildElementProfile>,
): ElementKey {
  const ranked: [ElementKey, number][] = [
    ["metal", profile.metal],
    ["wood", profile.wood],
    ["water", profile.water],
    ["fire", profile.fire],
    ["earth", profile.earth],
  ];

  ranked.sort((a, b) => b[1] - a[1]);
  return ranked[0][0];
}

function rankedElements(profile: ReturnType<typeof buildElementProfile>) {
  const ranked: [ElementKey, number][] = [
    ["metal", profile.metal],
    ["wood", profile.wood],
    ["water", profile.water],
    ["fire", profile.fire],
    ["earth", profile.earth],
  ];
  ranked.sort((a, b) => b[1] - a[1]);
  return ranked;
}

function weakestElement(profile: ReturnType<typeof buildElementProfile>): ElementKey {
  const ranked = rankedElements(profile);
  return ranked[ranked.length - 1][0];
}

function supportElement(profile: ReturnType<typeof buildElementProfile>): ElementKey {
  const ranked = rankedElements(profile);
  return ranked[1][0];
}

function seasonFromDate(date: string): "spring" | "summer" | "autumn" | "winter" {
  const month = Number(date.split("-")[1] ?? 0);
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  if ([9, 10, 11].includes(month)) return "autumn";
  return "winter";
}

function phaseFromTime(time?: string): "dawn" | "day" | "dusk" | "night" | "unknown" {
  if (!time) return "unknown";
  const hour = Number(time.split(":")[0] ?? 0);
  if (hour < 6) return "night";
  if (hour < 12) return "dawn";
  if (hour < 18) return "day";
  return "dusk";
}

function buildChartVisual(
  dominant: ElementKey,
  name: string,
): BaseChartVisual {
  return {
    chartType: "hexagram",
    dominantElement: dominant,
    ringOrder: ["metal", "wood", "water", "fire", "earth"],
    glowLabel: `${name}'s live pattern`,
  };
}

function buildInsights(
  dominant: ElementKey,
  weakest: ElementKey,
  support: ElementKey,
  name: string,
): QuickInsight[] {
  const insightMap: Record<ElementKey, QuickInsight[]> = {
    metal: [
      {
        title: "Where you tend to get stuck",
        body: `You edit yourself before you express yourself, especially when ${weakest} energy is running low and softness feels less available.`,
      },
      {
        title: "The signal worth trusting",
        body: `${name}'s strongest signal right now is sharp judgment, with ${support} acting like the hidden support beam behind it.`,
      },
      {
        title: "The best next direction",
        body: "Start with goal alignment or personal growth before you spend time on broad fortune prompts.",
      },
    ],
    wood: [
      {
        title: "Where you tend to get stuck",
        body: `You are not short on drive. The issue is that ${weakest} stays underfed, so your momentum spreads wider than it roots.`,
      },
      {
        title: "The signal worth trusting",
        body: `Growth is the strongest tone in your profile right now, with ${support} helping turn expansion into real movement.`,
      },
      {
        title: "The best next direction",
        body: "Go to growth and goal alignment first so abstract desire can become a visible path.",
      },
    ],
    water: [
      {
        title: "Where you tend to get stuck",
        body: `You feel everything in fine detail, and when ${weakest} dips too low, emotional weather can flood the whole field.`,
      },
      {
        title: "The signal worth trusting",
        body: `${name}'s strongest signal right now is sensitivity, while ${support} quietly helps timing cues become usable instead of overwhelming.`,
      },
      {
        title: "The best next direction",
        body: "Open relationship or fortune first, then decide whether a card draw should become today's extra signal.",
      },
    ],
    fire: [
      {
        title: "Where you tend to get stuck",
        body: `You usually know what you want, but when ${weakest} falls behind, your heat can outrun the patience that would have made it cleaner.`,
      },
      {
        title: "The signal worth trusting",
        body: `The brightest force in your profile right now is action heat, with ${support} helping momentum build once the direction is right.`,
      },
      {
        title: "The best next direction",
        body: "Start with goal alignment or fortune, then use a card draw as an immediate amplifier.",
      },
    ],
    earth: [
      {
        title: "Where you tend to get stuck",
        body: `You can delay change in the name of stability, especially when ${weakest} energy is too quiet to reassure you that movement is safe.`,
      },
      {
        title: "The signal worth trusting",
        body: `${name}'s strongest quality lately is steadiness, with ${support} making this a better moment for durable progress than dramatic change.`,
      },
      {
        title: "The best next direction",
        body: "Move into growth and goal alignment first to create a steadier feeling of progress.",
      },
    ],
  };

  return insightMap[dominant];
}

function buildRecommendedTracks(
  dominant: ElementKey,
): RecommendedTrack[] {
  const whyMap: Record<ElementKey, Record<RecommendedTrack["kind"], string>> = {
    metal: {
      "fandom-relationship": "Your relationship judgment is sharp, but your emotional expression stays compressed. This track is most likely to feel uncannily accurate.",
      "personal-growth": "What you need now is not more information but a clearer look at what you keep cutting away from yourself.",
      "fortune-upgrade": "Your profile responds better to precise timing cues than generic encouragement.",
      "goal-alignment": "Your execution and judgment are clarifying. Real-world momentum is worth prioritizing.",
    },
    wood: {
      "fandom-relationship": "You enter relationships with a strong growth drive, so this track will likely mirror you quickly.",
      "personal-growth": "Your profile is especially ready for growth work and directional clarity first.",
      "fortune-upgrade": "Your current fortune question is about choosing a direction, not waiting for luck.",
      "goal-alignment": "Your profile is very supportive of long-horizon progress toward meaningful goals.",
    },
    water: {
      "fandom-relationship": "You are most attuned to emotional and relational signals, so this track is likely to hit first.",
      "personal-growth": "The growth track helps explain why you often end up feeling more than other people notice.",
      "fortune-upgrade": "Today's fortune is more about detail alerts and emotional blind-spot avoidance.",
      "goal-alignment": "Goal alignment helps you turn intuition into gentler but sustained motion.",
    },
    fire: {
      "fandom-relationship": "Your magnetism and expressive drive are both strong, so this track should give quick feedback.",
      "personal-growth": "The growth track helps separate impulse from real direction.",
      "fortune-upgrade": "Your profile is especially suited to making a small upgrade move today, not someday.",
      "goal-alignment": "Right now your energy is best used by aiming it at one concrete goal.",
    },
    earth: {
      "fandom-relationship": "You seek steadiness in connection, and this track helps you spot slow emotional drain early.",
      "personal-growth": "Growth is especially useful here because you need to see the pattern by which you keep containing yourself.",
      "fortune-upgrade": "Your fortune upgrade is more about stable recalibration than a sudden spike.",
      "goal-alignment": "Goal alignment fits you best because your profile supports long-term, grounded progress.",
    },
  };

  return (
    [
      "fandom-relationship",
      "personal-growth",
      "fortune-upgrade",
      "goal-alignment",
    ] as const
  ).map((kind) => ({
    ...trackTemplates[kind],
    why: whyMap[dominant][kind],
  }));
}

export function buildBaseProfile(payload: IntakePayload): BaseProfile {
  const elementDistribution = buildElementProfile(payload);
  const dominant = dominantElement(elementDistribution);
  const weakest = weakestElement(elementDistribution);
  const support = supportElement(elementDistribution);
  const chartVisual = buildChartVisual(dominant, payload.name);
  const season = seasonFromDate(payload.birthDate);
  const dayPhase = phaseFromTime(payload.birthTime);
  const tensionPair: [ElementKey, ElementKey] = [dominant, weakest];
  const topInsights = buildInsights(dominant, weakest, support, payload.name);
  const recommendedTracks = buildRecommendedTracks(dominant);

  const coreConclusionMap: Record<ElementKey, string> = {
    metal: `Your field leads with metal while ${weakest} stays quieter underneath it. This makes the profile feel less emotional than precise, but the real work is letting sharp judgment stay connected to human timing.`,
    wood: `Your field leads with wood while ${weakest} is still asking for support. The profile is not short on movement. It is asking for one path strong enough to hold your growth.`,
    water: `Your field leads with water while ${weakest} keeps the edge of your sensitivity exposed. Emotional and relational signals will arrive early for you, so your power depends on reading them cleanly rather than resisting them.`,
    fire: `Your field leads with fire while ${weakest} lowers your tolerance for delay. The profile is hot, direct, and ready to move, but it works best when that heat has a target.`,
    earth: `Your field leads with earth while ${weakest} makes change feel riskier than it is. This profile gains power by stabilizing first, then moving without breaking its own rhythm.`,
  };

  const todaySignalMap: Record<ElementKey, string> = {
    metal: `Today favors one clean decision. ${support} is strong enough to help the choice land if you stop dragging it through ambiguity.`,
    wood: `Today favors naming the first real step. ${support} wants growth to become directional instead of staying conceptual.`,
    water: `Today favors reading emotional and timing signals first. ${support} helps you respond without drowning in subtlety.`,
    fire: `Today favors one immediate move. ${support} can turn raw heat into usable momentum if you act before the field cools.`,
    earth: `Today favors resolving one long-pending issue. ${support} helps the foundation strengthen once the stuck point is cleared.`,
  };

  return {
    identity: {
      name: payload.name,
      birthday: payload.birthDate,
      birthTime: payload.birthTime,
      birthLocation: payload.birthCity,
    },
    chartType: "hexagram",
    chartVisual,
    coreType: elementDistribution.archetype,
    elementDistribution,
    profileRationale: {
      dominantElement: dominant,
      weakestElement: weakest,
      supportElement: support,
      seasonalTone: season,
      dayPhase,
      tensionPair,
    },
    todaySignal: todaySignalMap[dominant],
    coreConclusion: coreConclusionMap[dominant],
    topInsights,
    recommendedTracks,
  };
}
