import Link from "next/link";

import { NavPill } from "@/components/nav-pill";
import { APP_NAME, APP_TAGLINE, ENTERTAINMENT_DISCLAIMER } from "@/lib/constants";
import { siteNav } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function Shell(props: {
  children: React.ReactNode;
  className?: string;
  activeHref?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(106,228,255,0.18),transparent_28%),linear-gradient(180deg,#090911_0%,#08060d_36%,#05060b_100%)] text-stone-100">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-14 pt-6 sm:px-8 lg:px-12">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="group">
            <div className="text-xs uppercase tracking-[0.4em] text-cyan-200/80">
              {APP_NAME}
            </div>
            <div className="font-serif text-lg text-stone-100 transition group-hover:text-pink-200">
              {APP_TAGLINE}
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-sm text-stone-300">
            <Link
              href="/quiz"
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10 lg:inline-flex"
            >
              Begin ritual
            </Link>
          </nav>
        </header>

        <div className="mb-8 flex flex-wrap gap-3">
          {siteNav.map((item) => (
            <NavPill
              key={item.href}
              href={item.href}
              label={item.label}
              active={props.activeHref === item.href}
            />
          ))}
        </div>

        <main className={cn("flex-1", props.className)}>{props.children}</main>

        <footer className="mt-12 border-t border-white/10 pt-5 text-xs leading-6 text-stone-400">
          {ENTERTAINMENT_DISCLAIMER}
        </footer>
      </div>
    </div>
  );
}
