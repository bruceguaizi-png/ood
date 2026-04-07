import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";
import { UniverseEntry } from "@/components/universe-entry";
import { artifactArchive, loreEntries, universeFeed } from "@/lib/site-content";

const archiveRoles = [
  {
    name: "Archive Keeper",
    duty: "Maintains the memory layer of every ritual artifact.",
    object: "History vault / saved receipts",
  },
  {
    name: "Card Reader",
    duty: "Translates fast symbolic signals into immediate emotional direction.",
    object: "Card draws / vibe tests",
  },
  {
    name: "Amulet Smith",
    duty: "Shapes collectible objects from missing-element compensation logic.",
    object: "Amulets / wallpapers / aura goods",
  },
  {
    name: "Signal Operator",
    duty: "Routes users from light tests into deeper rituals and premium goods.",
    object: "Manifest receipts / guided flow",
  },
] as const;

export default function UniversePage() {
  return (
    <Shell className="space-y-12" activeHref="/universe">
      <PageHero
        eyebrow="IP universe"
        title="The archive is a cast of entities, rules, and objects, not just a wall of lore."
        body="This page should make the world understandable at a glance: who lives here, what each entity does, and which artifact or service each one governs."
      />

      <section className="grid gap-5 lg:grid-cols-4">
        {archiveRoles.map((role) => (
          <RitualCard key={role.name} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-pink-200/75">Entity archive</p>
            <h2 className="font-serif text-3xl text-stone-50">{role.name}</h2>
            <p className="text-sm leading-7 text-stone-300">{role.duty}</p>
            <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200">
              {role.object}
            </div>
          </RitualCard>
        ))}
      </section>

      <section className="grid gap-5">
        {loreEntries.map((entry) => (
          <UniverseEntry key={entry.title} entry={entry} />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          "Every ritual should leave behind an object worth reopening.",
          "Fast tests reduce hesitation; deeper rituals monetize conviction.",
          "The universe must feel collectible before it feels instructional.",
        ].map((rule) => (
          <RitualCard key={rule} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Ritual rule</p>
            <p className="text-sm leading-7 text-stone-300">{rule}</p>
          </RitualCard>
        ))}
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Artifact archive</p>
          <h2 className="mt-2 font-serif text-4xl text-stone-50">Objects of the world</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-4">
          {artifactArchive.map((artifact) => (
            <RitualCard key={artifact.slug} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{artifact.type}</p>
                <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200">
                  archive object
                </div>
              </div>
              <h3 className="font-serif text-3xl text-stone-50">{artifact.title}</h3>
              <p className="text-sm leading-7 text-stone-300">{artifact.function}</p>
              <p className="text-sm leading-7 text-stone-400">{artifact.symbolism}</p>
              <Link
                href={artifact.destination}
                className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
              >
                Open object
              </Link>
            </RitualCard>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {universeFeed.map((item) => (
          <RitualCard key={item} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Latest transmission</p>
            <p className="text-sm leading-7 text-stone-300">{item}</p>
          </RitualCard>
        ))}
      </section>
    </Shell>
  );
}
