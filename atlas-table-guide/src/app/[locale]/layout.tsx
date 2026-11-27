import type { Metadata, Viewport } from "next";
import "../globals.css";
import { inter, playfair } from "../fonts";
import { BRAND, SITE_URL, type Locale } from "@/config/brand";
import { SITE } from "@/config/site";
import { fmt, getDict, isLocale, LOCALE_NAMES, LOCALES } from "@/i18n";
import { getDataset } from "@/db/repository";
import { getRates } from "@/lib/fx";
import { t } from "@/db/types";
import { collections } from "@/data/collections";
import { AppProvider } from "@/features/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/features/CompareTray";
import { CookieConsent } from "@/features/CookieConsent";
import { JsonLd } from "@/components/JsonLd";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/seo/jsonld";
import { formatDate } from "@/lib/format";

export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: BRAND.name,
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#B3122B", width: "device-width", initialScale: 1 };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: l } = await params;
  // Never throw here: the root layout also wraps the 404 render. Middleware guarantees a valid prefix.
  const locale: Locale = isLocale(l) ? l : "en";
  const dict = getDict(locale);
  const [data, rates] = await Promise.all([getDataset(), getRates()]);
  const countryName = (slug: string) => t(data.countries.find((c) => c.slug === slug)?.name, locale);
  const cities = data.cities.map((c) => ({ slug: c.slug, country: c.countrySlug, name: t(c.name, locale), countryName: countryName(c.countrySlug) }));
  const countries = data.countries.filter((c) => data.restaurants.some((r) => r.countrySlug === c.slug)).map((c) => ({ slug: c.slug, name: t(c.name, locale) }));
  const fxNote = rates.source === "live" ? fmt(dict.prefs.fxLive, { date: formatDate(rates.date, locale) }) : rates.source === "demo-reference" ? dict.prefs.fxDemo : dict.prefs.fxNone;
  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-ivory text-ink antialiased">
        <a href="#main" className="sr-only z-[100] rounded-[8px] bg-white px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3">{dict.nav.skip}</a>
        <AppProvider rates={rates} defaultCurrency={BRAND.defaultCurrency}>
          <Header
            dict={{ nav: dict.nav, prefs: dict.prefs, search: dict.search, common: dict.common }}
            data={{ locale, locales: LOCALES.map((c) => ({ code: c, name: LOCALE_NAMES[c] })), currencies: SITE.currencies, countries, cities, collections: collections.map((c) => ({ slug: c.slug, title: t(c.title, locale) })), fxNote }}
          />
          <main id="main" tabIndex={-1} className="outline-none">{children}</main>
          <Footer locale={locale} dict={dict} cities={cities} countries={countries} />
          <CompareTray locale={locale} labels={{ tray: dict.compare.tray, go: dict.compare.go, remove: dict.compare.remove, clearAll: dict.common.clearAll }} />
          <CookieConsent d={dict.consent} plausibleDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} />
        </AppProvider>
        <JsonLd data={[buildOrganizationJsonLd(), buildWebsiteJsonLd(locale)]} />
      </body>
    </html>
  );
}
