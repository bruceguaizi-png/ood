import { SectionLabel } from "@/components/section-label";

export function PageHero(props: {
  eyebrow: string;
  title: string;
  body: string;
  side?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-6 py-7 sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,188,220,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(132,219,255,0.12),transparent_24%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_0.62fr] lg:items-end">
        <div className="space-y-4">
        <SectionLabel>{props.eyebrow}</SectionLabel>
        <h1 className="max-w-4xl font-serif text-5xl leading-[0.94] text-stone-50 sm:text-6xl">
          {props.title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-stone-300">{props.body}</p>
        </div>
        {props.side ? (
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
            {props.side}
          </div>
        ) : null}
        <div className="pointer-events-none absolute right-8 top-8 hidden h-24 w-24 rounded-full border border-white/8 lg:block" />
        <div className="pointer-events-none absolute bottom-8 right-16 hidden h-10 w-10 rounded-full border border-amber-200/12 lg:block" />
      </div>
    </section>
  );
}
