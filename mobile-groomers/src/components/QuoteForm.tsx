"use client";

import { useState } from "react";

export default function QuoteForm({ groomerName }: { groomerName: string }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-xl bg-teal-soft p-4 text-sm text-teal-dark">
        <p className="font-semibold">Quote request sent 🎉</p>
        <p className="mt-1">{groomerName} typically replies within a few hours.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: POST to /api/leads — forwards to the groomer by email/SMS
        // and records the lead against their subscription tier.
        setSent(true);
      }}
    >
      <h3 className="text-base">Request a Free Quote</h3>
      <p className="mt-1 text-sm text-ink-soft">No obligation. No account needed.</p>

      <div className="mt-4 space-y-3">
        <div>
          <label className="field-label" htmlFor="lead-name">Your name</label>
          <input id="lead-name" name="name" type="text" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="lead-zip">Your zip code</label>
          <input
            id="lead-zip"
            name="zip"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{5}"
            className="field"
            placeholder="90210"
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="lead-phone">Phone or email</label>
          <input id="lead-phone" name="contact" type="text" className="field" required />
        </div>
        <div>
          <label className="field-label" htmlFor="lead-pet">Breed &amp; size</label>
          <input
            id="lead-pet"
            name="pet"
            type="text"
            className="field"
            placeholder="e.g. Goldendoodle, 65 lbs"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-navy btn-block mt-5">
        Request Free Quote
      </button>
    </form>
  );
}
