"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { TRACKING_EVENTS } from "@/lib/constants";
import { captureClientEvent } from "@/lib/client/posthog";
import { writeEmailHint } from "@/lib/client/local-history";
import { TurnstileField } from "@/components/turnstile-field";

export function QuizForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string>();
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const canSubmit = useMemo(
    () => Boolean(name && birthDate && email && consent && !submitting),
    [birthDate, consent, email, name, submitting],
  );

  const steps = [
    {
      key: "name",
      title: "Start with your name",
      hint: "Your name becomes the label of the profile, which makes the reading feel personally yours.",
      node: (
        <input
          required
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Aster"
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 outline-none placeholder:text-stone-500"
        />
      ),
    },
    {
      key: "birthday",
      title: "What is your birthday?",
      hint: "Your birthday is the central anchor of the base profile.",
      node: (
        <input
          required
          type="date"
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 outline-none"
        />
      ),
    },
    {
      key: "birth-time",
      title: "What about your birth time?",
      hint: "You can skip it if you do not know it, but adding it makes the reading more precise.",
      node: (
        <input
          type="time"
          value={birthTime}
          onChange={(event) => setBirthTime(event.target.value)}
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 outline-none"
        />
      ),
    },
    {
      key: "birth-city",
      title: "Where were you born?",
      hint: "Your birth city helps us place the profile more accurately.",
      node: (
        <input
          type="text"
          value={birthCity}
          onChange={(event) => setBirthCity(event.target.value)}
          placeholder="Seoul, Shanghai, Tokyo..."
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 outline-none placeholder:text-stone-500"
        />
      ),
    },
    {
      key: "email",
      title: "Leave an email for your result",
      hint: "That lets us save the profile, reopen it later, and continue into follow-up reports.",
      node: (
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@ritual.email"
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 outline-none placeholder:text-stone-500"
        />
      ),
    },
  ] as const;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      captureClientEvent(TRACKING_EVENTS.quizComplete, { entry: "base-profile" });

      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birthDate,
          birthTime,
          birthCity,
          email,
          turnstileToken: token,
          consentEntertainmentDisclaimer: consent,
        }),
      });

      if (!response.ok) {
        throw new Error("We couldn't open your preview yet. Try once more.");
      }

      const data = (await response.json()) as { sessionId: string };
      writeEmailHint(email);
      router.push(`/preview/${data.sessionId}`);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Something failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-stone-400">
          <span>Step {step + 1}</span>
          <span>{steps.length} total</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 transition-all"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-serif text-4xl text-stone-50">{steps[step].title}</h2>
        <p className="text-sm leading-7 text-stone-300">{steps[step].hint}</p>
      </div>

      {steps[step].node}

      <TurnstileField onToken={setToken} />

      <label className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-stone-300">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-1"
        />
        I understand this ritual is for entertainment and self-reflection only.
      </label>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current - 1)}
            className="h-14 rounded-full border border-white/10 px-6 text-sm text-stone-100 transition hover:bg-white/8"
          >
            Back
          </button>
        ) : null}

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current + 1)}
            className="h-14 rounded-full bg-stone-100 px-6 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-14 rounded-full bg-stone-100 px-6 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Generating your base profile..." : "Generate my base profile"}
          </button>
        )}
      </div>
    </form>
  );
}
