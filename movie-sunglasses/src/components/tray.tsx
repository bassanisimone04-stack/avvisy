"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { COMPARE_KEY, SAVED_KEY, useList, writeList } from "@/lib/client-store";

export interface ModelLite { id: string; slug: string; name: string; brand: string; match: string; shape: string; frame: string; lens: string }

export function useModels(ids: string[]): ModelLite[] {
  const key = ids.join(",");
  const [models, setModels] = useState<ModelLite[]>([]);
  useEffect(() => {
    if (!key) { setModels([]); return; }
    let live = true;
    fetch(`/api/models?ids=${encodeURIComponent(key)}`).then((r) => r.json()).then((d) => { if (live) setModels(d.models ?? []); }).catch(() => {});
    return () => { live = false; };
  }, [key]);
  return models;
}

/** Floating comparison tray: appears once at least one model is selected. */
export function CompareTray() {
  const ids = useList(COMPARE_KEY);
  const models = useModels(ids);
  if (ids.length === 0) return null;
  return (
    <aside aria-label="Comparison" className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-2xl flex-wrap items-center gap-3 rounded-2xl border border-line bg-white p-3 pl-4 shadow-2xl">
      <p className="text-sm font-medium">Compare <span className="text-mist">({ids.length}/3)</span></p>
      <ul className="flex min-w-0 flex-1 flex-wrap gap-2">
        {ids.map((id) => {
          const m = models.find((x) => x.id === id);
          return (
            <li key={id} className="flex items-center gap-1 rounded-full bg-paper py-1 pl-3 pr-1 text-xs">
              <span className="max-w-[9rem] truncate">{m?.name ?? id}</span>
              <button type="button" aria-label={`Remove ${m?.name ?? id} from comparison`} onClick={() => writeList(COMPARE_KEY, ids.filter((x) => x !== id))} className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-line">×</button>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={() => writeList(COMPARE_KEY, [])} className="text-xs text-slate underline">Clear</button>
      {ids.length >= 2
        ? <Link href={`/compare?ids=${ids.join(",")}`} className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white hover:bg-champagne-text">Compare now</Link>
        : <span className="text-xs text-mist">Add one more to compare</span>}
    </aside>
  );
}

export function SavedLink({ className = "" }: { className?: string }) {
  const n = useList(SAVED_KEY).length;
  return (
    <Link href="/saved" aria-label={`Saved sunglasses (${n})`} className={`relative ${className}`}>
      <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill={n ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12C19 16.4 12 21 12 21Z" strokeLinejoin="round" /></svg>
      {n > 0 && <span aria-hidden className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-white">{n}</span>}
    </Link>
  );
}
