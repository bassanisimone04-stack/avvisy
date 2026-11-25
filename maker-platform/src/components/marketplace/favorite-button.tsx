"use client";

import { Heart } from "lucide-react";
import { actions, isFavorite, useLocalState, type FavoriteRef } from "@/features/local-state/store";
import { cn } from "@/lib/utils";

export function FavoriteButton({ item, label, className, variant = "float" }: { item: FavoriteRef; label: string; className?: string; variant?: "float" | "inline" }) {
  const s = useLocalState();
  const on = isFavorite(s, item);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? `Remove ${label} from favorites` : `Save ${label} to favorites`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        actions.toggleFavorite(item);
      }}
      className={cn(
        "inline-flex items-center justify-center transition-colors",
        variant === "float"
          ? "size-9 rounded-full bg-ivory/90 text-forest shadow-hairline backdrop-blur-[2px] hover:bg-white"
          : "h-11 gap-2 rounded-sm border border-line-strong bg-white/60 px-4 text-sm font-medium text-forest hover:border-forest",
        className,
      )}
    >
      <Heart className={cn("size-4 transition-transform", on && "scale-110 fill-clay text-clay-ink")} aria-hidden />
      {variant === "inline" ? <span>{on ? "Saved" : "Save"}</span> : null}
    </button>
  );
}
