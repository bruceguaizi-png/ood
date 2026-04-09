export type DivinationService = {
  slug: string;
  name: string;
  blurb: string;
  status: "live" | "demo" | "coming_soon";
  deliverable: string;
  cta: string;
};

export type ProductCard = {
  slug: string;
  title: string;
  type: "report" | "wallpaper" | "amulet" | "bundle";
  priceLabel: string;
  description: string;
  mood: string;
  live: boolean;
};

export type LoreEntry = {
  title: string;
  body: string;
};

export type ArtifactRecord = {
  slug: string;
  title: string;
  type: "receipt" | "amulet" | "wallpaper" | "bundle";
  function: string;
  symbolism: string;
  destination: string;
};

export const siteNav = [
  { href: "/", label: "Home" },
  { href: "/divination", label: "Divination" },
  { href: "/shop", label: "Shop" },
  { href: "/collection", label: "Collection" },
  { href: "/universe", label: "Universe" },
  { href: "/profile", label: "Profile" },
  { href: "/about", label: "About" },
] as const;

export const divinationServices: DivinationService[] = [
  {
    slug: "crossover-report",
    name: "Cross-Over Report",
    blurb: "The free synthesis layer where the Eastern and Western branches stop reading separately and start speaking together.",
    status: "live",
    deliverable: "Free base artifact",
    cta: "Open preview flow",
  },
  {
    slug: "relationship-deep-dive",
    name: "Relationship Deep Dive",
    blurb: "A paid branch that maps attraction, emotional reciprocity, and the tension between closeness and self-protection.",
    status: "demo",
    deliverable: "Paid deep dive",
    cta: "View paid path",
  },
  {
    slug: "career-deep-dive",
    name: "Career Deep Dive",
    blurb: "A paid branch for visibility, work rhythm, execution, and the mismatch between private capacity and public output.",
    status: "demo",
    deliverable: "Paid deep dive",
    cta: "View paid path",
  },
  {
    slug: "bundle-drop",
    name: "Cross-Over Bundle",
    blurb: "A stronger product stack that groups one deep dive with visual artifacts and wallpaper expansion.",
    status: "coming_soon",
    deliverable: "Bundle offer",
    cta: "See bundle",
  },
];

export const shopProducts: ProductCard[] = [
  {
    slug: "relationship-deep-dive",
    title: "Relationship Deep Dive",
    type: "report",
    priceLabel: "$7.99",
    description: "A paid extension of the free cross-over report focused on attraction, intimacy, and emotional patterning.",
    mood: "attraction / reciprocity / tension",
    live: true,
  },
  {
    slug: "career-deep-dive",
    title: "Career Deep Dive",
    type: "report",
    priceLabel: "$7.99",
    description: "A paid extension focused on visibility, work direction, and how your two systems cooperate under pressure.",
    mood: "work / visibility / momentum",
    live: true,
  },
  {
    slug: "money-deep-dive",
    title: "Money Deep Dive",
    type: "report",
    priceLabel: "$7.99",
    description: "A paid extension focused on value patterns, exchange behavior, and where hesitation leaks abundance.",
    mood: "value / exchange / timing",
    live: true,
  },
  {
    slug: "healing-deep-dive",
    title: "Healing & Personality Deep Dive",
    type: "report",
    priceLabel: "$7.99",
    description: "A paid extension focused on coping pattern, self-protection, and the contradictions that shape personality.",
    mood: "healing / personality / repair",
    live: true,
  },
  {
    slug: "crossover-bundle",
    title: "Cross-Over Bundle",
    type: "bundle",
    priceLabel: "$19.99",
    description: "One stronger package that combines a deep dive with add-on visuals and collection-layer assets.",
    mood: "deep report / objects / expansion",
    live: false,
  },
  {
    slug: "signal-wallpaper",
    title: "Signal Wallpaper",
    type: "wallpaper",
    priceLabel: "$4.99",
    description: "An optional visual add-on seeded from your branch resonance and your dominant palette.",
    mood: "ambient / aesthetic / optional",
    live: false,
  },
];

export const loreEntries: LoreEntry[] = [
  {
    title: "Why O.O.D exists",
    body: "We treat ritual artifacts as designed emotional interfaces: less fortune-telling machine, more premium mirror for desire, timing, and self-narration.",
  },
  {
    title: "The signal model",
    body: "Eastern five-element balance becomes your structural profile. Western tarot becomes the daily modulation layer. The result is intentionally legible, visual, and sharable.",
  },
  {
    title: "What makes this cyber mystic",
    body: "The product is less about ancient authority and more about contemporary ritual UX: gradients, collectible assets, replayable reports, and emotionally resonant digital goods.",
  },
];

export const universeFeed = [
  "The Archive opened a new frequency channel for confidence rituals.",
  "A limited amulet drop is in synthesis for missing-water profiles.",
  "Tarot spreads are being reformatted into lighter, faster share cards.",
];

export const artifactArchive: ArtifactRecord[] = [
  {
    slug: "crossover-report",
    title: "Cross-Over Report",
    type: "receipt",
    function: "The archive's free synthesis document, built from the Eastern and Western branch readings.",
    symbolism: "The first complete document in the new flow: both systems held in one frame.",
    destination: "/report/demo-report?email=ritual%40ood.aura",
  },
  {
    slug: "relationship-deep-dive",
    title: "Relationship Deep Dive",
    type: "amulet",
    function: "A paid layer focused on attraction, reciprocity, and emotional tension.",
    symbolism: "Turns the general signal into one question that cuts closer to the heart.",
    destination: "/shop?product=relationship-deep-dive",
  },
  {
    slug: "signal-wallpaper",
    title: "Signal Wallpaper",
    type: "wallpaper",
    function: "A visual extension users can keep visible after the report ends.",
    symbolism: "Turns the reading into atmosphere instead of explanation.",
    destination: "/shop?product=signal-wallpaper",
  },
  {
    slug: "crossover-bundle",
    title: "Cross-Over Bundle",
    type: "bundle",
    function: "A grouped offer that stacks report depth and visual add-ons into one stronger purchase.",
    symbolism: "The archive’s first true paid stack.",
    destination: "/shop?product=crossover-bundle",
  },
];
