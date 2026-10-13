import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QuoteForm from "@/components/QuoteForm";
import { getAllGroomers, getGroomerBySlug, hasRating, hasTags, hasZipCodes } from "@/lib/groomers";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { JsonLd, breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/schema";
import { phoneHref, safeExternalUrl } from "@/lib/safe-output";

type Params = { citySlug: string; slug: string };

export async function generateStaticParams() {
  const groomers = await getAllGroomers();
  return groomers.map((g) => ({ citySlug: g.citySlug, slug: g.slug }));
}

// Listings added to the database after a build render on first request.
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { citySlug, slug } = await params;
  const groomer = await getGroomerBySlug(citySlug, slug);
  if (!groomer) return {};

  const title = `${groomer.name} — Mobile Groomer in ${groomer.city}, ${groomer.state}`;
  const description = groomer.tagline
    ? `${groomer.tagline} See contact details and request a free quote.`
    : `Mobile dog grooming in ${groomer.city}, ${groomer.state}. See contact details and request a free quote.`;
  const keywords = [
    groomer.name,
    `mobile dog groomer ${groomer.city}`,
    `mobile dog grooming ${groomer.city} ${groomer.state}`,
    `dog groomer near me ${groomer.city}`,
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/groomers/${citySlug}/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/groomers/${citySlug}/${slug}`,
      siteName: SITE_NAME,
      type: "profile",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function GroomerPage({ params }: { params: Promise<Params> }) {
  const { citySlug, slug } = await params;
  const groomer = await getGroomerBySlug(citySlug, slug);
  if (!groomer) notFound();

  const pageUrl = `${SITE_URL}/groomers/${citySlug}/${slug}`;
  const telHref = groomer.phone ? `tel:${phoneHref(groomer.phone)}` : null;
  const smsHref = groomer.phone ? `sms:${phoneHref(groomer.phone)}` : null;
  // Owner-supplied, so anything that is not an absolute http(s) URL is
  // dropped rather than rendered as an href.
  const websiteUrl = safeExternalUrl(groomer.website);

  return (
    <>
      <JsonLd data={localBusinessJsonLd(groomer, pageUrl)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: `${groomer.city}, ${groomer.state}`, url: `${SITE_URL}/cities/${citySlug}` },
          { name: groomer.name, url: pageUrl },
        ])}
      />

      {/* ---------- Listing header ---------- */}
      <header className="border-b border-line bg-surface">
        <div className="container-page py-10">
          <nav className="text-sm text-ink-soft">
            <Link href="/cities" className="hover:text-navy">Cities</Link>
            {" / "}
            <Link href={`/cities/${citySlug}`} className="hover:text-navy">
              {groomer.city}, {groomer.state}
            </Link>
          </nav>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                {groomer.verified ? (
                  <span className="chip chip-success">✓ Verified Mobile Unit</span>
                ) : (
                  <span className="chip chip-neutral">Unclaimed listing</span>
                )}
                {groomer.tier !== "free" && <span className="chip chip-teal">Pro Van</span>}
              </div>

              <h1 className="mt-3 text-4xl">{groomer.name}</h1>
              {groomer.tagline && <p className="mt-2 text-lg text-ink-soft">{groomer.tagline}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {hasRating(groomer) ? (
                  <span className="font-semibold text-navy">
                    ★ {groomer.rating?.toFixed(1)}{" "}
                    <span className="font-normal text-ink-soft">({groomer.reviewCount} reviews)</span>
                  </span>
                ) : (
                  <span className="text-ink-soft">Not yet reviewed</span>
                )}
                <span className="text-ink-soft">📍 {groomer.city}, {groomer.state}</span>
                {groomer.priceRange && (
                  <span className="text-ink-soft">💵 {groomer.priceRange} per groom</span>
                )}
                {groomer.responseTime && (
                  <span className="text-ink-soft">⚡ {groomer.responseTime}</span>
                )}
              </div>
            </div>

            {/* Service radius map placeholder */}
            <div
              className="flex h-44 w-full shrink-0 items-center justify-center rounded-xl border border-line bg-surface-2 text-sm text-ink-soft lg:w-80"
              role="img"
              aria-label={`Service radius map for ${groomer.name} around ${groomer.city}, ${groomer.state}`}
            >
              <div className="text-center">
                <div className="text-2xl">🗺️</div>
                <p className="mt-1 font-semibold text-navy">Service Radius</p>
                <p className="text-xs">
                  {hasZipCodes(groomer)
                    ? `${groomer.zipCodes?.length} zip codes around ${groomer.city}`
                    : "Not listed yet"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.6fr_1fr]">
        {/* ---------- Main column ---------- */}
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl">About This Mobile Groomer</h2>
            {groomer.about ? (
              <p className="mt-3 leading-relaxed text-ink-soft">{groomer.about}</p>
            ) : (
              <p className="mt-3 leading-relaxed text-ink-soft">
                This listing was compiled from public business information and has not
                been claimed yet. {groomer.name} hasn&apos;t added a description —{" "}
                <Link href={`/claim?listing=${groomer.slug}&city=${groomer.citySlug}`} className="font-semibold text-teal-dark underline">
                  is this your business?
                </Link>
              </p>
            )}
          </section>

          {hasTags(groomer) && (
            <section>
              <h2 className="text-2xl">Van Capabilities &amp; Services</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {groomer.tags?.map((tag) => (
                  <span key={tag} className="chip chip-teal text-sm">{tag}</span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl">Zip Codes Served</h2>
            {hasZipCodes(groomer) ? (
              <>
                <p className="mt-2 text-sm text-ink-soft">
                  This van actively covers the following {groomer.zipCodes?.length} zip codes
                  around {groomer.city}, {groomer.state}.
                </p>
                <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                  {groomer.zipCodes?.map((zip) => (
                    <li
                      key={zip}
                      className="rounded-lg border border-line bg-surface px-3 py-2 text-center text-sm font-semibold text-navy"
                    >
                      {zip}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-2 text-sm text-ink-soft">
                This business hasn&apos;t confirmed its exact coverage area yet. Contact them
                directly to check whether they serve your zip code.
              </p>
            )}
          </section>

          {/* ---------- B2B claim banner ---------- */}
          <section className="rounded-2xl border border-teal bg-teal-soft p-7">
            <h2 className="text-xl text-navy">Is this your mobile grooming business?</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Claim this listing to edit your zip codes, add your booking link, and receive
              direct leads from pet owners in {groomer.city} — free to start.
            </p>
            <Link href={`/claim?listing=${groomer.slug}&city=${groomer.citySlug}`} className="btn btn-navy mt-5">
              Claim This Listing
            </Link>
          </section>
        </div>

        {/* ---------- Lead generation sidebar ---------- */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="card p-6 shadow-lift">
            <h2 className="text-lg">Book This Van</h2>
            {groomer.responseTime && (
              <p className="mt-1 text-sm text-ink-soft">{groomer.responseTime}</p>
            )}

            <div className="mt-5 space-y-2.5">
              {telHref && (
                <>
                  <a href={telHref} className="btn btn-primary btn-block">📞 Call the Van</a>
                  <a href={smsHref ?? undefined} className="btn btn-outline btn-block">
                    💬 Text for Booking
                  </a>
                </>
              )}
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="btn btn-outline btn-block"
                >
                  🌐 Visit Website
                </a>
              )}
              {!telHref && !websiteUrl && (
                <p className="text-sm text-ink-soft">
                  No contact details on file yet. Check back once this business claims its
                  listing, or request a quote below.
                </p>
              )}
            </div>

            <div className="my-6 h-px bg-line" />

            <QuoteForm groomerName={groomer.name} groomerId={groomer.id} />
          </div>
        </aside>
      </div>
    </>
  );
}
