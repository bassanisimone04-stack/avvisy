import type { Catalog } from "@/lib/catalog";
import type { SunglassesModel } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/format";
import { TrackedLink } from "./tracked-link";

const AVAIL = { in_stock: "In stock", limited: "Limited stock", out_of_stock: "Out of stock", unknown: "Check store" } as const;

export function PriceTable({ c, m, src }: { c: Catalog; m: SunglassesModel; src: string }) {
  const offers = c.offersFor(m.id);
  const link = (merchantId: string, offerId?: string) => `/go?m=${merchantId}&model=${m.id}${offerId ? `&o=${offerId}` : ""}&src=${encodeURIComponent(src)}`;
  const searchMerchants = c.merchants.filter((x) => x.active && x.searchUrlTemplate);
  return (
    <section aria-labelledby="deals" className="rounded-2xl border border-line bg-white p-6 sm:p-8">
      <h2 id="deals" className="font-display text-3xl font-semibold">Compare prices</h2>
      {offers.length > 0 ? (
        <div className="relative mt-5 overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <caption className="sr-only">Offers for {m.name}</caption>
            <thead><tr className="border-b border-line text-xs uppercase tracking-widest text-mist">
              <th scope="col" className="py-2 pr-4 font-medium">Store</th><th scope="col" className="py-2 pr-4 font-medium">Price</th>
              <th scope="col" className="py-2 pr-4 font-medium">Availability</th><th scope="col" className="py-2 pr-4 font-medium">Shipping</th>
              <th scope="col" className="py-2 pr-4 font-medium">Updated</th><th scope="col" className="py-2"><span className="sr-only">Action</span></th>
            </tr></thead>
            <tbody>
              {offers.map((o, i) => (
                <tr key={o.id} className="border-b border-line/70 last:border-0">
                  <th scope="row" className="py-3 pr-4 font-medium">{c.merchantById.get(o.merchantId)?.name}{i === 0 && o.price != null && <span className="ml-2 rounded bg-champagne-light px-1.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-champagne-text">Lowest</span>}</th>
                  <td className="py-3 pr-4 font-semibold">{o.price != null ? formatPrice(o.price, o.currency) : "See store"}</td>
                  <td className="py-3 pr-4">{AVAIL[o.availability]}</td>
                  <td className="py-3 pr-4 text-slate">{o.shipping || "See store"}</td>
                  <td className="py-3 pr-4 text-slate">{formatDate(o.lastChecked)}</td>
                  <td className="py-3 text-right"><TrackedLink href={link(o.merchantId, o.id)} rel="sponsored nofollow noopener" target="_blank" className="inline-flex rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-champagne-text">View Deal<span className="sr-only"> at {c.merchantById.get(o.merchantId)?.name} (opens in new tab)</span></TrackedLink></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs text-slate">Prices and availability come from merchant feeds and can change. Confirm at checkout. We may earn a commission.</p>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-slate">No verified offers for this model yet. We never display a price we have not verified with a merchant or an affiliate feed. You can look for current listings directly:</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {searchMerchants.map((x) => (
              <li key={x.id}><TrackedLink href={link(x.id)} rel="sponsored nofollow noopener" target="_blank" className="inline-flex rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-white">Find listings on {x.name}<span className="sr-only"> (opens in new tab)</span></TrackedLink></li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-slate">These are search links — no price or availability is implied. We may earn a commission if you buy.</p>
        </div>
      )}
    </section>
  );
}
