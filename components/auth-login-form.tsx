"use client";

import { useState } from "react";

export function AuthLoginForm(props: { nextPath: string }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nextPath: props.nextPath,
        }),
      });

      const data = (await response.json()) as { error?: string; redirectTo?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Sign in failed.");
      }

      window.location.href = data.redirectTo ?? props.nextPath;
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.24em] text-stone-400">
          Email
        </label>
        <input
          required
          autoComplete="email"
          spellCheck={false}
          inputMode="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@oracleood.com"
          className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
        />
      </div>

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
        {submitting ? "Opening your archive..." : "Continue with email"}
      </button>
    </form>
  );
}
