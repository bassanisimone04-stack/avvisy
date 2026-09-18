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
    title: "Il Secchio e l'Olivaro, Ostiense (Roma): pizza senza glutine dal 1999",
    description: "Il Secchio e l'Olivaro a Ostiense, via del Porto Fluviale: pizza alta cotta a legna con laboratorio dedicato al senza glutine dal 1999. Indirizzo, orari e menu su Mappa Senza Glutine.",
  },
  "celiachiamo-roma": {
    title: "Celiachiamo, EUR (Roma): forno 100% senza glutine",
    description: "Celiachiamo a Roma EUR: forno e pasticceria interamente dedicati al senza glutine, laboratorio interno, pizza al taglio e pane fresco ogni giorno. Indirizzo e orari su Mappa Senza Glutine.",
  },
  "la-rosa-dei-venti-milano": {
    title: "La Rosa dei Venti, Milano: ristorante di pesce certificato AIC",
    description: "La Rosa dei Venti a Milano (Sempione): ristorante di pesce certificato AIC dal 2001, segnalato dalla Guida Michelin. Pane e pasta senza glutine, indirizzo e orari su Mappa Senza Glutine.",
  },
  "be-bop-milano": {
    title: "Be Bop, Navigli (Milano): pizza senza glutine dal 1986",
    description: "Be Bop a Milano, vicino ai Navigli: pizzeria e ristorante dal 1986 con pizza e menu tradizionale in versione senza glutine, opzioni vegan. Indirizzo e orari su Mappa Senza Glutine.",
  },
  "fornerie-alessandrino-roma": {
    title: "Fornerie Alessandrino, Roma: cucina certificata AIC separata",
    description: "Fornerie Alessandrino nel quartiere Alessandrino, Roma: pizzeria, braceria e hamburgheria con cucina interamente certificata AIC e separata. Indirizzo e orari su Mappa Senza Glutine.",
  },
};

const OVERRIDES_EN: Record<string, Override> = {
  "il-secchio-e-l-olivaro-roma": {
    title: "Il Secchio e l'Olivaro, Ostiense (Rome): gluten-free pizza since 1999",
    description: "Il Secchio e l'Olivaro in Ostiense, via del Porto Fluviale: high wood-fired pizza with a dedicated gluten-free lab since 1999. Address, hours and menu on Mappa Senza Glutine.",
  },
  "celiachiamo-roma": {
    title: "Celiachiamo, EUR (Rome): 100% gluten-free bakery",
    description: "Celiachiamo in Rome's EUR district: bakery and pastry shop entirely dedicated to gluten-free, in-house lab, pizza by the slice and fresh bread daily. Address and hours on Mappa Senza Glutine.",
  },
  "la-rosa-dei-venti-milano": {
    title: "La Rosa dei Venti, Milan: AIC-certified seafood restaurant",
    description: "La Rosa dei Venti in Milan (Sempione): AIC-certified seafood restaurant since 2001, featured in the Michelin Guide. Gluten-free bread and pasta, address and hours on Mappa Senza Glutine.",
  },
  "be-bop-milano": {
    title: "Be Bop, Navigli (Milan): gluten-free pizza since 1986",
    description: "Be Bop in Milan, near the Navigli: pizzeria and restaurant since 1986 with pizza and traditional dishes in gluten-free versions, vegan options. Address and hours on Mappa Senza Glutine.",
  },
  "fornerie-alessandrino-roma": {
    title: "Fornerie Alessandrino, Rome: AIC-certified separate kitchen",
    description: "Fornerie Alessandrino in Rome's Alessandrino district: pizzeria, grill and burger joint with an entirely AIC-certified, separate kitchen. Address and hours on Mappa Senza Glutine.",
  },
};

export function businessSeoOverride(slug: string, locale: Locale): Override | undefined {
  return locale === "en" ? OVERRIDES_EN[slug] : OVERRIDES_IT[slug];
}
