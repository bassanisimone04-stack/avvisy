import Link from "next/link";
import { FEATURED_CITIES } from "@/lib/site-config";

export default function CitiesGrid() {
  return (
    <section className="bg-surface-2 py-16 sm:py-20">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl sm:text-4xl">Find Mobile Groomers in Major US Cities</h2>
            <p className="mt-2 text-ink-soft">Browse top-rated van-based groomers by metro area.</p>
          </div>
          <Link href="/cities" className="btn btn-outline btn-sm shrink-0">
            View All Cities
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {FEATURED_CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              className="card card-hover flex items-center justify-between px-5 py-4 text-sm font-semibold text-ink"
            >
              <span>
                {c.city}, {c.state}
              </span>
              <span aria-hidden className="text-teal">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
