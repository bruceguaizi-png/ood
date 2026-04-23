import Image from "next/image";
import Link from "next/link";

import { RitualCard } from "@/components/ritual-card";
import { type ProductCard as ProductCardType } from "@/lib/site-content";

function StandardCover({ slug }: { slug: string }) {
  const coverClass = slug.includes("wealth")
    ? "bg-[radial-gradient(circle_at_26%_72%,rgba(255,135,112,0.92),transparent_24%),radial-gradient(circle_at_72%_30%,rgba(152,220,221,0.8),transparent_24%),linear-gradient(135deg,#14131b_0%,#0b1016_46%,#121923_100%)]"
    : "bg-[radial-gradient(circle_at_28%_24%,rgba(255,124,104,0.84),transparent_22%),radial-gradient(circle_at_70%_36%,rgba(139,220,228,0.72),transparent_26%),linear-gradient(145deg,#15161d_0%,#10131a_52%,#0a0d13_100%)]";

  return (
    <div className={`relative min-h-[270px] overflow-hidden rounded-[28px] border border-white/8 ${coverClass}`}>
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="absolute left-[12%] top-[12%] h-40 w-40 rounded-full border border-white/18" />
      <div className="absolute right-[12%] top-[18%] h-28 w-28 rounded-full border border-white/12" />
      <div className="absolute bottom-[16%] left-[14%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_70%)] blur-xl" />
      <div className="absolute bottom-4 left-4 rounded-full border border-white/12 bg-black/18 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-stone-100/88 backdrop-blur-sm">
        report
      </div>
    </div>
  );
}

function ImageCover(props: { src: string; alt: string }) {
  return (
    <div className="relative min-h-[270px] overflow-hidden rounded-[28px] border border-white/8 bg-[#f1ebe2]">
      <Image
        src={props.src}
        alt={props.alt}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-stone-900/80 backdrop-blur-sm">
        report
      </div>
    </div>
  );
}

function ProductCover({ product }: { product: ProductCardType }) {
  if (product.slug === "relationship-deep-dive") {
    return <ImageCover src="/relationship-cover.jpg" alt="Relationship cover art" />;
  }

  if (product.slug === "career-deep-dive") {
    return <ImageCover src="/career-cover.jpg" alt="Career cover art" />;
  }

  if (product.slug === "money-deep-dive") {
    return <ImageCover src="/money-cover.jpg" alt="Money cover art" />;
  }

  if (product.slug === "healing-deep-dive") {
    return <ImageCover src="/healing-personality-cover.jpg" alt="Healing and personality cover art" />;
  }

  return <StandardCover slug={product.slug} />;
}

export function ProductCard({ product }: { product: ProductCardType }) {
  return (
    <RitualCard className="flex h-full flex-col gap-5 border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.016))] p-5">
      <ProductCover product={product} />

      <div className="space-y-4">
        <div className="min-h-[8.75rem] max-w-[15rem]">
          <h3 className="text-balance font-serif text-[1.9rem] leading-[1.08] text-stone-50">
            {product.title}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-4">
          <p className="max-w-[10rem] text-xs uppercase tracking-[0.2em] leading-6 text-stone-400/90">
            {product.mood}
          </p>
          <div className="shrink-0 rounded-[22px] border border-white/10 bg-white/[0.04] px-3 py-2 text-right">
            <div className="tabular-nums text-base text-stone-100">{product.priceLabel}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-stone-400">
              per reading
            </div>
          </div>
        </div>
      </div>

      <p className="text-[15px] leading-7 text-stone-300">{product.description}</p>

      <div className="mt-auto pt-1">
        <Link
          href={`/shop/${product.slug}`}
          className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-stone-100 transition hover:border-white/16 hover:bg-white/[0.08]"
        >
          View Details
        </Link>
      </div>
    </RitualCard>
  );
}
