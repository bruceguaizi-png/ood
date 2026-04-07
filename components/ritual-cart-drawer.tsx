"use client";

import { useState } from "react";

import { RitualBagPanel } from "@/components/ritual-bag-panel";
import { readBag, type BagItem } from "@/lib/client/ritual-bag";
import { type ProductCard } from "@/lib/site-content";

export function RitualCartDrawer(props: {
  selected: ProductCard;
}) {
  const [open, setOpen] = useState(false);
  const [bag, setBag] = useState<BagItem[]>(() => readBag());

  function refresh() {
    setBag(readBag());
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          refresh();
          setOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 rounded-full border border-pink-300/25 bg-pink-300/16 px-5 py-3 text-sm font-medium text-pink-50 shadow-[0_18px_60px_rgba(0,0,0,0.3)] backdrop-blur"
      >
        Ritual bag · {bag.length}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm">
          <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#070910] p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-stone-200"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-auto pr-1">
              <RitualBagPanel
                bag={bag}
                onChange={setBag}
                mode="drawer"
                liveCheckoutHref={props.selected.live ? "/quiz" : "/quiz"}
                prototypeHref={props.selected.live ? "/collection" : "/collection"}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
