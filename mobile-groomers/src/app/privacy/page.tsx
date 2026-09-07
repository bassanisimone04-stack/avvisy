import type { Metadata } from "next";
import { SITE_NAME, SUPPORT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects your information.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <section className="container-page max-w-3xl py-16 sm:py-20">
      <h1 className="text-4xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-ink-soft">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-8 leading-relaxed text-ink-soft">
        <div>
          <h2 className="text-xl text-ink">Information we collect</h2>
          <p className="mt-2">
            When you submit a quote request, we collect the name, contact details, zip
            code, and pet information you provide, so we can forward the request to the
            groomer you selected. When a business claims a listing, we collect the
            business name, location, phone number, and work email used for verification.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-ink">How we use it</h2>
          <p className="mt-2">
            Quote requests are forwarded only to the specific groomer you contacted. We do
            not sell your personal information, and we do not distribute a single quote
            request to multiple businesses unless you explicitly request it.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-ink">Business listing data</h2>
          <p className="mt-2">
            Unclaimed listings are compiled from publicly available business information.
            If you own a business listed here and want the listing corrected or removed,
            contact us and we will action the request.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-ink">Your rights</h2>
          <p className="mt-2">
            You may request access to, correction of, or deletion of your personal
            information at any time by emailing{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-teal-dark underline">
              {SUPPORT_EMAIL}
            </a>
            . Residents of California (CCPA) and the EEA/UK (GDPR) have additional rights,
            including the right to opt out of the sale or sharing of personal information
            — which we do not do.
          </p>
        </div>

        <div>
          <h2 className="text-xl text-ink">Contact</h2>
          <p className="mt-2">
            Questions about this policy:{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-teal-dark underline">
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
