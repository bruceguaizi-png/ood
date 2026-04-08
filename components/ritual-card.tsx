import { cn } from "@/lib/utils";

export function RitualCard(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.38)] backdrop-blur",
        props.className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%)] opacity-70" />
      <div className="pointer-events-none absolute right-5 top-5 h-12 w-12 rounded-full border border-white/8 opacity-60" />
      <div className="relative">{props.children}</div>
    </div>
  );
}
