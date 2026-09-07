import Link from "next/link";
import { PRICING_TIERS } from "@/lib/site-config";

export default function PricingTable() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {PRICING_TIERS.map((tier) => (
        <div
          key={tier.id}
          className={`card relative flex flex-col p-8 ${
            tier.highlight ? "border-2 border-teal shadow-lift" : ""
          }`}
        >
          {"badge" in tier && tier.badge && (
            <span className="chip chip-teal absolute -top-3 left-8">{tier.badge}</span>
          )}

          <h3 className="text-xl">{tier.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">{tier.tagline}</p>

          <div className="mt-5 flex items-baseline gap-1">
            <span className="font-display text-4xl font-extrabold text-navy">{tier.price}</span>
            <span className="text-ink-soft">{tier.period}</span>
          </div>

          <ul className="mt-6 flex-1 space-y-3 text-sm">
            {tier.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-ink-soft">
                <span className="mt-0.5 text-teal">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/claim"
            className={`btn btn-block mt-8 ${tier.highlight ? "btn-primary" : "btn-navy"}`}
          >
            {tier.cta}
          </Link>
        </div>
      ))}
    </div>
  );
}
