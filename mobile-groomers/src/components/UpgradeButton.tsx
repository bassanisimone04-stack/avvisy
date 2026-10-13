"use client";

import { useState } from "react";

export default function UpgradeButton({ groomerId }: { groomerId: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function upgrade() {
    setPending(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groomerId, tier: "pro" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Could not start checkout.");
    } catch {
      setError("Network error.");
    }
    setPending(false);
  }

  return (
    <div className="text-right">
      <button onClick={upgrade} className="btn btn-primary btn-sm" disabled={pending}>
        {pending ? "Starting…" : "Upgrade to Pro Van"}
      </button>
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
