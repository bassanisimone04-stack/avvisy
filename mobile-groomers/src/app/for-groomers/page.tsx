import type { Metadata } from "next";
import Link from "next/link";
import PricingTable from "@/components/PricingTable";

export const metadata: Metadata = {
  title: "For Mobile Groomers — Get Listed & Get Leads",
  description:
    "How mobile grooming businesses get listed, claim their profile, set zip code coverage, and receive direct leads.",
  alternates: { canonical: "/for-groomers" },
};

const STEPS = [
  {
    n: "1",
    title: "Find or add your listing",
    body: "Search for your business — most established mobile groomers are already indexed. If not, add it in under two minutes.",
  },
  {
    n: "2",
    title: "Verify ownership",
    body: "We send a verification link to your work email or business phone. No documents, no sales call.",
  },
  {
    n: "3",
    title: "Set your real zip codes",
    body: "This is the important one. Your zip code coverage decides which local searches you appear in.",
  },
  {
    n: "4",
    title: "Receive leads directly",
    body: "Calls, texts, and quote requests come straight to you. We don't take a cut of any booking.",
  },
];

export default function ForGroomersPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-16 text-center sm:py-20">
          <span className="chip chip-teal">For Mobile Grooming Businesses</span>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl sm:text-5xl">
            Stop Competing with Salons for the Same Search Results
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-ink-soft">
            Pet owners searching for a mobile groomer have already decided they want a van
            at their door. Being listed where they search means the lead arrives
            pre-qualified.
          </p>
          <Link href="/claim" className="btn btn-primary mt-7 px-8">
            Claim Your Free Listing
          </Link>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <h2 className="text-center text-3xl">How It Works</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy font-display font-bold text-teal">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-2 py-16 sm:py-20">
        <div className="container-page">
          <h2 className="text-center text-3xl">Plans</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-ink-soft">
            Start free. Upgrade only when the leads justify it.
          </p>
          <div className="mt-10">
            <PricingTable />
          </div>
        </div>
      </section>
    </>
  );
}
