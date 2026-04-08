"use client";

import Link from "next/link";
import { useState } from "react";

import { RitualCard } from "@/components/ritual-card";
import { addToBag, readBag, type BagItem } from "@/lib/client/ritual-bag";
import { type ProductCard } from "@/lib/site-content";

export function ShopCatalogClient(props: {
  products: ProductCard[];
  selectedSlug: string;
}) {
  const [bag, setBag] = useState<BagItem[]>(() => readBag());

  return (
    <RitualCard className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Ritual bag</p>
          <h2 className="mt-2 text-balance font-serif text-3xl text-stone-50">
            {bag.length === 0 ? "No saved drops yet" : `${bag.length} saved items`}
          </h2>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200">
          local beta state
        </div>
      </div>

      <div className="grid gap-3">
        {props.products.map((product) => {
          const active = product.slug === props.selectedSlug;
          return (
            <div
              key={product.slug}
                  className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-pink-300/30 bg-pink-300/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-balance font-serif text-2xl text-stone-50">{product.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-400">
                    {product.type}
                  </div>
                </div>
                <div className="tabular-nums rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200">
                  {product.priceLabel}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/shop?product=${product.slug}`}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200 transition hover:bg-white/8"
                >
                  Inspect
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    addToBag({
                      slug: product.slug,
                      title: product.title,
                      priceLabel: product.priceLabel,
                    });
                    setBag(readBag());
                  }}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200 transition hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/45"
                >
                  Add to tray
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {bag.length > 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Saved items</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {bag.map((item, index) => (
              <div
                key={`${item.slug}-${index}`}
                className="tabular-nums rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200"
              >
                {item.title} · {item.priceLabel}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </RitualCard>
  );
}
