/**
 * Italian translations of the fictional demo content, keyed by slug. Applied on top of the English
 * records in src/db/demo.ts. Real (non-demo) content is translated through restaurant_translations.
 */
export const RESTAURANT_IT: Record<string, [style: string, description: string]> = {
  "maison-lune-paris": ["Cucina francese classica, con leggerezza moderna", "Una sala raccolta sulla Rive Gauche dove le verdure di tre orti di mercato guidano un lungo e preciso menu degustazione francese."],
  "atelier-sable-paris": ["Cucina francese a base di salse", "La sala di un ex pasticcere, dove salse di due giorni sono il cuore dei piatti salati e il finale è una sequenza tutta di dolci."],
  "le-quai-bleu-paris": ["Pesce di giornata", "Cucina di pesce sul fiume, costruita sul pescato bretone di ogni mattina, con pesce frollato tagliato su ordinazione."],
  "verdure-paris": ["Menu degustazione vegetale", "Un menu degustazione interamente vegetale con salse fermentate e un banco di panetteria all'ingresso."],
  "la-table-d-ombre-paris": ["Bistronomia", "Una sala di quartiere a lume di candela, con un menu breve e ambizioso e una carta di vini naturali scelti dal proprietario."],
  "sushi-kawase-tokyo": ["Bancone di sushi Edomae", "Otto posti a un bancone di hinoki, con pesce frollato fino a due settimane e riso condito con aceto rosso."],
  "hanare-takeda-tokyo": ["Kaiseki stagionale", "Una tranquilla casa di kaiseki con sale private, che propone un menu che cambia ogni mese servito su ceramiche su commissione."],
  "sumibi-oak-tokyo": ["Fuoco di binchotan e quercia", "Dodici posti al bancone attorno a una griglia dove ogni portata è cotta su binchotan e quercia."],
  "tempura-hikari-tokyo": ["Bancone di tempura", "Un bancone di tempura da dieci posti che frigge verdure e pesce di stagione nell'olio di sesamo."],
  "oro-di-brera-milan": ["Classici lombardi reinterpretati", "Una sala a Brera dove i classici lombardi sono alleggeriti e il risotto allo zafferano viene mantecato al tavolo."],
  "luna-fermenta-milan": ["Verdure e fermentazioni", "Una sala sul Naviglio che cuoce verdure, cereali e fermentati in un menu che cambia a ogni ciclo lunare."],
  "vetro-porta-nuova-milan": ["Mediterranea contemporanea", "Una sala con pareti di vetro al 20° piano, con un menu per il pranzo di lavoro e un menu degustazione più lungo la sera."],
  "the-tidewater-london": ["Costa britannica e macelleria a tutto animale", "Un magazzino vittoriano restaurato dove prodotti della costa e macelleria interna danno forma a un menu britannico sicuro di sé."],
  "saffron-and-slate-london": ["Spezie del Karnataka, stagioni britanniche", "Una sala in un mews di Mayfair che unisce le tradizioni speziate del Karnataka ai prodotti di stagione britannici."],
  "hearth-and-hall-london": ["Cucina di quartiere alla brace", "Una cucina alla brace a sud del fiume, con un cortile soleggiato e un breve menu degustazione."],
  "atlantic-house-new-york": ["Menu degustazione della costa atlantica", "Un menu degustazione a base di pesce ispirato alla costa atlantica, servito in una ex tipografia."],
  "copper-counter-new-york": ["Bancone dello chef", "Quattordici posti davanti a una cucina a vista, con una sequenza di portate che cambia, cotte nel rame."],
  "greenmarket-room-new-york": ["Verdure del mercato contadino", "Una sala luminosa che cucina prodotti acquistati quella mattina al vicino mercato contadino."],
  "dar-al-ward-dubai": ["Levantina moderna", "Una terrazza sopra il creek con cucina levantina moderna, dalle verdure arrostite sul carbone ai dolci profumati alla rosa."],
  "marina-ember-dubai": ["Griglia di ispirazione giapponese", "Una griglia sul mare dentro un boutique hotel, che cuoce pesce del Golfo su carbone giapponese."],
  "quinto-elemento-rome": ["Quinto quarto romano, raffinato", "Una cucina a Testaccio che trasforma la tradizione romana del quinto quarto in un preciso menu degustazione."],
  "terrazza-celeste-rome": ["Pesce in terrazza", "Una terrazza sul centro storico, nota per i crudi di mare e il pecorino a lunga stagionatura."],
  "orto-di-monti-rome": ["Cucina romana dell'orto", "Una piccola sala a Monti che cucina verdure e legumi del Lazio con sorprendente profondità."],
  "forno-antico-rome": ["Trattoria con forno a legna, in versione elevata", "Una trattoria elevata a Prati costruita attorno a un forno a legna centenario."],
  "brasa-marina-barcelona": ["Riso e pesce catalani", "Una sala sul mare dove riso e pesce catalani vengono cotti in una padella a legna."],
  "taula-nova-barcelona": ["Cucina al bancone", "Un vivace bancone dove i piccoli piatti arrivano uno alla volta, abbinati a vini naturali catalani."],
  "skov-og-hav-copenhagen": ["Stagioni nordiche raccolte nella natura", "Cucina nordica sul porto costruita su raccolta spontanea, fermentazione e la breve stagione di crescita del nord."],
  "rug-copenhagen": ["Segale, cereali e fuoco", "Una panetteria di giorno e un menu degustazione a base di cereali la sera."],
  "rumah-tan-singapore": ["Peranakan con tecnica francese", "Una shophouse restaurata dove le ricette di famiglia peranakan incontrano la tecnica francese."],
  "jade-lantern-singapore": ["Cantonese moderna", "Cucina cantonese moderna con carni arrosto e un menu degustazione di dim sum, in un hotel sulla baia."],
};

export const CHEF_IT: Record<string, string> = {
  "claire-montrose": "Formata a Lione e Montréal, Claire cucina un menu francese preciso e centrato sulle verdure, costruito su tre orti di mercato alle porte di Parigi.",
  "bastien-lafarge": "Ex pasticcere passato al salato, noto per salse ridotte in due giorni e un finale tutto di dolci.",
  "ines-auclair": "Lavora con i pescatori bretoni e frolla il pesce in casa; il suo menu cambia con il pescato di ogni giorno.",
  "kenji-arakawa": "Ha passato quindici anni al bancone di una famiglia prima di aprire la sua sala di sushi da otto posti.",
  "mio-takeda": "Cucina un kaiseki stagionale che nasce dalla locanda di famiglia a Kyoto, servito su ceramiche che ordina ogni anno.",
  "luca-ferraris": "Reinterpreta i classici lombardi con mano leggera; il suo risotto allo zafferano è mantecato al tavolo.",
  "giulia-sereni": "Autodidatta, si concentra su verdure e fermentazioni, con un menu che cambia a ogni ciclo lunare.",
  "marco-dellarosa": "Romano di nascita, ha trasformato le ricette di sua nonna a base di quinto quarto in un raffinato menu degustazione.",
  "chiara-valente": "Guida una cucina in terrazza nota per i crudi di mare e il pecorino a lunga stagionatura.",
  "oliver-hastings": "Sostiene i prodotti della costa britannica e la macelleria a tutto animale in un magazzino vittoriano restaurato.",
  "priya-rao": "Fonde le tradizioni speziate del Karnataka con la stagionalità britannica moderna.",
  "daniel-okafor": "Gestisce un bancone da dodici posti dove ogni portata è cotta su binchotan e quercia.",
  "sofia-marquez": "Costruisce piatti catalani di riso e pesce attorno a una padella a legna.",
  "anders-holm": "Raccoglitore e fermentatore, il suo menu segue le brevi stagioni nordiche.",
  "layla-haddad": "Cucina un menu levantino moderno, dalle verdure arrostite sul carbone ai dolci profumati alla rosa.",
  "wei-lin-tan": "Reinterpreta le ricette di famiglia peranakan con tecnica francese.",
  "henry-cho": "Chef cantonese moderno noto per le carni arrosto e i menu degustazione di dim sum.",
  "ava-sinclair": "Newyorkese, cucina un menu degustazione a base di pesce ispirato alla costa atlantica.",
};

export const HOTEL_IT: Record<string, string> = {
  "harbour-light-hotel-dubai": "Un hotel sul mare da 40 camere costruito attorno alla sua griglia di ispirazione giapponese, Marina Ember.",
  "palazzo-celeste-rome": "Un palazzo settecentesco restaurato con 22 camere sotto il ristorante in terrazza Terrazza Celeste.",
  "bayview-residence-singapore": "Un hotel sulla baia con piscina a sfioro e il ristorante cantonese moderno Jade Lantern.",
  "maison-des-vignes-paris": "Un hotel in una casa a schiera sulla Rive Gauche, con 16 camere e una cantina aperta agli ospiti.",
  "villa-lago-milan": "Una villa sul lago a un'ora da Milano, con terrazza apparecchiata e trasferimenti in barca.",
  "ryokan-kaze-tokyo": "Un ryokan moderno con dodici camere, bagni di cipresso e una colazione kaiseki.",
  "the-gatehouse-london": "Un hotel da 30 camere in una portineria restaurata vicino al fiume, con un cocktail bar.",
  "hudson-loft-new-york": "Loft di stile industriale sopra una ex tipografia a Tribeca.",
  "casa-del-mar-barcelona": "Un hotel sul lungomare con piscina sul tetto e accesso diretto alla spiaggia.",
  "nyhavn-light-copenhagen": "Un magazzino sul porto trasformato in design hotel da 50 camere, con una sauna sull'acqua.",
  "podere-cipressi-tuscany": "Una tenuta vinicola in attività tra Siena e Montalcino, con otto camere e visite in cantina.",
  "castello-vigna-tuscany": "Un resort in un castello sulle colline del Chianti, con scuola di cucina e uliveti.",
};

export const AMENITY_IT: Record<string, string> = {
  Pool: "Piscina", Spa: "Spa", "Sea view": "Vista mare", "Airport transfer": "Transfer dall'aeroporto", Rooftop: "Terrazza panoramica", Concierge: "Concierge", Bar: "Bar",
  Gym: "Palestra", "Bay view": "Vista sulla baia", "Wine cellar": "Cantina", Library: "Biblioteca", Courtyard: "Cortile", "Lake view": "Vista lago", "Boat transfer": "Transfer in barca",
  Garden: "Giardino", "Onsen-style bath": "Bagno in stile onsen", "Tea room": "Sala da tè", Bikes: "Biciclette", Sauna: "Sauna", "Beach access": "Accesso alla spiaggia",
  Vineyard: "Vigneto", "Cellar tours": "Visite in cantina", "Cooking school": "Scuola di cucina",
};

export const EXPERIENCE_IT: Record<string, [name: string, description: string]> = {
  "chefs-table-at-maison-lune": ["Tavolo dello chef da Maison Lune", "Sei ospiti siedono al pass per un menu di 12 portate raccontato portata per portata dalla brigata."],
  "private-dining-at-rumah-tan": ["Cena privata da Rumah Tan", "Una sala in una shophouse restaurata per un massimo di 14 ospiti, con un banchetto peranakan."],
  "fresh-pasta-masterclass": ["Masterclass di pasta fresca", "Impara la tecnica di tonnarelli, ravioli e cacio e pepe con un pastaio romano, pranzo incluso."],
  "champagne-house-cellar-visit": ["Visita alla cantina di una maison di champagne", "Una gita in giornata nella cantina di un vignaiolo con degustazione di cinque cuvée e passeggiata in vigna."],
  "chianti-vineyard-walk-and-lunch": ["Passeggiata in vigna e pranzo nel Chianti", "Cammina tra i filari di una tenuta di famiglia, poi assaggia quattro vini con un lungo pranzo toscano."],
  "white-truffle-hunt-with-a-trifolau": ["Caccia al tartufo bianco con un trifolau", "Segui un cercatore di tartufi e il suo cane sulle colline, poi degusta piatti a base di tartufo fresco."],
  "tsukiji-outer-market-food-walk": ["Passeggiata gastronomica al mercato esterno di Tsukiji", "Una passeggiata guidata al mattino nel mercato esterno con assaggi di tamagoyaki, tonno e wagashi."],
  "borough-market-morning": ["Una mattina al Borough Market", "Incontra produttori e formaggiai prima di un pranzo degustazione in un ristorante vicino."],
  "copenhagen-foraging-walk": ["Passeggiata di raccolta spontanea a Copenaghen", "Una raccolta lungo la costa con uno chef nordico, che si conclude con un pranzo cotto sul fuoco."],
  "spice-souk-and-levantine-supper": ["Souk delle spezie e cena levantina", "Una serata tra i souk delle spezie e dell'oro, poi una cena di piccoli piatti levantini."],
  "catalan-rice-workshop": ["Laboratorio sul riso catalano", "Cuoci un riso di mare in una padella a legna con uno chef catalano, e concludi con il pranzo in terrazza."],
  "sake-and-kaiseki-evening": ["Serata di sake e kaiseki", "Un sommelier di sake guida l'abbinamento di sei sake a un breve menu kaiseki."],
  "hawker-heritage-trail": ["Itinerario nei mercati hawker", "Un percorso di assaggi in tre hawker centre con uno storico dell'alimentazione."],
  "milan-culinary-weekend": ["Weekend gastronomico a Milano", "Due notti, una lezione di cucina, una visita al mercato e due cene nelle sale più note di Milano."],
  "hudson-valley-farm-day": ["Giornata in fattoria nella Hudson Valley", "Lascia la città per un tour di una fattoria e di una cidreria con un picnic di prodotti locali."],
};

export const ARTICLE_IT: Record<string, { excerpt: string; sections: { heading: string; paragraphs: string[] }[] }> = {
  "how-to-read-a-tasting-menu-price": { excerpt: "Servizio, tasse, supplementi e abbinamenti: cosa include il prezzo in evidenza e cosa lascia fuori.", sections: [
    { heading: "Il numero in evidenza", paragraphs: ["Il prezzo scritto accanto a un menu degustazione raramente è quello che si paga. In gran parte dell'Europa continentale include IVA e servizio; nel Regno Unito di solito si aggiunge un servizio discrezionale di circa il 12,5%; negli Stati Uniti e a Singapore tasse e mancia si sommano al prezzo del menu.", "Prima di confrontare due ristoranti, normalizza la cifra: aggiungi servizio e tasse previsti per ogni città e decidi se confronti solo il cibo o l'intera serata."] },
    { heading: "Supplementi e abbinamenti", paragraphs: ["Molti menu elencano supplementi facoltativi: un formaggio, un'aggiunta di caviale, un percorso di vini pregiati. Possono aggiungere dal 20 al 60% al conto. Gli abbinamenti di vini si pagano di solito a persona e vanno da circa metà del prezzo del cibo a più del prezzo del cibo stesso.", "In ogni scheda mostriamo separatamente i prezzi di pranzo, cena e abbinamento, ciascuno con il suo stato: verificato, stimato o mancante."] },
    { heading: "Perché conta la data", paragraphs: ["I prezzi cambiano, spesso una o due volte l'anno. Un prezzo senza data di raccolta serve a poco: per questo ogni cifra di questo sito riporta la data in cui è stata raccolta e un link alla fonte."] } ] },
  "lunch-versus-dinner-value-gap": { excerpt: "Perché un pranzo feriale è spesso il modo più accessibile di entrare in una sala ambiziosa, e quando non lo è.", sections: [
    { heading: "Menu più breve, prezzo più basso", paragraphs: ["Molti ristoranti propongono a pranzo un menu più breve a una frazione del prezzo della cena. Nel nostro dataset demo il menu del pranzo costa in genere circa la metà di quello serale, ma scende anche il numero di portate, quindi il prezzo per portata non è sempre inferiore.", "L'Indice dei prezzi di questo sito calcola questi rapporti solo da prezzi verificati e nasconde ogni dato dove il campione è troppo piccolo."] },
    { heading: "Quando la cena conviene di più", paragraphs: ["Alcune cucine riservano i piatti simbolo alla sera e i ristoranti con bancone possono servire lo stesso menu ai due turni. Leggi i dettagli del menu invece di dare per scontato che il pranzo sia una versione ridotta."] } ] },
  "what-a-wine-pairing-includes": { excerpt: "Mescite, numero di calici e alternative analcoliche: una guida pratica prima di dire sì all'abbinamento.", sections: [
    { heading: "Quanto vino viene servito", paragraphs: ["Un abbinamento significa di solito una mescita più piccola per portata o per gruppo di portate. Su un menu lungo può arrivare all'equivalente di una bottiglia a persona, per questo molti ristoranti offrono un abbinamento ridotto o a metà."] },
    { heading: "Abbinamenti analcolici", paragraphs: ["Succhi, fermentati, tè e infusi sono sempre più diffusi e spesso costano meno dell'abbinamento di vini. Chiedi in anticipo: vengono preparati di frequente in piccoli lotti.", "Quando registriamo il prezzo di un abbinamento indichiamo se è di vino, analcolico o entrambi, e se è verificato."] } ] },
  "counter-dining-etiquette-tokyo": { excerpt: "Turni fissi, niente profumi e come gestire le esigenze alimentari a un piccolo bancone.", sections: [
    { heading: "Arriva in orario", paragraphs: ["Molti banconi servono tutti gli ospiti nello stesso momento. Arrivare in ritardo può significare perdere portate che non si possono ripetere. Calcola con generosità i tempi di viaggio."] },
    { heading: "Lascia il profumo a casa", paragraphs: ["Le fragranze forti disturbano gli aromi delicati in un bancone dove gli ospiti siedono vicini. Molti ristoranti chiedono di evitarle.", "Le esigenze alimentari vanno comunicate alla prenotazione: le cucine piccole possono non riuscire ad adattare un menu fisso all'ultimo momento."] } ] },
  "interview-anders-holm": { excerpt: "Un'intervista demo allo chef fittizio di Skov og Hav su stagioni brevi e fermentazioni lunghe.", sections: [
    { heading: "Su questa intervista", paragraphs: ["Questo è un contenuto demo: Anders Holm è uno chef fittizio creato per mostrare come vengono presentate le interviste su questo sito. Le interviste vere saranno pubblicate con l'approvazione dello chef e la data della conversazione."] },
    { heading: "Le stagioni del nord", paragraphs: ["In una conversazione demo, lo chef descrive un menu scritto attorno a tre brevi finestre di crescita, con conservazione e fermentazione che portano i sapori nel lungo inverno."] } ] },
  "why-dine-and-stay": { excerpt: "I ristoranti con camere eliminano il taxi, il treno tardivo e la fretta, e spesso aggiungono la colazione della stessa cucina.", sections: [
    { heading: "Il fascino", paragraphs: ["Un lungo menu degustazione con abbinamento raramente finisce prima delle undici. Dormire al piano di sopra trasforma la cena nel cuore di un breve viaggio, invece di una serata con una scadenza."] },
    { heading: "Cosa controllare", paragraphs: ["Il numero di camere è spesso ridotto, quindi i pacchetti finiscono per primi. Verifica se la cena è inclusa, se il menu è quello degustazione completo e quali sono le condizioni di cancellazione per ciascuna parte della prenotazione."] } ] },
  "planning-a-culinary-trip-to-tuscany": { excerpt: "Quando andare, come spostarsi tra le tenute e come bilanciare lunghi pranzi e cene con menu degustazione.", sections: [
    { heading: "Le stagioni", paragraphs: ["La tarda primavera e l'inizio dell'autunno sono i mesi più piacevoli. La vendemmia porta movimento nelle tenute; la stagione del tartufo bianco va dall'autunno all'inizio dell'inverno."] },
    { heading: "Spostarsi", paragraphs: ["Sulla mappa le distanze sembrano brevi, ma le strade di collina sono lente. Programma al massimo una visita a una tenuta e un pasto importante al giorno, e prevedi un autista se hai intenzione di degustare."] } ] },
  "dietary-requests-at-tasting-menus": { excerpt: "Con quanto anticipo chiedere, cosa possono di solito fare le cucine e come registriamo le opzioni alimentari.", sections: [
    { heading: "Chiedi presto", paragraphs: ["La maggior parte delle cucine gestisce le richieste vegetariane con preavviso; i menu vegani e senza glutine variano molto di più. Lascia almeno 48 ore, e di più per i piccoli banconi."] },
    { heading: "Come lo registriamo", paragraphs: ["Le schede mostrano opzioni vegetariane, vegane e senza glutine solo quando il ristorante le ha confermate. I filtri dell'elenco usano esattamente gli stessi dati."] } ] },
  "chef-profile-tan-wei-lin": { excerpt: "Un profilo demo che mostra come presentiamo gli chef: formazione, approccio e dove assaggiare la loro cucina.", sections: [
    { heading: "Profilo demo", paragraphs: ["Tan Wei Lin è una chef fittizia. Il formato del profilo (formazione, approccio, piatti simbolo, dove mangiare) è quello che seguiranno i profili reali, con fatti confermati dal ristorante."] } ] },
  "autumn-openings-demo": { excerpt: "Un formato di notizie illustrativo: cambi di menu, chiusure e nuovi banconi tra i locali demo.", sections: [
    { heading: "Esempio di formato", paragraphs: ["Le notizie di questo sito rimandano sempre alla scheda interessata e riportano la data della modifica. Gli articoli qui sotto riguardano solo locali demo fittizi.", "Skov og Hav (demo) è passato al menu autunnale; Le Quai Bleu (demo) ora chiude nel fine settimana; Copper Counter (demo) ha aggiunto due posti al bancone."] } ] },
  "sparkling-wine-at-the-table": { excerpt: "Articolo sponsorizzato demo: come si abbinano le bollicine metodo classico alle portate di un menu degustazione.", sections: [
    { heading: "Contenuto sponsorizzato", paragraphs: ["Questa è una dimostrazione di come vengono etichettati i contenuti sponsorizzati. Gli sponsor non influenzano mai i riconoscimenti editoriali né l'ordine dei risultati dell'elenco."] },
    { heading: "Abbinare bollicine e portate", paragraphs: ["Le bollicine magre e molto acide si abbinano a crudi di mare e antipasti sapidi; gli stili più ricchi e di lunga maturazione reggono pollame, funghi e salse al burro."] } ] },
  "how-we-verify-prices": { excerpt: "Fonti, date di raccolta e i tre stati — verificato, stimato, mancante — spiegati.", sections: [
    { heading: "Le fonti", paragraphs: ["I prezzi arrivano direttamente dal ristorante, dal suo sito ufficiale dove i termini lo consentono o da una prenotazione confermata. Ogni prezzo conserva la fonte e la data in cui è stato raccolto."] },
    { heading: "Gli stati", paragraphs: ["Verificato significa confermato da una fonte primaria entro la finestra di validità. Stimato significa ricavato da una fonte affidabile ma indiretta. Mancante significa che non abbiamo la cifra, e lo diciamo invece di tirare a indovinare."] } ] },
};
