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
  name: string,
): QuickInsight[] {
  const insightMap: Record<ElementKey, QuickInsight[]> = {
    metal: [
      {
        title: "Where you tend to get stuck",
        body: "You edit yourself before you express yourself, which often hides the sharpest part of what you really mean.",
      },
      {
        title: "The signal worth trusting",
        body: `${name}'s strongest signal right now is not emotional intensity but unusually sharp judgment.`,
      },
      {
        title: "The best next direction",
        body: "Start with goal alignment or personal growth before you spend time on broad fortune prompts.",
      },
    ],
    wood: [
      {
        title: "Where you tend to get stuck",
        body: "You are not short on drive. Your energy spreads too wide, so not enough of it grows into a main trunk.",
      },
      {
        title: "The signal worth trusting",
        body: "Growth is the strongest tone in your profile right now, which means new action paths are easier to open.",
      },
      {
        title: "The best next direction",
        body: "Go to growth and goal alignment first so abstract desire can become a visible path.",
      },
    ],
    water: [
      {
        title: "Where you tend to get stuck",
        body: "You feel everything in fine detail, which makes you easier to slow down through emotional weather, relationship undercurrents, and self-doubt.",
      },
      {
        title: "The signal worth trusting",
        body: `${name}'s strongest signal right now is sensitivity, which means emotional and timing cues are likely to land with unusual accuracy.`,
      },
      {
        title: "The best next direction",
        body: "Open relationship or fortune first, then decide whether a card draw should become today's extra signal.",
      },
    ],
    fire: [
      {
        title: "Where you tend to get stuck",
        body: "You usually know what you want, but when your energy overheats you can rush past the point where patience was still useful.",
      },
      {
        title: "The signal worth trusting",
        body: "The brightest force in your profile right now is action heat. Once you pick the right direction, momentum builds quickly.",
      },
      {
        title: "The best next direction",
        body: "Start with goal alignment or fortune, then use a card draw as an immediate amplifier.",
      },
    ],
    earth: [
      {
        title: "Where you tend to get stuck",
        body: "You can delay change in the name of stability, which leaves you stuck longer exactly when movement would help most.",
      },
      {
        title: "The signal worth trusting",
        body: `${name}'s strongest quality lately is steadiness, which makes this a strong moment for practical groundwork that lasts.`,
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
  const chartVisual = buildChartVisual(dominant, payload.name);
  const topInsights = buildInsights(dominant, payload.name);
  const recommendedTracks = buildRecommendedTracks(dominant);

  const coreConclusionMap: Record<ElementKey, string> = {
    metal: "Your strongest force right now is not emotion but judgment. This profile feels more like a blade getting sharper.",
    wood: "Your strongest force right now is growth drive. The issue is not a lack of roads but the need for one clearer road.",
    water: "Your strongest force right now is sensitivity. Emotional and relational movement will register in you earlier than it does for most people.",
    fire: "Your strongest force right now is action heat. Picking the right direction matters more than storing more energy.",
    earth: "Your strongest force right now is steadiness. Secure your footing first, then move the goal forward.",
  };

  const todaySignalMap: Record<ElementKey, string> = {
    metal: "Today is best used to make one clear decision instead of dragging something forward in ambiguity.",
    wood: "Today is best used to name the first step of a long-term idea instead of continuing to imagine it.",
    water: "Today is best used to read the emotional and relational signals first, then decide whether to move closer.",
    fire: "Today is best used to make one immediate move and turn raw heat into real feedback.",
    earth: "Today is best used to resolve one long-pending issue so your foundation feels steadier.",
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
    todaySignal: todaySignalMap[dominant],
    coreConclusion: coreConclusionMap[dominant],
    topInsights,
    recommendedTracks,
  };
}
