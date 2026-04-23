import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CheckoutButton } from "@/components/checkout-button";
import { RitualCard } from "@/components/ritual-card";
import { SectionLabel } from "@/components/section-label";
import { Shell } from "@/components/shell";
import { getSession } from "@/lib/server/store";
import { shopProducts } from "@/lib/site-content";
import { subReportBlueprints, type SubReportSlug } from "@/lib/sub-report-blueprints";

type SubReportPageProps = {
  params: Promise<{ product: string }>;
  searchParams: Promise<{ session?: string }>;
};

function previewImageFor(product: SubReportSlug) {
  if (product === "relationship-deep-dive") return "/sub-report-relationship.jpg";
  if (product === "career-deep-dive") return "/sub-report-career.jpg";
  if (product === "money-deep-dive") return "/sub-report-personal-growth.jpg";
  return "/sub-report-health.jpg";
}

function skuCodeForProduct(product: SubReportSlug) {
  if (product === "relationship-deep-dive") return "crossover-relationship" as const;
  if (product === "career-deep-dive") return "crossover-career" as const;
  if (product === "money-deep-dive") return "crossover-money" as const;
  return "crossover-healing" as const;
}

export default async function SubReportPage({ params, searchParams }: SubReportPageProps) {
  const { product } = await params;
  const { session: sessionId } = await searchParams;
  const selected = shopProducts.find((item) => item.slug === product && item.type === "report");

  if (!selected) notFound();

  const blueprint = subReportBlueprints[selected.slug as SubReportSlug];
  if (!blueprint) notFound();
  const intakeSession = sessionId ? await getSession(sessionId) : null;

  return (
    <Shell className="space-y-12" activeHref="/shop">
      <section className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.018))] px-6 py-7 sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,132,108,0.16),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(126,219,228,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_55%)]" />
        <div className="pointer-events-none absolute left-[10%] top-[14%] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,132,108,0.14),transparent_64%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[10%] top-[12%] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(126,219,228,0.16),transparent_62%)] blur-3xl" />

        <div className="relative space-y-4">
          <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400/90">
            Field preview
          </p>
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#0b1018] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(128,220,228,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,150,120,0.12),transparent_24%)]" />
            <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#f4efe7]">
              <Image
                src={previewImageFor(selected.slug as SubReportSlug)}
                alt={`${blueprint.shortTitle} field preview`}
                width={1200}
                height={800}
                sizes="(min-width: 1024px) 960px, 100vw"
                className="h-[250px] w-full object-contain bg-[#f4efe7] p-4"
              />
            </div>
            <div className="pointer-events-none absolute right-8 top-6 h-24 w-24 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute bottom-10 right-8 h-10 w-10 rounded-full border border-[#ff9d87]/25" />
          </div>
          <div className="space-y-2">
            <p className="font-serif text-[1.95rem] leading-[1.04] text-stone-50">
              {blueprint.shortTitle}
            </p>
            <p className="text-sm leading-7 text-stone-300/92">{blueprint.premise}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl">
        <RitualCard className="space-y-8 px-7 py-7 sm:px-8 sm:py-8">
          <SectionLabel>{blueprint.shortTitle}</SectionLabel>
          <div className="space-y-3">
            <h2 className="text-balance font-serif text-[2.85rem] leading-[0.98] text-stone-50">
              {selected.title}
            </h2>
            <p className="max-w-4xl text-[15px] leading-8 text-stone-300/92">
              {selected.description}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Price</p>
              <p className="mt-4 tabular-nums text-[2rem] text-stone-100">{selected.priceLabel}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">
                per reading
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-stone-400">Mood</p>
              <p className="mt-4 max-w-sm text-[15px] leading-8 text-stone-300">{selected.mood}</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4 rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/75">Based on</p>
              <div className="space-y-4 text-[15px] leading-8 text-stone-300">
                {blueprint.basedOn.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-pink-100/75">Outputs</p>
              <div className="space-y-4 text-[15px] leading-8 text-stone-300">
                {blueprint.output.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">
              How this should feel
            </p>
            <p className="mt-4 max-w-4xl text-[15px] leading-8 text-stone-300">{blueprint.guidance}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            {intakeSession?.email ? (
              <CheckoutButton
                session={intakeSession}
                price={299}
                skuCode={skuCodeForProduct(selected.slug as SubReportSlug)}
                label={`Unlock ${selected.title} for ${selected.priceLabel}`}
              />
            ) : (
              <Link
                href="/quiz"
                className="inline-flex min-h-[56px] items-center rounded-full bg-stone-100 px-7 text-base font-semibold text-stone-950 shadow-[0_14px_36px_rgba(255,255,255,0.12)] transition hover:bg-cyan-100"
              >
                Start with free reading first
              </Link>
            )}
            <Link
              href="/"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Return to entry
            </Link>
          </div>
          {!intakeSession?.email ? (
            <p className="text-sm leading-7 text-stone-400">
              Paid checkout only opens after the user completes the free ritual and unlocks the
              cross-over layer with an email.
            </p>
          ) : null}
        </RitualCard>
      </section>
    </Shell>
  );
}
