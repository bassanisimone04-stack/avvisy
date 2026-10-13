"use client";

import { useState } from "react";
import { submitClaim } from "@/lib/actions/claim";

export default function ClaimForm({
  listingSlug,
  citySlug,
}: {
  listingSlug?: string;
  citySlug?: string;
}) {
  const [state, setState] = useState<"idle" | "pending" | "done" | "verify">("idle");
  const [error, setError] = useState("");

  async function action(formData: FormData) {
    setState("pending");
    setError("");
    const result = await submitClaim(formData);
    if (result?.error) {
      setError(result.error);
      setState("idle");
      return;
    }
    setState(result?.needsVerification ? "verify" : "done");
  }

  if (state === "verify") {
    return (
      <div className="rounded-xl bg-teal-soft p-5 text-sm text-teal-dark">
        <p className="font-semibold">Check your inbox</p>
        <p className="mt-1">
          We sent a verification link to your work email. Open it to finish
          claiming your listing.
        </p>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="rounded-xl bg-teal-soft p-5 text-sm text-teal-dark">
        <p className="font-semibold">Claim received 🎉</p>
        <p className="mt-1">
          We&apos;ll review it and email you once your listing is unlocked.
        </p>
      </div>
    );
  }

  return (
    <form action={action}>
      <h2 className="text-xl">Business Verification</h2>
      <p className="mt-1 text-sm text-ink-soft">We&apos;ll email you a verification link.</p>

      {listingSlug && <input type="hidden" name="listing" value={listingSlug} />}
      {/* Named distinctly from the visible "city" text field below — sharing
          a name would have FormData.get("city") return whichever comes
          first in DOM order and silently drop the other. */}
      {citySlug && <input type="hidden" name="city_slug" value={citySlug} />}

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

      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

      <button type="submit" className="btn btn-primary btn-block mt-6" disabled={state === "pending"}>
        {state === "pending" ? "Sending…" : "Send Verification Link"}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">
        By claiming, you agree to our <a href="/terms" className="underline">Terms</a> and{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
