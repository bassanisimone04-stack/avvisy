import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GroomerCard from "@/components/GroomerCard";
import { getGroomersByCitySlug } from "@/lib/groomers";
import { FEATURED_CITIES, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return FEATURED_CITIES.map((c) => ({ citySlug: c.slug }));
}

function getCity(citySlug: string) {
  return FEATURED_CITIES.find((c) => c.slug === citySlug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}): Promise<Metadata> {
  const { citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};
  const title = `Mobile Dog Groomers in ${city.city}, ${city.state}`;
  const description = `Compare van-based mobile dog groomers serving ${city.city}, ${city.state}. See real contact details, check coverage by zip code, and request a free quote.`;
  const keywords = [
    `mobile dog groomer ${city.city}`,
    `mobile dog grooming ${city.city} ${city.state}`,
    `at-home dog grooming ${city.city}`,
    `dog groomer near me ${city.city}`,
    `mobile pet grooming ${city.city}`,
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/cities/${city.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/cities/${city.slug}`,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CityPage({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();

  const groomers = await getGroomersByCitySlug(city.slug);

  return (
    <section className="container-page py-16 sm:py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Cities", url: `${SITE_URL}/cities` },
          { name: `${city.city}, ${city.state}`, url: `${SITE_URL}/cities/${city.slug}` },
        ])}
      />

      <nav className="text-sm text-ink-soft">
        <Link href="/cities" className="hover:text-navy">Cities</Link> / {city.city}, {city.state}
      </nav>

      <h1 className="mt-3 text-4xl">Mobile Dog Groomers in {city.city}, {city.state}</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        {groomers.length > 0
          ? `${groomers.length} mobile groomer${groomers.length === 1 ? "" : "s"} listed in ${city.city} so far.`
          : `We're building out coverage for ${city.city}. Own a van here?`}{" "}
        <Link href="/claim" className="font-semibold text-teal-dark underline">
          Claim your free listing
        </Link>
        .
      </p>

      {groomers.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groomers.map((g) => (
            <GroomerCard key={g.slug} groomer={g} />
          ))}
        </div>
      ) : (
        <div className="mt-10 card p-8 text-center text-ink-soft">
          No listings yet for {city.city} — be the first mobile groomer to claim this market.
        </div>
      )}
    </section>
  );
}
