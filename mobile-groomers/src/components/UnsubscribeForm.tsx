"use client";

import { useState } from "react";

export default function UnsubscribeForm({ defaultEmail }: { defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [state, setState] = useState<"idle" | "pending" | "done">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("pending");
    setError("");
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Network error. Please try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl bg-teal-soft p-4 text-sm text-teal-dark">
        <p className="font-semibold">You&apos;re unsubscribed</p>
        <p className="mt-1">We won&apos;t email {email} again.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="unsub-email">Email address</label>
      <input
        id="unsub-email"
        type="email"
        className="field"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
        required
      />
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn btn-navy btn-block mt-5" disabled={state === "pending"}>
        {state === "pending" ? "Working…" : "Unsubscribe me"}
      </button>
    </form>
  );
}
