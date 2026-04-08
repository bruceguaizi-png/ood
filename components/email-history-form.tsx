"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { readEmailHint, writeEmailHint } from "@/lib/client/local-history";

export function EmailHistoryForm() {
  const [email, setEmail] = useState(() => readEmailHint());
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        writeEmailHint(email);
        router.push(`/me/history?email=${encodeURIComponent(email)}`);
      }}
    >
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
        className="h-12 flex-1 rounded-full border border-white/10 bg-black/25 px-4 text-stone-100 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
      />
      <button
        type="submit"
        className="h-12 rounded-full bg-stone-100 px-5 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
      >
        Open My History
      </button>
    </form>
  );
}
