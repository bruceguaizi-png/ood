import Link from "next/link";

import { RitualCard } from "@/components/ritual-card";
import { type ProductCard as ProductCardType } from "@/lib/site-content";

export function ProductCard({ product }: { product: ProductCardType }) {
  return (
    <RitualCard className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-stone-400">{product.type}</p>
          <h3 className="mt-2 font-serif text-3xl text-stone-50">{product.title}</h3>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-sm text-stone-100">
          {product.priceLabel}
        </div>
      </div>
      <p className="text-sm leading-7 text-stone-300">{product.description}</p>
      <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">{product.mood}</p>
      <div className="mt-auto pt-2">
        <Link
          href={product.live ? "/quiz" : `/shop?product=${product.slug}`}
          className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
        >
          {product.live ? "Open live flow" : "View product"}
        </Link>
      </div>
    </RitualCard>
  );
}
