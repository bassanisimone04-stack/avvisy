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
  url: "https://cinefood-italia.example.com",

  /** Lingua del sito (usata nel tag <html lang>). */
  lang: "it",

  /** Email di contatto mostrata nelle pagine e nei form. */
  email: "info@cinefood-italia.example.com",

  /** Autore/organizzazione (usato nei dati strutturati). */
  author: "CineFood Italia",

  /** Link ai social (lascia vuoto "" per nasconderli dal footer). */
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "",
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
