import type { Metadata } from "next";
import ClaimForm from "@/components/ClaimForm";

export const metadata: Metadata = {
  title: "Claim Your Mobile Grooming Listing",
  description:
    "Claim your free mobile dog grooming listing to edit your zip codes, add photos, and start receiving direct leads.",
  alternates: { canonical: "/claim" },
};

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string; city?: string }>;
}) {
  // Outreach links carry ?listing=<slug>&city=<citySlug>. Both are required to
  // find the right row: slug is only unique per (city_slug, slug), so two
  // businesses in different metros can share a slug.
  const { listing, city } = await searchParams;
  return (
    <section className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <span className="chip chip-teal">Free — takes 2 minutes</span>
        <h1 className="mt-4 text-4xl">Claim Your Mobile Grooming Listing</h1>
        <p className="mt-4 max-w-xl text-ink-soft">
          Verify you own this business to edit your service zip codes, add your booking link,
          and start receiving leads directly by call or text — no commission, no phone tag.
        </p>

        <ul className="mt-8 space-y-4 text-sm">
          {[
            "Update your business name, phone, and service area zip codes",
            "Add your booking link, photos, and van specs (hydrobath, generator, etc.)",
            "Get the Verified Mobile Unit badge on your listing",
            "Choose Free, Pro Van, or Multi-Fleet after verifying",
          ].map((line) => (
            <li key={line} className="flex items-start gap-3 text-ink-soft">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-soft text-xs text-teal-dark">✓</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      <div className="card h-fit p-7">
        <ClaimForm listingSlug={listing} citySlug={city} />
      </div>
    </section>
  );
}
