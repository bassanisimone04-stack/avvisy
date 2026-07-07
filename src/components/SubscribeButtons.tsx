"use client";

import { useState } from "react";
import { startCheckout } from "@/lib/billing";
import { cn } from "@/lib/utils";

type Plan = "base" | "pro" | "multi";

const plans: {
  id: Plan;
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    id: "base",
    name: "Base",
    price: "79 €/mese",
    features: ["Struttura singola", "Prenotazioni e coda", "1 sportello"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "149 €/mese",
    features: [
      "Tutto di Base",
      "Notifiche, report, schermo sala d'attesa",
      "Servizi illimitati",
    ],
    highlight: true,
  },
  {
    id: "multi",
    name: "Multi-sede",
    price: "399 €/mese",
    features: ["Tutto di Pro", "Più sedi e sportelli", "Supporto prioritario"],
  },
];

export default function SubscribeButtons() {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function go(plan: Plan) {
    setLoading(plan);
    setError(null);
    const { url } = await startCheckout(plan);
    if (url) {
      window.location.href = url;
    } else {
      setLoading(null);
      setError(
        "I pagamenti non sono ancora attivi. Riprova più tardi o contatta il supporto."
      );
    }
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.id}
            className={cn(
              "flex flex-col rounded-2xl border bg-card p-5",
              p.highlight
                ? "border-brand shadow-lift ring-1 ring-brand"
                : "border-line shadow-soft"
            )}
          >
            {p.highlight && (
              <span className="mb-2 self-start rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                Consigliato
              </span>
            )}
            <h3 className="font-display text-lg font-bold">{p.name}</h3>
            <p className="mt-1 font-display text-2xl font-bold">{p.price}</p>
            <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm text-muted">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 font-bold text-brand-dark">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => go(p.id)}
              disabled={loading !== null}
              className={cn(
                "mt-5 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50",
                p.highlight
                  ? "bg-brand text-white hover:bg-brand-dark"
                  : "border border-line text-ink hover:border-ink"
              )}
            >
              {loading === p.id ? "Apertura…" : "Abbonati"}
            </button>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
