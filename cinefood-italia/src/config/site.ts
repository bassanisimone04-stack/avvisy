/**
 * ============================================================
 *  CONFIGURAZIONE CENTRALE DEL SITO
 * ============================================================
 *
 * Questo è l'UNICO file da modificare per cambiare il nome del
 * sito, lo slogan, i contatti e i link social.
 *
 * 👉 Per rinominare il sito: cambia semplicemente `name` qui sotto.
 *    Il nuovo nome comparirà automaticamente ovunque (header,
 *    footer, titoli delle pagine, SEO, ecc.).
 */
export const SITE = {
  /** Nome del sito (BRAND). Cambia solo questa riga per rinominarlo. */
  name: "CineFood Italia",

  /** Slogan/tagline mostrato nell'hero e nei meta tag. */
  tagline: "I ristoranti, bar e caffè italiani visti nei film e nelle serie TV",

  /** Descrizione breve usata per SEO e Open Graph (max ~160 caratteri). */
  description:
    "La guida ai ristoranti, bar, caffè e trattorie d'Italia apparsi al cinema e in TV. Scopri dove hanno mangiato i tuoi personaggi preferiti e prenota il tuo tavolo tra le stelle.",

  /**
   * URL pubblico del sito (senza slash finale).
   * ▶️ CAMBIA QUESTO quando pubblichi online su Netlify/Vercel,
   *    es. "https://cinefooditalia.netlify.app".
   */
  url: "https://cinefooditalia.com",

  /** Lingua del sito (usata nel tag <html lang>). */
  lang: "it",

  /** Email di contatto mostrata nelle pagine e nei form. */
  email: "info@cinefooditalia.com",

  /** Autore/organizzazione (usato nei dati strutturati). */
  author: "CineFood Italia",

  /**
   * Codice di verifica Google Search Console.
   * ▶️ Vai su https://search.google.com/search-console, aggiungi il sito,
   *    scegli "Tag HTML" e incolla QUI solo il valore `content` del meta
   *    (es. "AbCdEf123..."). Serve per far indicizzare il sito su Google
   *    e monitorare le ricerche. Lascia "" se non l'hai ancora fatto.
   */
  googleSiteVerification: "",

  /** Link ai social (lascia vuoto "" per nasconderli dal footer). */
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "",
  },

  /**
   * Statistiche visite (facoltative e rispettose della privacy).
   * Per attivarle: crea un account gratuito su https://plausible.io,
   * poi scrivi qui il dominio del tuo sito (es. "cinefooditalia.it").
   * Lascia "" per NON caricare alcuno script di tracciamento (default).
   * Plausible non usa cookie e non raccoglie dati personali.
   */
  plausibleDomain: "",

  /**
   * Link di affiliazione (monetizzazione). Lascia i valori vuoti "" finché
   * non hai un account: i box "Prenota" nel blog restano visibili e
   * funzionanti (portano a Booking.com/GetYourGuide) ma SENZA guadagnare
   * commissioni. Appena hai l'ID, incollalo qui: tutti i link del sito
   * iniziano a tracciare automaticamente, senza toccare i contenuti.
   */
  affiliates: {
    /**
     * ID affiliato Booking.com ("aid"). Iscriviti su
     * https://www.booking.com/affiliate-program/v2/index.html — gratuito,
     * nessuna soglia minima di traffico richiesta.
     */
    bookingAid: "",
    /**
     * ID partner GetYourGuide. Iscriviti su
     * https://partner.getyourguide.com/ — gratuito, nessuna soglia minima.
     */
    getyourguidePartnerId: "",
  },

  /**
   * Prodotto digitale: "La Guida CineFood Italia" (PDF a pagamento).
   * ▶️ Carica il PDF su Gumroad (gumroad.com) o Payhip (payhip.com) — gratis,
   *    gestiscono loro pagamento e download automatico — e incolla qui il
   *    link della pagina prodotto/checkout. Finché è vuoto "", il bottone
   *    "Acquista" nella pagina /guida non compare (nessun link rotto).
   */
  guida: {
    checkoutUrl: "",
    prezzo: "5,99 €",
  },
} as const;

/**
 * Voci del menu di navigazione principale.
 * Aggiungi/rimuovi voci qui per cambiare il menu del sito.
 */
export const NAV_LINKS = [
  { label: "Locali", href: "/locali" },
  { label: "Film", href: "/film" },
  { label: "Mappa", href: "/mappa" },
  { label: "Blog", href: "/blog" },
  { label: "Inserzioni", href: "/inserzioni" },
] as const;

export type Site = typeof SITE;
