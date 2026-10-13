import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description: `${SITE_NAME} is a US directory dedicated to van-based mobile dog and cat grooming services.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="container-page max-w-3xl py-16 sm:py-20">
      <h1 className="text-4xl">About {SITE_NAME}</h1>
      <div className="mt-6 space-y-5 leading-relaxed text-ink-soft">
        <p>
          {SITE_NAME} is a directory built for one thing: helping US pet owners find
          van-based mobile groomers who actually serve their zip code. General local
          directories lump mobile groomers in with salons, boarding kennels, and vets,
          which makes it almost impossible to tell whether a business will come to your
          driveway or expects you to drive to them.
        </p>
        <p>
          Every listing here is a mobile unit. We track the details that matter for
          at-home grooming — whether the van is self-contained, which breeds and sizes it
          can handle, whether it takes cats, and the exact zip codes it covers.
        </p>
        <p>
          Listings are free for groomers, and always will be. Businesses can claim their
          profile to control their own information and receive leads directly, with
          optional paid plans for priority placement.
        </p>
      </div>
    </section>
  );
}
