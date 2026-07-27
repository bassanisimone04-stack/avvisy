import { Star } from "lucide-react";
import type { Locale } from "@/lib/i18n/locale";

export default function RatingStars({ rating, size = 15, locale = "it" }: { rating: number; size?: number; locale?: Locale }) {
  const label = locale === "en" ? `Rating ${rating} out of 5` : `Valutazione ${rating} su 5`;
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={label}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            size={size}
            className={filled ? "fill-[var(--gf-gold)] text-[var(--gf-gold)]" : "text-[var(--gf-line-strong)]"}
          />
        );
      })}
    </div>
  );
}
