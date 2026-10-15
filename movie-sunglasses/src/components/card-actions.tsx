"use client";
import { useState } from "react";
import { COMPARE_KEY, COMPARE_MAX, SAVED_KEY, toggleId, useList } from "@/lib/client-store";

const btn = "flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 shadow-sm backdrop-blur transition hover:scale-110 focus-visible:scale-110";

/** Save + compare buttons overlaid on a model card (siblings of the card link, never nested in it). */
export function CardActions({ id, name }: { id: string; name: string }) {
  const saved = useList(SAVED_KEY).includes(id);
  const compared = useList(COMPARE_KEY).includes(id);
  const [msg, setMsg] = useState("");
  return (
    <div className="absolute right-3 top-3 z-10 flex gap-2">
      <button type="button" aria-pressed={saved} aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`} title={saved ? "Saved" : "Save"}
        onClick={() => { toggleId(SAVED_KEY, id); }} className={`${btn} ${saved ? "border-champagne text-champagne-text" : "border-line text-slate"}`}>
        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-4.6-9.3-9A5.3 5.3 0 0 1 12 6.6 5.3 5.3 0 0 1 21.3 12C19 16.4 12 21 12 21Z" strokeLinejoin="round" /></svg>
      </button>
      <button type="button" aria-pressed={compared} aria-label={compared ? `Remove ${name} from comparison` : `Compare ${name}`} title={compared ? "In comparison" : "Compare"}
        onClick={() => { setMsg(toggleId(COMPARE_KEY, id, COMPARE_MAX) === "full" ? `You can compare up to ${COMPARE_MAX} models.` : ""); }} className={`${btn} ${compared ? "border-ink bg-ink text-white" : "border-line text-slate"}`}>
        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 4v16M16 4v16M4 8h8M12 16h8" /></svg>
      </button>
      <span role="status" className="sr-only">{msg}</span>
    </div>
  );
}
