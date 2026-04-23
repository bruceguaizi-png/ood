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
        "shrink-0 rounded-full border px-4 py-2.5 text-sm transition backdrop-blur-md",
        props.active
          ? "border-white/20 bg-[linear-gradient(135deg,rgba(255,125,105,0.22),rgba(138,224,228,0.2))] text-stone-50 shadow-[0_10px_30px_rgba(255,125,105,0.16)]"
          : "border-white/8 bg-white/[0.035] text-stone-300 hover:border-white/16 hover:bg-[linear-gradient(135deg,rgba(255,125,105,0.1),rgba(138,224,228,0.12))] hover:text-stone-100",
      )}
    >
      {props.label}
    </Link>
  );
}
