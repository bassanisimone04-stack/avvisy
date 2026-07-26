import { Star } from "lucide-react";

export default function RatingStars({ rating, size = 15 }: { rating: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`Valutazione ${rating} su 5`}>
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
