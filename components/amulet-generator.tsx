"use client";

import { useEffect, useMemo, useState } from "react";

import { readAmuletDraft, writeAmuletDraft } from "@/lib/client/ritual-bag";

const palettes = {
  metal: ["#0f172a", "#d7dde8", "#f7fafc"],
  wood: ["#05160d", "#59d986", "#d2ffe2"],
  water: ["#071424", "#59c8ff", "#def7ff"],
  fire: ["#210612", "#ff5fc1", "#ffd6ef"],
  earth: ["#181008", "#d7a56b", "#f3dec1"],
} as const;

type Element = keyof typeof palettes;

export function AmuletGenerator() {
  const initialDraft = readAmuletDraft();
  const [name, setName] = useState(initialDraft?.name ?? "Aster");
  const [wish, setWish] = useState(initialDraft?.wish ?? "I want clearer momentum.");
  const [element, setElement] = useState<Element>(
    initialDraft?.element && initialDraft.element in palettes
      ? (initialDraft.element as Element)
      : "water",
  );

  const palette = useMemo(() => palettes[element], [element]);
  const sigil = useMemo(
    () =>
      `${name.slice(0, 2).toUpperCase()}-${element.slice(0, 1).toUpperCase()}-${wish.length
        .toString()
        .padStart(2, "0")}`,
    [element, name, wish],
  );

  useEffect(() => {
    writeAmuletDraft({
      name,
      wish,
      element,
      sigil,
    });
  }, [element, name, sigil, wish]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm text-stone-300">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 outline-none"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-stone-300">Wish</span>
          <textarea
            value={wish}
            onChange={(event) => setWish(event.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 outline-none"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-stone-300">Primary element</span>
          <select
            value={element}
            onChange={(event) => setElement(event.target.value as Element)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-black/25 px-4 outline-none"
          >
            {Object.keys(palettes).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        className="relative overflow-hidden rounded-[32px] border border-white/10 p-8"
        style={{
          background: `radial-gradient(circle at top, ${palette[2]}22, transparent 30%), linear-gradient(180deg, ${palette[0]}, #06070c)`,
        }}
      >
        <div className="absolute right-[-30px] top-[-20px] h-44 w-44 rounded-full blur-3xl"
             style={{ backgroundColor: `${palette[1]}44` }} />
        <p className="relative text-xs uppercase tracking-[0.28em] text-white/65">Aura amulet prototype</p>
        <div className="relative mt-8 flex h-48 w-48 items-center justify-center rounded-full border border-white/15 bg-black/20 text-center font-serif text-4xl text-stone-50">
          {sigil}
        </div>
        <div className="relative mt-8 space-y-3">
          <p className="font-serif text-3xl text-stone-50">{name || "Unnamed"}</p>
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-200/75">{element} channel</p>
          <p className="max-w-xl text-sm leading-7 text-stone-200">{wish}</p>
        </div>
      </div>
    </div>
  );
}
