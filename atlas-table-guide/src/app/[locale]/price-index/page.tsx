import Link from "next/link";
import type { Metadata } from "next";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { SITE } from "@/config/site";
import { t } from "@/db/types";
import { statsBy, lunchDinnerRatio, cheapestRecognised, type Stat } from "@/lib/price-index";
import { formatMoney } from "@/lib/price";
import { formatDate } from "@/lib/format";
import { Notice } from "@/components/ui/ui";
import { Price } from "@/features/Price";

export const revalidate = 3600;
type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/price-index/", title: `${dict.home.priceIndexTitle} — tasting menu prices by city`, description: "Average tasting-menu and wine-pairing prices by city, lunch vs dinner, computed from verified prices with sample size and collection date." });
}

function StatTable({ title, stats, locale, caption }: { title: string; stats: Stat[]; locale: string; caption: string }) {
  const max = Math.max(1, ...stats.filter((s) => !s.suppressed).map((s) => s.avg ?? 0));
  return (
    <figure className="rounded-[12px] border border-line bg-white p-5">
      <figcaption className="mb-3"><span className="font-semibold">{title}</span><span className="block text-xs text-stone">{caption}</span></figcaption>
      <table className="w-full text-sm">
        <thead><tr className="border-b border-line text-left text-stone"><th scope="col" className="py-2 font-medium">Place</th><th scope="col" className="py-2 font-medium">Average</th><th scope="col" className="hidden py-2 font-medium sm:table-cell">Range</th><th scope="col" className="py-2 text-right font-medium">n</th><th scope="col" className="hidden py-2 text-right font-medium md:table-cell">Collected</th></tr></thead>
        <tbody>
          {stats.map((s) => (
            <tr key={`${s.key}-${s.currency}`} className="border-b border-line last:border-0">
              <th scope="row" className="py-2 pr-2 text-left font-medium">{s.label} <span className="text-xs text-stone">({s.currency})</span></th>
              <td className="py-2">{s.suppressed ? <span className="text-stone">Not enough verified data</span> : (
                <span className="flex items-center gap-2"><span className="tabular-nums">{formatMoney(s.avg!, s.currency, locale)}</span>{s.currency === stats[0]?.currency && <span aria-hidden="true" className="hidden h-2 rounded bg-carmine sm:inline-block" style={{ width: `${Math.round(((s.avg ?? 0) / max) * 80)}px` }} />}</span>
              )}</td>
              <td className="hidden py-2 sm:table-cell">{s.suppressed ? "—" : `${formatMoney(s.min!, s.currency, locale)}–${formatMoney(s.max!, s.currency, locale)}`}</td>
              <td className="py-2 text-right tabular-nums">{s.n}</td>
              <td className="hidden py-2 text-right text-stone md:table-cell">{formatDate(s.collectedAt ?? undefined, locale, { month: "short", year: "numeric" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export default async function PriceIndex({ params }: P) {
  const { locale, dict, data, rates } = await pageCtx(params);
  const min = SITE.priceIndexMinSample;
  const cityLabel = (k: string) => t(data.cities.find((c) => c.slug === k)?.name, locale);
  const countryLabel = (k: string) => t(data.countries.find((c) => c.slug === k)?.name, locale);
  const dinnerCity = statsBy(data.restaurants, { kind: "tasting", service: "dinner", groupBy: (r) => r.citySlug, label: cityLabel, minSample: min });
  const lunchCity = statsBy(data.restaurants, { kind: "tasting", service: "lunch", groupBy: (r) => r.citySlug, label: cityLabel, minSample: min });
  const dinnerCountry = statsBy(data.restaurants, { kind: "tasting", service: "dinner", groupBy: (r) => r.countrySlug, label: countryLabel, minSample: min });
  const wineCountry = statsBy(data.restaurants, { kind: "wine_pairing", groupBy: (r) => r.countrySlug, label: countryLabel, minSample: min });
  const ratio = lunchDinnerRatio(data.restaurants, min);
  const cheapest = cheapestRecognised(data.restaurants, rates, 8);
  const caption = `Verified prices only · figures hidden when n < ${min} · original currency`;
  return (
    <PageShell crumbs={[{ name: dict.common.home, path: `/${locale}/` }, { name: dict.home.priceIndexTitle, path: `/${locale}/price-index/` }]} title={dict.home.priceIndexTitle} lead={dict.home.priceIndexSub}
      answer={`Computed live from ${data.restaurants.flatMap((r) => r.menus).filter((m) => m.status === "verified").length} verified prices. Averages are shown only where at least ${min} verified prices exist. See the methodology for sources and collection dates.`}>
      {data.restaurants.some((r) => r.isDemo) && <div className="mb-6"><Notice tone="warning">These figures are computed from fictional demo prices and are not market data.</Notice></div>}
      <div className="grid gap-6 lg:grid-cols-2">
        <StatTable title={`${dict.profile.dinner} — by city`} stats={dinnerCity} locale={locale} caption={caption} />
        <StatTable title={`${dict.profile.lunch} — by city`} stats={lunchCity} locale={locale} caption={caption} />
        <StatTable title={`${dict.profile.dinner} — by country`} stats={dinnerCountry} locale={locale} caption={caption} />
        <StatTable title={`${dict.profile.wine} — by country`} stats={wineCountry} locale={locale} caption={caption} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[12px] border border-line bg-white p-5">
          <h2 className="font-sans text-base font-semibold">Lunch vs dinner</h2>
          <p className="mt-2 font-serif text-4xl text-carmine">{ratio.suppressed ? "—" : `${Math.round(ratio.ratio! * 100)}%`}</p>
          <p className="text-sm text-stone">{ratio.suppressed ? "Not enough verified data" : `Average lunch price as a share of dinner at the same venue · n = ${ratio.n} · ${formatDate(ratio.collectedAt ?? undefined, locale)}`}</p>
        </div>
        <div className="rounded-[12px] border border-line bg-white p-5">
          <h2 className="font-sans text-base font-semibold">Most accessible recognised tasting menus</h2>
          <ol className="mt-3 space-y-1.5 text-sm">{cheapest.map((c) => <li key={c.r.slug} className="flex justify-between gap-3"><Link href={`/${locale}/restaurant/${c.r.slug}/`} className="hover:underline">{c.r.name}</Link><span className="text-right"><Price amount={c.amount} currency={c.currency} locale={locale} /> <span className="text-xs text-stone">≈ {formatMoney(c.eur, "EUR", locale)}</span></span></li>)}</ol>
          <p className="mt-2 text-xs text-stone">Ranked in EUR · {rates.source === "live" ? `ECB rates ${rates.date}` : rates.source === "demo-reference" ? dict.prefs.fxDemo : dict.prefs.fxNone}</p>
        </div>
      </div>
      <p className="mt-8 text-sm"><Link href={`/${locale}/methodology/`} className="font-semibold text-carmine underline-offset-4 hover:underline">{dict.footer.methodology} →</Link></p>
    </PageShell>
  );
}
