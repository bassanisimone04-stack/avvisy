import type { Locale } from "./i18n/locale";

/**
 * Override di title/description per le schede locale con impressioni alte
 * ma zero clic (vedi audit Search Console del 18/09/2026): il template
 * generico "Nome a Città" non dà nessun motivo di cliccare noi invece della
 * scheda Google del locale, che ha già mappa e orari in tempo reale.
 * Qui invece nomino il quartiere/via (spesso è la query di ricerca stessa,
 * come "il secchio e l'olivaro via del porto fluviale") e un elemento di
 * sicurezza specifico preso dai dati reali già presenti in mock-businesses.
 * Tutti i fatti citati (anno di apertura, certificazione, tipo di forno)
 * sono già nella scheda del locale: nessun dato nuovo o non verificato.
 */
interface Override {
  title: string;
  description: string;
}

const OVERRIDES_IT: Record<string, Override> = {
  "il-secchio-e-l-olivaro-roma": {
    title: "Il Secchio e l'Olivaro, Ostiense: pizza dal 1999",
    description: "Il Secchio e l'Olivaro a Ostiense, via del Porto Fluviale: pizza cotta a legna, laboratorio dedicato al senza glutine dal 1999. Su Mappa Senza Glutine.",
  },
  "celiachiamo-roma": {
    title: "Celiachiamo, Roma EUR: forno 100% senza glutine",
    description: "Celiachiamo a Roma EUR: forno e pasticceria dedicati al senza glutine, laboratorio interno, pizza e pane fresco ogni giorno. Su Mappa Senza Glutine.",
  },
  "la-rosa-dei-venti-milano": {
    title: "La Rosa dei Venti, Milano: ristorante certificato AIC",
    description: "La Rosa dei Venti a Milano: ristorante di pesce certificato AIC dal 2001, segnalato dalla Guida Michelin. Indirizzo e orari su Mappa Senza Glutine.",
  },
  "be-bop-milano": {
    title: "Be Bop, Navigli: pizza senza glutine dal 1986",
    description: "Be Bop a Milano, vicino ai Navigli: pizzeria dal 1986 con pizza e menu tradizionale senza glutine, opzioni vegan. Indirizzo su Mappa Senza Glutine.",
  },
  "fornerie-alessandrino-roma": {
    title: "Fornerie Alessandrino, Roma: cucina AIC separata",
    description: "Fornerie Alessandrino a Roma: pizzeria, braceria e hamburgheria con cucina interamente certificata AIC e separata. Indirizzo su Mappa Senza Glutine.",
  },
};

const OVERRIDES_EN: Record<string, Override> = {
  "il-secchio-e-l-olivaro-roma": {
    title: "Il Secchio e l'Olivaro, Ostiense: pizza since 1999",
    description: "Il Secchio e l'Olivaro in Ostiense, via del Porto Fluviale: wood-fired pizza with a dedicated gluten-free lab since 1999. On Mappa Senza Glutine.",
  },
  "celiachiamo-roma": {
    title: "Celiachiamo, Rome EUR: 100% gluten-free bakery",
    description: "Celiachiamo in Rome's EUR district: bakery dedicated to gluten-free, pizza and fresh bread daily. Address on Mappa Senza Glutine.",
  },
  "la-rosa-dei-venti-milano": {
    title: "La Rosa dei Venti, Milan: AIC-certified restaurant",
    description: "La Rosa dei Venti in Milan: AIC-certified seafood restaurant since 2001, featured in the Michelin Guide. Address and hours on Mappa Senza Glutine.",
  },
  "be-bop-milano": {
    title: "Be Bop, Navigli: gluten-free pizza since 1986",
    description: "Be Bop in Milan, near the Navigli: pizzeria since 1986 with pizza and traditional dishes gluten-free, vegan options. Address on Mappa Senza Glutine.",
  },
  "fornerie-alessandrino-roma": {
    title: "Fornerie Alessandrino, Rome: AIC-certified kitchen",
    description: "Fornerie Alessandrino in Rome: pizzeria, grill and burger joint with an entirely AIC-certified, separate kitchen. Address on Mappa Senza Glutine.",
  },
};

export function businessSeoOverride(slug: string, locale: Locale): Override | undefined {
  return locale === "en" ? OVERRIDES_EN[slug] : OVERRIDES_IT[slug];
}
