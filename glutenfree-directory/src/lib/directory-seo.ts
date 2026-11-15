import type { Metadata } from "next";
import { BUSINESSES } from "./mock-businesses";
import { filterBusinesses, parseFilters } from "./filter-businesses";
import { getCategoryInfo, categoryDescription, categoryLabelPlural } from "./categories";
import { cityName } from "./i18n/place-names";
import { getLocalizedBusiness } from "./i18n/content-business";
import { pageMetadata, seoTitle } from "./seo";
import { SITE_NAME } from "./site-config";
import type { Locale } from "./i18n/locale";

type SearchParams = Record<string, string | string[] | undefined>;

const MAX_TITLE = 60;
const MAX_DESC = 165;
const MIN_DESC = 120;

// Filtri che identificano una pagina "pulita" (solo città e/o categoria).
// Con qualunque altro parametro (ricerca libera, prezzo, ordinamento...)
// la pagina resta con i meta generici, come prima.
const CLEAN_KEYS = new Set(["comune", "categoria", "page"]);

// Nomi di categoria per gli elenchi dentro una frase (minuscoli, senza
// lasciare "b&bs" o "Cafés" a metà): non si può usare toLowerCase().
const LIST_LABEL: Record<string, { it: string; en: string }> = {
  ristorante: { it: "ristoranti", en: "restaurants" },
  pizzeria: { it: "pizzerie", en: "pizzerias" },
  hotel: { it: "hotel e B&B", en: "hotels & B&Bs" },
  farmacia: { it: "farmacie", en: "pharmacies" },
  supermercato: { it: "supermercati", en: "supermarkets" },
  negozio: { it: "negozi specializzati", en: "specialty shops" },
  "bar-pasticceria": { it: "bar e pasticcerie", en: "cafés & bakeries" },
  gelateria: { it: "gelaterie", en: "ice cream shops" },
};

const titleFits = (t: string) => seoTitle(t).length <= MAX_TITLE;
const pickTitle = (candidates: string[]) => candidates.find(titleFits) ?? candidates[candidates.length - 1];
const pickDescription = (candidates: string[]) => candidates.find((d) => d.length <= MAX_DESC) ?? candidates[candidates.length - 1];

/**
 * Meta della pagina /directory in base ai filtri (città o categoria). Tutti
 * i numeri (locali, certificati AIC, categorie presenti) sono calcolati dai
 * dati reali della directory. Una pagina senza alcun risultato viene esclusa
 * dall'indice (noindex): non ha nulla da mostrare a chi arriva da Google.
 */
export function directoryMetadata(sp: SearchParams, locale: Locale): Metadata {
  const en = locale === "en";
  const filters = parseFilters(sp);
  const results = filterBusinesses(filters);
  const n = results.length;
  const cleanFilters = Object.keys(sp).filter((k) => sp[k] !== undefined && sp[k] !== "").every((k) => CLEAN_KEYS.has(k));

  const cat = filters.categoria ? getCategoryInfo(filters.categoria) : undefined;
  const city = filters.comune ? BUSINESSES.find((b) => b.city.toLowerCase() === filters.comune!.toLowerCase())?.city : undefined;
  const venues = (count: number) => (en ? `${count} ${count === 1 ? "venue" : "venues"}` : `${count} ${count === 1 ? "locale" : "locali"}`);

  let meta: Metadata;

  if (cleanFilters && city && !cat) {
    const label = cityName(city, locale);
    const nAic = results.filter((b) => b.aicCertified).length;
    const catCounts = new Map<string, number>();
    for (const b of results) catCounts.set(b.category, (catCounts.get(b.category) ?? 0) + 1);
    const cats = [...catCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([slug]) => LIST_LABEL[slug]?.[locale] ?? categoryLabelPlural(getCategoryInfo(slug)!, locale).toLowerCase())
      .join(", ");
    const site = SITE_NAME;

    let title: string;
    let description: string;
    if (en) {
      title = n >= 3
        ? pickTitle([
            ...(nAic > 0 ? [`Gluten-free in ${label}: ${n} venues, ${nAic} AIC-certified`] : []),
            `Gluten-free in ${label}: ${n} verified venues`,
            `Gluten-free in ${label}: ${n} venues`,
            `Gluten-free in ${label}`,
          ])
        : `Gluten-free in ${label}`;
      const aic = nAic > 0 ? ` (${nAic} AIC-certified)` : "";
      description = n >= 2
        ? pickDescription([
            `${n} verified gluten-free venues in ${label}: ${cats}${aic}. Address, hours and menu on ${site}.`,
            `${n} verified gluten-free venues in ${label}: ${cats}. Address, hours and menu on ${site}.`,
          ])
        : pickDescription([
            `${getLocalizedBusiness(results[0], locale).shortDescription} The only venue verified so far in the city. Address and hours on ${site}.`,
            `${getLocalizedBusiness(results[0], locale).shortDescription} Address and hours on ${site}.`,
          ]);
    } else {
      title = n >= 3
        ? pickTitle([
            ...(nAic > 0 ? [`Senza glutine a ${label}: ${n} locali, ${nAic} ${nAic === 1 ? "certificato" : "certificati"} AIC`] : []),
            `Senza glutine a ${label}: ${n} locali verificati`,
            `Senza glutine a ${label}: ${n} locali`,
            `Senza glutine a ${label}`,
          ])
        : `Senza glutine a ${label}`;
      const aic = nAic > 0 ? ` (${nAic} ${nAic === 1 ? "certificato" : "certificati"} AIC)` : "";
      description = n >= 2
        ? pickDescription([
            `${n} locali senza glutine verificati a ${label}: ${cats}${aic}. Indirizzo, orari e menu su ${site}.`,
            `${n} locali senza glutine verificati a ${label}: ${cats}. Indirizzo, orari e menu su ${site}.`,
          ])
        : pickDescription([
            `${results[0].shortDescription} L'unico locale verificato finora in città. Indirizzo e orari su ${site}.`,
            `${results[0].shortDescription} Indirizzo e orari su ${site}.`,
          ]);
    }
    meta = pageMetadata({ title, description, path: `/directory?comune=${encodeURIComponent(city)}`, locale });
  } else if (cat) {
    const base = categoryDescription(cat, locale);
    const count = n === 0 ? "" : en ? ` ${venues(n)} verified on ${SITE_NAME}.` : ` ${n === 1 ? "1 locale verificato" : `${n} locali verificati`} su ${SITE_NAME}.`;
    const plural = categoryLabelPlural(cat, locale);
    const description = base.length < MIN_DESC && count ? pickDescription([base + count, base]) : base;
    meta = pageMetadata({
      title: en
        ? pickTitle([`Gluten-free ${LIST_LABEL[cat.slug]?.en ?? plural.toLowerCase()} in Italy`, `Gluten-free ${LIST_LABEL[cat.slug]?.en ?? plural.toLowerCase()}`])
        : pickTitle([`${plural} senza glutine in Italia`, `${plural} senza glutine`]),
      description,
      path: `/directory?categoria=${cat.slug}`,
      locale,
    });
  } else {
    const all = BUSINESSES.length;
    const certified = BUSINESSES.filter((b) => b.aicCertified).length;
    meta = pageMetadata(
      en
        ? {
            title: "Map of AIC-certified restaurants in Italy",
            description: `The map of AIC-certified restaurants and verified gluten-free venues in Italy: ${all} venues, ${certified} AIC-certified. Filter by city and category, find address and hours.`,
            path: "/directory",
            locale,
          }
        : {
            title: "Mappa ristoranti AIC certificati in Italia",
            description: `La mappa dei ristoranti certificati AIC e dei locali senza glutine verificati in Italia: ${all} locali, ${certified} certificati AIC. Filtra per città e categoria.`,
            path: "/directory",
            locale,
          },
    );
  }

  return n === 0 ? { ...meta, robots: { index: false, follow: true } } : meta;
}
