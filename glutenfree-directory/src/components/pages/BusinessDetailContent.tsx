import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone, Globe, Instagram, Facebook, MapPin, Clock, BadgeCheck, Heart,
  Truck, ShoppingBag, ExternalLink, UtensilsCrossed, CalendarCheck,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PlaceholderImage from "@/components/PlaceholderImage";
import CoverPhoto from "@/components/CoverPhoto";
import RatingStars from "@/components/RatingStars";
import FavoriteButton from "@/components/FavoriteButton";
import FaqAccordion from "@/components/FaqAccordion";
import BusinessCard from "@/components/BusinessCard";
import { getBusinessBySlug, getSimilarBusinesses } from "@/lib/mock-businesses";
import { getCategoryInfo, categoryLabel, categoryLabelPlural } from "@/lib/categories";
import { getLocalizedBusiness } from "@/lib/i18n/content-business";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatDate } from "@/lib/format";
import { JsonLd, faqJsonLd, localBusinessJsonLd } from "@/lib/seo";
import { guidesMentioningBusiness } from "@/lib/related-guides";
import { DISH_LABEL, PRODUCTION_LABEL } from "@/lib/business-attributes";

export default function BusinessDetailContent({ locale, slug }: { locale: Locale; slug: string }) {
  const base = getBusinessBySlug(slug);
  if (!base) notFound();
  const business = getLocalizedBusiness(base, locale);
  const t = getDictionary(locale);

  const cat = getCategoryInfo(business.category);
  const similar = getSimilarBusinesses(base).map((b) => getLocalizedBusiness(b, locale));
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address}, ${business.city}`)}`;
  const city = cityName(business.city, locale);
  const guides = guidesMentioningBusiness(base.slug, locale).slice(0, 4);

  return (
    <div className="container-page py-10">
      <JsonLd data={localBusinessJsonLd(business)} />
      <JsonLd data={faqJsonLd(business.faqs)} />
      <Breadcrumbs locale={locale} items={[
        { name: t.nav.directory, path: "/directory" },
        { name: cat ? categoryLabelPlural(cat, locale) : "", path: `/directory?categoria=${business.category}` },
        { name: business.name, path: `/directory/${business.slug}` },
      ]} />

      {/* Header */}
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="chip chip-neutral">{cat ? categoryLabel(cat, locale) : ""}</span>
                {business.aicCertified ? (
                  <span className="chip chip-brand"><BadgeCheck size={12} /> {t.business.certifiedAic}</span>
                ) : (
                  <span className="chip text-accent-dark" style={{ background: "var(--gf-accent-soft)" }}><Heart size={12} /> {t.business.communityVerified}</span>
                )}
                {business.openNow && <span className="chip bg-brand-solid text-white">{t.common.openNow}</span>}
              </div>
              <h1 className="font-editorial text-3xl font-semibold text-ink sm:text-4xl">{business.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-ink-soft">
                <MapPin size={16} /> {business.address}, {city} ({business.provinceCode})
              </p>
              <div className="mt-2 flex items-center gap-2">
                {business.reviewCount > 0 ? (
                  <>
                    <RatingStars rating={business.rating} locale={locale} />
                    <span className="text-sm text-ink-soft">{business.rating} · {business.reviewCount} {t.common.reviews} · {business.priceRange}</span>
                  </>
                ) : (
                  <span className="text-sm text-ink-soft">{business.priceRange}</span>
                )}
              </div>
            </div>
            <FavoriteButton id={business.id} className="static" />
          </div>

          {/* Foto */}
          <div className="mt-6">
            {business.photoUrl ? (
              <CoverPhoto photoUrl={business.photoUrl} objectPosition={business.photoPosition} seed={business.gallerySeeds[0]} variant={business.category} className="rounded-2xl" ratio="aspect-[16/10]" label={business.name} priority />
            ) : (
              <PlaceholderImage seed={business.gallerySeeds[0]} variant={business.category} className="rounded-2xl" ratio="aspect-[16/10]" label={business.name} />
            )}
          </div>

          {/* Description */}
          <div className="prose-article mt-8">
            <h2>{t.business.about}</h2>
            <p>{business.description}</p>
          </div>

          {/* In breve: tipo di produzione, piatti, esigenze (solo dati presenti nella scheda) */}
          {(business.production || (business.dishes?.length ?? 0) > 0 || business.veganFriendly || business.lactoseFree) && (
            <div className="card card-soft mt-8 p-5">
              <h2 className="mb-3 text-lg font-bold text-ink">{locale === "en" ? "At a glance" : "In breve"}</h2>
              <dl className="space-y-3 text-sm">
                {business.production && (
                  <div>
                    <dt className="font-semibold text-ink">{locale === "en" ? "Type of production" : "Tipo di produzione"}</dt>
                    <dd className="mt-1 text-ink-soft">
                      <span className={`chip mr-2 ${business.production === "dedicato" ? "chip-brand" : "chip-neutral"}`}>{PRODUCTION_LABEL[business.production].short[locale]}</span>
                      {PRODUCTION_LABEL[business.production].long[locale]}
                    </dd>
                  </div>
                )}
                {(business.dishes?.length ?? 0) > 0 && (
                  <div>
                    <dt className="font-semibold text-ink">{locale === "en" ? "What you can eat" : "Cosa puoi mangiare"}</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {(business.dishes ?? []).map((d) => (
                        <Link key={d} href={localeHref(locale, `/directory?piatto=${d}`)} className="chip chip-neutral">{DISH_LABEL[d][locale]}</Link>
                      ))}
                    </dd>
                  </div>
                )}
                {(business.veganFriendly || business.lactoseFree) && (
                  <div>
                    <dt className="font-semibold text-ink">{locale === "en" ? "Other needs" : "Altre esigenze"}</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {business.veganFriendly && <span className="chip chip-neutral">{locale === "en" ? "Vegan options" : "Opzioni vegane"}</span>}
                      {business.lactoseFree && <span className="chip chip-neutral">{locale === "en" ? "Lactose-free options" : "Opzioni senza lattosio"}</span>}
                    </dd>
                  </div>
                )}
                {business.menuUrl && (
                  <div>
                    <dt className="font-semibold text-ink">{locale === "en" ? "Gluten-free menu" : "Menu senza glutine"}</dt>
                    <dd className="mt-1">
                      <a href={business.menuUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-brand-dark">{locale === "en" ? "Open the menu" : "Apri il menu"}</a>
                    </dd>
                  </div>
                )}
              </dl>
              <p className="mt-3 text-xs text-muted">
                {locale === "en"
                  ? "Taken from the venue's listing: always confirm with the venue before going."
                  : "Ricavato dalla scheda del locale: conferma sempre con il locale prima di andare."}
              </p>
            </div>
          )}

          {/* Menu gluten free */}
          <div className="mt-8">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-ink"><UtensilsCrossed size={20} className="text-brand" /> {t.business.menuTitle}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {business.glutenFreeMenu.map((item) => (
                <li key={item} className="card flex items-center gap-2 px-4 py-3 text-sm text-ink-soft">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Servizi */}
          <div className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-ink">{t.business.servicesTitle}</h2>
            <div className="flex flex-wrap gap-2">
              {business.services.map((s) => <span key={s} className="chip chip-neutral">{s}</span>)}
              {business.delivery && <span className="chip chip-brand"><Truck size={12} /> {t.directory.filters.delivery}</span>}
              {business.takeaway && <span className="chip chip-brand"><ShoppingBag size={12} /> {t.directory.filters.takeaway}</span>}
            </div>
          </div>

          {/* Recensione in evidenza: compare solo quando esistono recensioni reali */}
          {business.reviews.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-3 text-xl font-bold text-ink">{locale === "en" ? "Featured review" : "Recensione in evidenza"}</h2>
              <blockquote className="card card-soft p-5 text-sm text-ink-soft">
                <p className="font-semibold text-ink">{business.reviews[0].title}</p>
                <p className="mt-1">{business.reviews[0].body}</p>
                <footer className="mt-2 text-xs text-muted">{business.reviews[0].author} · {formatDate(business.reviews[0].date, locale)}</footer>
              </blockquote>
            </div>
          )}

          {/* Nessuna recensione: invito a raccontare l'esperienza (storie reali, con consenso) */}
          {business.reviews.length === 0 && (
            <div className="card card-soft mt-10 p-5 text-sm text-ink-soft">
              <p className="font-semibold text-ink">{locale === "en" ? "Been here?" : "Ci sei stato?"}</p>
              <p className="mt-1">
                {locale === "en" ? "There are no reviews for this venue yet. " : "Per questo locale non ci sono ancora recensioni. "}
                <Link href={localeHref(locale, "/le-vostre-storie")} className="link-underline text-brand-dark">
                  {locale === "en" ? "Tell us how it went" : "Raccontaci com'è andata"}
                </Link>.
              </p>
            </div>
          )}

          {/* Guide che citano questo locale (ricavate dai link degli articoli) */}
          {guides.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-3 text-xl font-bold text-ink">{locale === "en" ? "Guides that mention this venue" : "Guide che citano questo locale"}</h2>
              <ul className="space-y-2">
                {guides.map((g) => (
                  <li key={g.id}>
                    <Link href={localeHref(locale, `/blog/${g.slug}`)} className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm text-ink-soft hover:border-brand hover:text-brand-dark">
                      <span>{g.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQ */}
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-ink">{t.business.faqTitle}</h2>
            <FaqAccordion items={business.faqs} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="card card-soft p-5">
            <h2 className="mb-3 font-semibold text-ink">{t.business.contactTitle}</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-ink-soft hover:text-brand-dark">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-brand" />
                  <span>{business.address}, {business.postalCode} {city} ({business.provinceCode}) <span className="inline-flex items-center gap-1 text-brand-dark">{t.business.openInMaps} <ExternalLink size={11} /></span></span>
                </a>
              </li>
              <li>
                <a href={`tel:${business.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2.5 text-ink-soft hover:text-brand-dark">
                  <Phone size={16} className="text-brand" /> {business.phone}
                </a>
              </li>
              <li>
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-ink-soft hover:text-brand-dark">
                  <Globe size={16} className="text-brand" /> {locale === "en" ? "Official website" : "Sito web ufficiale"}
                </a>
              </li>
              <li className="flex items-center gap-3 pl-0.5">
                {business.instagram && <a href={business.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-ink-soft hover:text-brand-dark"><Instagram size={18} /></a>}
                {business.facebook && <a href={business.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-ink-soft hover:text-brand-dark"><Facebook size={18} /></a>}
              </li>
            </ul>
            <p className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-xs text-muted">
              <CalendarCheck size={13} className="shrink-0 text-brand" /> {t.business.verifiedOn} {formatDate(business.createdAt, locale)}
            </p>
          </div>

          <div className="card card-soft p-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-ink"><Clock size={16} className="text-brand" /> {t.business.hoursTitle}</h2>
            <ul className="space-y-1.5 text-sm">
              {business.hours.map((h) => (
                <li key={h.day} className="flex justify-between text-ink-soft">
                  <span>{h.day}</span>
                  <span className={h.hours ? "" : "text-muted"}>{h.hours ?? t.business.closed}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href={localeHref(locale, "/per-le-aziende")} className="card card-soft block p-5 text-sm text-ink-soft hover:border-brand">
            {t.business.manageCta} <span className="font-semibold text-brand-dark">{t.business.manageCtaLink}</span>
          </Link>
        </aside>
      </div>

      {/* Attività simili */}
      {similar.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-5 text-2xl font-bold text-ink">{t.business.similarTitle}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((b) => <BusinessCard key={b.id} business={b} locale={locale} />)}
          </div>
        </div>
      )}
    </div>
  );
}
