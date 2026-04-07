import { SectionLabel } from "@/components/section-label";
import { QuizForm } from "@/components/quiz-form";
import { RitualCard } from "@/components/ritual-card";
import { Shell } from "@/components/shell";
import { TrackView } from "@/components/track-view";
import { TRACKING_EVENTS } from "@/lib/constants";

export default function QuizPage() {
  return (
    <Shell className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
      <TrackView event={TRACKING_EVENTS.quizStart} />

      <section className="space-y-6">
        <SectionLabel>Base Profile Intake</SectionLabel>
        <h1 className="max-w-xl font-serif text-5xl leading-[0.96] text-stone-50 sm:text-6xl">
          Generate your base profile first, then decide which track to explore.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-stone-300">
          This is not a generic form. You move step by step through the essentials, and the system
          responds with a profile that already feels recognizably yours.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "One step at a time instead of dumping every field at once",
            "Base profile first, quick summary second",
            "Every follow-up path branches from your profile",
            "The product reads you before it tries to sell you anything",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-stone-300"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <RitualCard className="lg:p-8">
        <QuizForm />
      </RitualCard>
    </Shell>
  );
}
