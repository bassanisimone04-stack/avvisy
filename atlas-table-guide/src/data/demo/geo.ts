import type { Chef, City, Country, Cuisine, Region } from "@/db/types";

const base = (id: string, slug: string) => ({
  id,
  slug,
  isDemo: true,
  publicationStatus: "published" as const,
  verificationStatus: "verified" as const,
  lastVerifiedAt: "2026-10-01",
  updatedAt: "2026-10-01",
});

export const countries: Country[] = [
  { ...base("c-fr", "france"), code: "FR", name: { en: "France", it: "Francia" }, currency: "EUR" },
  { ...base("c-jp", "japan"), code: "JP", name: { en: "Japan", it: "Giappone" }, currency: "JPY" },
  { ...base("c-it", "italy"), code: "IT", name: { en: "Italy", it: "Italia" }, currency: "EUR" },
  { ...base("c-gb", "united-kingdom"), code: "GB", name: { en: "United Kingdom", it: "Regno Unito" }, currency: "GBP" },
  { ...base("c-us", "united-states"), code: "US", name: { en: "United States", it: "Stati Uniti" }, currency: "USD" },
  { ...base("c-ae", "united-arab-emirates"), code: "AE", name: { en: "United Arab Emirates", it: "Emirati Arabi Uniti" }, currency: "AED" },
  { ...base("c-es", "spain"), code: "ES", name: { en: "Spain", it: "Spagna" }, currency: "EUR" },
  { ...base("c-dk", "denmark"), code: "DK", name: { en: "Denmark", it: "Danimarca" }, currency: "DKK" },
  { ...base("c-sg", "singapore"), code: "SG", name: { en: "Singapore", it: "Singapore" }, currency: "SGD" },
];

export const regions: Region[] = [
  { ...base("r-idf", "ile-de-france"), countrySlug: "france", name: { en: "Île-de-France" } },
  { ...base("r-kanto", "kanto"), countrySlug: "japan", name: { en: "Kantō" } },
  { ...base("r-lom", "lombardy"), countrySlug: "italy", name: { en: "Lombardy", it: "Lombardia" } },
  { ...base("r-laz", "lazio"), countrySlug: "italy", name: { en: "Lazio" } },
  { ...base("r-tus", "tuscany"), countrySlug: "italy", name: { en: "Tuscany", it: "Toscana" } },
  { ...base("r-eng", "england"), countrySlug: "united-kingdom", name: { en: "England", it: "Inghilterra" } },
  { ...base("r-ny", "new-york-state"), countrySlug: "united-states", name: { en: "New York State", it: "Stato di New York" } },
  { ...base("r-cat", "catalonia"), countrySlug: "spain", name: { en: "Catalonia", it: "Catalogna" } },
  { ...base("r-hov", "capital-region"), countrySlug: "denmark", name: { en: "Capital Region", it: "Regione della Capitale" } },
  { ...base("r-dxb", "dubai-emirate"), countrySlug: "united-arab-emirates", name: { en: "Dubai Emirate", it: "Emirato di Dubai" } },
];

const img = (key: string) => ({ key, subject: "skyline" as const, illustrative: true });

export const cities: City[] = [
  {
    ...base("ci-paris", "paris"), countrySlug: "france", regionSlug: "ile-de-france", name: { en: "Paris", it: "Parigi" },
    lat: 48.8566, lng: 2.3522, image: img("destination-paris"),
    intro: {
      en: "Paris remains a reference point for formal dining, from classical brigades and silver-domed service to small counters run by a single chef. Tasting menus dominate in the evening, while many dining rooms offer a shorter, better-value lunch on weekdays. Neighbourhood matters: the Left Bank leans traditional, the eastern arrondissements more experimental. Expect dress codes to be relaxed but service to be precise, and book well ahead for weekend evenings and for counter seats.",
      it: "Parigi resta un punto di riferimento per l'alta ristorazione, dalle brigate classiche con servizio a cloche ai piccoli banconi guidati da un solo chef. La sera dominano i menu degustazione, mentre molte sale propongono a pranzo, nei giorni feriali, un menu più breve e conveniente. Il quartiere conta: la Rive Gauche è più tradizionale, gli arrondissement orientali più sperimentali. Il dress code è rilassato ma il servizio preciso: prenotate con anticipo per i fine settimana e per i posti al bancone.",
    },
    bestTimeToBook: { en: "Four to six weeks ahead for dinner; weekday lunch often within a week.", it: "Da quattro a sei settimane prima per la cena; il pranzo feriale spesso entro una settimana." },
  },
  {
    ...base("ci-tokyo", "tokyo"), countrySlug: "japan", regionSlug: "kanto", name: { en: "Tokyo" },
    lat: 35.6762, lng: 139.6503, image: img("destination-tokyo"),
    intro: {
      en: "Tokyo's fine dining is defined by specialisation: counters devoted to sushi, tempura, kaiseki or grilled skewers, often seating fewer than twelve guests. Many restaurants work with fixed seatings and set start times, so punctuality is part of the experience. Seasonal ingredients drive menus that can change weekly. Reservations are frequently released one to two months ahead and some venues accept bookings only through a hotel concierge or a local reservation platform.",
      it: "L'alta cucina di Tokyo è definita dalla specializzazione: banconi dedicati a sushi, tempura, kaiseki o spiedini alla griglia, spesso con meno di dodici coperti. Molti ristoranti lavorano con turni fissi e orari d'inizio precisi, quindi la puntualità fa parte dell'esperienza. Gli ingredienti di stagione guidano menu che possono cambiare ogni settimana. Le prenotazioni si aprono spesso con uno o due mesi di anticipo e alcuni locali accettano richieste solo tramite il concierge dell'hotel o piattaforme locali.",
    },
    bestTimeToBook: { en: "As soon as the booking window opens, typically 30–60 days ahead.", it: "Appena si apre la finestra di prenotazione, di solito 30–60 giorni prima." },
  },
  {
    ...base("ci-milan", "milan"), countrySlug: "italy", regionSlug: "lombardy", name: { en: "Milan", it: "Milano" },
    lat: 45.4642, lng: 9.19, image: img("destination-milan"),
    intro: {
      en: "Milan combines a strong Lombard tradition — saffron risotto, slow-cooked veal, lake fish — with some of Italy's most design-led dining rooms. Business lunches keep many kitchens busy at midday, which makes lunch menus a practical way to try ambitious cooking. Restaurants cluster around Brera, the Navigli canals and the newer Porta Nuova district. Many close in August and around Christmas, so check opening periods before planning a trip.",
      it: "Milano unisce una forte tradizione lombarda — risotto allo zafferano, ossobuco, pesce di lago — ad alcune delle sale più attente al design in Italia. I pranzi di lavoro tengono attive molte cucine a mezzogiorno, e i menu del pranzo sono un modo pratico per provare cucine ambiziose. I ristoranti si concentrano tra Brera, i Navigli e il quartiere di Porta Nuova. Molti chiudono ad agosto e nel periodo natalizio: verificate le aperture prima di organizzare il viaggio.",
    },
    bestTimeToBook: { en: "Two to three weeks ahead; longer during Design Week and Fashion Week.", it: "Due o tre settimane prima; di più durante la Design Week e la Fashion Week." },
  },
  {
    ...base("ci-london", "london"), countrySlug: "united-kingdom", regionSlug: "england", name: { en: "London", it: "Londra" },
    lat: 51.5072, lng: -0.1276, image: img("destination-london"),
    intro: {
      en: "London's top tables range from grand hotel dining rooms in Mayfair to compact, produce-led kitchens in the east of the city. Modern British cooking sits alongside strong Indian, Japanese and Mediterranean traditions. Service charges of around 12.5% are commonly added to the bill, so compare prices with that in mind. Lunch and early-evening menus are widely offered and are often the most accessible way into the city's most sought-after rooms.",
      it: "I migliori tavoli di Londra spaziano dalle sale degli storici hotel di Mayfair a cucine compatte e incentrate sul prodotto nella zona est. La cucina britannica moderna convive con forti tradizioni indiane, giapponesi e mediterranee. Al conto viene spesso aggiunto un servizio di circa il 12,5%: tenetene conto nel confronto dei prezzi. Pranzo e menu del primo turno serale sono molto diffusi e spesso sono il modo più accessibile per entrare nelle sale più richieste.",
    },
    bestTimeToBook: { en: "Three to four weeks ahead; many releases happen at a fixed time each month.", it: "Tre o quattro settimane prima; molte disponibilità si aprono a orari fissi ogni mese." },
  },
  {
    ...base("ci-nyc", "new-york"), countrySlug: "united-states", regionSlug: "new-york-state", name: { en: "New York" },
    lat: 40.7128, lng: -74.006, image: img("destination-new-york"),
    intro: {
      en: "New York's fine dining moves quickly: chef's counters, seafood-focused tasting menus and reinvented classics open across Manhattan and Brooklyn every season. Prices are typically quoted before tax and tip, so the final bill can be considerably higher than the menu price. Many restaurants release tables on a rolling 28- or 30-day window, and walk-in bar seating is common. Dress codes are relaxed, though jackets remain welcome in older dining rooms.",
      it: "L'alta ristorazione di New York si muove in fretta: banconi dello chef, degustazioni di mare e classici reinventati aprono ogni stagione tra Manhattan e Brooklyn. I prezzi sono di norma indicati al netto di tasse e mancia, quindi il conto finale può essere molto più alto del prezzo del menu. Molti ristoranti aprono le prenotazioni con una finestra mobile di 28 o 30 giorni e i posti al bar senza prenotazione sono comuni. Il dress code è rilassato, ma la giacca resta gradita nelle sale più classiche.",
    },
    bestTimeToBook: { en: "Exactly when the rolling window opens, usually 28–30 days ahead.", it: "Proprio quando si apre la finestra mobile, di solito 28–30 giorni prima." },
  },
  {
    ...base("ci-dubai", "dubai"), countrySlug: "united-arab-emirates", regionSlug: "dubai-emirate", name: { en: "Dubai" },
    lat: 25.2048, lng: 55.2708, image: img("destination-dubai"),
    intro: {
      en: "Dubai's dining scene is concentrated in hotels and waterfront districts, with international chefs working alongside a growing number of local and regional concepts. Menus draw on Levantine, Persian, Indian and Japanese influences. The cooler months from November to March are the busiest, and outdoor terraces are most enjoyable then. Many venues set minimum ages or dress codes for evening service, so read the reservation notes carefully.",
      it: "La scena gastronomica di Dubai si concentra negli hotel e nei quartieri sul mare, con chef internazionali affiancati da un numero crescente di progetti locali e regionali. I menu attingono a influenze levantine, persiane, indiane e giapponesi. I mesi più freschi, da novembre a marzo, sono i più affollati e le terrazze all'aperto danno il meglio. Molti locali prevedono età minime o dress code per la sera: leggete con attenzione le note di prenotazione.",
    },
    bestTimeToBook: { en: "Two weeks ahead in peak season (November–March).", it: "Due settimane prima in alta stagione (novembre–marzo)." },
  },
  {
    ...base("ci-rome", "rome"), countrySlug: "italy", regionSlug: "lazio", name: { en: "Rome", it: "Roma" },
    lat: 41.9028, lng: 12.4964, image: img("destination-rome"),
    intro: {
      en: "Rome's ambitious kitchens often reinterpret the city's own canon — carbonara, cacio e pepe, offal and artichokes — with lighter technique and long-matured ingredients. Rooftop dining rooms with views over the historic centre are a speciality, alongside quieter restaurants in Prati and Monti. Dinner starts late by northern European standards. Summer evenings fill up quickly, and many restaurants close for part of August.",
      it: "Le cucine più ambiziose di Roma reinterpretano spesso il canone cittadino — carbonara, cacio e pepe, quinto quarto e carciofi — con tecniche più leggere e ingredienti a lunga maturazione. Le sale panoramiche sui tetti del centro storico sono una specialità, accanto a ristoranti più raccolti a Prati e Monti. Si cena tardi rispetto agli standard nordeuropei. Le sere d'estate si riempiono in fretta e molti ristoranti chiudono per parte di agosto.",
    },
    bestTimeToBook: { en: "Two to four weeks ahead; terraces book out first in summer.", it: "Da due a quattro settimane prima; d'estate le terrazze finiscono per prime." },
  },
  {
    ...base("ci-bcn", "barcelona"), countrySlug: "spain", regionSlug: "catalonia", name: { en: "Barcelona", it: "Barcellona" },
    lat: 41.3874, lng: 2.1686, image: img("destination-barcelona"),
    intro: {
      en: "Barcelona pairs a deep Catalan pantry — seafood, rice, preserved vegetables and cured meats — with a long history of technical experimentation. Long tasting menus coexist with lively counter dining where small plates arrive one by one. Lunch is the main meal for many locals and often starts after 2 pm, while dinner rarely begins before 8.30 pm. Natural and Catalan wines feature prominently on pairings.",
      it: "Barcellona unisce una ricca dispensa catalana — pesce, riso, verdure conservate e salumi — a una lunga storia di sperimentazione tecnica. I lunghi menu degustazione convivono con vivaci banconi dove i piccoli piatti arrivano uno alla volta. Per molti abitanti il pranzo è il pasto principale e inizia spesso dopo le 14, mentre la cena raramente prima delle 20.30. Vini naturali e catalani hanno un ruolo di primo piano negli abbinamenti.",
    },
    bestTimeToBook: { en: "Three weeks ahead; avoid the second half of August when many close.", it: "Tre settimane prima; evitate la seconda metà di agosto, quando molti chiudono." },
  },
  {
    ...base("ci-cph", "copenhagen"), countrySlug: "denmark", regionSlug: "capital-region", name: { en: "Copenhagen", it: "Copenaghen" },
    lat: 55.6761, lng: 12.5683, image: img("destination-copenhagen"),
    intro: {
      en: "Copenhagen's restaurants are known for close relationships with farmers, foragers and fishers, and for menus that follow the short Nordic growing season closely. Fermentation, preserving and open-fire cooking are common threads. Many restaurants run seasonal menus that change entirely several times a year, and some close between seasons. Bookings often open months in advance for the best-known rooms, while wine bars offer a more spontaneous alternative.",
      it: "I ristoranti di Copenaghen sono noti per il rapporto stretto con agricoltori, raccoglitori e pescatori, e per menu che seguono da vicino la breve stagione nordica. Fermentazione, conserve e cottura sul fuoco vivo sono fili conduttori comuni. Molti propongono menu stagionali che cambiano completamente più volte l'anno, e alcuni chiudono tra una stagione e l'altra. Per le sale più note le prenotazioni si aprono con mesi di anticipo, mentre i wine bar offrono un'alternativa più spontanea.",
    },
    bestTimeToBook: { en: "Two to three months ahead for the best-known rooms.", it: "Due o tre mesi prima per le sale più note." },
  },
  {
    ...base("ci-sg", "singapore"), countrySlug: "singapore", name: { en: "Singapore" },
    lat: 1.3521, lng: 103.8198, image: img("destination-singapore"),
    intro: {
      en: "Singapore's fine dining reflects its position as a crossroads: modern Cantonese, Peranakan, Japanese and contemporary European kitchens operate within a few blocks of each other. Many restaurants sit in hotels or restored shophouses around the Central Business District and Tanjong Pagar. Prices are generally quoted before a 10% service charge and goods and services tax. Lunch menus are widely available and good value relative to dinner.",
      it: "L'alta cucina di Singapore riflette il suo ruolo di crocevia: cucine cantonesi moderne, peranakan, giapponesi ed europee contemporanee convivono a pochi isolati di distanza. Molti ristoranti si trovano in hotel o in shophouse restaurate tra il Central Business District e Tanjong Pagar. I prezzi sono in genere indicati al netto del 10% di servizio e dell'imposta sui beni e servizi. I menu del pranzo sono molto diffusi e convenienti rispetto alla cena.",
    },
    bestTimeToBook: { en: "Two to three weeks ahead; longer around public holidays.", it: "Due o tre settimane prima; di più in prossimità delle festività." },
  },
];

export const cuisines: Cuisine[] = [
  { slug: "contemporary", name: { en: "Contemporary", it: "Contemporanea" } },
  { slug: "french", name: { en: "French", it: "Francese" } },
  { slug: "japanese", name: { en: "Japanese", it: "Giapponese" } },
  { slug: "sushi", name: { en: "Sushi" } },
  { slug: "kaiseki", name: { en: "Kaiseki" } },
  { slug: "italian", name: { en: "Italian", it: "Italiana" } },
  { slug: "nordic", name: { en: "Nordic", it: "Nordica" } },
  { slug: "seafood", name: { en: "Seafood", it: "Pesce" } },
  { slug: "vegetarian", name: { en: "Vegetarian", it: "Vegetariana" } },
  { slug: "mediterranean", name: { en: "Mediterranean", it: "Mediterranea" } },
  { slug: "modern-british", name: { en: "Modern British", it: "Britannica moderna" } },
  { slug: "american", name: { en: "Modern American", it: "Americana moderna" } },
  { slug: "spanish", name: { en: "Spanish", it: "Spagnola" } },
  { slug: "middle-eastern", name: { en: "Middle Eastern", it: "Mediorientale" } },
  { slug: "cantonese", name: { en: "Cantonese", it: "Cantonese" } },
  { slug: "peranakan", name: { en: "Peranakan" } },
];

const chefBase = (slug: string) => ({ ...base(`ch-${slug}`, slug) });

/** Fictional chefs for demo data only. */
export const chefs: Chef[] = [
  ["claire-montrose", "Claire Montrose", "Trained in Lyon and Montréal, Claire cooks a precise, vegetable-forward French menu built around three market gardens outside Paris."],
  ["bastien-lafarge", "Bastien Lafarge", "A former pastry chef who moved to the savoury side, known for sauces reduced over two days and an all-dessert finale."],
  ["ines-auclair", "Inès Auclair", "Works with Breton fishers and dry-ages fish in-house; her menu changes with each day's catch."],
  ["kenji-arakawa", "Kenji Arakawa", "Spent fifteen years at a family counter before opening his own eight-seat sushi room."],
  ["mio-takeda", "Mio Takeda", "Cooks a seasonal kaiseki rooted in her family's Kyoto inn, served on ceramics she commissions each year."],
  ["luca-ferraris", "Luca Ferraris", "Reinterprets Lombard classics with a lighter hand; his saffron risotto is finished tableside."],
  ["giulia-sereni", "Giulia Sereni", "Self-taught, focused on vegetables and fermentation, with a menu that changes with each moon cycle."],
  ["marco-dellarosa", "Marco Della Rosa", "Roman by birth, he rebuilt his grandmother's offal recipes into a refined tasting menu."],
  ["chiara-valente", "Chiara Valente", "Leads a rooftop kitchen known for seafood crudo and long-aged pecorino."],
  ["oliver-hastings", "Oliver Hastings", "Champions British coastal produce and whole-animal butchery in a converted Victorian warehouse."],
  ["priya-rao", "Priya Rao", "Blends the spice traditions of Karnataka with modern British seasonality."],
  ["daniel-okafor", "Daniel Okafor", "Runs a twelve-seat counter where each course is cooked over binchotan and oak."],
  ["sofia-marquez", "Sofía Márquez", "Builds Catalan rice and seafood dishes around a wood-fired paella pan."],
  ["anders-holm", "Anders Holm", "Forager and fermenter whose menu follows the short Nordic seasons."],
  ["layla-haddad", "Layla Haddad", "Cooks a modern Levantine menu, from charcoal-roasted vegetables to rose-scented desserts."],
  ["wei-lin-tan", "Tan Wei Lin", "Reimagines Peranakan family recipes with French technique."],
  ["henry-cho", "Henry Cho", "Modern Cantonese chef known for roast meats and dim sum tasting menus."],
  ["ava-sinclair", "Ava Sinclair", "A New York native cooking a seafood-led tasting menu inspired by the Atlantic coast."],
].map(([slug, name, bio]) => ({ ...chefBase(slug!), name: name!, bio: { en: bio! } }));
