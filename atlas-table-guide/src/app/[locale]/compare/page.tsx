import type { Metadata } from "next";
import Link from "next/link";
import { pageCtx } from "../_ctx";
import { buildMetadata } from "@/seo/metadata";
import { PageShell } from "@/features/PageShell";
import { decodeCompare, COMPARE_MAX } from "@/lib/compare-url";
import { fmt } from "@/i18n";
import { t, type MenuPrice, type Restaurant } from "@/db/types";
import { cityOf, chefOf, countryOf, cuisineName } from "@/db/queries";
import { combinedEstimate, menuPrice, toEUR, usable, type Rates } from "@/lib/price";
import { formatDate } from "@/lib/format";
import { Price } from "@/features/Price";
import { ShareButton } from "@/features/ItineraryTools";
import { EmptyState, Chip } from "@/components/ui/ui";
import { RecognitionText } from "@/components/cards/Recognition";
import { SmartImage } from "@/components/media/SmartImage";
import { buildAlt } from "@/lib/alt";

type P = { params: Promise<{ locale: string }>; searchParams: Promise<{ r?: string | string[] }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, dict } = await pageCtx(params);
  return buildMetadata({ locale, path: "/compare/", title: dict.compare.title, description: fmt(dict.compare.sub, { n: COMPARE_MAX }), noindex: true });
}

const eur = (m: MenuPrice | undefined, rates: Rates) => (m && usable(m) ? toEUR(m.amount!, m.currency, rates) : null);

export default async function Compare({ params, searchParams }: P) {
  const { locale, dict, data, rates } = await pageCtx(params);
  const slugs = decodeCompare((await searchParams).r);
  const list = slugs.map((s) => data.restaurants.find((r) => r.slug === s)).filter((r): r is Restaurant => !!r);
  const C = dict.compare;
  const crumbs = [{ name: dict.common.home, path: `/${locale}/` }, { name: C.title, path: `/${locale}/compare/` }];
  if (!list.length) return <PageShell crumbs={crumbs} title={C.title} lead={fmt(C.sub, { n: COMPARE_MAX })}><EmptyState title={C.empty}>{data.cities.slice(0, 5).map((c) => <Chip key={c.slug} href={`/${locale}/restaurants/${c.countrySlug}/${c.slug}/`}>{t(c.name, locale)}</Chip>)}</EmptyState></PageShell>;

  const rows: { label: string; values: (r: Restaurant) => React.ReactNode; best?: (r: Restaurant) => number | null }[] = [
    { label: C.location, values: (r) => `${t(cityOf(data, r.citySlug)?.name, locale)}, ${t(countryOf(data, r.countrySlug)?.name, locale)}` },
    { label: C.recognitions, values: (r) => <RecognitionText r={r} dict={dict} /> },
    { label: dict.profile.cuisine, values: (r) => r.cuisines.map((c) => cuisineName(data, c, locale)).join(", ") },
    { label: C.chef, values: (r) => chefOf(data, r.chefSlug)?.name ?? dict.common.notProvided },
    ...(["lunch", "dinner"] as const).map((s) => ({ label: s === "lunch" ? dict.profile.lunch : dict.profile.dinner, best: (r: Restaurant) => eur(menuPrice(r, "tasting", s), rates), values: (r: Restaurant) => { const m = menuPrice(r, "tasting", s); return m && usable(m) ? <><Price amount={m.amount!} currency={m.currency} locale={locale} /> <span className="text-xs text-stone">({m.status === "verified" ? dict.common.verified : dict.common.estimated})</span></> : <span className="text-stone">{dict.common.missing}</span>; } })),
    { label: dict.profile.wine, best: (r) => eur(menuPrice(r, "wine_pairing"), rates), values: (r) => { const m = menuPrice(r, "wine_pairing"); return m && usable(m) ? <Price amount={m.amount!} currency={m.currency} locale={locale} /> : <span className="text-stone">{dict.common.missing}</span>; } },
    { label: `${C.total} (${dict.common.estimate})`, best: (r) => { const e = combinedEstimate(r); return e ? toEUR(e.amount, e.currency, rates) : null; }, values: (r) => { const e = combinedEstimate(r); return e ? <Price amount={e.amount} currency={e.currency} locale={locale} /> : "—"; } },
    { label: dict.profile.dietary, values: (r) => [r.dietary.vegetarian && dict.directory.diet.vegetarian, r.dietary.vegan && dict.directory.diet.vegan, r.dietary.glutenFree && dict.directory.diet.glutenFree].filter(Boolean).join(", ") || "—" },
    { label: C.hotelOnSite, values: (r) => (r.features.rooms ? dict.common.yes : dict.common.no) },
    { label: C.giftCards, values: (r) => (r.features.giftCard ? dict.common.yes : dict.common.no) },
    { label: C.reservation, values: (r) => dict.directory.reservation[r.reservation.method] },
    { label: C.lastVerification, values: (r) => formatDate(r.lastVerifiedAt, locale) || dict.common.notVerified },
  ];
  const bestOf = (row: (typeof rows)[number]) => { if (!row.best) return null; const v = list.map((r) => row.best!(r)).filter((x): x is number => x != null); return v.length > 1 ? Math.min(...v) : null; };

  return (
    <PageShell crumbs={crumbs} title={C.title} lead={fmt(C.sub, { n: COMPARE_MAX })}>
      <div className="mb-6 flex flex-wrap items-center gap-3"><ShareButton label={dict.common.copyLink} copied={dict.common.copied} title={C.title} /><p className="text-sm text-stone">{C.shareHint}</p></div>
      {/* Desktop / tablet: table with sticky first column */}
      <div className="hidden overflow-x-auto rounded-[12px] border border-line bg-white md:block">
        <table className="w-full min-w-[720px] text-sm">
          <caption className="sr-only">{C.title}</caption>
          <thead>
            <tr>
              <td className="sticky left-0 z-10 w-48 bg-white p-4" />
              {list.map((r) => (
                <th key={r.slug} scope="col" className="p-4 text-left align-top">
                  <SmartImage imageKey={r.images[0]!.key} alt={buildAlt(r.images[0]!, { name: r.name, city: t(cityOf(data, r.citySlug)?.name, locale), locale })} sizes="220px" ratio="4 / 3" />
                  <Link href={`/${locale}/restaurant/${r.slug}/`} className="mt-2 block font-serif text-lg hover:underline">{r.name}</Link>
                  <Link href={`/${locale}/compare/?r=${slugs.filter((s) => s !== r.slug).join(",")}`} className="inline-flex min-h-6 items-center py-1 text-xs font-normal text-carmine underline">{C.remove}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => { const best = bestOf(row); return (
              <tr key={row.label} className="border-t border-line">
                <th scope="row" className="sticky left-0 z-10 bg-white p-4 text-left font-semibold">{row.label}</th>
                {list.map((r) => { const isBest = best != null && row.best!(r) === best; return <td key={r.slug} className={`p-4 align-top ${isBest ? "bg-[#E7F3EC]" : ""}`}>{row.values(r)}{isBest && <span className="ml-1 text-xs font-semibold text-success">· {C.best}</span>}</td>; })}
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
      {/* Mobile: stacked cards with horizontal swipe */}
      <ul className="scroll-snap-x -mx-4 flex gap-4 overflow-x-auto px-4 md:hidden">
        {list.map((r) => (
          <li key={r.slug} className="w-[85%] shrink-0 rounded-[12px] border border-line bg-white p-4">
            <h2 className="font-serif text-xl"><Link href={`/${locale}/restaurant/${r.slug}/`}>{r.name}</Link></h2>
            <dl className="mt-3 space-y-2 text-sm">{rows.map((row) => { const best = bestOf(row); const isBest = best != null && row.best!(r) === best; return <div key={row.label} className="flex justify-between gap-3 border-b border-line pb-2"><dt className="text-stone">{row.label}</dt><dd className={`text-right ${isBest ? "font-semibold text-success" : ""}`}>{row.values(r)}</dd></div>; })}</dl>
          </li>
        ))}
      </ul>
      {rates.source !== "live" && <p className="mt-4 text-xs text-stone">{rates.source === "demo-reference" ? dict.prefs.fxDemo : dict.prefs.fxNone}</p>}
    </PageShell>
  );
}
