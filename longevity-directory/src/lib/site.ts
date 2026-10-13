/**
 * ============================================================
 *  CONFIGURAZIONE CENTRALE DEL SITO
 * ============================================================
 * Unico file da cambiare per rinominare il progetto, aggiornare
 * lo slogan o il dominio pubblico.
 */
export const SITE = {
  name: "Longevità",
  tagline: "La medicina della longevità, vicino a te",
  /** ≤160 caratteri: usata come meta description di default (home e pagine senza una propria). */
  description:
    "Cliniche, diagnostica e professionisti della longevità e della medicina preventiva. Criteri pubblici, medico responsabile sempre in chiaro.",
  /** ▶️ CAMBIA QUESTO quando pubblichi online. */
  url: "https://www.longevita-directory.it",
  lang: "it",
  email: "info@longevita-directory.it",
  author: "Longevità",
  social: {
    instagram: "",
    linkedin: "",
  },
} as const;
