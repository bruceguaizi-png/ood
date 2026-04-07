import Link from "next/link";

export function RitualHero(props: {
  livePrice: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,132,213,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(108,223,255,0.18),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:68px_68px]" />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-pink-200/10" />
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10" />

      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Ritual entry space</p>
          <h1 className="max-w-4xl font-serif text-6xl leading-[0.9] text-stone-50 sm:text-7xl lg:text-8xl">
            Generate your base profile first, then decide where to go deeper.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
            You do not need to read a lot up front. Enter the essentials first, get a dedicated
            base profile, then move into one core conclusion and the track that fits you best.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-cyan-100"
            >
              Start the reading
            </Link>
            <Link
              href="/report/demo-report?email=ritual%40ood.aura"
              className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-100 transition hover:bg-white/8"
            >
              Open demo report
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Live unlock", value: props.livePrice },
              { label: "Primary asset", value: "Hexagram base profile" },
              { label: "Output shape", value: "Profile + summary + routing" },
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
            <p className="text-xs uppercase tracking-[0.22em] text-pink-200/75">Portal I</p>
            <div className="mt-3 font-serif text-4xl text-stone-50">Base profile</div>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Name, birthday, birth time, and city are calibrated into your base profile. It is
              the shared starting point for everything that follows.
            </p>
          </div>
          <div className="rounded-[28px] border border-cyan-300/18 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/75">Portal II</p>
            <div className="mt-3 font-serif text-4xl text-stone-50">Quick summary</div>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              You get one core conclusion first, then three follow-up insights worth exploring. No
              wall of text right away.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.22em] text-stone-400">Recommended next steps</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="font-serif text-4xl text-stone-50">Route first, then decide how deep to go</div>
                <p className="mt-2 max-w-lg text-sm leading-7 text-stone-300">
                  Relationship, personal growth, fortune upgrade, and goal alignment are all
                  recommended from your base profile. Card draw is just a lighter supporting move.
                </p>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-100">
                See the result first
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
