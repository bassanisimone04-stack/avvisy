"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/Logo";
import { BRAND } from "@/config/brand";
import { ChevronDown, HeartIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { useApp } from "@/features/providers";
import dynamic from "next/dynamic";
const loadSearch = () => import("@/features/GlobalSearch").then((m) => m.GlobalSearch);
const GlobalSearch = dynamic(loadSearch, { ssr: false });
import type { Dict } from "@/i18n/en";

export type HeaderData = {
  locale: string;
  locales: { code: string; name: string }[];
  currencies: readonly string[];
  countries: { slug: string; name: string }[];
  cities: { slug: string; country: string; name: string; countryName: string }[];
  collections: { slug: string; title: string }[];
  fxNote: string;
};

type NavItem = { key: keyof Dict["nav"]; href: string; mega?: "restaurants" | "destinations" };

export function Header({ data, dict }: { data: HeaderData; dict: Pick<Dict, "nav" | "prefs" | "search" | "common"> }) {
  const { locale } = data;
  const pathname = usePathname() ?? `/${locale}/`;
  const { favourites, currency, setCurrency, units, setUnits } = useApp();
  const [search, setSearch] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [mega, setMega] = useState<null | "restaurants" | "destinations">(null);
  const [scrolled, setScrolled] = useState(false);
  const closeSearch = useCallback(() => setSearch(false), []);

  const NAV: NavItem[] = [
    { key: "restaurants", href: `/${locale}/restaurants/`, mega: "restaurants" },
    { key: "destinations", href: `/${locale}/destinations/`, mega: "destinations" },
    { key: "hotels", href: `/${locale}/hotels/` },
    { key: "experiences", href: `/${locale}/experiences/` },
    { key: "travel", href: `/${locale}/travel/` },
    { key: "gifts", href: `/${locale}/gifts/` },
    { key: "magazine", href: `/${locale}/magazine/` },
  ];
  const isActive = (href: string) => pathname.startsWith(href) || (href.endsWith("/restaurants/") && pathname.includes(`/${locale}/restaurant/`));

  // Fetch the search chunk when the browser is idle so "/" and the search button open instantly.
  useEffect(() => {
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const id = idle ? idle(() => void loadSearch()) : window.setTimeout(() => void loadSearch(), 1500);
    return () => { if (!idle) clearTimeout(id); };
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(tgt.tagName) && !tgt.isContentEditable) { e.preventDefault(); setSearch(true); }
      if (e.key === "Escape") { setMega(null); setPrefs(false); }
    };
    const onScroll = () => setScrolled(window.scrollY > 80);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { document.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll); };
  }, []);
  useEffect(() => { setMega(null); setPrefs(false); }, [pathname]);

  const switchLocale = (code: string) => pathname.replace(/^\/(en|it)(?=\/|$)/, `/${code}`) || `/${code}/`;
  const favCount = favourites.length;

  return (
    <header className="on-dark sticky top-0 z-50 bg-carmine text-ivory">
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-3">
        <Link href={`/${locale}/`} className="shrink-0 py-2 min-h-11" aria-label={`${BRAND.name} — ${dict.common.home}`}>
          <Logo variant="light" />
        </Link>

        <nav aria-label={dict.nav.primary} className="hidden lg:block">
          <ul className="flex items-center">
            {NAV.map((n) => (
              <li key={n.key} className="relative" onMouseLeave={() => n.mega && setMega(null)}>
                <div className="flex items-center">
                  <Link href={n.href} aria-current={isActive(n.href) ? "page" : undefined} onMouseEnter={() => n.mega && setMega(n.mega)}
                    className={clsx("inline-flex min-h-11 items-center whitespace-nowrap px-2 text-[14px] font-medium hover:underline hover:underline-offset-8", isActive(n.href) && "underline decoration-2 underline-offset-8")}>
                    {dict.nav[n.key]}
                  </Link>
                  {n.mega && (
                    <button type="button" aria-expanded={mega === n.mega} aria-controls={`mega-${n.mega}`} onClick={() => setMega(mega === n.mega ? null : n.mega!)} className="grid h-11 w-6 place-items-center" aria-label={`${dict.nav[n.key]} — ${dict.common.open}`}>
                      <ChevronDown size={14} />
                    </button>
                  )}
                </div>
                {n.mega && mega === n.mega && (
                  <div id={`mega-${n.mega}`} className="absolute left-1/2 top-full z-50 w-[640px] -translate-x-1/2 rounded-[12px] border border-line bg-white p-6 text-ink shadow-card">
                    {n.mega === "restaurants" ? (
                      <div className="grid grid-cols-3 gap-6 text-sm">
                        <div><p className="eyebrow mb-2">{dict.nav.byCountry}</p><ul className="space-y-1">{data.countries.map((c) => <li key={c.slug}><Link className="hover:text-carmine hover:underline" href={`/${locale}/restaurants/${c.slug}/`}>{c.name}</Link></li>)}</ul></div>
                        <div>
                          <p className="eyebrow mb-2">{dict.nav.byRecognition}</p>
                          <ul className="space-y-1">{[3, 2, 1].map((l) => <li key={l}><Link className="hover:text-carmine hover:underline" href={`/${locale}/restaurants/?rec=${l}`}>{`Level ${l}`}</Link></li>)}</ul>
                          <p className="eyebrow mb-2 mt-4">{dict.nav.byPrice}</p>
                          <ul className="space-y-1">{[100, 150, 250].map((p) => <li key={p}><Link className="hover:text-carmine hover:underline" href={`/${locale}/collections/tasting-menus-under-${p}/`}>{`< €${p}`}</Link></li>)}</ul>
                        </div>
                        <div><p className="eyebrow mb-2">{dict.nav.collections}</p><ul className="space-y-1">{data.collections.slice(0, 7).map((c) => <li key={c.slug}><Link className="hover:text-carmine hover:underline" href={`/${locale}/collections/${c.slug}/`}>{c.title}</Link></li>)}</ul></div>
                      </div>
                    ) : (
                      <div>
                        <p className="eyebrow mb-3">{dict.nav.topCities}</p>
                        <ul className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm">{data.cities.map((c) => <li key={c.slug}><Link className="hover:text-carmine hover:underline" href={`/${locale}/restaurants/${c.country}/${c.slug}/`}><span className="font-semibold">{c.name}</span> <span className="text-stone">{c.countryName}</span></Link></li>)}</ul>
                        <Link href={`/${locale}/destinations/`} className="mt-4 inline-block text-sm font-semibold text-carmine hover:underline">{dict.nav.allDestinations} →</Link>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => setSearch(true)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-red-700" aria-label={`${dict.nav.search} (${dict.search.hint})`} aria-keyshortcuts="/">
            <SearchIcon />
          </button>
          <div className="relative">
            <button type="button" aria-expanded={prefs} aria-controls="prefs-popover" onClick={() => setPrefs((v) => !v)} className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-2 text-[13px] font-semibold tracking-wide hover:bg-red-700" aria-label={`${dict.prefs.title}: ${locale.toUpperCase()} · ${currency}`}>
              {locale.toUpperCase()} · {currency}
            </button>
            {prefs && (
              <div id="prefs-popover" role="dialog" aria-label={dict.prefs.title} className="absolute right-0 top-full z-50 mt-2 w-72 rounded-[12px] border border-line bg-white p-4 text-ink shadow-card">
                <p className="eyebrow mb-2">{dict.prefs.language}</p>
                <ul className="mb-4 flex gap-2">{data.locales.map((l) => <li key={l.code}><Link hrefLang={l.code} lang={l.code} href={switchLocale(l.code)} aria-current={l.code === locale ? "true" : undefined} className={clsx("inline-flex min-h-9 items-center rounded-full border px-3 text-sm", l.code === locale ? "border-carmine bg-blush text-carmine" : "border-line hover:border-carmine")}>{l.name}</Link></li>)}</ul>
                <label htmlFor="pref-currency" className="eyebrow mb-1 block">{dict.prefs.currency}</label>
                <select id="pref-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="mb-2 min-h-11 w-full rounded-[8px] border border-line bg-white px-3">
                  {data.currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <p className="mb-4 text-xs text-stone">{data.fxNote}</p>
                <fieldset>
                  <legend className="eyebrow mb-1">{dict.prefs.units}</legend>
                  <div className="flex gap-4 text-sm">
                    {(["metric", "imperial"] as const).map((u) => <label key={u} className="inline-flex min-h-9 items-center gap-2"><input type="radio" name="units" checked={units === u} onChange={() => setUnits(u)} className="accent-[var(--red-600)]" />{dict.prefs[u]}</label>)}
                  </div>
                </fieldset>
              </div>
            )}
          </div>
          <Link prefetch={false} href={`/${locale}/account/favourites/`} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-red-700" aria-label={`${dict.nav.favourites} (${favCount})`}>
            <HeartIcon />
            {favCount > 0 && <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ivory px-1 text-[11px] font-bold text-carmine" aria-hidden="true">{favCount}</span>}
          </Link>
          <Link prefetch={false} href={`/${locale}/account/`} className="hidden h-10 w-10 place-items-center rounded-full hover:bg-red-700 min-[480px]:grid" aria-label={dict.nav.account}><UserIcon /></Link>
          <Link href={`/${locale}/club/`} className="ml-2 hidden min-h-10 items-center whitespace-nowrap rounded-[8px] border border-ivory/80 px-3 text-[13px] font-semibold hover:bg-ivory hover:text-carmine xl:inline-flex">{dict.nav.joinClub}</Link>
        </div>
      </div>

      {/* Second row on tablet/mobile (as in the reference): small centred text nav, scrolls if it does not fit; collapses on scroll */}
      <nav aria-label={`${dict.nav.primary} (mobile)`} className={clsx("lg:hidden", scrolled && "hidden")}>
        <ul className="scroll-snap-x mx-auto flex w-max max-w-full gap-5 overflow-x-auto px-4 pb-1.5 text-[13px]">
          {NAV.map((n) => (
            <li key={n.key} className="shrink-0">
              <Link href={n.href} aria-current={isActive(n.href) ? "page" : undefined} className={clsx("inline-flex min-h-9 items-center whitespace-nowrap border-b-2", isActive(n.href) ? "border-ivory" : "border-transparent")}>{dict.nav[n.key]}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {search && <GlobalSearch
        locale={locale}
        open={search}
        onClose={closeSearch}
        popular={data.cities.slice(0, 8).map((c) => ({ title: c.name, href: `/${locale}/restaurants/${c.country}/${c.slug}/` }))}
        labels={{ ...dict.search, close: dict.nav.close }}
      />}
    </header>
  );
}
