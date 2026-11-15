export const SITE_NAME = "Mappa Senza Glutine";
export const SITE_URL = "https://www.mappasenzaglutine.it";
export const SITE_DESCRIPTION =
  "La mappa italiana dei locali senza glutine: ristoranti, hotel e negozi, prodotti verificati e guide su celiachia e alimentazione.";
export const SITE_DESCRIPTION_EN =
  "Italy's map of gluten-free venues: restaurants, hotels and shops near you, verified products, and guides on celiac disease and nutrition.";
export const SITE_LOCALE = "it_IT";

/**
 * Prodotto digitale: "Vivere Senza Glutine" (PDF a pagamento, guida di
 * riferimento compilata dai contenuti verificati del blog).
 * Carica il PDF su Payhip (payhip.com) o Gumroad (gumroad.com) — gratis,
 * gestiscono loro pagamento e download automatico — e incolla qui il link
 * della pagina prodotto/checkout. Finché è vuoto "", il bottone "Acquista"
 * nella pagina /vivere-senza-glutine non compare (nessun link rotto).
 */
export const GUIDE2 = {
  /** Link Payhip dell'edizione italiana. */
  checkoutUrl: "https://payhip.com/b/BOtuJ",
  /** Link Payhip dell'edizione inglese: finché è vuoto la pagina EN mostra "in arrivo" (nessun link rotto). */
  checkoutUrlEn: "",
  price: "$9.97",
  priceAmount: "9.97",
  priceCurrency: "USD",
};
