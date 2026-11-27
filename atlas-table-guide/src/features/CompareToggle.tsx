"use client";

import clsx from "clsx";
import { useApp } from "./providers";

export function CompareToggle({ slug, name, label, fullMsg, className, variant = "overlay" }: { slug: string; name: string; label: string; fullMsg: string; className?: string; variant?: "overlay" | "inline" }) {
  const { compare, toggleCompare, announce } = useApp();
  const on = compare.some((c) => c.slug === slug);
  const id = `cmp-${slug}-${variant}`;
  return (
    <label
      htmlFor={id}
      onClick={(e) => e.stopPropagation()}
      className={clsx(
        "inline-flex min-h-9 cursor-pointer select-none items-center gap-2 text-sm font-medium",
        variant === "overlay" ? "rounded-[6px] bg-white/95 px-2.5 py-1 text-ink shadow-card" : "rounded-[8px] border border-line bg-white px-4 min-h-11",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={on}
        onChange={() => { const ok = toggleCompare({ slug, name }); if (!ok) announce(fullMsg); }}
        className="h-4 w-4 accent-[var(--red-600)]"
        aria-label={`${label}: ${name}`}
      />
      <span aria-hidden="true">{label}</span>
    </label>
  );
}
