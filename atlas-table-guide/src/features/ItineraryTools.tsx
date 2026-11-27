"use client";

import { useState } from "react";
import { DownloadIcon, ShareIcon } from "@/components/ui/icons";
import { useApp } from "./providers";

/** Share (native or copy link), print/save as PDF, and ICS export for a chosen start date. */
export function ShareButton({ label, copied, title }: { label: string; copied: string; title: string }) {
  const { announce } = useApp();
  return (
    <button type="button" onClick={async () => {
      const url = window.location.href;
      if (navigator.share) { try { await navigator.share({ title, url }); return; } catch { /* cancelled */ } }
      try { await navigator.clipboard.writeText(url); announce(copied); } catch { announce(url); }
    }} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-line bg-white px-4 text-sm font-semibold hover:border-carmine">
      <ShareIcon size={18} /> {label}
    </button>
  );
}

export function ItineraryExport({ slug, locale }: { slug: string; locale: string }) {
  const [start, setStart] = useState("");
  return (
    <div className="no-print flex flex-wrap items-end gap-2">
      <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-line bg-white px-4 text-sm font-semibold hover:border-carmine"><DownloadIcon size={18} /> PDF</button>
      <form action="/api/itinerary-ics/" method="get" className="flex items-end gap-2">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="locale" value={locale} />
        <label className="text-xs text-stone">Start date
          <input type="date" name="start" required value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 block min-h-11 rounded-[8px] border border-line bg-white px-2 text-sm text-ink" />
        </label>
        <button type="submit" disabled={!start} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-line bg-white px-4 text-sm font-semibold hover:border-carmine disabled:opacity-50"><DownloadIcon size={18} /> .ics</button>
      </form>
    </div>
  );
}
