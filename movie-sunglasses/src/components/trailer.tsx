"use client";
import { useState } from "react";

/**
 * Click-to-load trailer. Nothing is requested from YouTube (no thumbnail, no cookies) until the visitor presses play,
 * and then the privacy-enhanced domain is used.
 */
export function Trailer({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl bg-ink" style={{ aspectRatio: "16/9" }}>
      {on ? (
        <iframe title={`${title}: official trailer`} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" className="h-full w-full border-0" />
      ) : (
        <button type="button" onClick={() => setOn(true)} className="on-dark flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,170,113,.3),transparent_65%)] text-white">
          <span aria-hidden className="flex h-16 w-16 items-center justify-center rounded-full border border-champagne text-2xl text-champagne">▶</span>
          <span className="font-display text-2xl font-semibold">Play the official trailer</span>
          <span className="text-xs text-white/65">Loads from YouTube only when you press play</span>
        </button>
      )}
    </div>
  );
}
