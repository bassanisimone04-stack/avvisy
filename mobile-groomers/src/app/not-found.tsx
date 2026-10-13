import Link from "next/link";
import { FEATURED_CITIES } from "@/lib/site-config";

export default function NotFound() {
  return (
    <section className="container-page py-20 text-center sm:py-28">
      <p className="font-display text-sm font-bold uppercase tracking-widest text-teal-dark">
        404
      </p>
      <h1 className="mx-auto mt-4 max-w-xl text-4xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mx-auto mt-4 max-w-md text-ink-soft">
        The listing may have been removed, or the link may be out of date.
        Try searching your metro area instead.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/cities" className="btn btn-primary">Browse groomers</Link>
        <Link href="/" className="btn btn-outline">Back home</Link>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
          Popular metros
        </h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {FEATURED_CITIES.slice(0, 8).map((c) => (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              className="chip chip-neutral hover:bg-teal-soft"
            >
              {c.city}, {c.state}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
