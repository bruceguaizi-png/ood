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
    slug: "manifest-receipt",
    name: "Manifest Receipt",
    blurb: "A one-question ritual receipt with your present signal, best move, caution, and mantra.",
    status: "live",
    deliverable: "HTML + PDF + share card",
    cta: "Start live flow",
  },
  {
    slug: "tarot-spread",
    name: "Three-Card Tarot",
    blurb: "A demo ritual that maps your past pressure, present signal, and next opening.",
    status: "demo",
    deliverable: "Interactive result card",
    cta: "Preview demo",
  },
  {
    slug: "destiny-chart",
    name: "Destiny Chart",
    blurb: "A lighter birth-map read that turns classical inputs into a modern archetype profile.",
    status: "demo",
    deliverable: "Archetype profile",
    cta: "View example",
  },
  {
    slug: "bazi-deep-read",
    name: "Deep Bazi Reading",
    blurb: "Long-form interpretation and cycle analysis for users who want a denser ritual artifact.",
    status: "coming_soon",
    deliverable: "Long-form premium report",
    cta: "Join waitlist",
  },
];

export const shopProducts: ProductCard[] = [
  {
    slug: "manifest-receipt",
    title: "Manifest Receipt",
    type: "report",
    priceLabel: "$2.99",
    description: "Our live paid-beta SKU. Preview free, then unlock the full ritual with downloads.",
    mood: "signal / action / mantra",
    live: true,
  },
  {
    slug: "energy-wallpaper",
    title: "Energy Wallpaper",
    type: "wallpaper",
    priceLabel: "$9.99",
    description: "A personalized ritual wallpaper shaped by your dominant element and current focus.",
    mood: "aesthetic / daily reminder",
    live: false,
  },
  {
    slug: "aura-amulet",
    title: "Aura Amulet",
    type: "amulet",
    priceLabel: "$14.99",
    description: "A collectible digital talisman designed around missing-element compensation.",
    mood: "protective / collectible",
    live: false,
  },
  {
    slug: "ritual-bundle",
    title: "Ritual Starter Bundle",
    type: "bundle",
    priceLabel: "$19.99",
    description: "Receipt, wallpaper, and collectible card grouped as a launch-week product drop.",
    mood: "starter kit / gifting",
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
    slug: "manifest-receipt",
    title: "Manifest Receipt",
    type: "receipt",
    function: "A fast premium ritual artifact that turns present signal into readable action.",
    symbolism: "The archive’s primary document: compact, quotable, and worth reopening.",
    destination: "/report/demo-report?email=ritual%40ood.aura",
  },
  {
    slug: "aura-amulet",
    title: "Aura Amulet",
    type: "amulet",
    function: "A collectible object generated from missing-element compensation logic.",
    symbolism: "The universe’s protective object: less explanation, more possession.",
    destination: "/collection",
  },
  {
    slug: "energy-wallpaper",
    title: "Energy Wallpaper",
    type: "wallpaper",
    function: "A visual field users can keep visible after the ritual ends.",
    symbolism: "Turns private signal into ambient atmosphere.",
    destination: "/shop?product=energy-wallpaper",
  },
  {
    slug: "ritual-bundle",
    title: "Ritual Starter Bundle",
    type: "bundle",
    function: "A staged drop that groups multiple artifacts into a stronger first purchase.",
    symbolism: "The archive’s onboarding reliquary.",
    destination: "/shop?product=ritual-bundle",
  },
];
