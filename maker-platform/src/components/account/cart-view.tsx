"use client";

import { Lock, Trash2 } from "lucide-react";
import Link from "next/link";
import { PlanSheet } from "@/components/marketplace/plan-sheet";
import { buttonVariants } from "@/components/ui/button";
import { demoProducts } from "@/data/demo/products";
import { actions, useLocalState } from "@/features/local-state/store";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { cart } = useLocalState();
  const lines = cart
    .map((i) => ({ item: i, product: demoProducts.find((p) => p.slug === i.slug) }))
    .filter((l): l is { item: (typeof cart)[number]; product: (typeof demoProducts)[number] } => Boolean(l.product));
  const total = lines.reduce((s, l) => s + (l.item.license === "commercial" && l.product.prices.commercial ? l.product.prices.commercial : l.product.prices.personal), 0);

  if (!lines.length) {
    return (
      <div className="rounded-lg border border-dashed border-line-strong px-6 py-16 text-center">
        <p className="font-display text-3xl text-forest">Your cart is empty.</p>
        <p className="mt-2 text-muted">Find a plan worth cutting.</p>
        <Link href="/shop" className={`${buttonVariants({ variant: "primary" })} mt-6`}>
          Browse digital projects
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map(({ item, product }) => (
          <li key={product.slug} className="grid grid-cols-[6rem_1fr] gap-4 py-5 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
            <div className="overflow-hidden rounded-sm border border-line">
              <PlanSheet product={product} className="aspect-square" showTitleBlock={false} />
            </div>
            <div>
              <Link href={`/shop/${product.slug}`} className="font-display text-xl text-forest hover:underline">
                {product.title}
              </Link>
              <p className="mt-1 text-sm text-muted">{product.formats.join(" · ")}</p>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <span className="text-muted">License</span>
                <select
                  value={item.license}
                  onChange={(e) => actions.setLicense(product.slug, e.target.value as "personal" | "commercial")}
                  className="ui-select h-9 appearance-none rounded-sm border border-line-strong bg-white pr-8 pl-2.5 text-sm"
                >
                  <option value="personal">Personal</option>
                  {product.prices.commercial ? <option value="commercial">Commercial</option> : null}
                </select>
              </label>
            </div>
            <div className="col-start-2 flex items-center justify-between gap-4 sm:col-start-auto sm:flex-col sm:items-end">
              <p className="nums font-display text-xl text-forest">
                {formatPrice(item.license === "commercial" && product.prices.commercial ? product.prices.commercial : product.prices.personal)}
              </p>
              <button type="button" onClick={() => actions.removeFromCart(product.slug)} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-danger">
                <Trash2 className="size-4" aria-hidden /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-md border border-line bg-white p-6">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="nums">{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Sales tax</dt>
            <dd className="text-muted">Calculated at checkout</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-semibold text-forest">
            <dt>Total</dt>
            <dd className="nums">{formatPrice(total)}</dd>
          </div>
        </dl>
        <button type="button" disabled className="mt-6 inline-flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-sm bg-forest/40 text-[0.9375rem] font-medium text-ivory">
          <Lock className="size-4" aria-hidden /> Checkout unavailable in preview
        </button>
        <p className="mt-3 text-xs leading-relaxed text-muted">Secure checkout (Stripe, test mode first) arrives in a later phase. Your cart lives only in this browser.</p>
      </aside>
    </div>
  );
}
