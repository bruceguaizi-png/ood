import { cn } from "@/lib/utils";

export function RitualCard(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_100px_rgba(0,0,0,0.35)] backdrop-blur",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
