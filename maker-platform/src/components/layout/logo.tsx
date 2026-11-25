import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Placeholder wordmark until the brand is chosen: compass mark + name. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[22px]", className)} fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path d="M15.6 8.4 13.3 13.3 8.4 15.6l2.3-4.9z" fill="currentColor" />
      <circle cx="12" cy="12" r="1.1" fill="var(--color-ivory)" />
    </svg>
  );
}

export function Logo({ className, tone = "forest" }: { className?: string; tone?: "forest" | "ivory" }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2", tone === "forest" ? "text-forest" : "text-ivory", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark className="transition-transform duration-500 group-hover:rotate-45" />
      <span className="font-display text-[1.3125rem] leading-none font-[460] tracking-[-0.02em]">
        {siteConfig.name}
        <span className="text-clay">.</span>
      </span>
    </Link>
  );
}
