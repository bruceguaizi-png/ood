export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.42em] text-cyan-100/78">
      <span className="h-px w-6 bg-gradient-to-r from-cyan-200/10 to-cyan-200/75" />
      {children}
    </p>
  );
}
