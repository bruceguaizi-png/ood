import Link from "next/link";

export function RitualHero(props: {
  livePrice: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,132,213,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(108,223,255,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:68px_68px]" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-200/10" />
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10" />
      <div className="absolute left-[12%] top-[16%] h-2 w-2 rounded-full bg-amber-100/80 shadow-[0_0_18px_rgba(255,243,200,0.7)]" />
      <div className="absolute right-[18%] top-[22%] h-1.5 w-1.5 rounded-full bg-cyan-100/70 shadow-[0_0_16px_rgba(166,237,255,0.6)]" />
      <div className="absolute bottom-[20%] left-[22%] h-1.5 w-1.5 rounded-full bg-pink-100/70 shadow-[0_0_16px_rgba(255,188,220,0.6)]" />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.34em] text-cyan-200/80">Oracle gate / paid beta</p>
          <h1 className="max-w-4xl font-serif text-6xl leading-[0.9] text-stone-50 sm:text-7xl lg:text-8xl">
            Ask once.
            <br />
            Receive the sign.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
            O.O.D turns your birth signal into a ritual artifact: one core message, three clean
            insights, and the next gate that wants your attention.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
            >
              Open my reading
            </Link>
            <Link
              href="/report/demo-report?email=ritual%40ood.aura"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
            >
              See a sample omen
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Live unlock", value: props.livePrice },
              { label: "Ritual core", value: "Birth signal" },
              { label: "You receive", value: "1 omen + 3 clues" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
              >
                <div className="text-[11px] uppercase tracking-[0.24em] text-stone-400">
                  {item.label}
                </div>
                <div className="mt-2 font-serif text-2xl text-stone-50">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-pink-300/18 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-pink-200/75">Seal I</p>
            <div className="mt-3 font-serif text-4xl text-stone-50">Name the seeker</div>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Name, birthday, time, and city open the chart. The ritual starts once the pattern has
              enough signal to answer back.
            </p>
          </div>
          <div className="rounded-[28px] border border-cyan-300/18 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/75">Seal II</p>
            <div className="mt-3 font-serif text-4xl text-stone-50">Receive the omen</div>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              First comes the sentence that matters. Then three shorter clues. The wall of text can
              wait until you want more depth.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">After the first sign</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-serif text-4xl text-stone-50">Follow the gate that calls you</div>
                <p className="mt-2 max-w-lg text-sm leading-7 text-stone-300">
                  Love, alignment, fortune, and self-direction all branch from the same base chart.
                  Extra tests stay light, like side omens around the main ritual.
                </p>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100">
                Result first
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
