/**
 * ============================================================
 *  TRADUZIONI DELL'INTERFACCIA (italiano / inglese)
 * ============================================================
 *  Qui stanno TUTTE le scritte "fisse" del sito nelle due lingue.
 *  Per correggere una traduzione, modifica il testo corrispondente.
 *  Per aggiungere una lingua, duplica il blocco e aggiungila a `languages`.
 */

export const languages = { it: "Italiano", en: "English" } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "it";

export const ui = {
  it: {
    // Navigazione
    "nav.locali": "Locali",
    "nav.film": "Film",
    "nav.mappa": "Mappa",
    "nav.blog": "Blog",
    "nav.guida": "Guida PDF",
    "nav.inserzioni": "Inserzioni",
    "nav.chiSiamo": "Chi siamo",
    "nav.aggiungi": "Aggiungi locale",
    "nav.aggiungiLungo": "Aggiungi il tuo locale",
    "a11y.menu": "Apri il menu",
    "a11y.tema": "Cambia tema chiaro/scuro",
    "a11y.lingua": "Cambia lingua",
    "a11y.skip": "Salta al contenuto",
    // Hero / home
    "hero.kicker": "Cinema & buona tavola",
    "hero.titolo": "Mangia dove nascono i film",
    "hero.sottotitolo":
      "La guida ai ristoranti, bar e caffè italiani apparsi al cinema e in TV. Scopri le location reali e prenota il tuo tavolo tra le stelle.",
    "hero.cerca": "Cerca",
    "hero.cercaPh": "Cerca un film, una città o un locale…",
    "hero.mappa": "Esplora la mappa",
    "stats.locali": "locali",
    "stats.citta": "città",
    "stats.film": "film e serie",
    "home.evidenzaTitolo": "Locali in evidenza",
    "home.evidenzaSub": "Una selezione dei set più iconici da scoprire.",
    "home.vediTutti": "Vedi tutti",
    "home.perFilmTitolo": "Sfoglia per film",
    "home.perFilmSub": "Dove mangiano i tuoi personaggi preferiti?",
    "home.perCittaTitolo": "Sfoglia per città",
    "home.perCittaSub": "Roma, Milano, Napoli, Crema, Venezia e altre.",
    "home.comeTitolo": "Come funziona",
    "home.step1t": "Scopri il film",
    "home.step1d": "Cerca il film o la serie che ami e trova le location gastronomiche reali.",
    "home.step2t": "Trova il locale",
    "home.step2d": "Ristoranti, bar e caffè con indirizzo, mappa e descrizione della scena.",
    "home.step3t": "Prenota e vai",
    "home.step3d": "Vai sul posto e mangia dove è nato il cinema. Buon appetito!",
    "home.mappaTitolo": "Esplora sulla mappa",
    "home.mappaSub": "Tutti i locali del cinema in un colpo d'occhio.",
    "home.apriMappa": "Apri la mappa",
    "home.blogTitolo": "Dal blog",
    "home.tuttiArticoli": "Tutti gli articoli",
    "home.ctaTitolo": "Il tuo locale è stato in un film?",
    "home.ctaSub": "Inseriscilo e raggiungi migliaia di appassionati di cinema e buona cucina.",
    "home.ctaAggiungi": "Aggiungi il tuo locale",
    "home.ctaInserzioni": "Scopri le inserzioni",
    // Card / badge
    "card.scopri": "Scopri di più",
    "badge.evidenza": "In evidenza",
    "badge.setReale": "Set reale",
    "badge.aTema": "A tema cinema",
    "badge.legato": "Legato al film",
    "stato.aperto": "Aperto",
    "stato.chiuso": "Chiuso",
    "stato.tempChiuso": "Temporaneamente chiuso",
    "tipo.ristorante": "ristorante",
    "tipo.trattoria": "trattoria",
    "tipo.bar": "bar",
    "tipo.caffè": "caffè",
    "tipo.pasticceria": "pasticceria",
    "tipo.pizzeria": "pizzeria",
    // Filtri
    "filtri.cercaPh": "Cerca per nome, città o film…",
    "filtri.citta": "Città",
    "filtri.film": "Film / Serie",
    "filtri.tipo": "Tipo",
    "filtri.categoria": "Categoria",
    "filtri.prezzo": "Prezzo",
    "filtri.tutte": "Tutte",
    "filtri.tutti": "Tutti",
    "filtri.azzera": "Azzera",
    "filtri.nessuno": "Nessun locale corrisponde ai filtri.",
    "filtri.azzeraLink": "Azzera i filtri",
    "conta.uno": "locali",
    "conta.su": "su",
    // Pagine elenco
    "locali.titolo": "Tutti i locali",
    "locali.sub": "Filtra per città, film, tipo, prezzo o categoria (set reale / legato al film / a tema cinema).",
    "film.titolo": "Film e serie TV",
    "film.sub": "Scegli un titolo e scopri dove mangiare come nel film.",
    "film.locali": "locali",
    "film.film": "Film",
    "film.serie": "Serie TV",
    "film.regia": "Regia di",
    "film.altriLocali": "Altri locali a",
    "film.legati": "Locali legati al film",
    "film.arrivo": "Locali in arrivo",
    "film.nessuno": "Non abbiamo ancora schede per questo film.",
    "film.segnala": "Conosci un locale? Segnalalo →",
    "film.faq": "Domande frequenti",
    "film.doveMangiano": "Dove mangiano ne",
    // Dettaglio locale
    "loc.home": "Home",
    "loc.locali": "Locali",
    "loc.prenota": "Prenota un tavolo",
    "loc.sito": "Sito ufficiale",
    "loc.indicazioni": "Indicazioni",
    "loc.schermo": "Al cinema e in TV",
    "loc.dove": "Dove si trova",
    "loc.aggiornato": "Ultimo aggiornamento",
    "loc.nota": "I dati sono indicativi: verifica sempre orari e disponibilità con il locale.",
    // Città
    "citta.titoloSeo": "Ristoranti di {c} visti al cinema",
    "citta.localiDi": "Locali a",
    "citta.filmDi": "Film ambientati a",
    "citta.conteggio": "locali del cinema",
    // Tipo
    "tipo.alCinema": "al cinema",
    "tipo.diQuesto": "locali di questo tipo nella directory.",
    // Mappa
    "mappa.titolo": "Mappa dei locali",
    "mappa.sub": "Clicca su un segnaposto per i dettagli del locale. Mappa basata su OpenStreetMap.",
    // Blog
    "blog.titolo": "Blog",
    "blog.sub": "Itinerari, curiosità e storie di cinema e cucina.",
    "blog.leggi": "Leggi l'articolo",
    "blog.vuoto": "Nessun articolo pubblicato al momento.",
    "blog.torna": "Torna al blog",
    // Footer
    "brand.tagline": "I ristoranti, bar e caffè italiani visti nei film e nelle serie TV",
    "nav.privacy": "Privacy e Cookie",
    "cookie.testo": "Usiamo solo cookie tecnici necessari al funzionamento del sito. Attivando statistiche o mappe potrebbero essere usati cookie di terze parti.",
    "cookie.accetta": "Ho capito",
    "cookie.dettagli": "Dettagli",
    "share.titolo": "Condividi",
    "share.copia": "Copia link",
    "share.copiato": "Link copiato!",
    "footer.naviga": "Naviga",
    "footer.info": "Informazioni",
    "footer.contatti": "Contatti",
    "footer.newsTitolo": "Resta aggiornato",
    "footer.newsSub": "Nuovi locali, itinerari e curiosità dal mondo del cinema a tavola.",
    "footer.iscriviti": "Iscriviti",
    "footer.emailPh": "La tua email",
    "footer.legale":
      "I dati dei locali sono a scopo dimostrativo e vanno verificati. I titoli di film e serie appartengono ai rispettivi aventi diritto.",
  },
  en: {
    "nav.locali": "Venues",
    "nav.film": "Films",
    "nav.mappa": "Map",
    "nav.blog": "Blog",
    "nav.guida": "PDF Guide",
    "nav.inserzioni": "Advertising",
    "nav.chiSiamo": "About",
    "nav.aggiungi": "Add venue",
    "nav.aggiungiLungo": "Add your venue",
    "a11y.menu": "Open the menu",
    "a11y.tema": "Toggle light/dark theme",
    "a11y.lingua": "Change language",
    "a11y.skip": "Skip to content",
    "hero.kicker": "Cinema & good food",
    "hero.titolo": "Eat where films are born",
    "hero.sottotitolo":
      "The guide to Italian restaurants, bars and cafés seen on the big and small screen. Discover the real locations and book your table among the stars.",
    "hero.cerca": "Search",
    "hero.cercaPh": "Search a film, a city or a venue…",
    "hero.mappa": "Explore the map",
    "stats.locali": "venues",
    "stats.citta": "cities",
    "stats.film": "films & series",
    "home.evidenzaTitolo": "Featured venues",
    "home.evidenzaSub": "A selection of the most iconic sets to discover.",
    "home.vediTutti": "See all",
    "home.perFilmTitolo": "Browse by film",
    "home.perFilmSub": "Where do your favourite characters eat?",
    "home.perCittaTitolo": "Browse by city",
    "home.perCittaSub": "Rome, Milan, Naples, Crema, Venice and more.",
    "home.comeTitolo": "How it works",
    "home.step1t": "Find the film",
    "home.step1d": "Search the film or series you love and find its real food locations.",
    "home.step2t": "Find the venue",
    "home.step2d": "Restaurants, bars and cafés with address, map and scene description.",
    "home.step3t": "Book and go",
    "home.step3d": "Head there and eat where cinema was born. Enjoy your meal!",
    "home.mappaTitolo": "Explore on the map",
    "home.mappaSub": "All the film venues at a glance.",
    "home.apriMappa": "Open the map",
    "home.blogTitolo": "From the blog",
    "home.tuttiArticoli": "All articles",
    "home.ctaTitolo": "Has your venue been in a film?",
    "home.ctaSub": "Add it and reach thousands of cinema and food lovers.",
    "home.ctaAggiungi": "Add your venue",
    "home.ctaInserzioni": "See advertising options",
    "card.scopri": "Discover more",
    "badge.evidenza": "Featured",
    "badge.setReale": "Real set",
    "badge.aTema": "Cinema-themed",
    "badge.legato": "Film-related",
    "stato.aperto": "Open",
    "stato.chiuso": "Closed",
    "stato.tempChiuso": "Temporarily closed",
    "tipo.ristorante": "restaurant",
    "tipo.trattoria": "trattoria",
    "tipo.bar": "bar",
    "tipo.caffè": "café",
    "tipo.pasticceria": "pastry shop",
    "tipo.pizzeria": "pizzeria",
    "filtri.cercaPh": "Search by name, city or film…",
    "filtri.citta": "City",
    "filtri.film": "Film / Series",
    "filtri.tipo": "Type",
    "filtri.categoria": "Category",
    "filtri.prezzo": "Price",
    "filtri.tutte": "All",
    "filtri.tutti": "All",
    "filtri.azzera": "Reset",
    "filtri.nessuno": "No venue matches the filters.",
    "filtri.azzeraLink": "Reset filters",
    "conta.uno": "venues",
    "conta.su": "of",
    "locali.titolo": "All venues",
    "locali.sub": "Filter by city, film, type, price or category (real set / film-related / cinema-themed).",
    "film.titolo": "Films & TV series",
    "film.sub": "Pick a title and discover where to eat like in the film.",
    "film.locali": "venues",
    "film.film": "Film",
    "film.serie": "TV series",
    "film.regia": "Directed by",
    "film.altriLocali": "More venues in",
    "film.legati": "Venues linked to the film",
    "film.arrivo": "Venues coming soon",
    "film.nessuno": "We don't have venues for this film yet.",
    "film.segnala": "Know a venue? Suggest it →",
    "film.faq": "Frequently asked questions",
    "film.doveMangiano": "Where they eat in",
    "loc.home": "Home",
    "loc.locali": "Venues",
    "loc.prenota": "Book a table",
    "loc.sito": "Official website",
    "loc.indicazioni": "Directions",
    "loc.schermo": "On screen & TV",
    "loc.dove": "Where to find it",
    "loc.aggiornato": "Last updated",
    "loc.nota": "Data is indicative: always check opening hours and availability with the venue.",
    "citta.titoloSeo": "{c} Film Locations & Movie Restaurants",
    "citta.localiDi": "Venues in",
    "citta.filmDi": "Films set in",
    "citta.conteggio": "film venues",
    "tipo.alCinema": "on screen",
    "tipo.diQuesto": "venues of this type in the directory.",
    "mappa.titolo": "Venue map",
    "mappa.sub": "Click a marker for the venue details. Map based on OpenStreetMap.",
    "blog.titolo": "Blog",
    "blog.sub": "Itineraries, trivia and stories of cinema and food.",
    "blog.leggi": "Read the article",
    "blog.vuoto": "No articles published yet.",
    "blog.torna": "Back to the blog",
    "brand.tagline": "Italian restaurants, bars and cafés seen in films and TV series",
    "nav.privacy": "Privacy & Cookies",
    "cookie.testo": "We only use technical cookies needed for the site to work. Enabling analytics or maps may set third-party cookies.",
    "cookie.accetta": "Got it",
    "cookie.dettagli": "Details",
    "share.titolo": "Share",
    "share.copia": "Copy link",
    "share.copiato": "Link copied!",
    "footer.naviga": "Navigate",
    "footer.info": "Information",
    "footer.contatti": "Contacts",
    "footer.newsTitolo": "Stay updated",
    "footer.newsSub": "New venues, itineraries and trivia from the world of cinema at the table.",
    "footer.iscriviti": "Subscribe",
    "footer.emailPh": "Your email",
    "footer.legale":
      "Venue data is for demonstration and must be verified. Film and series titles belong to their respective right holders.",
  },
} as const;

export type UIKey = keyof (typeof ui)["it"];

/** Restituisce la funzione di traduzione per una lingua. */
export function useT(lang: Lang) {
  return function t(key: UIKey): string {
    return (ui[lang] as Record<string, string>)[key] ?? ui[defaultLang][key];
  };
}

/** Ricava la lingua dall'URL (/en/... → "en", altrimenti "it"). */
export function getLang(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "it";
}

/** Aggiunge il prefisso lingua a un percorso interno (it = nessun prefisso). */
export function path(p: string, lang: Lang): string {
  if (lang === "it") return p;
  return p === "/" ? "/en" : `/en${p}`;
}

/** Toglie il prefisso /en da un percorso (per il selettore lingua). */
export function stripLang(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

/**
 * Normalizza `Astro.url.pathname` a un URL "pulito" (senza `.html` né slash
 * finale): con `build.format: "file"` Astro espone il pathname con
 * l'estensione del file generato (es. "/blog/aosta.html"), che non combacia
 * con gli URL puliti usati nei link interni, nella sitemap e nei canonical.
 * Usarla ovunque si legge `Astro.url.pathname` per confronti o per costruire link.
 */
export function cleanPathname(pathname: string): string {
  let p = pathname;
  if (p.endsWith("/index.html")) p = p.slice(0, -"index.html".length);
  else if (p.endsWith(".html")) p = p.slice(0, -".html".length);
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

/** Codice locale per la formattazione di date/numeri. */
export function localeCode(lang: Lang): string {
  return lang === "en" ? "en-GB" : "it-IT";
}
