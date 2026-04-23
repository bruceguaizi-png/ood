import Link from "next/link";

export function PaywallCta(props: {
  sessionId: string;
  productSlug: string;
  title?: string;
  body?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="space-y-4 rounded-[26px] border border-pink-200/15 bg-[linear-gradient(180deg,rgba(255,192,203,0.09),rgba(255,255,255,0.02))] p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-pink-100/75">Paid Unlock</p>
        <h3 className="font-serif text-3xl text-stone-50">
          {props.title ?? "This layer opens after payment."}
        </h3>
        <p className="text-sm leading-7 text-stone-300">
          {props.body ??
            "The free flow gets the user to the cross-over report. Focused deep dives stay locked until the paid reading is purchased."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/shop/${props.productSlug}?session=${encodeURIComponent(props.sessionId)}`}
          className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
        >
          {props.primaryLabel ?? "Unlock paid reading"}
        </Link>
        <Link
          href="/report/demo-report"
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
        >
          {props.secondaryLabel ?? "See the free cross-over example"}
        </Link>
      </div>
    </div>
  );
}
