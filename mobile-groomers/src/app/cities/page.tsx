import type { Metadata } from "next";
import Link from "next/link";
import GroomerCard from "@/components/GroomerCard";
import { getGroomersByZip } from "@/lib/groomers";
import { FEATURED_CITIES } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mobile Dog Groomers by City",
  description: "Browse mobile dog and cat groomers across major US cities and metro areas.",
  alternates: { canonical: "/cities" },
};

export default async function CitiesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  // A five-digit query is a zip code, so answer it with matching vans rather
  // than sending the visitor back to a city list.
  const zipMatches = /^\d{5}$/.test(query) ? await getGroomersByZip(query) : [];

  return (
    <section className="container-page py-16 sm:py-20">
      <h1 className="text-4xl">Mobile Dog Groomers by City</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Choose a metro area to see verified, van-based groomers serving your zip code.
      </p>

      {/^\d{5}$/.test(query) && (
        <div className="mt-10">
          <h2 className="text-2xl">
            {zipMatches.length > 0
              ? `Vans serving ${query}`
              : `No vans listed for ${query} yet`}
          </h2>
          {zipMatches.length > 0 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {zipMatches.map((g) => (
                <GroomerCard key={`${g.citySlug}-${g.slug}`} groomer={g} />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-ink-soft">
              Browse a nearby metro below — many vans cover a wider radius than
              their listed zip codes.
            </p>
          )}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_CITIES.map((c) => (
          <Link key={c.slug} href={`/cities/${c.slug}`} className="card card-hover flex items-center justify-between px-6 py-5 font-semibold">
            <span>{c.city}, {c.state}</span>
            <span aria-hidden className="text-teal">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
