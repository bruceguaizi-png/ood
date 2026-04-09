"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TurnstileField } from "@/components/turnstile-field";
import { writeActiveSession } from "@/lib/client/active-session";
import { writeEmailHint } from "@/lib/client/local-history";
import { captureClientEvent } from "@/lib/client/posthog";
import { TRACKING_EVENTS } from "@/lib/constants";

export function EmailUnlockForm(props: {
  sessionId: string;
  name: string;
  coreType: string;
  dominantElement: "metal" | "wood" | "water" | "fire" | "earth";
  weakestElement: "metal" | "wood" | "water" | "fire" | "earth";
  elementDistribution: {
    metal: number;
    wood: number;
    water: number;
    fire: number;
    earth: number;
  };
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/intake/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: props.sessionId,
          email,
          turnstileToken: token,
        }),
      });

      if (!response.ok) {
        throw new Error("The unlock gate did not open yet. Try again.");
      }

      const data = (await response.json()) as {
        reportId: string;
        stage: string;
      };

      writeEmailHint(email);
      writeActiveSession({
        sessionId: props.sessionId,
        name: props.name,
        email,
        coreType: props.coreType,
        dominantElement: props.dominantElement,
        weakestElement: props.weakestElement,
        elementDistribution: props.elementDistribution,
        createdAt: new Date().toISOString(),
      });

      captureClientEvent(TRACKING_EVENTS.emailGateComplete, {
        sessionId: props.sessionId,
        reportId: data.reportId,
      });

      router.push(`/summary/${props.sessionId}`);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "The unlock gate did not open yet.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.24em] text-stone-400">
          Email unlock
        </label>
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
      </div>

      <TurnstileField onToken={setToken} />

      {error ? (
        <p aria-live="polite" className="text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-14 items-center rounded-full bg-stone-100 px-6 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {submitting ? "Unlocking your full reading…" : "Unlock Full Reading"}
      </button>
    </form>
  );
}
