"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function QuoteForm({
  groomerName,
  groomerId,
}: {
  groomerName: string;
  groomerId?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groomerId,
          name: form.get("name"),
          contact: form.get("contact"),
          zip: form.get("zip"),
          pet: form.get("pet"),
          company: form.get("company"),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl bg-teal-soft p-4 text-sm text-teal-dark">
        <p className="font-semibold">Quote request sent 🎉</p>
        <p className="mt-1">{groomerName} typically replies within a few hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
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
          <label className="field-label" htmlFor="lead-contact">Phone or email</label>
          <input id="lead-contact" name="contact" type="text" className="field" required />
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

      {/* Honeypot: hidden from users, filled by most naive bots. */}
      <div aria-hidden className="hidden">
        <label htmlFor="lead-company">Company</label>
        <input id="lead-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        className="btn btn-navy btn-block mt-5"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Request Free Quote"}
      </button>
    </form>
  );
}
