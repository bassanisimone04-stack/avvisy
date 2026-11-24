import { cityPath } from "@/lib/city-pages";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import AicRestaurantsMap from "@/components/AicRestaurantsMap";
import FaqAccordion from "@/components/FaqAccordion";
import { JsonLd, faqJsonLd, itemListJsonLd } from "@/lib/seo";
import { aicRestaurants } from "@/lib/aic-map";
import { getLocalizedBusiness } from "@/lib/i18n/content-business";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { cityName } from "@/lib/i18n/place-names";
import type { FaqItem } from "@/lib/types";

export const AIC_MAP_PATH = "/mappa-ristoranti-aic";

/** FAQ per città (Roma, Milano): numeri e nomi calcolati dai dati, mai scritti a mano. */
function cityFaqs(locale: Locale): FaqItem[] {
  const en = locale === "en";
  return ["Roma", "Milano"].flatMap((city) => {
    const names = aicRestaurants().filter((b) => b.city === city).map((b) => b.name);
    if (names.length === 0) return [];
    const list = names.join(", ");
    const shown = cityName(city, locale);
    return [
      en
        ? {
            question: `Are there AIC restaurants in ${shown}?`,
            answer: `On this map we list ${names.length} restaurants and pizzerias in ${shown} that are marked as AIC members: ${list}. It is not the complete list for the city: check the AIC's own list and call the venue before you go.`,
          }
        : {
            question: `Ci sono ristoranti AIC a ${shown}?`,
            answer: `Sulla nostra mappa trovi ${names.length} ristoranti e pizzerie a ${shown} che risultano aderenti ad AIC: ${list}. Non è l'elenco completo della città: controlla anche quello di AIC e telefona al locale prima di andare.`,
          },
    ];
  });
}

export function aicMapFaqs(locale: Locale, n: number, cities: number): FaqItem[] {
  return [...baseFaqs(locale, n, cities), ...cityFaqs(locale)];
}

function baseFaqs(locale: Locale, n: number, cities: number): FaqItem[] {
  return locale === "en"
    ? [
        { question: "What is the map of AIC restaurants?", answer: `A map of the restaurants and pizzerias in the Mappa Senza Glutine directory that take part in the Alimentazione Fuori Casa program of the Italian Celiac Association (AIC). Today it shows ${n} venues in ${cities} cities.` },
        { question: "What is the AIC circuit (Alimentazione Fuori Casa)?", answer: "It is the network of venues in the AIC's Alimentazione Fuori Casa (AFC) program: restaurants, pizzerias, bars, ice cream shops, hotels and other venues whose staff has taken the association's training, which follow procedures agreed with the AIC and are checked periodically. This map is a shorter list of that network: only the restaurants and pizzerias we have checked." },
        { question: "Are all the venues on the map AIC members?", answer: "Yes: only restaurants and pizzerias marked as AIC members in our directory appear here. Hotels, shops, pharmacies, bakeries and ice cream shops are left out on purpose, and you'll find them in the full directory." },
        { question: "Is this the complete list of AIC restaurants in Italy?", answer: `No. The map shows only the venues we have checked so far, ${n} in ${cities} cities. The complete and up-to-date list of members is published by AIC itself, on its website and in its app: use it alongside ours.` },
        { question: "Does AIC membership mean zero risk?", answer: "No. Membership means the staff has been trained and the venue follows procedures agreed with the association, which lowers the margin of error, but it is not a guarantee against every risk. It's still worth telling the staff you have celiac disease and asking about the fryer and the kitchen." },
        { question: "How do I add my restaurant to the map?", answer: "Use the For businesses page to submit your venue: listings are published for free." },
      ]
    : [
        { question: "Cos'è la mappa dei ristoranti AIC?", answer: `È una mappa dei ristoranti e delle pizzerie della directory di Mappa Senza Glutine che aderiscono al programma Alimentazione Fuori Casa dell'Associazione Italiana Celiachia (AIC). Oggi mostra ${n} locali in ${cities} città.` },
        { question: "Cos'è il circuito AIC (Alimentazione Fuori Casa)?", answer: "È la rete di locali del programma Alimentazione Fuori Casa (AFC) dell'AIC: ristoranti, pizzerie, bar, gelaterie, hotel e altri locali il cui personale ha seguito la formazione dell'associazione, che adottano procedure condivise con l'AIC e ricevono controlli periodici. Questa mappa è un elenco ridotto di quella rete: solo i ristoranti e le pizzerie che abbiamo verificato." },
        { question: "Tutti i locali della mappa aderiscono ad AIC?", answer: "Sì: qui compaiono solo i ristoranti e le pizzerie che nella nostra directory risultano aderenti ad AIC. Hotel, negozi, farmacie, pasticcerie e gelaterie sono esclusi di proposito, e li trovi nella directory completa." },
        { question: "È l'elenco completo dei ristoranti AIC in Italia?", answer: `No. La mappa mostra solo i locali che abbiamo verificato finora, ${n} in ${cities} città. L'elenco completo e aggiornato degli aderenti lo pubblica AIC stessa, sul suo sito e nella sua app: conviene usarlo insieme al nostro.` },
        { question: "L'adesione ad AIC significa rischio zero?", answer: "No. Significa che il personale è formato e che il locale segue procedure condivise con l'associazione, e questo riduce il margine di errore, ma non è una garanzia contro ogni rischio. Resta utile dire che si è celiaci e chiedere di friggitrice e cucina." },
        { question: "Come aggiungo il mio ristorante alla mappa?", answer: "Dalla pagina Per le aziende puoi proporre il tuo locale: le schede sono pubblicate gratuitamente." },
      ];
}

export default function AicMapContent({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const h = (path: string) => localeHref(locale, path);
  const list = aicRestaurants().map((b) => getLocalizedBusiness(b, locale));
  const n = list.length;
  const cities = new Set(list.map((b) => b.city)).size;
  const topCities = [...list.reduce((m, b) => m.set(b.city, (m.get(b.city) ?? 0) + 1), new Map<string, number>())]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([c, k]) => `${cityName(c, locale)} (${k})`)
    .join(", ");
  const faqs = aicMapFaqs(locale, n, cities);

  return (
    <div className="container-page py-10">
      <JsonLd data={itemListJsonLd(list.map((b) => ({ name: b.name, path: h(`/directory/${b.slug}`) })))} />
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs locale={locale} items={[{ name: en ? "AIC restaurants map" : "Mappa ristoranti AIC", path: AIC_MAP_PATH }]} />

      <header className="max-w-3xl">
        <h1 className="font-editorial text-3xl font-semibold text-ink sm:text-4xl">
          {en ? "Map of AIC restaurants in Italy" : "Mappa dei ristoranti AIC in Italia"}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">
          {en
            ? `${n} restaurants and pizzerias in ${cities} cities that take part in the AIC Alimentazione Fuori Casa program, all in one map. Pick a city or tap a pin to see the address and open the listing.`
            : `${n} ristoranti e pizzerie in ${cities} città che aderiscono al programma Alimentazione Fuori Casa di AIC, in un'unica mappa. Scegli una città o tocca un pin per vedere l'indirizzo e aprire la scheda.`}
        </p>
      </header>

      <div className="mt-8">
        <AicRestaurantsMap businesses={list} locale={locale} />
      </div>

      {/* Elenco leggibile anche senza JavaScript: dà a ogni scheda un link in entrata
          e a Google il percorso verso le pagine città. */}
      <section className="mt-12" aria-label={en ? "AIC restaurants by city" : "Ristoranti AIC per città"}>
        <h2 className="font-editorial text-2xl font-semibold text-ink">
          {en ? "AIC restaurants and pizzerias, city by city" : "Ristoranti e pizzerie AIC, città per città"}
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...list.reduce((m, b) => m.set(b.city, [...(m.get(b.city) ?? []), b]), new Map<string, typeof list>())]
            .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
            .map(([c, items]) => (
              <div key={c} className="card card-soft p-5">
                <h3 className="font-semibold text-ink">
                  <Link href={h(cityPath(c))} className="link-underline hover:text-brand-dark">
                    {cityName(c, locale)}
                  </Link>{" "}
                  <span className="text-sm font-normal text-muted">({items.length})</span>
                </h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {items.map((b) => (
                    <li key={b.id}>
                      <Link href={h(`/directory/${b.slug}`)} className="text-brand-dark hover:underline">{b.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>

      <div className="mt-12 max-w-3xl">
        <h2 className="font-editorial text-2xl font-semibold text-ink">
          {en ? "What \"AIC restaurant\" means" : "Cosa significa \"ristorante AIC\""}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "The Italian Celiac Association (AIC) runs the Alimentazione Fuori Casa program, which venues join voluntarily: it involves training for the staff and procedures agreed with the association for preparing and serving gluten-free dishes. Technically it is not a certification in the strict sense, but it is the reference people with celiac disease look for when they eat out."
            : "L'Associazione Italiana Celiachia (AIC) gestisce il programma Alimentazione Fuori Casa, a cui i locali aderiscono volontariamente: prevede la formazione del personale e procedure condivise con l'associazione per la preparazione e il servizio dei piatti senza glutine. Tecnicamente non è una certificazione in senso stretto, ma è il riferimento che i celiaci cercano quando mangiano fuori."}{" "}
          {en ? "We explain it in detail in the guide to " : "Lo spieghiamo nel dettaglio nella guida alla "}
          <Link href={h("/blog/certificazione-aic-cosa-significa-e-come-riconoscere-un-locale-davvero-certificato")} className="link-underline text-brand-dark">
            {en ? "AIC certification" : "certificazione AIC"}
          </Link>
          .
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">
          {en ? "The AIC circuit: what Alimentazione Fuori Casa is and how to read this list" : "Il circuito AIC: cos'è l'Alimentazione Fuori Casa e come leggere questa lista"}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "When people talk about the «AIC circuit» or the «list of AIC restaurants», they mean the network of venues in the Alimentazione Fuori Casa (AFC) program: restaurants, pizzerias, bars, ice cream shops, hotels and other venues that have taken the Italian Celiac Association's training, follow procedures agreed with the association and are checked periodically. In its December 2024 guidelines for Christmas and New Year, the AIC pointed to the AFC Guide with over 4,000 trained venues. This page is a shorter list drawn from that network: only the restaurants and pizzerias we have checked. For the complete list use the AIC website and app; to see how joining works, read the guide for "
            : "Quando si parla di «circuito AIC» o di «lista dei ristoranti AIC» si intende la rete di locali del programma Alimentazione Fuori Casa (AFC): ristoranti, pizzerie, bar, gelaterie, hotel e altri locali che hanno seguito la formazione dell'Associazione Italiana Celiachia, adottano procedure condivise con l'associazione e ricevono controlli periodici. Nel suo decalogo per Natale e Capodanno del dicembre 2024, l'AIC indicava la Guida AFC con oltre 4.000 locali formati. Questa pagina è un elenco ridotto di quella rete: solo i ristoranti e le pizzerie che abbiamo verificato. Per l'elenco completo usa il sito e l'app dell'AIC; per capire come funziona l'adesione, c'è la guida per i "}
          <Link href={h("/blog/ristoratori-come-aderire-al-programma-aic-alimentazione-fuori-casa")} className="link-underline text-brand-dark">
            {en ? "restaurateurs" : "ristoratori"}
          </Link>
          .
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">
          {en ? "What's on the map, and what isn't" : "Cosa c'è sulla mappa e cosa no"}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? `Only restaurants and pizzerias that we've checked and marked as AIC members appear here: ${n} venues in ${cities} cities, with the most in ${topCities}. It is not the complete list of AIC venues in Italy, which is published by AIC on its website and app, and some cities are still missing. We add a venue only after checking it, so the map grows slowly but stays reliable. Hotels, shops, pharmacies, bakeries and ice cream shops are in the `
            : `Qui compaiono solo i ristoranti e le pizzerie che abbiamo verificato e che risultano aderenti ad AIC: ${n} locali in ${cities} città, con più presenze a ${topCities}. Non è l'elenco completo dei locali AIC in Italia, che AIC pubblica sul suo sito e nella sua app, e mancano ancora diverse città. Aggiungiamo un locale solo dopo averlo verificato, quindi la mappa cresce piano ma resta affidabile. Hotel, negozi, farmacie, pasticcerie e gelaterie sono nella `}
          <Link href={h("/directory")} className="link-underline text-brand-dark">{en ? "full directory" : "directory completa"}</Link>
          {en ? ". Own a restaurant? " : ". Hai un ristorante? "}
          <Link href={h("/per-le-aziende")} className="link-underline text-brand-dark">{en ? "Add it for free" : "Aggiungilo gratis"}</Link>
          .
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">
          {en ? "Before you go: three questions" : "Prima di andare: tre domande"}
        </h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "Membership lowers the risk but does not remove it, and a venue can change its procedures. A one-minute call is enough: do you have a dedicated kitchen or oven? Is the fryer separate? Are the gluten-free flours stored apart? Always say you have celiac disease, not that you prefer gluten-free food. More tips in the guides on "
            : "L'adesione riduce il rischio ma non lo azzera, e un locale può cambiare le proprie procedure. Basta una telefonata di un minuto: avete una cucina o un forno dedicati? La friggitrice è separata? Le farine senza glutine sono conservate a parte? Di' sempre che sei celiaco, non che preferisci il senza glutine. Altri consigli nelle guide su "}
          <Link href={h("/blog/come-evitare-la-contaminazione-crociata-al-ristorante-la-guida-completa-per-mangiare-senza-glutine-in-sicurezza")} className="link-underline text-brand-dark">
            {en ? "avoiding cross-contamination at restaurants" : "come evitare la contaminazione crociata al ristorante"}
          </Link>
          {en ? " and on " : " e su "}
          <Link href={h("/blog/senza-glutine-vicino-a-me-come-trovare-ristoranti-negozi-e-farmacie")} className="link-underline text-brand-dark">
            {en ? "finding gluten-free places near you" : "come trovare locali senza glutine vicino a te"}
          </Link>
          .
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "Frequently asked questions" : "Domande frequenti"}</h2>
        <div className="mt-4">
          <FaqAccordion items={faqs} />
        </div>
      </div>
    </div>
  );
}
