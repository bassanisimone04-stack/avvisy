import { cn } from "@/lib/utils";

/** Logotipo Avvisy: corsivo, blu. La dimensione si eredita dal contenitore. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-bold italic tracking-tight text-logo",
        className
      )}
    >
      Avvisy<span className="text-logo">.</span>
    </span>
  );
}
