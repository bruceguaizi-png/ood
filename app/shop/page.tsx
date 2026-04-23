import { PageHero } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { RitualCartDrawer } from "@/components/ritual-cart-drawer";
import { Shell } from "@/components/shell";
import { shopProducts } from "@/lib/site-content";
import { subReportBlueprints, type SubReportSlug } from "@/lib/sub-report-blueprints";

type ShopPageProps = {
  searchParams: Promise<{ product?: string }>;
};
export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { product } = await searchParams;
  const displayProducts = shopProducts.filter(
    (item): item is (typeof shopProducts)[number] & { slug: SubReportSlug } => item.type === "report",
  );
  const selected = displayProducts.find((item) => item.slug === product) ?? displayProducts[0];
  const blueprint = subReportBlueprints[selected.slug];

  return (
    <Shell className="space-y-12" activeHref="/shop">
      <PageHero
        eyebrow="Paid Sub-Reports"
        title="Choose the next field to deepen."
        body="Each paid report is not a separate horoscope. It branches out from the same intake data and the Cross Over synthesis the user already opened."
        side={
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Selected field</p>
            <p className="font-serif text-4xl text-stone-50">{blueprint.shortTitle}</p>
            <p className="text-sm leading-7 text-stone-300">{blueprint.premise}</p>
          </div>
        }
      />

      <section className="mx-auto grid w-full max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-4">
        {displayProducts.map((productCard) => (
          <ProductCard key={productCard.slug} product={productCard} />
        ))}
      </section>

      <RitualCartDrawer selected={selected} />
    </Shell>
  );
}
