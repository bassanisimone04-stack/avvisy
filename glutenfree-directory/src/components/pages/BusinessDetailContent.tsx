import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone, Globe, Instagram, Facebook, MapPin, Clock, BadgeCheck,
  Truck, ShoppingBag, ExternalLink, UtensilsCrossed,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PlaceholderImage from "@/components/PlaceholderImage";
import RatingStars from "@/components/RatingStars";
import FavoriteButton from "@/components/FavoriteButton";
import FaqAccordion from "@/components/FaqAccordion";
import BusinessCard from "@/components/BusinessCard";
import BusinessReviews from "@/components/BusinessReviews";
import { getBusinessBySlug, getSimilarBusinesses } from "@/lib/mock-businesses";
import { getCategoryInfo, categoryLabel, categoryLabelPlural } from "@/lib/categories";
import { getLocalizedBusiness } from "@/lib/i18n/content-business";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { JsonLd, faqJsonLd, localBusinessJsonLd } from "@/lib/seo";

export default function BusinessDetailContent({ locale, slug }: { locale: Locale; slug: string }) {
  const base = getBusinessBySlug(slug);
  if (!base) notFound();
  const business = getLocalizedBusiness(base, locale);
  const t = getDictionary(locale);

  const cat = getCategoryInfo(business.category);
  const similar = getSimilarBusinesses(base).map((b) => getLocalizedBusiness(b, locale));
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address}, ${business.city}`)}`;
  const city = cityName(business.city, locale);

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
                {business.aicCertified && <span className="chip chip-brand"><BadgeCheck size={12} /> {t.business.certifiedAic}</span>}
                {business.openNow && <span className="chip bg-brand text-white">{t.common.openNow}</span>}
              </div>
              <h1 className="text-3xl font-bold text-ink sm:text-4xl">{business.name}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-ink-soft">
                <MapPin size={16} /> {business.address}, {city} ({business.provinceCode})
              </p>
              <div className="mt-2 flex items-center gap-2">
                <RatingStars rating={business.rating} locale={locale} />
                <span className="text-sm text-ink-soft">{business.rating} · {business.reviewCount} {t.common.reviews} · {business.priceRange}</span>
              </div>
            </div>
            <FavoriteButton id={business.id} className="static" />
          </div>

          {/* Gallery */}
          <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-4">
            <PlaceholderImage seed={business.gallerySeeds[0]} variant={business.category} className="col-span-4 rounded-2xl sm:col-span-2 sm:row-span-2" ratio="aspect-[16/10]" label={business.name} />
            {business.gallerySeeds.slice(1).map((s) => (
              <PlaceholderImage key={s} seed={s} variant={business.category} className="col-span-2 rounded-xl sm:col-span-1" ratio="aspect-square" label={business.name} />
            ))}
          </div>

          {/* Description */}
          <div className="prose-article mt-8">
            <h2>{t.business.about}</h2>
            <p>{business.description}</p>
          </div>

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

          {/* Recensioni */}
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold text-ink">{t.business.reviewsTitle} ({business.reviews.length})</h2>
            <BusinessReviews reviews={business.reviews} />
          </div>

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
