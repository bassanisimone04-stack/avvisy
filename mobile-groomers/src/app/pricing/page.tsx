import type { Metadata } from "next";
import PricingTable from "@/components/PricingTable";

export const metadata: Metadata = {
  title: "Pricing for Mobile Groomers | List Your Van & Get Local Leads",
  description:
    "Compare Free, Pro Van, and Multi-Fleet plans for mobile dog groomers. Rank higher in local search and receive direct booking leads.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="chip chip-teal">For Mobile Grooming Businesses</span>
        <h1 className="mt-4 text-4xl sm:text-5xl">Get Found by Local Pet Owners</h1>
        <p className="mt-4 text-ink-soft">
          Claim your free listing today, or upgrade to Pro Van to rank higher in your city and
          start receiving direct calls, texts, and quote requests.
        </p>
      </div>

      <div className="mt-12">
        <PricingTable />
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-line bg-surface-2 p-8 text-center">
        <h2 className="text-2xl">Not sure which plan fits your fleet?</h2>
        <p className="mt-2 text-ink-soft">
          Talk to us about Multi-Fleet pricing for 3+ vans, custom lead routing, or franchise
          rollouts across multiple metro areas.
        </p>
        <a href="mailto:hello@findmobilegrooming.com" className="btn btn-navy mt-5">
          Contact Sales
        </a>
      </div>
    </section>
  );
}
