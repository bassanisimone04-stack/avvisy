"use client";

import clsx from "clsx";
import { HeartIcon } from "@/components/ui/icons";
import { useApp } from "./providers";

export function FavouriteButton({ itemKey, name, labels, className, variant = "overlay" }: { itemKey: string; name: string; labels: { add: string; remove: string; saved: string; save: string }; className?: string; variant?: "overlay" | "inline" }) {
  const { favourites, toggleFavourite, announce } = useApp();
  const on = favourites.includes(itemKey);
  const label = `${on ? labels.remove : labels.add}: ${name}`;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavourite(itemKey); announce(on ? `${labels.remove}: ${name}` : `${labels.saved}: ${name}`); }}
      className={clsx(
        variant === "overlay"
          ? "grid h-11 w-11 place-items-center rounded-full bg-white/95 text-carmine shadow-card hover:bg-white"
          : "inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-carmine bg-white px-4 text-sm font-semibold text-carmine hover:bg-blush",
        className,
      )}
    >
      <HeartIcon filled={on} />
      {variant === "inline" && <span>{on ? labels.saved : labels.save}</span>}
    </button>
  );
}
