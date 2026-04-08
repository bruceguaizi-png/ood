import { RitualCard } from "@/components/ritual-card";
import { type LoreEntry } from "@/lib/site-content";

export function UniverseEntry({ entry }: { entry: LoreEntry }) {
  return (
    <RitualCard className="space-y-3">
      <h3 className="text-balance font-serif text-3xl text-stone-50">{entry.title}</h3>
      <p className="text-pretty text-sm leading-7 text-stone-300">{entry.body}</p>
    </RitualCard>
  );
}
