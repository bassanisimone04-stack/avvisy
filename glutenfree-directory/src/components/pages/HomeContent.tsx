import { cityPath } from "@/lib/city-pages";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, MapPinned, Sparkles } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CategoryIcon from "@/components/CategoryIcon";
import BusinessCard from "@/components/BusinessCard";
import ArticleCard from "@/components/ArticleCard";
import FaqAccordion from "@/components/FaqAccordion";
import BusinessMapExplorer from "@/components/BusinessMapExplorer";
import HeroPhotoCollage from "@/components/HeroPhotoCollage";
import Reveal from "@/components/Reveal";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { CATEGORIES, categoryLabelPlural } from "@/lib/categories";
import { REGIONS } from "@/lib/regions";
import { BUSINESSES, getFeaturedBusinesses, getTopRatedBusinesses } from "@/lib/mock-businesses";
import { getLatestArticles, getRecipeArticles } from "@/lib/mock-articles";
import { HOME_FAQS } from "@/lib/mock-site";
import { getLocalizedBusiness } from "@/lib/i18n/content-business";
import { HOME_FAQS_EN } from "@/lib/i18n/content-site";
import { cityName } from "@/lib/i18n/place-names";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary, tf } from "@/lib/i18n/dictionary";

const topCities = ["Milano", "Roma", "Napoli", "Firenze", "Torino", "Bologna", "Venezia", "Palermo"];

export default function HomeContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const faqs = locale === "en" ? HOME_FAQS_EN : HOME_FAQS;
  const featured = getFeaturedBusinesses(6).map((b) => getLocalizedBusiness(b, locale));
  const topRated = getTopRatedBusinesses(6).map((b) => getLocalizedBusiness(b, locale));
  const latestArticles = getLatestArticles(3);
  const recipeArticles = getRecipeArticles(3);
  const h = (path: string) => localeHref(locale, path);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-soft">
        <div className="grid-texture absolute inset-0 opacity-60" />
        <div className="container-page relative py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <HeroPhotoCollage label={t.home.title1} />
            </Reveal>
            <Reveal delay={40}>
              <span className="eyebrow mt-8 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
                <Sparkles size={13} /> {t.home.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-editorial mt-5 text-4xl font-semibold text-ink sm:text-5xl lg:text-6xl">
                {t.home.title1} <span className="text-brand">{t.home.title2}</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">{t.home.subtitle}</p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mx-auto mt-8 max-w-xl">
                <SearchBar />
              </div>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href={h("/directory")} className="btn btn-primary">
                  {t.home.ctaDirectory} <ArrowRight size={16} />
                </Link>
                <Link href={h("/per-le-aziende")} className="btn btn-outline">
                  {t.home.ctaBusiness}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RICETTE */}
      <section className="bg-brand-soft py-14">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <Reveal>
              <div>
                <p className="eyebrow">{t.home.recipesEyebrow}</p>
                <h2 className="font-editorial mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t.home.recipesTitle}</h2>
                <p className="mt-2 max-w-xl text-ink-soft">{t.home.recipesSubtitle}</p>
              </div>
            </Reveal>
            <Link href={`${h("/blog")}?categoria=ricette`} className="hidden text-sm font-semibold text-brand-dark link-underline sm:block">{t.home.recipesSeeAll}</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recipeArticles.map((a, i) => (
              <Reveal key={a.id} delay={i * 60}>
                <ArticleCard article={a} locale={locale} />
              </Reveal>
            ))}
          </div>
          <Link href={`${h("/blog")}?categoria=ricette`} className="mt-6 flex text-sm font-semibold text-brand-dark link-underline sm:hidden">{t.home.recipesSeeAll}</Link>
        </div>
      </section>

      {/* RICERCA PER CATEGORIA */}
      <section className="container-page py-14">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">{t.home.categoryEyebrow}</p>
              <h2 className="font-editorial mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t.home.categoryTitle}</h2>
            </div>
            <Link href={h("/directory")} className="hidden text-sm font-semibold text-brand-dark link-underline sm:block">{t.common.seeAll}</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 40}>
              <Link
                href={`${h("/directory")}?categoria=${c.slug}`}
                className="card card-hover flex flex-col items-center gap-2.5 p-4 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
                  <CategoryIcon icon={c.icon} size={22} />
                </span>
                <span className="text-sm font-medium text-ink">{categoryLabelPlural(c, locale)}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RICERCA PER CITTÀ */}
      <section className="bg-surface-2 py-14">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">{t.home.cityEyebrow}</p>
            <h2 className="font-editorial mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t.home.cityTitle}</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-3">
            {topCities.map((city, i) => (
              <Reveal key={city} delay={i * 30}>
                <Link href={h(cityPath(city))} className="btn btn-outline bg-surface">
                  <MapPinned size={15} /> {cityName(city, locale)}
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-soft">{tf(t.home.cityFooter, { n: REGIONS.length })}</p>
        </div>
      </section>

      {/* MAPPA INTERATTIVA */}
      <section className="container-page py-14">
        <Reveal>
          <p className="eyebrow">{t.home.mapEyebrow}</p>
          <h2 className="font-editorial mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t.home.mapTitle}</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">{t.home.mapSubtitle}</p>
        </Reveal>
        <div className="mt-8">
          <BusinessMapExplorer businesses={BUSINESSES.map((b) => getLocalizedBusiness(b, locale))} locale={locale} />
        </div>
      </section>

      {/* RISTORANTI PIÙ VOTATI */}
      <section className="bg-surface-2 py-14">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <Reveal>
              <div>
                <p className="eyebrow">{t.home.topEyebrow}</p>
                <h2 className="font-editorial mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t.home.topTitle}</h2>
              </div>
            </Reveal>
            <Link href={`${h("/directory")}?ordina=rating`} className="hidden text-sm font-semibold text-brand-dark link-underline sm:block">{t.common.seeAll}</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topRated.map((b, i) => (
              <Reveal key={b.id} delay={i * 60}>
                <BusinessCard business={b} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ULTIMI ARTICOLI */}
      <section className="container-page py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <Reveal>
            <div>
              <p className="eyebrow">{t.home.articlesEyebrow}</p>
              <h2 className="font-editorial mt-1 text-2xl font-semibold text-ink sm:text-3xl">{t.home.articlesTitle}</h2>
            </div>
          </Reveal>
          <Link href={h("/blog")} className="hidden text-sm font-semibold text-brand-dark link-underline sm:block">{t.home.articlesSeeAll}</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((a, i) => (
            <Reveal key={a.id} delay={i * 60}>
              <ArticleCard article={a} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FIDUCIA */}
      <section className="container-page py-14">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: t.home.trust1Title, body: t.home.trust1Body },
            { icon: Users, title: t.home.trust2Title, body: t.home.trust2Body },
            { icon: MapPinned, title: t.home.trust3Title, body: t.home.trust3Body },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="card card-soft flex h-full flex-col gap-3 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><item.icon size={20} /></span>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="text-sm text-ink-soft">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-14">
        <Reveal>
          <p className="eyebrow text-center">{t.home.faqEyebrow}</p>
          <h2 className="font-editorial mb-8 mt-1 text-center text-2xl font-semibold text-ink sm:text-3xl">{t.home.faqTitle}</h2>
        </Reveal>
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={faqs} />
        </div>
      </section>
    </>
  );
}
