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
    title: "Il Secchio e l'Olivaro, Porto Fluviale: senza glutine",
    description: "Il Secchio e l'Olivaro, via del Porto Fluviale 3 a Roma: pizza cotta a legna e menu senza glutine in laboratorio dedicato dal 1999. Orari, telefono e indirizzo.",
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
    title: "Be Bop Milano, Navigli: pizza senza glutine",
    description: "Be Bop a Milano, vicino ai Navigli: pizzeria dal 1986 con pizza e menu tradizionale senza glutine, opzioni vegan. Indirizzo su Mappa Senza Glutine.",
  },
  "fornerie-alessandrino-roma": {
    title: "Fornerie Alessandrino, Roma: cucina AIC separata",
    description: "Fornerie Alessandrino a Roma: pizzeria, braceria e hamburgheria con cucina interamente certificata AIC e separata. Indirizzo su Mappa Senza Glutine.",
  },
  "mama-eat-milano": {
    title: "Mama Eat Milano, via Procaccini: cucina AIC",
    description: "Mama Eat in via Procaccini, Milano: ristorante-pizzeria certificato AIC con doppia cucina separata, tutto il menu anche senza glutine. Su Mappa Senza Glutine.",
  },
  "no-gluten-bakery-palermo": {
    title: "No Gluten Bakery Palermo: forno dedicato",
    description: "No Gluten Bakery in via Simone Cuccia, Palermo: forno e pasticceria con laboratorio senza glutine, brioche, pane, pizza e panelle. Su Mappa Senza Glutine.",
  },
  "randazzo-gluten-free-genova": {
    title: "Randazzo Gluten Free, Sestri Ponente: AIC",
    description: "Randazzo Gluten Free a Sestri Ponente, Genova: panificio-pasticceria solo senza glutine, aperto a fine 2024, nel circuito AIC Liguria. Su Mappa Senza Glutine.",
  },
  "hotel-al-piave-venezia": {
    title: "Hotel Al Piave Venezia: hotel certificato AIC",
    description: "Hotel Al Piave a Castello, vicino a San Marco: uno dei pochi hotel di Venezia con certificazione AIC, colazione interamente senza glutine. Su Mappa Senza Glutine.",
  },
  "gusto-libero-verona": {
    title: "Gusto Libero Verona: negozio senza glutine",
    description: "Gusto Libero in via Luigi Dorigo 14, Verona: negozio con oltre 100 prodotti senza glutine e senza lattosio, convenzionato ULSS per i buoni. Su Mappa Senza Glutine.",
  },
  "senza-pensieri-healthy-bakery-roma": {
    title: "Senza Pensieri Healthy Bakery, San Lorenzo",
    description: "Senza Pensieri Healthy Bakery a San Lorenzo, Roma: dolce e salato senza glutine, molte opzioni vegan e senza lattosio. Su Mappa Senza Glutine.",
  },
  "casa-biga-milano": {
    title: "Casa Biga, Isola: pizza senza glutine AIC",
    description: "Casa Biga nel quartiere Isola a Milano: pizzeria certificata AIC, premiata Best Pizza GF 2025, con impasto a lunga lievitazione. Indirizzo su Mappa Senza Glutine.",
  },
  "mama-eat-roma": {
    title: "Mama Eat Roma, Borgo Pio: cucina AIC",
    description: "Mama Eat a Borgo Pio, vicino al Vaticano: ristorante certificato AIC con doppia cucina separata e piatti su stoviglie di colore diverso. Su Mappa Senza Glutine.",
  },
  "pizzeria-starita-napoli": {
    title: "Pizzeria Starita, Materdei: forno dedicato",
    description: "Pizzeria Starita a Materdei, Napoli, dal 1901: tutte le pizze anche senza glutine, cotte in un forno separato dedicato. Indirizzo e orari su Mappa Senza Glutine.",
  },
  "ciro-sons-firenze": {
    title: "Ciro & Sons Firenze: pizzeria AIC",
    description: "Ciro & Sons in via del Giglio a Firenze: dal 1948, campione mondiale di pizza senza glutine, certificato AIC e AVPN, con forno separato. Su Mappa Senza Glutine.",
  },
  "quinoa-firenze": {
    title: "Quinoa, Firenze: ristorante senza glutine",
    description: "Quinoa a Firenze: il primo ristorante 100% senza glutine della città, aperto dal 2014 e certificato AIC, in un chiostro cinquecentesco. Su Mappa Senza Glutine.",
  },
  "zero-gelato-milano": {
    title: "Zero Gelato, Milano: gelateria AIC",
    description: "Zero Gelato in Corso Ventidue Marzo, Milano: gelateria certificata AIC con gusti interamente senza glutine e molte varianti senza lattosio. Su Mappa Senza Glutine.",
  },
  "solho-bari": {
    title: "Solho Bari: pizza in teglia senza glutine",
    description: "Solho in via Sparano a Bari: pizza in teglia con farina di riso come alternativa senza glutine, accanto alla cucina pugliese. Indirizzo su Mappa Senza Glutine.",
  },
  "leopoldo-cafebar-napoli": {
    title: "Leopoldo Cafebar: pasticceria senza glutine",
    description: "Leopoldo Cafebar in piazza Cavour, Napoli, di fronte al MANN: pasticceria napoletana esclusivamente senza glutine, con laboratorio dedicato. Su Mappa Senza Glutine.",
  },
  "glufree-bakery-milano": {
    title: "GluFree Bakery, Porta Romana: circuito AIC",
    description: "GluFree Bakery in via Curtatone, Milano: panificio e pasticceria con laboratorio 100% senza glutine, nel circuito AIC. Su Mappa Senza Glutine.",
  },
  "pizzeria-oke-venezia": {
    title: "Pizzeria OKE, Zattere: due cucine separate",
    description: "Pizzeria OKE alle Zattere, Venezia: tra i primi locali formati dall'AIC, con due cucine fisicamente separate e consegna in alcune zone. Su Mappa Senza Glutine.",
  },
  "le-specialita-milano": {
    title: "Le Specialità Milano: pizzeria AIC",
    description: "Le Specialità in via Pietro Calvi, Milano: pizzeria storica dal 1977, certificata AIC, con oltre 50 pizze al forno a legna senza glutine. Su Mappa Senza Glutine.",
  },
  "franco-pizzeria-genova": {
    title: "Franco Pizzeria, Sampierdarena: forno AIC",
    description: "Franco Pizzeria a Sampierdarena, Genova: certificata AIC, con forno dedicato al senza glutine, pizze senza lattosio, birra e dolci. Su Mappa Senza Glutine.",
  },
  "sans-de-ble-roma": {
    title: "Sans de Blé, Roma: panificio AIC",
    description: "Sans de Blé a Roma, zona Garbatella: panificio e pasticceria con laboratorio 100% senza glutine e senza lattosio, certificati AIC. Su Mappa Senza Glutine.",
  },
  "rame-sushi-naturale-italiano-roma": {
    title: "Ramè, Roma: sushi senza glutine AIC",
    description: "Ramè in via Folco Portinari, Roma: ristorante di sushi certificato AIC, con ricette garantite senza glutine, consegna e asporto. Su Mappa Senza Glutine.",
  },
  "mangiafuoco-pizza-grill-roma": {
    title: "Mangiafuoco Roma: pizza e griglia AIC",
    description: "Mangiafuoco Pizza & Grill in via Chiana, Roma: certificato AIC, con cucina separata per il senza glutine, pizza e griglia. Su Mappa Senza Glutine.",
  },
  "ristorante-flora-verona": {
    title: "Ristorante Flora, Verona: vegano e AIC",
    description: "Ristorante Flora a Verona: menu interamente vegano, senza glutine e senza lattosio, certificato AIC. Pranzo a buffet, cena à la carte. Su Mappa Senza Glutine.",
  },
};

const OVERRIDES_EN: Record<string, Override> = {
  "il-secchio-e-l-olivaro-roma": {
    title: "Il Secchio e l'Olivaro, Porto Fluviale: gluten free",
    description: "Il Secchio e l'Olivaro, via del Porto Fluviale 3 in Rome: wood-fired pizza and a gluten-free menu from a dedicated lab since 1999. Hours, phone and address.",
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
    title: "Be Bop Milan, Navigli: gluten-free pizza",
    description: "Be Bop in Milan, near the Navigli: pizzeria since 1986 with pizza and traditional dishes gluten-free, vegan options. Address on Mappa Senza Glutine.",
  },
  "fornerie-alessandrino-roma": {
    title: "Fornerie Alessandrino, Rome: AIC-certified kitchen",
    description: "Fornerie Alessandrino in Rome: pizzeria, grill and burger joint with an entirely AIC-certified, separate kitchen. Address on Mappa Senza Glutine.",
  },
  "mama-eat-milano": {
    title: "Mama Eat Milan, via Procaccini: AIC kitchen",
    description: "Mama Eat on via Procaccini in Milan: AIC-certified restaurant and pizzeria with a fully separate double kitchen, whole menu also gluten-free. On Mappa Senza Glutine.",
  },
  "no-gluten-bakery-palermo": {
    title: "No Gluten Bakery Palermo: dedicated bakery",
    description: "No Gluten Bakery on via Simone Cuccia, Palermo: bakery, pastry shop and deli with a gluten-free kitchen, brioche, bread, pizza and panelle. On Mappa Senza Glutine.",
  },
  "randazzo-gluten-free-genova": {
    title: "Randazzo Gluten Free Genoa: AIC bakery",
    description: "Randazzo Gluten Free in Sestri Ponente, Genoa: gluten-free-only bakery and pastry shop, opened late 2024, part of AIC Liguria. On Mappa Senza Glutine.",
  },
  "hotel-al-piave-venezia": {
    title: "Hotel Al Piave Venice: AIC-certified hotel",
    description: "Hotel Al Piave in Castello, near St Mark's: one of the few Venice hotels with AIC certification, with an entirely gluten-free breakfast. On Mappa Senza Glutine.",
  },
  "gusto-libero-verona": {
    title: "Gusto Libero Verona: gluten-free shop",
    description: "Gusto Libero on via Luigi Dorigo 14, Verona: shop with over 100 gluten-free and lactose-free products, with an ULSS agreement for vouchers. On Mappa Senza Glutine.",
  },
  "senza-pensieri-healthy-bakery-roma": {
    title: "Senza Pensieri Bakery, San Lorenzo, Rome",
    description: "Senza Pensieri Healthy Bakery in San Lorenzo, Rome: sweet and savory gluten-free food, many vegan and lactose-free options. On Mappa Senza Glutine.",
  },
  "casa-biga-milano": {
    title: "Casa Biga, Isola: AIC gluten-free pizza",
    description: "Casa Biga in Milan's Isola district: AIC-certified pizzeria, awarded Best Pizza GF 2025, with a long-rise dough. Address on Mappa Senza Glutine.",
  },
  "mama-eat-roma": {
    title: "Mama Eat Rome, Borgo Pio: AIC kitchen",
    description: "Mama Eat in Borgo Pio, near the Vatican: AIC-certified restaurant with a fully separate double kitchen and color-coded plates. On Mappa Senza Glutine.",
  },
  "pizzeria-starita-napoli": {
    title: "Pizzeria Starita, Materdei: dedicated oven",
    description: "Pizzeria Starita in Materdei, Naples, since 1901: every pizza also gluten-free, baked in a separate dedicated oven. Address and hours on Mappa Senza Glutine.",
  },
  "ciro-sons-firenze": {
    title: "Ciro & Sons Florence: AIC gluten-free pizza",
    description: "Ciro & Sons on via del Giglio, Florence: since 1948, gluten-free pizza world champion, AIC and AVPN certified, with a separate oven. On Mappa Senza Glutine.",
  },
  "quinoa-firenze": {
    title: "Quinoa, Florence: gluten-free restaurant",
    description: "Quinoa in Florence: the city's first 100% gluten-free restaurant, open since 2014 and AIC-certified, in a 16th-century cloister. On Mappa Senza Glutine.",
  },
  "zero-gelato-milano": {
    title: "Zero Gelato, Milan: AIC gelateria",
    description: "Zero Gelato on Corso Ventidue Marzo, Milan: AIC-certified gelateria with entirely gluten-free flavors and many lactose-free options. On Mappa Senza Glutine.",
  },
  "solho-bari": {
    title: "Solho Bari: gluten-free tray pizza",
    description: "Solho on via Sparano, Bari: tray pizza made with rice flour as a gluten-free alternative, alongside traditional Apulian dishes. Address on Mappa Senza Glutine.",
  },
  "leopoldo-cafebar-napoli": {
    title: "Leopoldo Cafebar: gluten-free pastries",
    description: "Leopoldo Cafebar on Piazza Cavour, Naples, opposite the MANN: Neapolitan pastries made exclusively gluten-free, in a dedicated kitchen. On Mappa Senza Glutine.",
  },
  "glufree-bakery-milano": {
    title: "GluFree Bakery, Porta Romana: AIC network",
    description: "GluFree Bakery on via Curtatone, Milan: bakery and pastry shop with a 100% gluten-free kitchen, in the AIC network. On Mappa Senza Glutine.",
  },
  "pizzeria-oke-venezia": {
    title: "Pizzeria OKE: two separate kitchens",
    description: "Pizzeria OKE on the Zattere, Venice: among the first venues trained by AIC, with two physically separate kitchens and delivery in some areas. On Mappa Senza Glutine.",
  },
  "le-specialita-milano": {
    title: "Le Specialità Milan: AIC pizzeria",
    description: "Le Specialità on via Pietro Calvi, Milan: historic pizzeria since 1977, AIC-certified, with over 50 wood-fired pizzas available gluten-free. On Mappa Senza Glutine.",
  },
  "franco-pizzeria-genova": {
    title: "Franco Pizzeria, Sampierdarena: AIC oven",
    description: "Franco Pizzeria in Sampierdarena, Genoa: AIC-certified, with an oven dedicated to gluten-free food, lactose-free pizzas, beer and desserts. On Mappa Senza Glutine.",
  },
  "sans-de-ble-roma": {
    title: "Sans de Blé, Rome: AIC bakery",
    description: "Sans de Blé in Rome's Garbatella area: bakery and pastry shop with a 100% gluten-free and lactose-free kitchen, AIC-certified. On Mappa Senza Glutine.",
  },
  "rame-sushi-naturale-italiano-roma": {
    title: "Ramè, Rome: AIC gluten-free sushi",
    description: "Ramè on via Folco Portinari, Rome: AIC-certified sushi restaurant with recipes guaranteed gluten-free, delivery and takeaway. On Mappa Senza Glutine.",
  },
  "mangiafuoco-pizza-grill-roma": {
    title: "Mangiafuoco Rome: AIC pizza and grill",
    description: "Mangiafuoco Pizza & Grill on via Chiana, Rome: AIC-certified, with a separate kitchen for gluten-free food, pizza and grill. On Mappa Senza Glutine.",
  },
  "ristorante-flora-verona": {
    title: "Ristorante Flora, Verona: vegan and AIC",
    description: "Ristorante Flora in Verona: an entirely vegan, gluten-free and lactose-free menu, AIC-certified. Lunch buffet, à la carte dinner. On Mappa Senza Glutine.",
  },
};

export function businessSeoOverride(slug: string, locale: Locale): Override | undefined {
  return locale === "en" ? OVERRIDES_EN[slug] : OVERRIDES_IT[slug];
}
