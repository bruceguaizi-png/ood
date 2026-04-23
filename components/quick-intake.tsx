"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BirthDateField, isValidBirthDate } from "@/components/birth-date-field";
import { TurnstileField } from "@/components/turnstile-field";
import { writeActiveSession } from "@/lib/client/active-session";
import { captureClientEvent } from "@/lib/client/posthog";
import { TRACKING_EVENTS } from "@/lib/constants";
import { type BranchPreview, type ElementKey, type ElementProfile } from "@/lib/types";

export function QuickIntake() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [consent, setConsent] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [token, setToken] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");

  const canSubmit = useMemo(
    () => Boolean(name && birthDate && consent && !submitting),
    [birthDate, consent, name, submitting],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    if (!isValidBirthDate(birthDate)) {
      setBirthDateError("Enter a valid birth date in English month / day / year.");
      return;
    }

    setSubmitting(true);
    setError("");
    setBirthDateError("");

    try {
      captureClientEvent(TRACKING_EVENTS.quizStart, { entry: "quick-intake" });
      captureClientEvent(TRACKING_EVENTS.quizComplete, { entry: "quick-intake" });

      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birthDate,
          birthTime,
          birthCity,
          turnstileToken: token,
          consentEntertainmentDisclaimer: consent,
        }),
      });

      if (!response.ok) {
        throw new Error("The signal did not open yet. Check your details and try again.");
      }

      const data = (await response.json()) as {
        sessionId: string;
        branchPreview: {
          eastern: BranchPreview;
          western: BranchPreview;
        };
        stage: string;
        baseProfile: {
          coreType: string;
          profileRationale: {
            dominantElement: ElementKey;
            weakestElement: ElementKey;
          };
          elementDistribution: ElementProfile;
        };
      };
      writeActiveSession({
        sessionId: data.sessionId,
        name,
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
      setError(
        nextError instanceof Error
          ? nextError.message
          : "The signal did not open yet. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,11,20,0.96),rgba(3,7,14,0.9))] p-4 shadow-[0_36px_140px_rgba(0,0,0,0.48)] sm:rounded-[34px] sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,232,255,0.16),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(255,194,153,0.12),transparent_24%)]" />
      <div className="pointer-events-none absolute right-[-32px] top-[-24px] h-32 w-32 rounded-full border border-cyan-200/10" />
      <div className="pointer-events-none absolute right-10 top-10 h-10 w-10 rounded-full border border-amber-200/15" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)]" />

      <div className="relative space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.34em] text-cyan-100/72">
              Private Entry
            </p>
            <h2 className="max-w-md text-balance font-serif text-[2.1rem] leading-[0.92] text-stone-50 sm:text-5xl">
              Let the sign appear.
            </h2>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-stone-300 sm:text-[11px]">
            3 fields
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-stone-400">Name</span>
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
            </label>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Birth Date
              </span>
              <BirthDateField value={birthDate} onChange={setBirthDate} />
              {birthDateError ? (
                <p aria-live="polite" className="text-sm text-red-300">
                  {birthDateError}
                </p>
              ) : null}
            </div>
          </div>

          <div className="order-first space-y-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-3 md:order-none md:rounded-[28px] md:p-4">
            <div className="relative flex min-h-[150px] items-center justify-center overflow-hidden rounded-[20px] border border-white/10 bg-[#10131b] md:min-h-[188px] md:rounded-[24px]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-72"
                style={{ backgroundImage: 'url(/first-opening-bg.jpg)' }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,20,0.18),rgba(8,12,20,0.68))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(111,232,255,0.16),transparent_38%)]" />
              <div className="absolute h-44 w-44 rounded-full border border-cyan-200/20 motion-safe:animate-[orbitSpin_18s_linear_infinite]" />
              <div className="absolute h-32 w-32 rounded-full border border-pink-200/15 motion-safe:animate-[orbitSpin_12s_linear_infinite_reverse]" />
              <div className="absolute h-20 w-20 rounded-full border border-amber-200/20" />
              <div className="z-10 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-stone-300/90">
                  First Opening
                </p>
                <p className="mt-2 text-balance font-serif text-2xl text-stone-50 drop-shadow-[0_6px_28px_rgba(0,0,0,0.42)] md:mt-3 md:text-3xl">
                  One sign. Two mirrors.
                </p>
              </div>
            </div>

            <div className="grid gap-2 text-sm leading-6 text-stone-300">
              <p>Name and birth date open the first layer.</p>
              <p>The full reading waits after the preview.</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.22em] text-stone-200 transition hover:border-cyan-200/25 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
        >
          {expanded ? "Hide extra signal fields" : "Add time & city"}
        </button>

        {expanded ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Birth Time
              </span>
              <input
                name="birthTime"
                autoComplete="off"
                type="time"
                value={birthTime}
                onChange={(event) => setBirthTime(event.target.value)}
                className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Birth City
              </span>
              <input
                name="birthCity"
                autoComplete="off"
                type="text"
                value={birthCity}
                onChange={(event) => setBirthCity(event.target.value)}
                placeholder="Seoul, Shanghai, Tokyo…"
                className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
              />
            </label>
          </div>
        ) : null}

        <TurnstileField onToken={setToken} />

        <label className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-stone-300">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 rounded border-white/20 bg-black/20"
          />
          <span>This ritual is for entertainment and self-reflection only.</span>
        </label>

        {error ? (
          <p aria-live="polite" className="text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-center text-xs uppercase tracking-[0.24em] text-stone-500 sm:text-left">
            Preview first. Full ritual later.
          </p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex min-h-[60px] w-full items-center justify-center rounded-full border border-amber-100/45 bg-[linear-gradient(135deg,#fff7e3_0%,#ffe7b8_40%,#ffd37b_100%)] px-7 text-sm font-semibold uppercase tracking-[0.18em] text-stone-950 shadow-[0_18px_56px_rgba(255,211,123,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_72px_rgba(255,211,123,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-100/70 disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
          >
            {submitting ? "Opening the reading..." : "Enter the reading"}
          </button>
        </div>
      </div>
    </form>
  );
}
