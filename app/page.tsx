import { HomeQuickIntake } from "@/components/home-quick-intake";
import { Shell } from "@/components/shell";
import { TrackView } from "@/components/track-view";
import { TRACKING_EVENTS } from "@/lib/constants";

export default function Home() {
  return (
    <Shell className="space-y-8" activeHref="/" navMode="full">
      <TrackView event={TRACKING_EVENTS.landingView} />

      <section className="relative overflow-hidden rounded-[28px] border border-white/8 sm:rounded-[40px]">
        <div
          className="absolute inset-[-10%] bg-cover bg-center opacity-58 scale-[1.08]"
          style={{ backgroundImage: 'url(/home-hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,16,0.36),rgba(5,7,14,0.74))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,138,159,0.1),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(126,219,228,0.08),transparent_28%),radial-gradient(circle_at_56%_64%,rgba(253,208,119,0.06),transparent_26%)]" />
        <div className="absolute inset-0 opacity-12 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(4,7,14,0.42),transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,rgba(4,7,14,0.58),transparent)]" />

        <div className="relative space-y-6 px-3 py-4 sm:space-y-8 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <section className="mx-auto w-full max-w-[54rem]">
            <HomeQuickIntake />
          </section>

          <section className="mx-auto w-full max-w-[54rem] space-y-4">
            <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.38em] text-cyan-100/72">
              <span className="h-px w-5 bg-gradient-to-r from-cyan-200/10 to-cyan-200/75" />
              Full ritual intake
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                "One field. One breath.",
                "Signal first. Explanation second.",
                "Birth time and city stay ready here.",
                "Everything routes from the same base profile.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(7,10,18,0.3),rgba(7,10,18,0.12))] px-4 py-3 text-sm text-stone-300 backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </Shell>
  );
}
