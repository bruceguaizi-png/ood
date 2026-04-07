import { SectionLabel } from "@/components/section-label";

export function PageHero(props: {
  eyebrow: string;
  title: string;
  body: string;
  side?: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_0.62fr] lg:items-end">
      <div className="space-y-4">
        <SectionLabel>{props.eyebrow}</SectionLabel>
        <h1 className="max-w-4xl font-serif text-5xl leading-[0.94] text-stone-50 sm:text-6xl">
          {props.title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-stone-300">{props.body}</p>
      </div>
      {props.side ? (
        <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
          {props.side}
        </div>
      ) : null}
    </section>
  );
}
