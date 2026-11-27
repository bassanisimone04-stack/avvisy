import type { Metadata } from "next";
import Link from "next/link";
import { Photo } from "@/components/Photo";
import { Card, CityCard, RestaurantCard } from "@/components/Cards";
import { FeaturedTabs } from "@/components/FeaturedTabs";
import { More, Notice, Section } from "@/components/Section";
import { cities, cuisines, restaurants, title } from "@/data/catalog";
import { T, money, url, type Locale } from "@/lib/i18n";
import { meta } from "@/lib/seo";
import { demoCopy } from "@/lib/demo";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> { return meta((await params).locale as Locale, ""); }

const query = (locale: Locale, key: string, value: string | number) => `${url(locale, "restaurants")}?${new URLSearchParams({ [key]: String(value) })}`;

export default async function Home({ params }: P) {
  const locale = (await params).locale as Locale;
  const t = T(locale);
  const demo = demoCopy(locale);
  const chips: [string, string, string][] = [[t("Level 1", "Livello 1"), "level", "1"], [t("Level 2", "Livello 2"), "level", "2"], [t("Level 3", "Livello 3"), "level", "3"], [t("Under €100", "Meno di €100"), "max", "100"], [t("Dine & Stay", "Cena e soggiorno"), "rooms", "1"]];
  const experiences: [string, string, string, string][] = [
    ["tasting", t("Exceptional tasting menus", "Menù degustazione"), t("Discover and compare", "Scopri e confronta"), query(locale, "sort", "price")],
    ["lake", t("Dine & Stay", "Cena e soggiorno"), t("Remarkable places to stay", "Soggiorni per chi viaggia per il gusto"), url(locale, "hotels")],
    ["plate1", t("Last-minute tables", "Tavoli dell’ultimo minuto"), t("Partner availability pending", "Disponibilità dei partner in attesa"), url(locale, "experiences/last-minute")],
    ["wine", t("Give an experience", "Regala un’esperienza"), t("Ideas for a special occasion", "Idee per un’occasione speciale"), url(locale, "gifts")],
  ];
  const panelFor = (n: 1 | 2 | 3) => restaurants.filter((r) => r.level === n).slice(0, 3).map((r) => <RestaurantCard key={r.slug} r={r} locale={locale} />);
  const panels = { 1: panelFor(1), 2: panelFor(2), 3: panelFor(3) };

  return (
    <>
      {/* 1. Amalfi Coast terrace, with the search BELOW the photo */}
      <section className="hero">
        <Photo name="hero" priority sizes="(min-width: 1428px) 1428px, 100vw" alt={t("Restaurant terrace overlooking the Amalfi Coast", "Terrazza di un ristorante affacciata sulla Costiera Amalfitana")} />
        <h1>{t("The world is yours to taste.", "Il mondo, tutto da assaggiare.")}</h1>
        <p>{t("Discover exceptional restaurants, remarkable hotels and unforgettable culinary journeys.", "Scopri ristoranti d’eccezione, soggiorni da ricordare e viaggi gastronomici.")}</p>
        <form className="search" action={url(locale, "restaurants")} role="search">
          <label htmlFor="hero-query" aria-hidden="true">⌕</label>
          <input id="hero-query" name="q" aria-label={t("Destination or restaurant", "Destinazione o ristorante")} placeholder={t("Where would you like to dine?", "Dove ti piacerebbe cenare?")} />
          <button>{t("Explore", "Esplora")}</button>
        </form>
        <details className="hero-options">
          <summary>{t("Advanced search", "Ricerca avanzata")}</summary>
          <form action={url(locale, "restaurants")} className="hero-filter">
            <label>{t("Destination", "Destinazione")}<select name="city"><option value="">{t("Any city", "Tutte le città")}</option>{cities.map((c) => <option key={c.slug} value={c.slug}>{c.name[locale]}</option>)}</select></label>
            <label>{t("Budget below (€)", "Budget sotto (€)")}<input type="number" min="1" name="max" /></label>
            <label>{t("Cuisine", "Cucina")}<select name="cuisine"><option value="">{t("Any cuisine", "Tutte le cucine")}</option>{cuisines.map((c) => <option key={c.key} value={c.key}>{c.name[locale]}</option>)}</select></label>
            <button>{t("Explore", "Esplora")}</button>
          </form>
        </details>
        <div className="chips">{chips.map(([label, k, v]) => <Link key={label} href={query(locale, k, v)}>{label}</Link>)}</div>
      </section>

      {/* 2. Vertical city cards */}
      <Section heading={t("Explore culinary destinations", "Esplora le destinazioni gastronomiche")} eyebrow={t("The world’s finest destinations", "Destinazioni dal mondo")}>
        <div className="grid cities">{cities.slice(0, 3).map((c) => <CityCard key={c.slug} city={c} locale={locale} />)}</div>
        <div className="topline"><More href={url(locale, "destinations")} label={t("View all destinations", "Vedi tutte le destinazioni")} /></div>
      </Section>

      {/* 3. Experiences */}
      <Section heading={t("Find your next experience", "Trova la tua prossima esperienza")}>
        <div className="grid two home-experiences">{experiences.map(([img, h, d, href]) => <Card key={img} img={img} heading={h} desc={d} href={href} sizes="(min-width: 1100px) 580px, 50vw" />)}</div>
      </Section>

      {/* 4. Tuscany panorama */}
      <Section heading={t("Travel for taste", "Viaggia per il gusto")}>
        <div className="wide"><Card img="tuscany" heading={t("A gastronomic journey through Tuscany", "Un viaggio gastronomico in Toscana")} desc={t("Explore Italy through its tables, vineyards and stays.", "Scopri l’Italia attraverso le sue tavole, i vigneti e i soggiorni.")} href={url(locale, "travel/tuscany")} sizes="(min-width: 1180px) 1180px, 100vw" /></div>
      </Section>

      <Section heading={t("Exceptional restaurants", "Ristoranti da scoprire")}>
        <Notice>{demo.notice}</Notice>
        <FeaturedTabs locale={locale} panels={panels} />
        <div className="topline"><More href={url(locale, "restaurants")} label={t("View all restaurants", "Vedi tutti i ristoranti")} /></div>
      </Section>

      <Section heading={t("Fine dining for every budget", "Fine dining per ogni budget")}>
        <div className="row">{[50, 100, 150, 250].map((n) => <Link key={n} className="btn" href={query(locale, "max", n)}>{t("Under", "Meno di")} {money(n, locale)}</Link>)}</div>
        <small>{demo.label}</small>
      </Section>

      <Section heading={t("Dine & Stay", "Cena e soggiorno")}>
        <div className="split">
          <Photo name="dining" alt={t("A dining room with warm lighting", "Una sala da pranzo con luce calda")} sizes="(min-width: 661px) 580px, 100vw" />
          <div><h3>{t("Exceptional dining deserves an exceptional stay.", "Una cena speciale merita un soggiorno all’altezza.")}</h3><p className="topline"><More href={url(locale, "hotels")} label={t("Explore stays", "Esplora i soggiorni")} /></p></div>
        </div>
      </Section>

      <Section heading={title("price-index", locale)}>
        <p className="lead">{t("Not enough verified data.", "Dati verificati insufficienti.")}</p>
        <More href={url(locale, "methodology")} label={title("methodology", locale)} />
      </Section>

      <Section heading="Magazine">
        <div className="grid two">
          <Card img="wine" heading={t("How to read a wine pairing", "Come leggere un abbinamento vini")} desc={t("Wine and Champagne", "Vino e Champagne")} href={url(locale, "magazine/wine")} sizes="(min-width: 1100px) 580px, 100vw" />
          <Card img="plate2" heading={t("How to compare tasting menus", "Come confrontare i menù degustazione")} desc={t("Fine dining guides", "Guide al fine dining")} href={url(locale, "magazine/menus")} sizes="(min-width: 1100px) 580px, 100vw" />
        </div>
      </Section>

      <section className="section dark">
        <div className="wrap">
          <h2>GastroAtlas Club</h2>
          <p className="lead">{t("Recommendations, saved lists and culinary journeys.", "Consigli, liste di preferiti e itinerari gastronomici.")}</p>
          <Link className="btn" href={url(locale, "club")}>{t("Discover the Club", "Scopri il Club")}</Link>
        </div>
      </section>

      <Section heading="Newsletter"><Notice>{t("Subscriptions are currently unavailable.", "Le iscrizioni non sono ancora disponibili.")}</Notice></Section>
    </>
  );
}
