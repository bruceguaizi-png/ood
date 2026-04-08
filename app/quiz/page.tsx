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
        <SectionLabel>Full Ritual Intake</SectionLabel>
        <h1 className="max-w-xl text-balance font-serif text-5xl leading-[0.96] text-stone-50 sm:text-6xl">
          Enter the deeper chamber.
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-8 text-stone-300">
          The homepage opens the fast gate. This page keeps the full ritual path for anyone who
          wants the longer entrance.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "One field. One breath.",
            "Signal first. Explanation second.",
            "Birth time and city stay ready here.",
            "Everything routes from the same base profile.",
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
