"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { readActiveSession } from "@/lib/client/active-session";
import { deriveCardResult, deriveElementResult } from "@/lib/client/ritual-derivations";
import { writeTestResultDetail } from "@/lib/client/ritual-bag";

export function RitualEntryClient() {
  const router = useRouter();

  function drawCard() {
    const activeSession = readActiveSession();
    if (!activeSession) {
      router.push("/");
      return;
    }

    const result = deriveCardResult(activeSession);
    writeTestResultDetail(result);
    router.push(result.nextHref);
  }

  function runElementQuiz() {
    const activeSession = readActiveSession();
    if (!activeSession) {
      router.push("/");
      return;
    }

    const result = deriveElementResult(activeSession);
    writeTestResultDetail(result);
    router.push(result.nextHref);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <button
        type="button"
        onClick={drawCard}
        className="group rounded-[32px] border border-pink-300/20 bg-[radial-gradient(circle_at_top,rgba(255,166,221,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 text-left transition hover:border-pink-200/35 hover:bg-[radial-gradient(circle_at_top,rgba(255,166,221,0.22),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]"
      >
        <p className="text-xs uppercase tracking-[0.24em] text-pink-200/80">Entry one</p>
        <h3 className="mt-3 font-serif text-4xl text-stone-50">Draw a card</h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-stone-300">
          A side ritual layered on top of your base signal. It should react to your profile, not
          ignore it.
        </p>
        <div className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition group-hover:bg-white/8">
          Pull my signal
        </div>
      </button>

      <div className="rounded-[32px] border border-cyan-300/18 bg-[radial-gradient(circle_at_top,rgba(126,227,255,0.15),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">Entry two</p>
        <h3 className="mt-3 font-serif text-4xl text-stone-50">Element quiz</h3>
        <p className="mt-3 max-w-md text-sm leading-7 text-stone-300">
          A faster secondary reading derived from the same base profile. Good when you want a
          lighter angle on the same field.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={runElementQuiz}
            className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
          >
            Run the quiz
          </button>
          <Link
            href="/quiz"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
          >
            Open full ritual
          </Link>
        </div>
      </div>
    </div>
  );
}
