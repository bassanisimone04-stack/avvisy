import type { Metadata } from "next";
import Link from "next/link";
import { FEATURED_CITIES } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mobile Dog Groomers by City",
  description: "Browse mobile dog and cat groomers across major US cities and metro areas.",
  alternates: { canonical: "/cities" },
};

export default function CitiesIndexPage() {
  return (
    <section className="container-page py-16 sm:py-20">
      <h1 className="text-4xl">Mobile Dog Groomers by City</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Choose a metro area to see verified, van-based groomers serving your zip code.
      </p>

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
