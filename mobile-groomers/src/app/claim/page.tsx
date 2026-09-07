import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claim Your Mobile Grooming Listing",
  description:
    "Claim your free mobile dog grooming listing to edit your zip codes, add photos, and start receiving direct leads.",
  alternates: { canonical: "/claim" },
};

export default function ClaimPage() {
  return (
    <section className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr,0.9fr]">
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

      <form className="card h-fit p-7">
        <h2 className="text-xl">Business Verification</h2>
        <p className="mt-1 text-sm text-ink-soft">We&apos;ll email you a verification link.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="biz-name">Business name</label>
            <input id="biz-name" name="biz-name" type="text" className="field" placeholder="e.g. PawMobile Grooming Co." required />
          </div>
          <div>
            <label className="field-label" htmlFor="city">City &amp; state</label>
            <input id="city" name="city" type="text" className="field" placeholder="e.g. Los Angeles, CA" required />
          </div>
          <div>
            <label className="field-label" htmlFor="phone">Business phone</label>
            <input id="phone" name="phone" type="tel" className="field" placeholder="(555) 555-0123" required />
          </div>
          <div>
            <label className="field-label" htmlFor="email">Work email</label>
            <input id="email" name="email" type="email" className="field" placeholder="you@yourbusiness.com" required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block mt-6">
          Send Verification Link
        </button>
        <p className="mt-3 text-center text-xs text-ink-soft">
          By claiming, you agree to our <a href="/terms" className="underline">Terms</a> and{" "}
          <a href="/privacy" className="underline">Privacy Policy</a>.
        </p>
      </form>
    </section>
  );
}
