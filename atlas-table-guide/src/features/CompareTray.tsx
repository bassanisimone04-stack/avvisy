"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "./providers";
import { CloseIcon } from "@/components/ui/icons";
import { compareHref } from "@/lib/compare-url";

/** Persistent comparison tray (bottom bar). State lives in localStorage (+ account when signed in). */
export function CompareTray({ locale, labels }: { locale: string; labels: { tray: string; go: string; remove: string; clearAll: string } }) {
  const { compare, toggleCompare, clearCompare } = useApp();
  const path = usePathname();
  if (!compare.length || path?.includes("/compare")) return null;
  return (
    <aside aria-label={labels.tray} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/98 shadow-[0_-8px_24px_rgba(26,20,21,.08)] backdrop-blur">
      <div className="container-page flex flex-wrap items-center gap-3 py-3">
        <p className="text-sm font-semibold">{labels.tray}</p>
        <ul className="flex flex-1 flex-wrap gap-2">
          {compare.map((c) => (
            <li key={c.slug} className="inline-flex items-center gap-1 rounded-full border border-line bg-ivory py-1 pl-3 pr-1 text-sm">
              {c.name}
              <button type="button" onClick={() => toggleCompare(c)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-sand" aria-label={`${labels.remove}: ${c.name}`}><CloseIcon size={14} /></button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={clearCompare} className="min-h-11 text-sm text-stone underline-offset-4 hover:underline">{labels.clearAll}</button>
        <Link href={compareHref(locale, compare.map((c) => c.slug))} className="inline-flex min-h-11 items-center rounded-[8px] bg-carmine px-5 text-sm font-semibold text-white hover:bg-red-700">{labels.go.replace("{n}", String(compare.length))}</Link>
      </div>
    </aside>
  );
}
