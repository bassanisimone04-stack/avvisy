"use client";

import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";

export default function FavoriteButton({ id, className = "" }: { id: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useStore();
  const active = isFavorite(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id);
      }}
      aria-pressed={active}
      aria-label={active ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 dark:bg-black/40 ${className}`}
    >
      <Heart size={17} className={active ? "animate-pop fill-accent text-accent" : "text-ink-soft"} />
    </button>
  );
}
