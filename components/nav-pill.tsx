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
        "rounded-full border px-4 py-2 text-sm transition",
        props.active
          ? "border-pink-300/30 bg-pink-300/12 text-pink-100"
          : "border-white/10 text-stone-300 hover:bg-white/8",
      )}
    >
      {props.label}
    </Link>
  );
}
