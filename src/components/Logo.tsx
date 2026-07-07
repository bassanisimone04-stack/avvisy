import { cn } from "@/lib/utils";

/** Logotipo Avvisy: corsivo (script), blu elettrico. La dimensione si
 * eredita dal contenitore; lo script rende bene un filo più grande. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-script font-bold leading-none tracking-[0.06em] text-logo",
        className
      )}
    >
      Avvisy
    </span>
  );
}
