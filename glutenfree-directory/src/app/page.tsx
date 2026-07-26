import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, MapPinned, Sparkles } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CategoryIcon from "@/components/CategoryIcon";
import BusinessCard from "@/components/BusinessCard";
import ArticleCard from "@/components/ArticleCard";
import ProductCard from "@/components/ProductCard";
import TestimonialCard from "@/components/TestimonialCard";
import FaqAccordion from "@/components/FaqAccordion";
import NewsletterForm from "@/components/NewsletterForm";
import MapSection from "@/components/MapSection";
import Reveal from "@/components/Reveal";
import { JsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { CATEGORIES } from "@/lib/categories";
import { REGIONS } from "@/lib/regions";
import { getFeaturedBusinesses, getTopRatedBusinesses } from "@/lib/mock-businesses";
import { getLatestArticles } from "@/lib/mock-articles";
import { getRecommendedProducts } from "@/lib/mock-products";
import { TESTIMONIALS, HOME_FAQS } from "@/lib/mock-site";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: `${SITE_NAME} — Ristoranti, negozi e prodotti senza glutine in Italia`,
  description: SITE_DESCRIPTION,
  path: "/",
});

const topCities = ["Milano", "Roma", "Napoli", "Firenze", "Torino", "Bologna", "Venezia", "Palermo"];

export default function HomePage() {
  const featured = getFeaturedBusinesses(6);
  const topRated = getTopRatedBusinesses(6);
  const latestArticles = getLatestArticles(3);
  const products = getRecommendedProducts(8);

  return (
    <>
      <JsonLd data={faqJsonLd(HOME_FAQS)} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-brand-soft">
        <div className="grid-texture absolute inset-0 opacity-60" />
        <div className="container-page relative py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm">
                <Sparkles size={13} /> La community italiana del senza glutine
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 text-4xl font-extrabold text-ink sm:text-5xl lg:text-6xl">
                Vivi senza glutine, <span className="text-brand">senza pensieri</span>
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-5 max-w-xl text-lg text-ink-soft">
                Trova in pochi secondi ristoranti, pizzerie, hotel, negozi e farmacie certificati vicino a te, leggi guide affidabili e scopri i prodotti consigliati dalla community celiaca.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mx-auto mt-8 max-w-xl">
                <SearchBar />
              </div>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link href="/directory" className="btn btn-primary">
                  Esplora la directory <ArrowRight size={16} />
                </Link>
                <Link href="/per-le-aziende" className="btn btn-outline">
                  Inserisci la tua attività
                </Link>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">1.200+</p>
                  <p className="text-xs text-ink-soft sm:text-sm">Attività verificate</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">18.000+</p>
                  <p className="text-xs text-ink-soft sm:text-sm">Recensioni celiaci</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-brand-dark sm:text-3xl">100+</p>
                  <p className="text-xs text-ink-soft sm:text-sm">Città coperte</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RICERCA PER CATEGORIA */}
      <section className="container-page py-14">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Cerca per categoria</p>
              <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Cosa stai cercando oggi?</h2>
            </div>
            <Link href="/directory" className="hidden text-sm font-semibold text-brand-dark link-underline sm:block">Vedi tutte →</Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 40}>
              <Link
                href={`/directory?categoria=${c.slug}`}
                className="card card-hover flex flex-col items-center gap-2.5 p-4 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark">
                  <CategoryIcon icon={c.icon} size={22} />
                </span>
                <span className="text-sm font-medium text-ink">{c.labelPlural}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RICERCA PER CITTÀ */}
      <section className="bg-surface-2 py-14">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Cerca per città</p>
            <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Le città più cercate</h2>
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-3">
            {topCities.map((city, i) => (
              <Reveal key={city} delay={i * 30}>
                <Link href={`/directory?comune=${encodeURIComponent(city)}`} className="btn btn-outline bg-surface">
                  <MapPinned size={15} /> {city}
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            Copriamo {REGIONS.length} regioni italiane, dalle grandi città alle mete di villeggiatura.
          </p>
        </div>
      </section>

      {/* MAPPA INTERATTIVA */}
      <section className="container-page py-14">
        <Reveal>
          <p className="eyebrow">Esplora la mappa</p>
          <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Le attività in evidenza vicino a te</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">Passa il mouse sui punti o scorri l&apos;elenco per scoprire le attività certificate in tutta Italia.</p>
        </Reveal>
        <div className="mt-8">
          <MapSection businesses={featured} />
        </div>
      </section>

      {/* RISTORANTI PIÙ VOTATI */}
      <section className="bg-surface-2 py-14">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <Reveal>
              <div>
                <p className="eyebrow">I preferiti dalla community</p>
                <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Ristoranti più votati</h2>
              </div>
            </Reveal>
            <Link href="/directory?ordina=rating" className="hidden text-sm font-semibold text-brand-dark link-underline sm:block">Vedi tutti →</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topRated.map((b, i) => (
              <Reveal key={b.id} delay={i * 60}>
                <BusinessCard business={b} />
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
              <p className="eyebrow">Dal blog</p>
              <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Ultimi articoli</h2>
            </div>
          </Reveal>
          <Link href="/blog" className="hidden text-sm font-semibold text-brand-dark link-underline sm:block">Vai al blog →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((a, i) => (
            <Reveal key={a.id} delay={i * 60}>
              <ArticleCard article={a} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRODOTTI CONSIGLIATI */}
      <section className="bg-surface-2 py-14">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between gap-4">
            <Reveal>
              <div>
                <p className="eyebrow">Selezionati per te</p>
                <h2 className="mt-1 text-2xl font-bold text-ink sm:text-3xl">Prodotti consigliati</h2>
              </div>
            </Reveal>
            <Link href="/prodotti" className="hidden text-sm font-semibold text-brand-dark link-underline sm:block">Vedi tutti →</Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 50}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FIDUCIA */}
      <section className="container-page py-14">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Certificazioni verificate", body: "Ogni scheda indica chiaramente se l'attività è certificata AIC e con quali garanzie opera." },
            { icon: Users, title: "Community reale", body: "Recensioni scritte da persone celiache e con sensibilità al glutine, non anonime generiche." },
            { icon: MapPinned, title: "Copertura nazionale", body: "Migliaia di indirizzi in tutte le regioni italiane, aggiornati costantemente." },
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

      {/* TESTIMONIANZE */}
      <section className="bg-surface-2 py-14">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow text-center">Cosa dice la community</p>
            <h2 className="mt-1 text-center text-2xl font-bold text-ink sm:text-3xl">Testimonianze</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.id} delay={i * 60}>
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page py-14">
        <Reveal>
          <p className="eyebrow text-center">Domande frequenti</p>
          <h2 className="mb-8 mt-1 text-center text-2xl font-bold text-ink sm:text-3xl">Tutto quello che devi sapere</h2>
        </Reveal>
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={HOME_FAQS} />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container-page pb-20">
        <Reveal>
          <div className="card card-soft flex flex-col items-center gap-5 bg-brand px-6 py-12 text-center text-white sm:px-16">
            <h2 className="text-2xl font-bold sm:text-3xl">Non perderti le novità senza glutine</h2>
            <p className="max-w-xl text-white/85">Nuovi locali certificati, guide pratiche e prodotti selezionati direttamente nella tua casella email, una volta al mese.</p>
            <NewsletterForm dark />
          </div>
        </Reveal>
      </section>
    </>
  );
}
