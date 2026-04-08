import Link from "next/link";

import { NavPill } from "@/components/nav-pill";
import { APP_NAME, APP_TAGLINE, ENTERTAINMENT_DISCLAIMER } from "@/lib/constants";
import { siteNav } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export function Shell(props: {
  children: React.ReactNode;
  className?: string;
  activeHref?: string;
  navMode?: "full" | "minimal";
}) {
  const navItems =
    props.navMode === "minimal"
      ? siteNav.filter((item) => ["/divination", "/collection", "/profile"].includes(item.href))
      : siteNav;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(106,228,255,0.16),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(255,182,217,0.11),transparent_22%),linear-gradient(180deg,#090911_0%,#08060d_36%,#05060b_100%)] text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,rgba(4,5,10,0.08)_45%,rgba(4,5,10,0.44)_100%)]" />
      <a
        href="#main-content"
        className="absolute left-4 top-4 z-[60] -translate-y-20 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-950 transition focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-[calc(56px+var(--safe-bottom))] pt-[calc(24px+var(--safe-top))] sm:px-8 lg:px-12">
        <header className="mb-10 flex items-center justify-between gap-6">
          <Link href="/" className="group">
            <div className="text-[11px] uppercase tracking-[0.52em] text-cyan-200/80">
              {APP_NAME}
            </div>
            <div className="font-serif text-xl text-stone-100 transition group-hover:text-amber-100">
              {APP_TAGLINE}
            </div>
          </Link>

          <nav className="flex items-center gap-3 text-sm text-stone-300">
            <Link
              href="/quiz"
              className="hidden rounded-full border border-amber-200/20 bg-amber-100/10 px-4 py-2 text-amber-50 transition hover:bg-amber-100/16 lg:inline-flex"
            >
              Enter ritual
            </Link>
          </nav>
        </header>

        <div className="mb-8 flex flex-wrap gap-3">
          {navItems.map((item) => (
            <NavPill
              key={item.href}
              href={item.href}
              label={item.label}
              active={props.activeHref === item.href}
            />
          ))}
        </div>

        <main id="main-content" className={cn("flex-1", props.className)}>
          {props.children}
        </main>

        <footer className="mt-12 border-t border-white/10 pt-5 text-xs leading-6 text-stone-400">
          {ENTERTAINMENT_DISCLAIMER}
        </footer>
      </div>
    </div>
  );
}
