import Link from "next/link";
import type { ReactNode } from "react";
import clsx from "clsx";

/** Category filter chips (server-rendered links, shareable URLs). */
export function CategoryChips({ base, current, options, allLabel }: { base: string; current?: string; options: { value: string; label: string; count: number }[]; allLabel: string }) {
  const cls = (on: boolean) => clsx("inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-sm", on ? "border-carmine bg-blush text-carmine" : "border-line bg-white hover:border-carmine");
  return (
    <ul className="mb-8 flex flex-wrap gap-2">
      <li><Link href={base} className={cls(!current)} aria-current={!current ? "true" : undefined}>{allLabel}</Link></li>
      {options.map((o) => <li key={o.value}><Link href={`${base}?category=${o.value}`} className={cls(current === o.value)} aria-current={current === o.value ? "true" : undefined}>{o.label} <span className="text-xs text-stone">{o.count}</span></Link></li>)}
    </ul>
  );
}

export function Grid({ children }: { children: ReactNode }) {
  return <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{children}</ul>;
}
