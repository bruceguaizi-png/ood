import Link from "next/link";

import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { RitualCard } from "@/components/ritual-card";
import { RitualCartDrawer } from "@/components/ritual-cart-drawer";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";
import { ShopCatalogClient } from "@/components/shop-catalog-client";
import { shopProducts } from "@/lib/site-content";

type ShopPageProps = {
  searchParams: Promise<{ product?: string }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { product } = await searchParams;
  const selected = shopProducts.find((item) => item.slug === product) ?? shopProducts[0];

  return (
    <Shell className="space-y-12" activeHref="/shop">
      <PageHero
        eyebrow="Digital goods"
        title="A shop designed for emotional artifacts, not generic SKUs."
        body="The first release keeps commerce intentionally narrow: fewer products, stronger identity, and clearer emotional reasons to buy."
        side={
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Featured product</p>
            <p className="font-serif text-4xl text-stone-50">{selected.title}</p>
            <p className="text-sm leading-7 text-stone-300">{selected.description}</p>
          </div>
        }
      />

      <section className="grid gap-5 lg:grid-cols-4">
        {shopProducts.map((productCard) => (
          <ProductCard key={productCard.slug} product={productCard} />
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <RitualCard className="space-y-4">
          <SectionLabel>Selected detail</SectionLabel>
          <h2 className="font-serif text-4xl text-stone-50">{selected.title}</h2>
          <p className="text-sm leading-7 text-stone-300">{selected.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-stone-300">
              Price: {selected.priceLabel}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-stone-300">
              Mood: {selected.mood}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={selected.live ? "/quiz" : "/collection"}
              className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
            >
              {selected.live ? "Buy via live flow" : "See related collectible"}
            </Link>
            <Link
              href="/profile"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
            >
              View cart / profile state
            </Link>
          </div>
        </RitualCard>

        <ShopCatalogClient products={shopProducts} selectedSlug={selected.slug} />
      </section>

      <RitualCartDrawer selected={selected} />
    </Shell>
  );
}
