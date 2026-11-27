import { BRAND } from "@/config/brand";

/** Original compass rose whose north needle is a fork. Not a star, leaf or face. */
export function SelectionMark({ size = 18, className, title }: { size?: number; className?: string; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="-50 -64 100 114" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} fill="none" stroke="currentColor" strokeWidth={5}>
      <circle r="40" />
      <path d="M0,-28 L6,0 L0,28 L-6,0 Z" fill="currentColor" stroke="none" />
      <path d="M-28,0 L0,-5 L28,0 L0,5 Z" fill="currentColor" stroke="none" opacity="0.55" />
      <path d="M-7,-62 L-7,-49 M0,-62 L0,-49 M7,-62 L7,-49 M-7,-49 Q0,-42 7,-49 M0,-46 L0,-36" strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}

/** Wordmark: bold uppercase sans, cream on red / red on ivory. Text comes from BRAND. */
export function Logo({ variant = "light", className }: { variant?: "light" | "dark" | "mark"; className?: string }) {
  const color = variant === "light" ? "text-sand" : "text-carmine";
  if (variant === "mark") return <SelectionMark size={28} className={color} title={BRAND.name} />;
  return <span className={`whitespace-nowrap font-sans text-[17px] font-bold uppercase tracking-[0.05em] sm:text-[19px] ${color} ${className ?? ""}`}>{BRAND.name}</span>;
}
