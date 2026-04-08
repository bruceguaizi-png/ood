import Link from "next/link";

import { cn } from "@/lib/utils";

export function NavPill(props: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={props.href}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition backdrop-blur-sm",
        props.active
          ? "border-amber-200/35 bg-amber-100/10 text-amber-50 shadow-[0_0_18px_rgba(255,221,168,0.16)]"
          : "border-white/10 bg-white/[0.03] text-stone-300 hover:border-cyan-200/25 hover:bg-white/8 hover:text-stone-100",
      )}
    >
      {props.label}
    </Link>
  );
}
