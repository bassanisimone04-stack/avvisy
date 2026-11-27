"use client";

import { useState } from "react";
import { SORTS, serializeFilters, type Filters, type Sort } from "@/lib/filters";
import { LocateIcon } from "@/components/ui/icons";
import { useDirectoryNav } from "./DirectoryShell";

export function SortSelect({ basePath, filters, labels, sortLabel }: { basePath: string; filters: Filters; labels: Record<Sort, string>; sortLabel: string }) {
  const navigate = useDirectoryNav();
  const go = (f: Filters) => { const qs = serializeFilters({ ...f, page: 1 }); navigate(`${basePath}${qs ? `?${qs}` : ""}`); };
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-stone">{sortLabel}</label>
      <select id="sort" value={filters.sort} onChange={(e) => go({ ...filters, sort: e.target.value as Sort })} className="min-h-11 rounded-[8px] border border-line bg-white px-2 text-sm">
        {SORTS.map((s) => <option key={s} value={s} disabled={s === "distance" && !filters.near}>{labels[s]}</option>)}
      </select>
    </div>
  );
}

/** Permission-gated geolocation: only requested on click; rounded to ~100 m before entering the URL. */
export function NearMeButton({ basePath, filters, labels }: { basePath: string; filters: Filters; labels: { nearMe: string; locating: string; geoDenied: string } }) {
  const navigate = useDirectoryNav();
  const [state, setState] = useState<"idle" | "locating" | "denied">("idle");
  return (
    <div className="flex items-center gap-2">
      <button type="button" disabled={state === "locating"} onClick={() => {
        if (!("geolocation" in navigator)) { setState("denied"); return; }
        setState("locating");
        navigator.geolocation.getCurrentPosition(
          (p) => { setState("idle"); const qs = serializeFilters({ ...filters, sort: "distance", near: { lat: +p.coords.latitude.toFixed(3), lng: +p.coords.longitude.toFixed(3) }, page: 1 }); navigate(`${basePath}?${qs}`); },
          () => setState("denied"),
          { timeout: 8000, maximumAge: 600000 },
        );
      }} className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-line bg-white px-3 text-sm hover:border-carmine">
        <LocateIcon size={18} /> {state === "locating" ? labels.locating : labels.nearMe}
      </button>
      {state === "denied" && <span role="alert" className="text-xs text-carmine">{labels.geoDenied}</span>}
    </div>
  );
}
