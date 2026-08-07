import type { FaqItem } from "./types";
import type { Locale } from "./i18n/locale";

export const PRODUCT_FAQS_IT: FaqItem[] = [
  { question: "Quali sono i migliori prodotti senza glutine per la spesa quotidiana?", answer: "Pane, pasta, farine e sostituti certificati AIC coprono le esigenze di base: su Mappa Senza Glutine trovi i prodotti gluten free più recensiti dalla community, divisi per categoria." },
  { question: "Come riconosco un prodotto gluten free sicuro al supermercato?", answer: "Cerca il marchio della Spiga Barrata, gestito da AIC, oppure la dicitura \"senza glutine\" regolamentata a livello europeo: entrambi garantiscono un contenuto di glutine sotto i 20 ppm." },
  { question: "I prodotti senza glutine sono acquistabili con il buono AIC in farmacia?", answer: "Sì, i prodotti inseriti nel Prontuario AIC sono acquistabili con il buono mensile del Servizio Sanitario Nazionale in farmacia e nei negozi convenzionati." },
  { question: "Dove comprare prodotti senza glutine vicino a me?", answer: "Usa la directory di Mappa Senza Glutine filtrando per farmacie, supermercati o negozi specializzati: trovi indirizzo, orari e recensioni di ogni punto vendita vicino a te." },
];

export const PRODUCT_FAQS_EN: FaqItem[] = [
  { question: "What are the best gluten-free products for everyday shopping?", answer: "AIC-certified bread, pasta, flours and substitutes cover the basics: Mappa Senza Glutine lists the most reviewed gluten-free products from the community, sorted by category." },
  { question: "How do I recognize a safe gluten-free product at the supermarket?", answer: "Look for the Crossed Grain symbol, managed by AIC, or the \"gluten-free\" claim regulated at the European level: both guarantee a gluten content below 20 ppm." },
  { question: "Can gluten-free products be bought with the AIC pharmacy voucher?", answer: "Yes, products listed in the AIC Food Guide can be purchased with the National Health Service's monthly voucher at pharmacies and partner stores." },
  { question: "Where can I buy gluten-free products near me?", answer: "Use the Mappa Senza Glutine directory and filter by pharmacies, supermarkets or specialty stores: you'll find the address, hours and reviews for every venue near you." },
];

export function productDetailFaqs(locale: Locale, productName: string, brand: string, categoryLabel: string): FaqItem[] {
  if (locale === "en") {
    return [
      { question: `Where can I buy ${productName} near me?`, answer: `Check the "Where to buy it" section on this page: it lists verified stores that carry ${productName} in the Mappa Senza Glutine directory.` },
      { question: `Is ${brand} a reliable gluten-free brand?`, answer: `${brand} products shown on Mappa Senza Glutine are certified or declared gluten-free by the manufacturer and reviewed by the community: always check the AIC badge and reviews before buying.` },
      { question: `How do I know if ${categoryLabel.toLowerCase()} products are really gluten-free safe?`, answer: `Look for the Crossed Grain symbol or AIC certification, which guarantee a gluten content below 20 ppm, and always check the ingredient list if in doubt.` },
    ];
  }
  return [
    { question: `Dove posso comprare ${productName} vicino a me?`, answer: `Consulta la sezione "Dove trovarlo" in questa pagina: trovi i punti vendita verificati che hanno segnalato la disponibilità di ${productName} nella directory di Mappa Senza Glutine.` },
    { question: `${brand} è un marchio affidabile per prodotti senza glutine?`, answer: `I prodotti ${brand} mostrati su Mappa Senza Glutine sono certificati o dichiarati senza glutine dal produttore e recensiti dalla community: controlla sempre il badge AIC e le recensioni prima dell'acquisto.` },
    { question: `Come faccio a sapere se un prodotto della categoria ${categoryLabel.toLowerCase()} è davvero sicuro senza glutine?`, answer: `Cerca il marchio della Spiga Barrata o la certificazione AIC, che garantiscono un contenuto di glutine sotto i 20 ppm, e verifica sempre la lista ingredienti in caso di dubbio.` },
  ];
}
