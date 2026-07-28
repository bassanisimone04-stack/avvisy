import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import RatingStars from "./RatingStars";

export default function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = t.name.split(" ").map((p) => p[0]).join("");
  return (
    <div className="card card-soft flex h-full flex-col gap-4 p-6">
      <Quote size={26} className="text-brand-soft" fill="currentColor" />
      <p className="flex-1 text-sm leading-relaxed text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center gap-3 pt-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">
          {initials}
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{t.name}</p>
          <p className="text-xs text-muted">{t.role}</p>
        </div>
        <div className="ml-auto"><RatingStars rating={t.rating} size={13} /></div>
      </div>
    </div>
  );
}
