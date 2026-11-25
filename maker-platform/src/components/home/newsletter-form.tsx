"use client";

import { useState } from "react";
import { z } from "zod";

const emailSchema = z.email();

/**
 * Newsletter form — NOT CONNECTED. Validates locally and tells the visitor
 * plainly that nothing was sent. Phase 5 wires it to Resend with double opt-in.
 */
export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "invalid" | "demo">("idle");
  return (
    <form
      noValidate
      className="mx-auto mt-8 max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get("email");
        setState(emailSchema.safeParse(email).success ? "demo" : "invalid");
      }}
    >
      <div className="flex flex-col gap-2 rounded-md border border-line-strong bg-white p-1.5 shadow-soft sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={state === "invalid" || undefined}
          aria-describedby="newsletter-status"
          className="h-12 flex-1 rounded-sm px-3 text-[0.9375rem] focus:outline-none"
        />
        <button type="submit" className="h-12 rounded-sm bg-forest px-6 text-[0.9375rem] font-medium text-ivory hover:bg-forest-deep">
          Subscribe
        </button>
      </div>
      <p id="newsletter-status" role="status" className="mt-3 min-h-5 text-sm text-muted">
        {state === "invalid" ? <span className="text-danger">Please enter a valid email address.</span> : null}
        {state === "demo" ? "Thanks! Signups open soon — this preview does not store or send anything yet." : null}
        {state === "idle" ? "No spam. Unsubscribe anytime." : null}
      </p>
    </form>
  );
}
