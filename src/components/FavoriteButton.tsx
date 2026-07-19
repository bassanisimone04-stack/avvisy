"use client";

import { useState } from "react";
import { useFavorites } from "@/lib/store";
import { notify } from "./Toaster";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20s-7-4.5-9.2-9C1.3 8 2.6 5 5.6 5c1.9 0 3.2 1.1 4 2.2.8-1.1 2.1-2.2 4-2.2 3 0 4.3 3 2.8 6-2.2 4.5-9.2 9-9.2 9z" />
    </svg>
  );
}

export default function FavoriteButton({
  lotId,
  variant = "overlay",
}: {
  lotId: string;
  variant?: "overlay" | "inline";
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(lotId);
  const [bump, setBump] = useState(false);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggle(lotId);
    notify(active ? "Rimosso dai lotti salvati." : "Lotto salvato nei preferiti.");
    setBump(true);
    setTimeout(() => setBump(false), 450);
  }

  const heart = <span className={bump ? "inline-flex animate-pop" : "inline-flex"}><HeartIcon filled={active} /></span>;

  if (variant === "inline") {
    return (
      <button onClick={onClick} className="btn btn-outline btn-sm w-full" aria-pressed={active}>
        <span className={active ? "text-brand" : ""}>{heart}</span>
        {active ? "Salvato" : "Salva lotto"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={active ? "Rimuovi dai preferiti" : "Salva nei preferiti"}
      aria-pressed={active}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface/95 shadow-sm transition-colors hover:scale-110 ${
        active ? "text-brand" : "text-muted hover:text-ink"
      }`}
    >
      {heart}
    </button>
  );
}
