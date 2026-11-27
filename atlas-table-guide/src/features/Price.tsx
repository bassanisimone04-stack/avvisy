"use client";

import { convert, formatMoney } from "@/lib/price";
import { useApp } from "./providers";
import { useEffect, useState } from "react";

/**
 * Renders a price in its ORIGINAL currency (server-rendered, indexable) and — after hydration — an
 * approximate conversion into the visitor's preferred currency when a rate is available.
 */
export function Price({ amount, currency, locale, className, approxLabel = "≈" }: { amount: number; currency: string; locale: string; className?: string; approxLabel?: string }) {
  const { currency: pref, rates } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const converted = mounted && pref !== currency ? convert(amount, currency, pref, rates) : null;
  return (
    <span className={className}>
      {formatMoney(amount, currency, locale)}
      {converted != null && (
        <span className="ml-1 text-[0.85em] font-normal text-stone" title={rates.source === "live" ? `ECB ${rates.date}` : "Illustrative demo rate"}>
          ({approxLabel} {formatMoney(converted, pref, locale)}{rates.source === "demo-reference" ? "*" : ""})
        </span>
      )}
    </span>
  );
}
