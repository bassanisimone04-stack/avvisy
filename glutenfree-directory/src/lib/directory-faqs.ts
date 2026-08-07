import type { FaqItem } from "./types";
import type { Locale } from "./i18n/locale";

// Genere grammaticale del nome plurale di categoria, per costruire frasi
// italiane con il corretto accordo (es. "le migliori pizzerie", non "i migliori").
const FEMININE_CATEGORIES = new Set(["pizzeria", "farmacia", "gelateria"]);

export function directoryFaqs(locale: Locale, cityLabel?: string, category?: { slug: string; label: string }): FaqItem[] {
  const categoryLabel = category?.label;
  if (locale === "en") {
    const catPart = categoryLabel ? `gluten-free ${categoryLabel.toLowerCase()}` : "gluten-free venues";
    if (cityLabel) {
      return [
        { question: `Where can I find the best ${catPart} in ${cityLabel}?`, answer: `Mappa Senza Glutine lists all the ${catPart} in ${cityLabel}, verified through AIC certification or community reviews, filterable by rating and distance.` },
        { question: `How do I know if a restaurant in ${cityLabel} is safe for celiacs?`, answer: `Check the badge on the listing: AIC certified, or community verified, and read real reviews from other celiacs before booking.` },
        { question: `Are there gluten-free venues open now in ${cityLabel}?`, answer: `Use the "Open now" quick filter above the results to see only currently open venues in ${cityLabel}.` },
      ];
    }
    if (categoryLabel) {
      return [
        { question: `What are the best ${catPart} in Italy?`, answer: `Mappa Senza Glutine collects ${catPart} verified across Italy, with AIC certification and community reviews: filter by city, rating and price to find the best ones near you.` },
        { question: `How do I find a certified ${categoryLabel.toLowerCase()} near me?`, answer: `Enable your browser's location and use the "AIC certified" quick filter above the results to instantly see verified venues in this category closest to you.` },
        { question: `What does the AIC badge mean on a ${categoryLabel.toLowerCase()} listing?`, answer: `It means the venue has passed periodic AIC audits on gluten-free purchasing, storage and preparation procedures, the strongest reliability signal available.` },
      ];
    }
    return [
      { question: "How do I find gluten-free restaurants near me?", answer: "Enable your browser's location and use the quick filters above the results (category, AIC certification, open now) to instantly see verified venues closest to you." },
      { question: "Which Italian cities have the most certified gluten-free venues?", answer: "Milan, Rome, Bologna and Naples are among the cities with the highest concentration of AIC-certified venues, but the directory covers over 100 cities across Italy." },
      { question: "What's the difference between an \"AIC certified\" and a \"Community verified\" venue?", answer: "The AIC badge means an official certification with periodic audits; the \"Community verified\" badge flags venues considered safe by user reviews, without official certification." },
    ];
  }

  const feminine = category ? FEMININE_CATEGORIES.has(category.slug) : false;
  const migliori = feminine ? "le migliori" : "i migliori";
  const certificate = feminine ? "certificate" : "certificati";
  const catPart = categoryLabel ? `${categoryLabel.toLowerCase()} senza glutine` : "locali senza glutine";

  if (cityLabel) {
    return [
      { question: `Quali sono ${migliori} ${catPart} a ${cityLabel}?`, answer: `Su Mappa Senza Glutine trovi tutti i ${catPart} di ${cityLabel} verificati, con certificazione AIC o dalla community, filtrabili per valutazione e distanza.` },
      { question: `Come faccio a sapere se un ristorante a ${cityLabel} è sicuro per celiaci?`, answer: `Controlla il badge sulla scheda: certificazione AIC, oppure verificato dalla community, e leggi le recensioni reali di altri celiaci prima di prenotare.` },
      { question: `Ci sono locali senza glutine a ${cityLabel} aperti ora?`, answer: `Usa il filtro rapido "Aperto ora" sopra i risultati per vedere subito solo i locali attualmente aperti a ${cityLabel}.` },
    ];
  }
  if (categoryLabel) {
    return [
      { question: `Quali sono ${migliori} ${catPart} in Italia?`, answer: `Mappa Senza Glutine raccoglie ${catPart} verificati in tutta Italia, con certificazione AIC e recensioni della community: filtra per città, valutazione e fascia di prezzo per trovare i migliori vicino a te.` },
      { question: `Come trovo ${catPart} ${certificate} AIC vicino a me?`, answer: `Attiva la geolocalizzazione del browser e usa il filtro rapido "Certificati AIC" sopra i risultati per vedere subito i locali di questa categoria verificati più vicini a te.` },
      { question: `Cosa significa il badge AIC su una scheda di questa categoria?`, answer: `Significa che il locale ha superato controlli periodici AIC su acquisti, stoccaggio e preparazione dei pasti senza glutine: è il segnale di affidabilità più forte disponibile.` },
    ];
  }
  return [
    { question: "Come trovo ristoranti senza glutine vicino a me?", answer: "Attiva la geolocalizzazione del browser e usa i filtri rapidi sopra i risultati (categoria, certificazione AIC, aperto ora) per vedere subito i locali verificati più vicini a te." },
    { question: "Quali città italiane hanno più locali senza glutine certificati?", answer: "Milano, Roma, Bologna e Napoli sono tra le città con la maggiore concentrazione di locali certificati AIC, ma la directory copre oltre 100 città in tutta Italia." },
    { question: "Qual è la differenza tra un locale \"Certificato AIC\" e uno \"Verificato dalla community\"?", answer: "Il badge AIC indica una certificazione ufficiale con controlli periodici; il badge \"Verificato dalla community\" segnala locali considerati sicuri dalle recensioni degli utenti, senza certificazione ufficiale." },
  ];
}
