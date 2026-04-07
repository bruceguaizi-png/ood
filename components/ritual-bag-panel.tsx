"use client";

import Link from "next/link";

import { clearBag, readBag, removeFromBag, type BagItem } from "@/lib/client/ritual-bag";

function parsePrice(value: string) {
  const number = Number(value.replace("$", ""));
  return Number.isFinite(number) ? number : 0;
}

export function RitualBagPanel(props: {
  bag: BagItem[];
  onChange: (next: BagItem[]) => void;
  mode?: "drawer" | "panel";
  liveCheckoutHref?: string;
  prototypeHref?: string;
}) {
  const total = props.bag.reduce((sum, item) => sum + parsePrice(item.priceLabel), 0);

  function sync() {
    props.onChange(readBag());
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-pink-200/75">Altar tray</p>
          <h2 className="mt-2 font-serif text-4xl text-stone-50">
            {props.bag.length === 0 ? "Empty tray" : `${props.bag.length} staged rituals`}
          </h2>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200">
          local beta state
        </div>
      </div>

      <div className="space-y-3">
        {props.bag.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-stone-300">
            Add goods from the shop to stage a basket. Live items route into the full ritual.
          </div>
        ) : (
          props.bag.map((item, index) => (
            <div
              key={`${item.slug}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-serif text-2xl text-stone-50">{item.title}</div>
                  <div className="mt-2 text-sm text-stone-300">{item.priceLabel}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeFromBag(item.slug);
                    sync();
                  }}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-400">Estimated total</span>
          <span className="font-serif text-3xl text-stone-50">${total.toFixed(2)}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={props.liveCheckoutHref ?? "/quiz"}
            className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
          >
            Checkout live ritual
          </Link>
          <Link
            href={props.prototypeHref ?? "/collection"}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
          >
            Open prototype goods
          </Link>
          <button
            type="button"
            onClick={() => {
              clearBag();
              sync();
            }}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
          >
            Clear tray
          </button>
        </div>
      </div>
    </div>
  );
}
