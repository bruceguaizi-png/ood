"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BirthDateField, isValidBirthDate } from "@/components/birth-date-field";
import { TRACKING_EVENTS } from "@/lib/constants";
import { writeActiveSession } from "@/lib/client/active-session";
import { captureClientEvent } from "@/lib/client/posthog";
import { writeEmailHint } from "@/lib/client/local-history";
import { TurnstileField } from "@/components/turnstile-field";
import { type ElementKey, type ElementProfile } from "@/lib/types";

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
  const [birthDateError, setBirthDateError] = useState("");

  const canSubmit = useMemo(
    () => Boolean(name && birthDate && email && consent && !submitting),
    [birthDate, consent, email, name, submitting],
  );

  const steps = [
    {
      key: "name",
      title: "First, name the seeker",
      hint: "The chart needs a name to address.",
      node: (
        <input
          required
          name="name"
          autoComplete="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Aster…"
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
        />
      ),
    },
    {
      key: "birthday",
      title: "Mark the day you arrived",
      hint: "This is the chart's main anchor.",
      node: <BirthDateField value={birthDate} onChange={setBirthDate} />,
    },
    {
      key: "birth-time",
      title: "If known, mark the hour",
      hint: "Skip it if you do not know it. Add it if you want a sharper signal.",
      node: (
        <input
          name="birthTime"
          autoComplete="off"
          type="time"
          value={birthTime}
          onChange={(event) => setBirthTime(event.target.value)}
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
        />
      ),
    },
    {
      key: "birth-city",
      title: "Name the city of origin",
      hint: "Place helps the pattern settle.",
      node: (
        <input
          name="birthCity"
          autoComplete="off"
          type="text"
          value={birthCity}
          onChange={(event) => setBirthCity(event.target.value)}
          placeholder="Seoul, Shanghai, Tokyo…"
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
        />
      ),
    },
    {
      key: "email",
      title: "Choose where the omen returns",
      hint: "We use this to save the reading and reopen it later.",
      node: (
        <input
          required
          name="email"
          autoComplete="email"
          spellCheck={false}
          inputMode="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@ritual.email…"
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
        />
      ),
    },
  ] as const;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidBirthDate(birthDate)) {
      setBirthDateError("Enter a valid birth date in English month / day / year.");
      return;
    }

    setSubmitting(true);
    setError("");
    setBirthDateError("");

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

      const data = (await response.json()) as {
        sessionId: string;
        baseProfile: {
          coreType: string;
          profileRationale: {
            dominantElement: ElementKey;
            weakestElement: ElementKey;
          };
          elementDistribution: ElementProfile;
        };
      };
      writeEmailHint(email);
      writeActiveSession({
        sessionId: data.sessionId,
        name,
        email,
        coreType: data.baseProfile.coreType,
        dominantElement: data.baseProfile.profileRationale.dominantElement,
        weakestElement: data.baseProfile.profileRationale.weakestElement,
        elementDistribution: {
          metal: data.baseProfile.elementDistribution.metal,
          wood: data.baseProfile.elementDistribution.wood,
          water: data.baseProfile.elementDistribution.water,
          fire: data.baseProfile.elementDistribution.fire,
          earth: data.baseProfile.elementDistribution.earth,
        },
        createdAt: new Date().toISOString(),
      });
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
          <span>Seal {step + 1}</span>
          <span>{steps.length} seals</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 transition-[width]"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-100/72">
            Current invocation
          </p>
          <h2 className="text-balance font-serif text-4xl text-stone-50">{steps[step].title}</h2>
          <p className="text-sm leading-7 text-stone-300">{steps[step].hint}</p>
        </div>
      </div>

      {steps[step].node}

      {steps[step].key === "birthday" && birthDateError ? (
        <p aria-live="polite" className="text-sm text-red-300">
          {birthDateError}
        </p>
      ) : null}

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

      {error ? (
        <p aria-live="polite" className="text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current - 1)}
            className="h-14 rounded-full border border-white/10 px-6 text-sm text-stone-100 transition hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
          >
            Previous seal
          </button>
        ) : null}

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((current) => current + 1)}
            className="h-14 rounded-full bg-stone-100 px-6 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
          >
            Open next seal
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-14 rounded-full bg-stone-100 px-6 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Summoning your reading…" : "Reveal my omen"}
          </button>
        )}
      </div>
    </form>
  );
}
