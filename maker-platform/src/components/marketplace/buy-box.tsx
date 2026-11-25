"use client";

import { Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { LicenseType, Product } from "@/features/catalog/types";
import { actions, useLocalState } from "@/features/local-state/store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "./favorite-button";

export function BuyBox({ product }: { product: Product }) {
  const { cart } = useLocalState();
  const [license, setLicense] = useState<LicenseType>("personal");
  const inCart = cart.find((i) => i.slug === product.slug);
  const price = license === "commercial" && product.prices.commercial ? product.prices.commercial : product.prices.personal;

  const options: { value: LicenseType; title: string; text: string; price: number | null }[] = [
    { value: "personal", title: "Personal license", text: "Build it for yourself, family and friends.", price: product.prices.personal },
    { value: "commercial", title: "Commercial license", text: "Make and sell finished pieces (not the files).", price: product.prices.commercial },
  ];

  return (
    <div>
      <p className="nums font-display text-[2.75rem] leading-none text-forest">{formatPrice(price)}</p>
      <p className="mt-1 text-xs text-muted">USD · demo price, not for sale yet</p>

      <fieldset className="mt-6">
        <legend className="mb-2 text-[0.8125rem] font-medium text-forest">License</legend>
        <div className="space-y-2">
          {options.map((o) => {
            const disabled = o.price === null;
            return (
              <label
                key={o.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-sm border bg-white p-3.5 transition-colors",
                  license === o.value ? "border-forest ring-1 ring-forest" : "border-line-strong hover:border-forest/60",
                  disabled && "cursor-not-allowed opacity-55",
                )}
              >
                <input type="radio" name="license" value={o.value} checked={license === o.value} disabled={disabled} onChange={() => setLicense(o.value)} className="mt-1 accent-[#263B32]" />
                <span className="flex-1">
                  <span className="flex justify-between gap-3 text-sm font-medium text-forest">
                    {o.title}
                    <span className="nums">{o.price === null ? "Not offered" : formatPrice(o.price)}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">{o.text}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 flex gap-2">
        {inCart ? (
          <Link href="/cart" className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-sm bg-sage-ink text-[0.9375rem] font-medium text-white">
            <Check className="size-4" aria-hidden /> In your cart — view
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => actions.addToCart({ slug: product.slug, license })}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-sm bg-forest text-[0.9375rem] font-medium text-ivory transition-colors hover:bg-forest-deep"
          >
            <ShoppingBag className="size-4" aria-hidden /> Add to cart
          </button>
        )}
        <FavoriteButton item={{ kind: "product", slug: product.slug }} label={product.title} variant="inline" className="h-12" />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">Checkout is not connected in this preview. Downloads will be delivered through secure, expiring links after verified payment.</p>
    </div>
  );
}
