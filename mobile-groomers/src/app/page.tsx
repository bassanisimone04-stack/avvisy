import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import ValueProps from "@/components/ValueProps";
import CitiesGrid from "@/components/CitiesGrid";
import FaqSection from "@/components/FaqSection";
import { JsonLd, faqPageJsonLd } from "@/lib/schema";
import { CORE_FAQS } from "@/data/faqs";
import { getGroomerCount } from "@/lib/groomers";

export const metadata: Metadata = {
  title: "Mobile Dog Grooming Near You | FindMobileGrooming",
  description:
    "Compare top-rated mobile dog groomers by zip code. Stress-free, at-home van grooming — book a free quote in minutes.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  // A real, computed count rather than a fixed marketing number — this is
  // exactly the kind of claim that has to move when the data does, or it
  // becomes a lie the moment the dataset changes.
  const groomerCount = await getGroomerCount();

  return (
    <>
      <JsonLd data={faqPageJsonLd(CORE_FAQS)} />

      <section className="relative overflow-hidden bg-navy">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #0ea5e9 0, transparent 40%), radial-gradient(circle at 80% 0%, #0ea5e9 0, transparent 35%)",
          }}
        />
        <div className="container-page relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip chip-teal">100% Free for Pet Owners</span>
            <h1 className="mt-5 text-4xl text-white sm:text-5xl lg:text-6xl">
              Find Top-Rated Mobile Dog Groomers Near You
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              Compare van-based dog &amp; cat groomers by zip code. No cages, no commute —
              book a stress-free grooming appointment right at your door.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-2xl">
            <SearchBar />
          </div>

          <p className="mt-4 text-center text-sm text-slate-400">
            {groomerCount > 0
              ? `${groomerCount} mobile groomer${groomerCount === 1 ? "" : "s"} indexed so far — growing every week`
              : "New directory — be the first mobile groomer listed in your city"}
          </p>
        </div>
      </section>

      <ValueProps />
      <CitiesGrid />
      <FaqSection />

      <section className="border-t border-line bg-navy">
        <div className="container-page flex flex-col items-center gap-4 py-16 text-center">
          <h2 className="text-3xl text-white sm:text-4xl">Own a Mobile Grooming Business?</h2>
          <p className="max-w-xl text-slate-300">
            Your business may already be listed. Claim your free profile to edit your service
            zip codes and start receiving direct leads — no phone tag required.
          </p>
          <a href="/claim" className="btn btn-primary mt-2 px-8">
            Claim Your Free Listing
          </a>
        </div>
      </section>
    </>
  );
}
