import Link from "next/link";
import type { Groomer } from "@/lib/groomers";

export default function GroomerCard({ groomer }: { groomer: Groomer }) {
  return (
    <Link
      href={`/groomers/${groomer.citySlug}/${groomer.slug}`}
      className="card card-hover flex flex-col gap-3 p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg">{groomer.name}</h3>
          <p className="text-sm text-ink-soft">{groomer.city}, {groomer.state}</p>
        </div>
        {groomer.verified && (
          <span className="chip chip-teal shrink-0">✓ Verified Van</span>
        )}
      </div>

      <p className="text-sm text-ink-soft">{groomer.tagline}</p>

      <div className="flex flex-wrap gap-1.5">
        {groomer.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="chip chip-neutral">{tag}</span>
        ))}
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-line pt-3 text-sm">
        <span className="font-semibold text-navy">
          ★ {groomer.rating.toFixed(1)}{" "}
          <span className="font-normal text-ink-soft">({groomer.reviewCount})</span>
        </span>
        <span className="font-semibold text-ink-soft">{groomer.priceRange}</span>
      </div>
    </Link>
  );
}
