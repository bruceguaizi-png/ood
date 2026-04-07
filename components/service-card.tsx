import Link from "next/link";

import { RitualCard } from "@/components/ritual-card";
import { type DivinationService } from "@/lib/site-content";

export function ServiceCard({ service }: { service: DivinationService }) {
  const href =
    service.status === "live"
      ? "/quiz"
      : service.status === "demo"
        ? "/report/demo-report?email=ritual%40ood.aura"
        : "/about";

  return (
    <RitualCard className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs uppercase tracking-[0.22em] text-stone-400">
          {service.status.replace("_", " ")}
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-200">
          {service.deliverable}
        </div>
      </div>
      <h3 className="font-serif text-3xl text-stone-50">{service.name}</h3>
      <p className="text-sm leading-7 text-stone-300">{service.blurb}</p>
      <div className="mt-auto pt-2">
        <Link
          href={href}
          className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100 transition hover:bg-white/8"
        >
          {service.cta}
        </Link>
      </div>
    </RitualCard>
  );
}
