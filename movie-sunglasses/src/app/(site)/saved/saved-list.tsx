"use client";
import Link from "next/link";
import { GlassesArt } from "@/components/glasses";
import { MatchBadge } from "@/components/ui";
import { useModels } from "@/components/tray";
import { COMPARE_KEY, SAVED_KEY, toggleId, useList, writeList } from "@/lib/client-store";
import type { MatchType } from "@/lib/types";

export function SavedList() {
  const ids = useList(SAVED_KEY);
  const models = useModels(ids);
  if (ids.length === 0) return (
    <div className="rounded-2xl border border-dashed border-line p-10 text-center">
      <p className="font-display text-3xl font-semibold">No saved sunglasses yet</p>
      <p className="mx-auto mt-3 max-w-md text-slate">Press the heart on any model card to keep it here.</p>
      <Link href="/sunglasses" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-medium text-white hover:bg-champagne-text">Browse the catalog</Link>
    </div>
  );
  const ordered = ids.map((id) => models.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m);
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
        <span>{ids.length} saved</span>
        {ids.length >= 2 && <Link className="underline" href={`/compare?ids=${ids.slice(0, 3).join(",")}`} onClick={() => writeList(COMPARE_KEY, ids.slice(0, 3))}>Compare the first {Math.min(3, ids.length)}</Link>}
        <button type="button" className="underline" onClick={() => writeList(SAVED_KEY, [])}>Clear all</button>
      </div>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((m) => (
          <li key={m.id} className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
            <Link href={`/sunglasses/${m.slug}`} className="block">
              <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-b from-paper to-[#efece4] p-6">
                <GlassesArt shape={m.shape} frame={m.frame} lens={m.lens} className="w-full max-w-[240px]" />
                <div className="absolute left-3 top-3"><MatchBadge type={m.match as MatchType} /></div>
              </div>
              <div className="p-5"><p className="eyebrow">{m.brand}</p><h3 className="font-display text-2xl font-semibold leading-tight">{m.name}</h3></div>
            </Link>
            <div className="flex gap-4 px-5 pb-5 text-xs">
              <button type="button" className="underline" onClick={() => toggleId(COMPARE_KEY, m.id, 3)}>Add to compare</button>
              <button type="button" className="text-red-700 underline" onClick={() => toggleId(SAVED_KEY, m.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
