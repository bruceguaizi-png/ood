import { PageHero } from "@/components/page-hero";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";

export default function AboutPage() {
  return (
    <Shell className="space-y-12" activeHref="/about">
      <PageHero
        eyebrow="Brand story"
        title="O.O.D exists to make mystical interfaces feel collectible, playable, and emotionally legible."
        body="This page should read like an archive dossier: why the world exists, how the signal works, and why this feels different from a generic astrology site."
      />

      <section className="grid gap-5 lg:grid-cols-3">
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-pink-200/75">Dossier I</p>
          <h2 className="font-serif text-3xl text-stone-50">Why this world needs to exist</h2>
          <p className="text-sm leading-7 text-stone-300">
            Most mystical products still feel either too literal, too text-heavy, or too spiritually generic.
            O.O.D exists to turn self-reflection into designed digital artifacts people actually want to keep.
          </p>
        </RitualCard>
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/70">Dossier II</p>
          <h2 className="font-serif text-3xl text-stone-50">How the signal works</h2>
          <p className="text-sm leading-7 text-stone-300">
            Five-element structure gives the system shape. Tarot and symbolic tests modulate the current mood.
            The result is not “truth from above”, but a crafted mirror for timing, desire, and action.
          </p>
        </RitualCard>
        <RitualCard className="space-y-4">
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Dossier III</p>
          <h2 className="font-serif text-3xl text-stone-50">Why it feels different</h2>
          <p className="text-sm leading-7 text-stone-300">
            Traditional astrology sites optimize for explanation. O.O.D optimizes for atmosphere, objects,
            repeat interaction, and the feeling that every ritual adds to a personal collection.
          </p>
        </RitualCard>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          "Wellness / entertainment first",
          "Readable outputs over mystical complexity",
          "Artifacts before essays",
        ].map((principle) => (
          <RitualCard key={principle} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Operating principle</p>
            <p className="font-serif text-3xl text-stone-50">{principle}</p>
          </RitualCard>
        ))}
      </section>
    </Shell>
  );
}
