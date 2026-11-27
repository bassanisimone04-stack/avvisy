import Link from "next/link";
import { BRAND, disclaimer, type Locale } from "@/config/brand";
import type { Dict } from "@/i18n/en";
import { fmt } from "@/i18n";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/features/forms/Forms";
import { ConsentManageButton } from "@/features/CookieConsent";

export function Footer({ locale, dict, cities, countries, demo }: { locale: Locale; dict: Dict; demo?: boolean; cities: { slug: string; country: string; name: string }[]; countries: { slug: string; name: string }[] }) {
  const L = (p: string) => `/${locale}${p}`;
  const f = dict.footer;
  const cols: { title: string; links: [string, string][] }[] = [
    { title: f.explore, links: [[dict.nav.restaurants, L("/restaurants/")], [dict.nav.destinations, L("/destinations/")], [f.collections, L("/collections/")], [f.priceIndex, L("/price-index/")], [dict.nav.magazine, L("/magazine/")], [dict.nav.gifts, L("/gifts/")], ["Concierge", L("/concierge/")]] },
    { title: f.destinations, links: cities.slice(0, 7).map((c) => [c.name, L(`/restaurants/${c.country}/${c.slug}/`)]) },
    { title: f.restaurants, links: countries.slice(0, 7).map((c) => [c.name, L(`/restaurants/${c.slug}/`)]) },
    { title: f.hotels, links: [[dict.nav.hotels, L("/hotels/")], [dict.home.cards.dineStay[0] as string, L("/collections/restaurants-with-rooms/")], [dict.nav.travel, L("/travel/")]] },
    { title: f.experiences, links: [[dict.nav.experiences, L("/experiences/")], [f.chefs, L("/chefs/")], ["Club", L("/club/")]] },
    { title: f.company, links: [[f.about, L("/about/")], [f.editorial, L("/editorial-policy/")], [f.methodology, L("/methodology/")], [f.contact, L("/contact/")]] },
    { title: f.business, links: [[dict.footer.business, L("/business/")], [f.claim, L("/business/claim-your-restaurant/")], [f.listHotel, L("/business/list-your-hotel/")], [f.partner, L("/business/experience-partner/")], [f.advertise, L("/business/advertise/")]] },
    { title: f.legal, links: [[f.privacy, L("/legal/privacy/")], [f.cookies, L("/legal/cookies/")], [f.terms, L("/legal/terms/")], [f.affiliate, L("/legal/affiliate-disclosure/")], [f.sponsoredPolicy, L("/legal/sponsored-content/")], [f.correction, L("/legal/data-correction/")]] },
  ];
  return (
    <footer className="on-dark mt-0 bg-garnet text-sand">
      <div className="bg-red-700">
        <div className="container-page grid gap-6 py-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <p className="font-serif text-2xl text-ivory">{f.newsletter}</p>
            <p className="mt-1 text-sm text-ivory/90">{dict.home.newsletterSub}</p>
          </div>
          <NewsletterForm locale={locale} d={{ ...dict.forms, submit: dict.common.submit, sending: dict.common.sending }} entity={BRAND.legalEntity} privacyHref={L("/legal/privacy/")} compact dark />
        </div>
      </div>
      <div className="container-page py-12">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link href={L("/")} aria-label={BRAND.name}><Logo variant="light" /></Link>
          <p className="text-sm text-sand">{BRAND.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-ivory">{c.title}</p>
              <ul className="space-y-1.5 text-sm">{c.links.map(([label, href]) => <li key={href}><Link href={href} className="inline-flex min-h-6 hover:text-white hover:underline">{label}</Link></li>)}</ul>
            </nav>
          ))}
        </div>
        <div className="mt-10 grid gap-6 border-t border-ivory/20 pt-8 text-sm md:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            <p className="text-sand"><span className="font-semibold text-ivory">{f.social}: </span>{f.socialNote}</p>
            <p className="max-w-3xl text-sand">{disclaimer()}</p>
            {demo && <p className="text-sand">{dict.common.demoNotice}</p>}
            <p className="text-sand">{fmt(f.rights, { year: new Date().getFullYear(), entity: BRAND.legalEntity })}</p>
          </div>
          <div className="flex flex-col items-start gap-2 md:items-end">
            <Link href={L("/contact/?topic=correction")} className="font-semibold text-ivory underline-offset-4 hover:underline">{f.report}</Link>
            <ConsentManageButton label={dict.consent.manage} />
            <Link href={L("/design-system/")} className="text-sand hover:underline">{f.designSystem}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
