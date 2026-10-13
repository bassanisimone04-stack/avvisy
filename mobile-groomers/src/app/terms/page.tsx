import type { Metadata } from "next";
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms governing use of ${SITE_NAME}.`,
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <section className="container-page max-w-3xl py-16 sm:py-20">
      <h1 className="text-4xl">Terms of Service</h1>
      {/* A real last-edit date, not the current year on every render — a
          policy date should say when it last changed, not when it was viewed. */}
      <p className="mt-3 text-sm text-ink-soft">Last updated: September 7, 2026</p>

      <div className="mt-8 space-y-8 leading-relaxed text-ink-soft">
        <div>
          <h2 className="text-xl text-ink">Directory listings</h2>
          <p className="mt-2">
            {SITE_NAME} is an informational directory. We are not a party to any agreement
            between a pet owner and a grooming business, and we do not perform grooming
            services. Verify licensing, insurance, and pricing directly with each business
            before booking.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-ink">Accuracy</h2>
          <p className="mt-2">
            Listing information — including service areas, pricing ranges, and
            capabilities — is supplied by businesses or compiled from public sources and
            may change without notice. We make no warranty as to its accuracy.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-ink">Paid plans</h2>
          <p className="mt-2">
            Paid plans are billed monthly and may be cancelled at any time, effective at
            the end of the current billing period. Paid placement affects ranking position
            within a market; it does not guarantee any volume of leads or bookings.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-ink">Acceptable use</h2>
          <p className="mt-2">
            You may not scrape the directory, submit false listings or reviews, or use
            contact details obtained here for unsolicited bulk marketing.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-ink">Contact</h2>
          <p className="mt-2">
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-teal-dark underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
