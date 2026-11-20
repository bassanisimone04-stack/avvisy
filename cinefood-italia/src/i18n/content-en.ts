/**
 * ============================================================
 *  TRADUZIONI INGLESI DEI CONTENUTI (film e locali)
 * ============================================================
 *  Tutte le traduzioni in un unico file, indicizzate per "slug"
 *  (il nome del file senza .md). Se una voce manca, il sito usa
 *  automaticamente il testo italiano.
 */
import type { Restaurant, Film } from "../lib/utils";
import type { Lang } from "./ui";

interface FilmEn {
  titolo?: string;
  titoloSeo?: string;
  locandinaAlt?: string;
  sinossi?: string;
  faq?: { domanda: string; risposta: string }[];
}

/**
 * Nomi delle città che cambiano in inglese (le altre restano invariate).
 * Usata solo per il TESTO visibile in inglese: gli slug delle pagine e gli
 * indirizzi reali restano in italiano (es. /en/roma, "00186 Roma RM").
 */
const CITTA_EN: Record<string, string> = {
  Roma: "Rome",
  Milano: "Milan",
  Napoli: "Naples",
  Venezia: "Venice",
};

/** Traduce il nome di una città per la lingua data (solo per il testo mostrato). */
export function tCitta(cittaIt: string, lang: Lang): string {
  if (lang !== "en") return cittaIt;
  return CITTA_EN[cittaIt] ?? cittaIt;
}

export const filmsEn: Record<string, FilmEn> = {
  "il-padrino": {
    locandinaAlt: "The entrance of Bar Vitelli in Savoca",
    titolo: "The Godfather",
    sinossi:
      "Coppola's masterpiece about the Corleone family. The 'Sicilian' scenes were shot in the villages of Savoca and Forza d'Agrò, near Messina.",
    faq: [
      { domanda: "Where was the Sicilian part of The Godfather filmed?", risposta: "In the villages of Savoca and Forza d'Agrò, near Messina: the town of Corleone looked too modern, so Coppola chose these untouched hamlets." },
      { domanda: "Where can you eat like in The Godfather in Savoca?", risposta: "At Bar Vitelli, in Piazza Fossia, the bar where Michael Corleone asks the owner for Apollonia's hand: it's still open and almost unchanged since 1972." },
    ],
  },
  "il-talento-di-mr-ripley": {
    titoloSeo: "The Talented Mr. Ripley: Italy Filming Locations",
    locandinaAlt: "A room of Caffè Florian in Piazza San Marco, Venice",
    titolo: "The Talented Mr. Ripley",
    sinossi:
      "A psychological thriller with Matt Damon and Jude Law, set in 1950s Italy between the coast, Rome and Venice.",
    faq: [
      { domanda: "Where was The Talented Mr. Ripley filmed in Venice?", risposta: "Its Venetian locations include the famous Caffè Florian in St Mark's Square, where Tom meets Marge and Dickie's father." },
      { domanda: "Does Caffè Florian still exist?", risposta: "Yes: opened in 1720, it is considered Italy's oldest café still in business, under the Procuratie Nuove in St Mark's Square." },
    ],
  },
  "mangia-prega-ama": {
    titoloSeo: "Eat Pray Love in Italy: All Filming Locations",
    locandinaAlt: "The entrance of L'Antica Pizzeria da Michele in Naples",
    titolo: "Eat Pray Love",
    sinossi:
      "Based on Elizabeth Gilbert's memoir, starring Julia Roberts. The first part, set in Rome, is a hymn to Italian food and la dolce vita.",
    faq: [
      { domanda: "Where does Julia Roberts eat in Eat Pray Love in Rome?", risposta: "Several trattorias in the historic centre, including Trattoria Santa Lucia in Largo Febo (the famous Roman-dishes scene) and Da Pancrazio, in the cellars of the ancient Theatre of Pompey." },
      { domanda: "What is the film's most famous food scene?", risposta: "The one where the lead savours Roman cuisine in a trattoria: it became an icon of food scenes set in Italy." },
      { domanda: "Can you still visit the film's restaurants?", risposta: "Yes, they are real venues in central Rome. Always check opening hours and availability before going." },
    ],
  },
  "benvenuti-al-sud": {
    titoloSeo: "Benvenuti al Sud: Castellabate Filming Locations",
    locandinaAlt: "The seaside terrace of Ristorante Le Gatte in Castellabate",
    titolo: "Welcome to the South",
    sinossi:
      "A blockbuster comedy with Claudio Bisio and Alessandro Siani, largely shot in Castellabate, in the Cilento area.",
    faq: [
      { domanda: "Where was Welcome to the South filmed?", risposta: "Mainly in Castellabate, a village in the Cilento (province of Salerno), among the little square, the port of San Marco and the old alleys." },
      { domanda: "Where to eat like in the film in Castellabate?", risposta: "At the Le Gatte restaurant, on the port, where the colleagues' dinner is set, and in the bars of the little square overlooking the sea." },
    ],
  },
  "la-grande-bellezza": {
    locandinaAlt: "The frescoed room of La Veranda at Hotel Columbus in Rome (now closed)",
    titolo: "The Great Beauty",
    sinossi:
      "Winner of the Oscar for Best Foreign Film. A baroque, melancholic portrait of Rome, among terraces, palaces and atmospheric restaurants.",
    faq: [
      { domanda: "Where was The Great Beauty filmed in Rome?", risposta: "In many of the city's landmarks. Among the restaurants, Jep's dinner with Ramona is set at La Veranda of Hotel Columbus, in Borgo Santo Spirito, near the Vatican; the hotel is now closed and the restaurant no longer appears to be operating." },
      { domanda: "Where can you eat like in The Great Beauty?", risposta: "La Veranda of Hotel Columbus, where Jep's dinner was shot, no longer appears to be operating. You can still find the film's Rome in the places described in the linked articles, such as Palazzo Sacchetti on Via Giulia." },
    ],
  },
  "un-americano-a-roma": {
    locandinaAlt: "Outdoor tables with checked tablecloths under an «Antica Trattoria Romana» sign on a square in Rome",
    titolo: "An American in Rome",
    sinossi:
      "A cult comedy with Alberto Sordi as Nando Mericoni, the Roman obsessed with America. His is the legendary 'macaroni' scene.",
    faq: [
      { domanda: "What is the most famous scene of An American in Rome?", risposta: "The 'macaroni' scene: after scorning American food, Nando gives in to Roman pasta with the line 'Macaroni, you provoked me and now I'll destroy you'." },
      { domanda: "Where can you eat the Roman cuisine of the film?", risposta: "In Rome's historic trattorias serving traditional dishes, like those loved by Nando Mericoni." },
    ],
  },
  "chiamami-col-tuo-nome": {
    locandinaAlt: "A street in the centre of a Northern Italian town with colourful hanging umbrellas and an ice-cream cone in the foreground",
    titolo: "Call Me by Your Name",
    sinossi:
      "An Oscar-winning summer love story (Best Adapted Screenplay), filmed in the Lombard lowlands, with Crema and its surroundings at its scenic heart.",
    faq: [
      { domanda: "Where was Call Me by Your Name filmed?", risposta: "Around Crema, in Lombardy: the villa in Moscazzano, the squares and alleys of Crema's old town, and the surrounding countryside." },
      { domanda: "What to see and where to stop in Crema following the film?", risposta: "Piazza del Duomo and the cafés of the historic centre, perfect for a break while touring the film's locations." },
    ],
  },
  "la-dolce-vita": {
    locandinaAlt: "The Trevi Fountain in Rome, the fountain of the film's most famous scene",
    titoloSeo: "La Dolce Vita Filming Locations in Rome",
    titolo: "La Dolce Vita",
    sinossi:
      "Fellini's masterpiece with Marcello Mastroianni: the worldly, night-time Rome of Via Veneto, its cafés and the Trevi Fountain, between glamour and melancholy.",
    faq: [
      { domanda: "Where is La Dolce Vita set in Rome?", risposta: "Mostly on Via Veneto, with its elegant cafés and hotels, and at the Trevi Fountain (Anita Ekberg's famous bathe)." },
      { domanda: "Where to soak up the film's atmosphere today?", risposta: "On Via Veneto: Harry's Bar is still open, while the Café de Paris is closed. Note that the film's Via Veneto scenes were rebuilt at Cinecittà." },
    ],
  },
  "il-commissario-montalbano": {
    locandinaAlt: "The seaside veranda of Enzo a Mare in Punta Secca",
    titolo: "Inspector Montalbano",
    sinossi:
      "The cult TV series based on Camilleri's novels, filmed in south-eastern Sicily (Ragusa, Scicli, Punta Secca). The inspector is also famous for his love of Sicilian food.",
    faq: [
      { domanda: "Where was the Montalbano series filmed?", risposta: "In the Ragusa area: Montalbano's house is in Punta Secca (Santa Croce Camerina), while the police station is in Scicli. Ragusa Ibla and the local baroque form the backdrop." },
      { domanda: "Where can you eat like Montalbano?", risposta: "In the seaside trattorias of the Ragusa coast, serving the Sicilian dishes the inspector loves: pasta 'ncasciata, arancini and fresh fish." },
    ],
  },
  "nuovo-cinema-paradiso": {
    titoloSeo: "Cinema Paradiso: Palazzo Adriano & the Museum",
    locandinaAlt: "Piazza Umberto I in Palazzo Adriano, with the fountain and the bell tower",
    titolo: "Cinema Paradiso",
    sinossi:
      "Winner of the Oscar for Best Foreign Film. A Sicilian boy's love story with cinema, with the famous square of Palazzo Adriano at the heart of the tale.",
    faq: [
      { domanda: "Where was Cinema Paradiso filmed?", risposta: "Mainly in Palazzo Adriano, in the province of Palermo, whose square with the octagonal fountain became the set of the town of Giancaldo." },
      { domanda: "What to see in Palazzo Adriano following the film?", risposta: "The beautiful Piazza Umberto I and the bars overlooking the square, where you can stop while visiting the village." },
    ],
  },
  "il-postino": {
    locandinaAlt: "Pastel-coloured houses overlooking the Marina Corricella harbour, Procida",
    titoloSeo: "Il Postino Filming Locations: Salina & Procida",
    titolo: "Il Postino (The Postman)",
    sinossi:
      "Massimo Troisi's last, poetic film: the friendship between a humble postman and the poet Pablo Neruda, shot on the islands of Salina and Procida.",
    faq: [
      { domanda: "Where was Il Postino filmed?", risposta: "Across the Aeolian island of Salina (especially Pollara) and Procida, in the Gulf of Naples, with their almost untouched seascapes." },
      { domanda: "Was Il Postino filmed in Procida or Salina?", risposta: "In both: Procida (Marina Corricella, the inn, the church) is the film's village; Salina (Pollara) hosts Neruda's house and the bike rides." },
      { domanda: "What to eat in Salina?", risposta: "Aeolian flavours: pane cunzato, Salina capers, malvasia wine and fish dishes in the trattorias overlooking the sea." },
    ],
  },
  "to-rome-with-love": {
    locandinaAlt: "Tables with checked tablecloths under a flowering wisteria in front of a restaurant in central Rome",
    titolo: "To Rome with Love",
    sinossi:
      "Woody Allen's ensemble comedy set in Rome, among squares, alleys and restaurants of the Eternal City, in an ironic tribute to the capital.",
    faq: [
      { domanda: "Where was To Rome with Love filmed?", risposta: "In Rome, at places in the historic centre such as Piazza del Campidoglio and the Trevi Fountain." },
      { domanda: "Where to eat like in the film in Rome?", risposta: "Our list does not yet include a venue confirmed among the film's filming locations: see the listing for the Rome stops we suggest, which are marked as not filmed in the movie." },
    ],
  },
  "house-of-gucci": {
    locandinaAlt: "An orange tram on a cobbled street in central Milan",
    titolo: "House of Gucci",
    sinossi:
      "Ridley Scott's drama about the Gucci dynasty with Lady Gaga and Adam Driver, filmed between Milan, Lake Como and Rome, amid elegance and ambition.",
    faq: [
      { domanda: "Where was House of Gucci filmed in Italy?", risposta: "Between Milan (with its fashion and palaces), Lake Como and Rome, plus some Alpine locations." },
      { domanda: "Where to feel the film's atmosphere in Milan?", risposta: "No venue is confirmed among the filming locations; the listing suggests a restaurant in Brera, marked as not filmed in the movie." },
    ],
  },
  "master-of-none": {
    locandinaAlt: "The shop window of the Giusti delicatessen in Modena",
    sinossi:
      "The Netflix series created by Aziz Ansari and Alan Yang. Season 2 (2017) opens in Modena, where Dev learns the art of pasta and dines at Osteria Francescana, Massimo Bottura's three-Michelin-star restaurant.",
    faq: [
      { domanda: "Was Master of None really filmed in Modena?", risposta: "Yes: the start of season 2 (2017) was filmed entirely in Modena, where Dev moves to learn how to make fresh pasta." },
      { domanda: "What is the real restaurant that appears in the show?", risposta: "Osteria Francescana, chef Massimo Bottura's three-Michelin-star restaurant, voted the world's best restaurant in both 2016 and 2018." },
      { domanda: "Did Aziz Ansari really learn to make pasta for the role?", risposta: "Yes: the actor and co-creator actually moved to Modena for weeks, studying Italian and the art of hand-rolled pasta before filming." },
    ],
  },
  "succession": {
    locandinaAlt: "A cypress-lined drive with a farmhouse at the end, among Tuscan hills",
    sinossi:
      "The Emmy-winning HBO series about the Roy family. The wedding in the season 3 finale is filmed in Tuscany, between Villa La Foce and Villa Cetinale, in the Val d'Orcia.",
    faq: [
      { domanda: "Where was Succession filmed in Tuscany?", risposta: "In the Val d'Orcia: the Roy family stays at Villa La Foce, while the season 3 finale wedding is filmed at Villa Cetinale, near Siena." },
      { domanda: "Can you eat at one of Succession's real locations?", risposta: "The Villa La Foce estate has a restaurant, Dopolavoro La Foce, open to the public near Pienza; it is not listed among the filming locations, which concern the villa." },
    ],
  },
  "l-amica-geniale": {
    locandinaAlt: "The bar counter of café ScottoJonno in Naples",
    titolo: "My Brilliant Friend",
    sinossi:
      "The HBO/Rai series based on Elena Ferrante's novels, set in 1950s Naples. The neighbourhood is a built set, but many scenes are filmed in real locations across the city, including the historic Galleria Principe di Napoli.",
    faq: [
      { domanda: "Is My Brilliant Friend really filmed in Naples?", risposta: "Partly: the Rione Luzzatti where Lila and Elena live is actually a set built in Marcianise, near Caserta. Many other scenes, though, are shot in real Naples locations: the Galleria Principe di Napoli, the Caracciolo seafront, Piazza dei Martiri, the Teatro San Carlo." },
      { domanda: "What real venue appears in the show?", risposta: "Season 4 features ScottoJonno, a real café-bistrot inside the Galleria Principe di Napoli, reopened in 2023 in a 19th-century former café-chantant." },
    ],
  },
  "e-stata-la-mano-di-dio": {
    locandinaAlt: "Villa Giusso in Vico Equense, with the well in the garden",
    titolo: "The Hand of God",
    sinossi:
      "Paolo Sorrentino's Netflix film, Silver Lion winner in Venice and Oscar nominee, tells the story of his native Naples. Filmed in real city locations, including the Vomero district and Villa Giusso, on the Sorrentine Peninsula.",
    faq: [
      { domanda: "Was The Hand of God really filmed in Naples?", risposta: "Yes: among the real locations, the Schisa family home is filmed on Via San Domenico, in the Vomero district, one floor from Sorrentino's real childhood home. Piazza del Plebiscito and the Galleria Umberto I also appear." },
      { domanda: "Where was the family lunch scene filmed?", risposta: "At Villa Giusso, an agriturismo set in a 17th-century former monastery in Vico Equense, on the Sorrentine Peninsula, overlooking the Gulf of Naples." },
    ],
  },
  hannibal: {
    locandinaAlt: "Palazzo Vecchio in Piazza della Signoria, Florence",
    titolo: "Hannibal",
    sinossi:
      "The sequel to The Silence of the Lambs takes Hannibal Lecter to Florence, where he lives under a false name as curator of the Palazzo Capponi library. Shot in the city in 2000, the film moves through Piazza della Signoria, Palazzo Vecchio, Santa Croce and the Spedale degli Innocenti.",
    faq: [
      { domanda: "Was Hannibal really filmed in Florence?", risposta: "Yes. The Florentine shoot took place in spring and summer 2000, and Piazza della Signoria, Palazzo Vecchio, the Basilica of Santa Croce and the Spedale degli Innocenti are all recognisable in the film." },
      { domanda: "Which historic café appears in Hannibal?", risposta: "Caffè Rivoire, on Piazza della Signoria, is among the places recognisable in the film: the historic café facing Palazzo Vecchio, founded in 1872 and still open today." },
      { domanda: "Why is the film set in Florence?", risposta: "In Thomas Harris's novel, Lecter hides in Florence under the identity of \"Dr Fell\", curator of the Palazzo Capponi library. It is there that inspector Rinaldo Pazzi, played by Giancarlo Giannini, begins to suspect his true identity." },
    ],
  },
  "the-american": {
    locandinaAlt: "A square with arcades and a Renaissance palace in a central Italian town",
    titolo: "The American",
    sinossi:
      "George Clooney plays a gunsmith and assassin who takes refuge in an Abruzzo village after an ambush. Shot across Sulmona, Castel del Monte, Pacentro, Calascio and Campo Imperatore, the film turned the province of L'Aquila into its main landscape.",
    faq: [
      { domanda: "Where was The American with George Clooney filmed?", risposta: "In Abruzzo, in the province of L'Aquila: Sulmona, Castel del Monte, Pacentro, Castelvecchio Calvisio, Calascio, Corfinio and Campo Imperatore, as documented by the Abruzzo Region Film Commission." },
      { domanda: "How long did the Sulmona shoot last?", risposta: "Filming in Piazza Garibaldi lasted four days, with around 1,600 extras and some thirty businesses on the square involved in the production, including Caffè Tucci." },
      { domanda: "Does Caffè Tucci in Sulmona appear in the film?", risposta: "Caffè Tucci, on Piazza Garibaldi, was involved in the shoot: owner Sante Tucci took down the outdoor gazebo for the production's needs, as reported by the newspaper Il Centro." },
    ],
  },
  "corro-da-te": {
    locandinaAlt: "A Turin square with arcaded buildings and outdoor tables with closed parasols",
    titolo: "Running to You (Corro da te)",
    sinossi:
      "A comedy with Pierfrancesco Favino and Miriam Leone, shot in Turin in 2020. Gianni, a serial seducer, pretends to use a wheelchair in order to win over Chiara, a paraplegic musician — and ends up having to face himself.",
    faq: [
      { domanda: "Where was Corro da te filmed?", risposta: "In Turin, in February 2020, supported by the Film Commission Torino Piemonte. Locations include the Teatro Regio and the Del Cambio restaurant on Piazza Carignano." },
      { domanda: "Which restaurant appears in Corro da te?", risposta: "Ristorante Del Cambio, the historic venue on Piazza Carignano in Turin, today a Michelin-starred restaurant. It is where Gianni takes Chiara to dinner after her performance at the Teatro Regio." },
      { domanda: "Who stars in Corro da te?", risposta: "Pierfrancesco Favino as Gianni and Miriam Leone as Chiara, directed by Riccardo Milani. The film was released in cinemas in March 2022." },
    ],
  },
  "il-re": {
    locandinaAlt: "Trieste's Grand Canal at sunset, with moored boats",
    titolo: "The King (Il Re)",
    sinossi:
      "A Sky Original series starring Luca Zingaretti as Bruno Testori, the governor of a border prison who runs it by his own rules. Shot across Rome, Turin, Civitavecchia and Trieste, where the production used Piazza Oberdan, Ponterosso, the Porto Vecchio and the Antico Caffè San Marco.",
    faq: [
      { domanda: "Where was the series Il Re with Luca Zingaretti filmed?", risposta: "Across Rome, Turin, Civitavecchia and Trieste. In Trieste, filming covered Piazza Oberdan, Ponterosso, the Porto Vecchio and the Antico Caffè San Marco, as documented by the film tourism portal of the Friuli Venezia Giulia Film Commission." },
      { domanda: "Which historic café appears in Il Re?", risposta: "The Antico Caffè San Marco in Trieste, founded in 1914 and still open today: some scenes in the series are shot in its interiors." },
      { domanda: "What is Il Re about?", risposta: "Bruno Testori runs a prison on Italy's eastern border by his own highly personal rules, until internal investigations into several murders and the presence of a suspected terrorist put him under pressure. A second season arrived in 2025." },
    ],
  },
  "rocco-schiavone": {
    locandinaAlt: "An Alpine village with a stone bridge and mountains behind",
    titolo: "Rocco Schiavone",
    sinossi:
      "Based on Antonio Manzini's novels, this Rai series follows Roman deputy police chief Rocco Schiavone (Marco Giallini), transferred to Aosta as a punishment. Shot in the Aosta Valley with the support of the regional film commission.",
    faq: [
      { domanda: "Where is the series Rocco Schiavone filmed?", risposta: "In the Aosta Valley, in and around Aosta, with the collaboration of the Fondazione Film Commission Vallée d'Aoste and the regional government. Locations include Via Porta Praetoria, the Roman Theatre, the Beauregard Hospital and the Caffè Nazionale on Piazza Chanoux." },
      { domanda: "Does the Caffè Nazionale in Aosta really exist?", risposta: "Yes: it is a historic café under the arcades of Piazza Émile Chanoux in Aosta. At the time of the season 4 shoot it was closed, and was reopened specifically for filming; it then reopened to the public in August 2022 as \"Paolo Griffa al Caffè Nazionale\"." },
      { domanda: "Who plays Rocco Schiavone?", risposta: "Marco Giallini, as the Roman deputy police chief transferred to Aosta as a punishment, the lead of the Rai series based on Antonio Manzini's novels." },
    ],
  },
  "the-equalizer-3": {
    locandinaAlt: "A village of ochre-coloured houses by the sea, on the Amalfi Coast",
    titoloSeo: "The Equalizer 3 Filming Locations: Atrani",
    titolo: "The Equalizer 3",
    sinossi:
      "Robert McCall (Denzel Washington), badly wounded, is nursed back to health in a small village on the Amalfi Coast and ends up defending it from the Camorra. The fictional town of \"Altamonte\" is in fact Atrani, with filming also in Maiori and Minori.",
    faq: [
      { domanda: "Where was The Equalizer 3 filmed?", risposta: "On the Amalfi Coast: the fictional village of \"Altamonte\" is Atrani, Italy's smallest municipality by area, with filming also in Maiori and Minori." },
      { domanda: "Does Denzel Washington's café in The Equalizer 3 really exist?", risposta: "Yes: the film's \"Aminah's Cafe\" is Ristorante Savò in Atrani, on the village square, dressed as a café for the shoot. The venue tells the story on its own website." },
      { domanda: "Are the shops in Atrani real?", risposta: "Partly not: the production replaced the shop signs around the square, turning some into a set bakery, grocery and hardware store. The buildings and the square itself, though, are the real Atrani." },
    ],
  },
  "the-devil-wears-prada-2": {
    locandinaAlt: "The façade of Milan Cathedral",
    titolo: "The Devil Wears Prada 2",
    sinossi:
      "Twenty years after the first film, Andy Sachs (Anne Hathaway), now a media executive, has to work with her former boss Miranda Priestly (Meryl Streep), whose publishing empire is in crisis. Partly filmed in Milan and on Lake Como in autumn 2025, released in Italian cinemas on 29 April 2026 (1 May in the United States).",
    faq: [
      { domanda: "Was The Devil Wears Prada 2 really filmed in Milan?", risposta: "Yes. Palazzo Parigi Hotel & Grand Spa, where the cast stayed, reports scenes shot in the lobby, at Caffè Parigi and outside. In Milan the shoot also touched Brera (Pinacoteca) and Fashion Week; then Villa Arconati and, on Lake Como, Villa Balbiano." },
      { domanda: "Did the film have a tourism impact on Milan?", risposta: "Sky TG24 (8 May 2026) reported a boom of tourist interest in the film's Italian locations. We haven't verified the percentages in circulation, so we don't report them." },
      { domanda: "Who stars in The Devil Wears Prada 2?", risposta: "Meryl Streep (Miranda Priestly), Anne Hathaway (Andy Sachs) and Emily Blunt (Emily Charlton), twenty years after the first film, directed by David Frankel." },
    ],
  },
  "from-scratch": {
    locandinaAlt: "Ponte Vecchio and the houses along the Arno in Florence",
    titolo: "From Scratch",
    sinossi:
      "An 8-episode Netflix limited series based on Tembi Locke's autobiographical memoir. Amy (Zoe Saldana), an American student in Florence, falls for Sicilian chef Lino: the story follows their life between Tuscany and Sicily.",
    faq: [
      { domanda: "Is From Scratch based on a true story?", risposta: "Yes, it's based on Tembi Locke's autobiographical memoir, which recounts her own love story with a Sicilian chef she met in Florence." },
      { domanda: "Where does Lino work in the show?", risposta: "At Buca dell'Orafo, a historic Florentine trattoria on Via dei Girolami, a real venue in the city where the character works as a chef." },
      { domanda: "Who created From Scratch?", risposta: "Sisters Attica Locke and Tembi Locke, co-creators, with Zoe Saldana starring as protagonist Amy. Directing credits include Nzingha Stewart." },
    ],
  },
  "blocco-181-gangs-of-milano": {
    locandinaAlt: "A Turin square with arcaded buildings and outdoor tables with closed parasols",
    titolo: "Blocco 181 - Gangs of Milano",
    sinossi:
      "A Sky Original crime drama created and musically supervised by Salmo, about youth gangs in Milan's suburbs. The story is set in Milan, but season 2 was filmed almost entirely in Turin, between October 2023 and April 2024.",
    faq: [
      { domanda: "Is Blocco 181 really filmed in Milan?", risposta: "The story is set in Milan, but season 2 was filmed almost entirely in Turin, according to the Film Commission Torino Piemonte, which documented over a hundred Piedmont locations used by the production." },
      { domanda: "Which historic restaurant appears in the show?", risposta: "Ristorante Del Cambio, on Piazza Carignano, among the more than a hundred Turin locations used for filming season 2, alongside Le Roi Music Hall and the Crocetta district." },
      { domanda: "Who created Blocco 181?", risposta: "Rapper Salmo, creator and music supervisor of the Sky Original series, directed by Ciro Visco." },
    ],
  },
  "la-porta-rossa": {
    locandinaAlt: "Trieste's Grand Canal at sunset, with moored boats",
    titolo: "The Red Door",
    sinossi:
      "A Rai 2 noir series in three seasons (2017-2023), set in Trieste. Inspector Leonardo Cagliostro (Lino Guanciale), left in a suspended state after being murdered, investigates his own killing alongside judge Anna Mayer (Gabriella Pession).",
    faq: [
      { domanda: "Where is The Red Door filmed?", risposta: "In Trieste, which forms the backdrop for all three seasons of the series, drawing on the city's Mitteleuropean atmosphere and historic cafés." },
      { domanda: "Which historic café appears in The Red Door?", risposta: "The Antico Caffè San Marco, where the characters of judge Anna Mayer and magistrate Antonio Piras meet, according to the official film tourism portal of the Friuli Venezia Giulia region." },
      { domanda: "Who plays the leads in The Red Door?", risposta: "Lino Guanciale as Inspector Leonardo Cagliostro and Gabriella Pession as judge Anna Mayer, in a series created by Carlo Lucarelli and Giampiero Rigosi." },
    ],
  },
  "viaggi-di-nozze": {
    locandinaAlt: "A historic villa with statues and citrus pots on a stone balustrade, under a blue sky",
    titolo: "Honeymoons",
    sinossi:
      "A three-story comedy about disastrous honeymoons. In the first, Ivano (Carlo Verdone) and Jessica (Claudia Gerini) celebrate an 'off-key' wedding between Rome and Sardinia, before the trip turns into a string of mishaps.",
    faq: [
      { domanda: "Where do Ivano and Jessica get married in Honeymoons?", risposta: "At the Church of San Giuseppe Cottolengo, on Viale Valle Aurelia in Rome, with the reception filmed at Ristorante Paradiso Terrestre, on Via delle Capannelle." },
      { domanda: "Who directed Honeymoons?", risposta: "Carlo Verdone, who also stars as one of the leads (Ivano) alongside Claudia Gerini (Jessica), in a three-story film about honeymoons gone wrong." },
    ],
  },
  "diabolik-ginko-allattacco": {
    locandinaAlt: "Trieste's Grand Canal at sunset, with moored boats",
    titolo: "Diabolik - Ginko Attacks!",
    sinossi:
      "The second chapter of the Italian trilogy about Diabolik, based on the famous comic by the Giussani sisters. Inspector Ginko hunts the masked thief through the fictional city of Clerville, recreated across Bologna, Trieste and Milan.",
    faq: [
      { domanda: "Where was Diabolik - Ginko Attacks! filmed?", risposta: "The fictional city of Clerville was recreated across Bologna, Trieste and Milan. In Trieste, filming included a car chase in Piazza della Borsa and a scene at the Antico Caffè San Marco." },
      { domanda: "Which historic café appears in the film?", risposta: "The Antico Caffè San Marco in Trieste, open since 1914: a scene was shot at the venue's counter, while the nearby Piazza della Borsa hosts the chase between police cars and Diabolik's Jaguar E-Type." },
      { domanda: "Who directed Diabolik - Ginko Attacks!?", risposta: "The Manetti Bros., for the second chapter of the Italian trilogy based on the Giussani sisters' comic, starring Giacomo Gianniotti as Diabolik and Valerio Mastandrea as Inspector Ginko." },
    ],
  },
  "il-commissario-ricciardi": {
    locandinaAlt: "A street in Naples' old town with wrought-iron balconies",
    titolo: "Commissioner Ricciardi",
    sinossi:
      "A Rai 1 series based on Maurizio De Giovanni's novels. Naples, the 1930s: Commissioner Luigi Alfredo Ricciardi (Lino Guanciale) has a supernatural gift — he perceives the last thoughts of murder victims — which he uses to solve cases amid fascism and Neapolitan high society.",
    faq: [
      { domanda: "Was Commissioner Ricciardi really filmed in Naples?", risposta: "Yes. Among the official locations, documented by the Campania Region Film Commission, are the Teatro San Carlo, the Teatro Sannazaro, Capodimonte, Villa Pignatelli, the Royal Palace of Portici and the Gran Caffè Gambrinus." },
      { domanda: "Which historic café appears in the show?", risposta: "The Gran Caffè Gambrinus, on Piazza Trieste e Trento: for filming it was transformed into the 1930s café frequented by the commissioner, with scenes set at his favourite table overlooking Piazza del Plebiscito." },
      { domanda: "Who plays Commissioner Ricciardi?", risposta: "Lino Guanciale in the title role, in a Rai 1 series based on Maurizio De Giovanni's novels, airing since 2021 across several seasons." },
    ],
  },
  "stanley-tucci-searching-for-italy": {
    locandinaAlt: "The corner of a Roman lane with an orange-fronted bar and people at the tables",
    titolo: "Stanley Tucci: Searching for Italy",
    sinossi:
      "A CNN food-travel series: actor Stanley Tucci explores Italian cuisine region by region, from Naples to Rome, Emilia-Romagna to Sicily, through trattorias, pizzerias and great restaurants. Winner of multiple Emmys for outstanding hosted non-fiction series.",
    faq: [
      { domanda: "Where did Stanley Tucci eat in Searching for Italy?", risposta: "Among the venues listed by CNN: La Reginella in Rome's Jewish Ghetto (carciofi alla giudia), Enzo Coccia's pizzeria La Notizia in Naples, I Pupi in Bagheria and Mè Cumpari Turiddu in Catania (Sicily), Osteria del Cinghiale Bianco in Florence, Ratanà and Osteria del Treno in Milan, All'Arco, Villa 600, Venissa and Orient Experience in Venice, Christian e Manuel in Vercelli, Antichi Sapori, Bere Vecchie and Vitantonio Lombardo (Puglia and Matera), Alla Via di Mezzo (Umbria), Mabrouk, Luigi Pomata and Fradis Minoris (Sardinia), Osteria della Cipolla Rossa (Calabria), Cracco Portofino and Il Genovese (Liguria), Lo Scoglio in Marina del Cantone (spaghetti alla Nerano) and Casa Artusi in Forlimpopoli." },
      { domanda: "Who produces Searching for Italy?", risposta: "It's a CNN Original Series, airing since February 14, 2021 across two seasons, hosted by actor Stanley Tucci, whose family comes from Calabria." },
      { domanda: "Are the places Tucci visited still open?", risposta: "The ones listed on CineFood Italia are: we've verified each one. Hours and availability can still change, so check before you go." },
    ],
  },
  "somebody-feed-phil-venezia": {
    locandinaAlt: "A Venetian canal with a gondola between the palaces",
    titolo: "Somebody Feed Phil - Venice and Modena",
    sinossi:
      "The Venice episode of the Netflix food-travel series hosted by Phil Rosenthal, creator of Everybody Loves Raymond: bacari, cicchetti and historic trattorias, in search of the Venice that Venetians actually eat in.",
    faq: [
      { domanda: "What is Somebody Feed Phil?", risposta: "A Netflix food-travel series hosted by Phil Rosenthal, creator of the sitcom Everybody Loves Raymond. The Venice episode opens season two (2018)." },
      { domanda: "Where did Phil Rosenthal eat in Venice?", risposta: "Among the episode's venues, listed on Phil Rosenthal's official website: Al Covo, which Phil calls perhaps the best restaurant in Venice, and Vini da Arturo, famous for its pork chop with vinegar." },
      { domanda: "Do you need to book?", risposta: "For Al Covo and Vini da Arturo it's recommended: they're small, busy places, even more so since the episode aired." },
    ],
  },
  "no-reservations-rome": {
    locandinaAlt: "A cobbled lane in Rome at night, with lit outdoor tables and a dome in the background",
    titolo: "Anthony Bourdain: No Reservations - Rome",
    sinossi:
      "An episode of the Travel Channel culinary travel series hosted by Anthony Bourdain: the chef and writer explores Rome between historic trattorias and the Via Veneto of the 'dolce vita', in search of the Italian art of living well.",
    faq: [
      { domanda: "What is Anthony Bourdain: No Reservations?", risposta: "A culinary travel series that aired on Travel Channel from 2005 to 2012, hosted by chef and writer Anthony Bourdain." },
      { domanda: "Which Rome restaurant did the episode make famous?", risposta: "Ristorante Roma Sparita, in Trastevere, for its cacio e pepe served in an edible parmesan basket — Bourdain initially kept the venue's name secret, calling it 'Restaurant X'." },
      { domanda: "Does the Rome episode also feature Via Veneto?", risposta: "Yes: Bourdain also stops at Harry's Bar, a historic venue on the Via Veneto of Fellini's 'dolce vita'." },
    ],
  },
  "makari": {
    locandinaAlt: "Sea stacks rising from the turquoise water in the bay of Scopello, Sicily",
    titolo: "Màkari",
    sinossi:
      "A Rai 1 series based on Gaetano Savatteri's novels. Saverio Lamanna (Claudio Gioè), a writer in crisis, returns to his native Sicily and gets drawn into investigations alongside his friend, private investigator Peppe Piccionello, between the village of Macari and San Vito Lo Capo.",
    faq: [
      { domanda: "Is Màkari really filmed in Sicily?", risposta: "Yes, mainly between Macari (a hamlet of San Vito Lo Capo), Castellammare del Golfo and the Zingaro Nature Reserve, in the province of Trapani, according to the official Italy for Movies portal." },
      { domanda: "Does Marilù's restaurant in the show really exist?", risposta: "The restaurant set was built at the Tonnara di Scopello, according to Italy for Movies. The character of Marilù is inspired by a real person, Marilù Terrasi, who runs the restaurant Il Pocho in Macari — a different location from the one used for filming." },
      { domanda: "Who plays Saverio Lamanna in Màkari?", risposta: "Claudio Gioè, in the lead role, in a Rai 1 series based on Gaetano Savatteri's novels, airing since 2021 across several seasons." },
    ],
  },
  "don-matteo": {
    locandinaAlt: "A medieval lane with stone arches, in a town in central Italy",
    titolo: "Don Matteo",
    sinossi:
      "A Rai 1 series on air since 2000, still in production. Terence Hill plays Don Matteo, a detective priest who helps the local police solve cases alongside Sergeant Cecchini (Nino Frassica). Filmed in Gubbio for the first eight seasons (2000-2011), then in Spoleto.",
    faq: [
      { domanda: "Where is Don Matteo filmed?", risposta: "The first eight seasons (2000-2011) were shot in Gubbio, Umbria; from season nine on, production moved to Spoleto, also in Umbria." },
      { domanda: "Which café appears in Don Matteo in Gubbio?", risposta: "Caffè Ducale, on Piazza Grande: it's the café where Sergeant Cecchini and Don Matteo play their daily chess games. The venue still keeps props from the show." },
      { domanda: "Who plays Don Matteo?", risposta: "Terence Hill in the title role, with Nino Frassica as Sergeant Cecchini, in a series created by Enrico Oldoini and airing on Rai 1 since 2000." },
    ],
  },
  "i-laureati": {
    locandinaAlt: "A lane in central Florence with wrought-iron lamps",
    titolo: "I laureati",
    sinossi: "A 1995 comedy directed by and starring Leonardo Pieraccioni, one of the Tuscan director's first hits, set in Florence.",
    faq: [
      { domanda: "Where was I laureati filmed?", risposta: "In Florence. Among the locations listed by the Italy for Movies portal is Trattoria Coco Lezzone, on Via del Parioncino 26/r, where a scene is shot inside the venue." },
      { domanda: "Who directed I laureati?", risposta: "Leonardo Pieraccioni, who also stars in it. The film dates from 1995." },
      { domanda: "Can you eat at the film's trattoria?", risposta: "Yes: Trattoria Coco Lezzone is a historic Florentine venue still in business, serving traditional Tuscan cooking." },
    ],
  },
  "the-trip-to-italy": {
    locandinaAlt: "Laid tables in a lane on the Amalfi Coast",
    titolo: "The Trip to Italy",
    sinossi: "Steve Coogan and Rob Brydon cross Italy eating at real restaurants, from Piedmont to Capri. It began as a BBC TV series directed by Michael Winterbottom and was also cut as a feature film.",
    faq: [
      { domanda: "Which real restaurants appear in The Trip to Italy?", risposta: "Among those named by sources: Trattoria della Posta in Monforte d'Alba, Piedmont, La Cantina in San Fruttuoso, Liguria, Relais Blu in Massa Lubrense and Il Riccio in Anacapri, on Capri." },
      { domanda: "Is The Trip to Italy a film or a series?", risposta: "It began as a BBC TV series directed by Michael Winterbottom and was then also cut as a film." },
      { domanda: "Can you book the film's restaurants?", risposta: "Yes, they are real venues open to the public; for Il Riccio and Trattoria della Posta booking is advisable, and hours and availability should be checked." },
    ],
  },
  "la-moglie-del-prete": {
    locandinaAlt: "An abbey with a brick bell tower among wooded hills, in the Veneto",
    titolo: "The Priest's Wife (La moglie del prete)",
    sinossi: "A 1970 film by Dino Risi with Sophia Loren and Marcello Mastroianni, shot in Vicenza and its surroundings.",
    faq: [
      { domanda: "Where was La moglie del prete filmed?", risposta: "In Vicenza and its surroundings. Italy for Movies lists the restaurant Al Zocco in Grisignano di Zocco among the locations." },
      { domanda: "Who directed La moglie del prete?", risposta: "Dino Risi, in 1970, with Sophia Loren and Marcello Mastroianni." },
      { domanda: "Can you eat at the film's restaurant?", risposta: "Yes: Al Zocco, at Largo Galileo Galilei 2 in Grisignano di Zocco, is still in business." },
    ],
  },
  "io-sono-li": {
    locandinaAlt: "A Venetian canal with a covered bridge between terracotta-coloured palaces",
    titolo: "Shun Li and the Poet (Io sono Li)",
    sinossi: "A 2011 film by Andrea Segre set in Chioggia, where the protagonist Shun Li works in an osteria frequented by fishermen.",
    faq: [
      { domanda: "Where was Io sono Li filmed?", risposta: "In Chioggia, in the Venetian lagoon. Italy for Movies lists an osteria in Chioggia among the locations; secondary sources identify it as Osteria Paradiso." },
      { domanda: "Who directed Io sono Li?", risposta: "Andrea Segre, in 2011." },
      { domanda: "Can you visit the film's osteria?", risposta: "Yes: Osteria Paradiso, on Fondamenta Canal Lombardo in Chioggia, is still open and displays photos and posters of the film." },
    ],
  },
  "la-corrispondenza": {
    locandinaAlt: "A pre-Alpine lake at dawn, with mist and a headland in the distance",
    titolo: "The Correspondence (La corrispondenza)",
    sinossi: "A 2016 film by Giuseppe Tornatore with Jeremy Irons and Olga Kurylenko, shot in several places including Lake Orta.",
    faq: [
      { domanda: "Where was La corrispondenza filmed?", risposta: "In several places, including Lake Orta. Italy for Movies lists the Ristorante San Giulio on the island of San Giulio among the locations." },
      { domanda: "Who directed La corrispondenza?", risposta: "Giuseppe Tornatore, in 2016." },
      { domanda: "Can you eat at the film's restaurant?", risposta: "Yes: Ristorante San Giulio, on Via Basilica in Orta San Giulio, is reachable by boat from Piazza Motta." },
    ],
  },
  "tucci-in-italy": {
    locandinaAlt: "A square with a Renaissance palace in a town in the Marche",
    titolo: "Tucci in Italy",
    sinossi: "A National Geographic series in which Stanley Tucci explores Italy's regions through their food, landscape and history. Season one aired in 2025; season two, in 2026, includes an episode on Le Marche.",
    faq: [
      { domanda: "Where did Stanley Tucci eat in Le Marche?", risposta: "In the Marche episode, the third of season two, he visits Uliassi, the three-Michelin-star restaurant in Senigallia." },
      { domanda: "Is Tucci in Italy the same as Searching for Italy?", risposta: "No. Searching for Italy was a CNN series (2021-2022); Tucci in Italy is a National Geographic series that premiered in 2025, with season two in 2026." },
      { domanda: "Where can you watch Tucci in Italy?", risposta: "On National Geographic; season two episodes were also released for streaming on Disney+ and Hulu." },
    ],
  },
  "the-gentlemen-2": {
    locandinaAlt: "An aerial view of a lake among mountains, with the terracotta roofs of a village in the foreground",
    titolo: "The Gentlemen (season 2)",
    titoloSeo: "The Gentlemen 2: Italian Filming Locations",
    sinossi: "The second season of the Netflix series created by Guy Ritchie takes Eddie Horniman to Lake Maggiore. The Italian shoot ran between June and July 2025 in Verbania, Pallanza, Intra and Stresa, with the wedding at the heart of episode six.",
    faq: [
      { domanda: "Where was The Gentlemen season 2 filmed in Italy?", risposta: "On Lake Maggiore, not Lake Como: Film Commission Torino Piemonte lists Villa Rusconi-Clerici, Piazza Garibaldi, the church of San Leonardo and the Grand Hotel Majestic among the main sets, all in Verbania-Pallanza, plus Intra and Stresa." },
      { domanda: "When were the Italian scenes shot?", risposta: "Between June and July 2025, with the Italian work concentrated into about two weeks. The season was released on Netflix on 3 September 2026." },
      { domanda: "Can you stay or eat at the hotel from the series?", risposta: "Yes: the Grand Hotel Majestic in Pallanza is open to the public and has its own restaurant, La Beola, with the summer terrace Il Portico." },
      { domanda: "Was the wedding really filmed in a church?", risposta: "Sources list the parish church of San Leonardo, in Pallanza, among the sets of the wedding sequence at the heart of episode six." },
    ],
  },
  "una-finestra-vista-lago": {
    locandinaAlt: "A pre-Alpine lake at dawn, with mist and mountains in the background",
    titolo: "A Window on the Lake (Una finestra vista lago)",
    titoloSeo: "Una finestra vista lago: Film & Real Locations",
    sinossi: "A Rai Fiction series based on Andrea Vitali's novels, on Rai 1 from 29 September 2026. It is set in the fictional Bellamo, but was filmed mostly on Lake Orta, between Orta San Giulio and Miasino.",
    faq: [
      { domanda: "Where was Una finestra vista lago filmed?", risposta: "Mostly on Lake Orta, between Orta San Giulio and Miasino, in the province of Novara. Lake Como also appears, with the Cernobbio jetty." },
      { domanda: "Does Bellamo really exist?", risposta: "No: the village in the series is fictional and was pieced together from views of several villages on the Italian lakes." },
      { domanda: "Which places can you recognise in Orta San Giulio?", risposta: "The area around Piazza Motta, the Broletto and the climb to the church of Santa Maria Assunta, with the island of San Giulio behind." },
      { domanda: "What is the series based on?", risposta: "On Andrea Vitali's novels, directed by Marco Pontecorvo for Rai Fiction and Alexandra Cinematografica." },
    ],
  },
  "the-white-lotus": {
    locandinaAlt: "A lane in Taormina with colourful houses and the mountain rising behind",
    titolo: "The White Lotus (season 2)",
    titoloSeo: "The White Lotus 2: Sicily Filming Locations",
    sinossi: "HBO anthology series created by Mike White. Season two (2022) is set in Sicily: seven episodes based at the San Domenico Palace hotel in Taormina, plus locations in Giardini Naxos, Noto and Palermo.",
    faq: [
      { domanda: "Where was season two of The White Lotus filmed?", risposta: "Mostly in Taormina, at the San Domenico Palace hotel. Italy for Movies also lists Giardini Naxos (the restaurant La Cambusa), Noto and Palermo." },
      { domanda: "Does the series' hotel exist?", risposta: "Yes: it is the San Domenico Palace, a Four Seasons set in a former Dominican convent and turned into a hotel in 1896." },
      { domanda: "Can you eat at one of the series' locations?", risposta: "Yes: La Cambusa, in Giardini Naxos, is the restaurant that in the series belongs to the resort. In Taormina there is also Principe Cerami, inside the hotel, with a Michelin star." },
    ],
  },
  "la-vita-e-bella": {
    locandinaAlt: "A brick street in a medieval Tuscan village",
    titolo: "Life Is Beautiful",
    titoloSeo: "Life Is Beautiful: Film, Set and Locations",
    sinossi: "Roberto Benigni's film about Guido, who turns a concentration camp into a game to protect his son. Shot mostly in Arezzo and around; the camp was rebuilt at Papigno, in Umbria.",
    faq: [
      { domanda: "Where was Life Is Beautiful filmed?", risposta: "Mostly in Arezzo (Piazza Grande, Via Borgunto, Logge Vasari), with Villa Masini in Montevarchi, Castiglion Fiorentino and the Teatro Signorelli in Cortona; the camp at Papigno, near Terni." },
      { domanda: "Was Life Is Beautiful filmed in Matera?", risposta: "No: none of the sources consulted lists Matera among the locations." },
    ],
  },
  "l-oro-di-napoli": {
    locandinaAlt: "Piazza del Plebiscito in Naples, with the basilica of San Francesco di Paola",
    titolo: "The Gold of Naples (L'oro di Napoli)",
    titoloSeo: "The Gold of Naples: the pizzeria of the film",
    sinossi: "Vittorio De Sica's anthology film from Giuseppe Marotta's stories, set in post-war Naples. In the pizza-maker episode Sophia Loren fries pizzas in a neighbourhood shop.",
    faq: [
      { domanda: "Where was the fried-pizza scene of The Gold of Naples filmed?", risposta: "By tradition at the Starita pizzeria in Materdei, which claims the link; some Neapolitans say the film's shop was elsewhere, so the connection remains disputed." },
      { domanda: "Who stars in The Gold of Naples?", risposta: "The cast includes Sophia Loren, as the pizza maker, in a film directed by Vittorio De Sica (1954)." },
    ],
  },
};

interface RestEn {
  descrizione?: string;
  titoloSeo?: string;
  /** Descrizione della scena, per slug di film. */
  scena?: Record<string, string>;
}

export const restaurantsEn: Record<string, RestEn> = {
  "pizzeria-da-michele-napoli": {
    titoloSeo: "Da Michele, Naples: the Eat Pray Love pizzeria",
    descrizione: "Founded in 1870 in the Forcella district, it is one of the most historic and famous pizzerias in Naples. An essential menu — marinara and margherita — baked in a wood-fired oven according to tradition. A simple, authentic setting, often with a queue outside.",
    scena: { "mangia-prega-ama": "It is the pizzeria where Liz (Julia Roberts) savours the famous Neapolitan margherita pizza, in one of the film's most iconic food scenes." },
  },
  "bar-vitelli-savoca": {
    titoloSeo: "Bar Vitelli, Savoca: The Godfather Location",
    descrizione: "Historic village bar overlooking the square of Savoca, famous for its granita and as one of the most visited Sicilian film locations.",
    scena: { "il-padrino": "In the village of Savoca, Michael Corleone asks the bar owner for the hand of his daughter Apollonia." },
  },
  "caffe-florian": {
    descrizione: "Opened in 1720 under the Procuratie Nuove, it is considered Italy's oldest café still in business. Frescoed rooms, live music and a view of St Mark's Basilica.",
    scena: { "il-talento-di-mr-ripley": "At the tables of the Florian, Tom Ripley meets Marge and Dickie's father: one of the film's best-known Venetian scenes." },
  },
  "trattoria-santa-lucia": {
    descrizione: "A trattoria a stone's throw from Piazza Navona, in Largo Febo. Traditional Roman cuisine: from Jewish-style artichokes to amatriciana and homemade pasta.",
    scena: { "mangia-prega-ama": "This is where Liz (Julia Roberts) orders and enjoys Roman dishes, in one of the film's most famous food scenes." },
  },
  "da-pancrazio": {
    descrizione: "A historic restaurant built above the remains of the ancient Theatre of Pompey: the lower rooms, among arches and Roman columns, are a real experience.",
    scena: { "mangia-prega-ama": "Among the Roman trattorias that form the backdrop of the film's Italian part, with the lead discovering local cuisine." },
  },
  "la-veranda-hotel-columbus": {
    descrizione: "Former restaurant of Hotel Columbus, in Palazzo della Rovere in Borgo Santo Spirito, where Sorrentino shot Jep and Ramona's dinner. It no longer appears to be operating.",
    scena: { "la-grande-bellezza": "Jep Gambardella dines with Ramona here: one of the Roman scenes of the Oscar-winning film." },
  },
  "ristorante-le-gatte": {
    titoloSeo: "Le Gatte, Castellabate: Benvenuti al Sud set",
    descrizione: "A seafood restaurant on the port of Castellabate: this is where the dinner among colleagues in Benvenuti al Sud (2010) is set, one of the highest-grossing Italian comedies ever.",
    scena: { "benvenuti-al-sud": "The restaurant is where the dinner among post-office colleagues is set, one of the film's funniest moments." },
  },
  "bar-la-piazzetta-castellabate": {
    descrizione: "A bar on the main square of Castellabate, a meeting point of the Cilento village made famous by 'Welcome to the South'. Perfect for a coffee with a sea view.",
    scena: { "benvenuti-al-sud": "The village's little square — the heart of town life in the film — where the bar overlooks the main square of Castellabate." },
  },
  "caffe-del-duomo-crema": {
    titoloSeo: "Duomocafè, Crema: Call Me by Your Name square",
    descrizione: "A café overlooking Crema's scenic Piazza del Duomo, an ideal stop along the tour of Guadagnino's film locations.",
    scena: { "chiamami-col-tuo-nome": "It does not appear among the filming locations: it is a café on Piazza Duomo, the Crema square where a scene of the film was shot, suggested as a stop along the itinerary." },
  },
  "cafe-de-paris-roma": {
    descrizione: "A historic café on Via Vittorio Veneto, founded, by the most commonly cited date, in 1948, the real heart of the Roman 'dolce vita' that inspired Fellini's film. A symbol of glamorous 1960s Rome, it is now closed after judicial investigations and a seizure.",
    scena: { "la-dolce-vita": "The real worldly hangout on Via Veneto that inspired Fellini: here, in real late-1950s Rome, paparazzi photographed stars and the jet set — the very scene the director later recreated on a soundstage at Cinecittà for the film." },
  },
  "enzo-a-mare-punta-secca": {
    titoloSeo: "Enzo a Mare, Punta Secca: Montalbano's beach",
    descrizione: "A seafood restaurant on the seafront of Punta Secca, the village with the famous house of Inspector Montalbano. Sea cuisine of the Ragusa tradition.",
    scena: { "il-commissario-montalbano": "A few steps from Montalbano's house in Punta Secca, on the seafront where the inspector loves to enjoy the fresh fish of the Ragusa coast." },
  },
  "bar-paradiso-palazzo-adriano": {
    descrizione: "A restaurant and pizzeria in Palazzo Adriano, the village-set of Tornatore's Oscar winner, a short walk from the scenic Piazza Umberto I. Ideal for a break between history and cinema.",
    scena: { "nuovo-cinema-paradiso": "It does not appear among the filming locations: it is a hotel-restaurant in Palazzo Adriano, the village where the film was shot, suggested as a place to eat nearby." },
  },
  "trattoria-dell-isola-salina": {
    descrizione: "A historic trattoria in the centre of Santa Marina Salina, the island of Il Postino: pane cunzato, capers, malvasia wine and fresh fish with a view over the Aeolian sea.",
    scena: { "il-postino": "It does not appear among the filming locations: it is a trattoria in Santa Marina Salina, on the island where the film was shot, suggested as a place to taste local flavours." },
  },
  "caffe-di-piazza-navona": {
    descrizione: "A café overlooking the scenic Piazza Navona, among Bernini's fountains. One of Rome's finest open-air salons, dear to cinema.",
    scena: { "to-rome-with-love": "It does not appear among the filming locations: it is a café on Piazza Navona in Rome, suggested as a stop during a film-tourism itinerary in the capital." },
  },
  "ristorante-brera-milano": {
    descrizione: "A historic restaurant founded in 1970 (under a different name) in the heart of Brera, Milan's bohemian-chic district. Signature Italian cuisine in an elegant setting, between art and fashion.",
    scena: { "house-of-gucci": "It does not appear among the filming locations: it is a historic restaurant in Milan's Brera district, suggested only as a place to eat in the city." },
  },
  "hosteria-giusti-modena": {
    descrizione: "A four-table osteria in the heart of Modena, carved out in 1989 from the former slaughterhouse behind the historic Giusti delicatessen, running since 1598: one of Europe's oldest food shops.",
    scena: { "master-of-none": "Among the real locations of Master of None season 2, set in Modena while Dev learns the art of fresh pasta." },
  },
  "dopolavoro-la-foce": {
    descrizione: "A restaurant on the historic Villa La Foce estate, in the Val d'Orcia: built in 1939 as a recreational club for the estate's workers, it now serves Tuscan cuisine grown in the villa's own gardens, minutes from Pienza and Montepulciano.",
    scena: { "succession": "It does not appear among the filming locations: it is the restaurant on the Villa La Foce estate, the villa where the Roy family stays in season 3 of Succession, filmed in the Val d'Orcia." },
  },
  "scottojonno-napoli": {
    descrizione: "A café-bistrot inside the elegant Galleria Principe di Napoli, opposite the National Archaeological Museum. Born as a 19th-century café-chantant, reopened in 2023 by entrepreneur Luca Iannuzzi with cooking by chef Marco Ambrosino.",
    scena: { "l-amica-geniale": "In the historic Galleria Principe di Napoli, where ScottoJonno, a real café-bistrot reopened in 2023 in a 19th-century former café-chantant, appears in season 4 of the show." },
  },
  "villa-giusso-vico-equense": {
    descrizione: "An agriturismo set in a 17th-century former monastery on the hills above Vico Equense, on the Sorrentine Peninsula, overlooking the Gulf of Naples. Traditional Sorrentine cuisine using produce from the estate.",
    scena: { "e-stata-la-mano-di-dio": "In the 17th-century former monastery overlooking the Gulf of Naples, where Paolo Sorrentino filmed the family lunch scene." },
  },
  "rivoire-firenze": {
    descrizione: "A historic café and chocolate house founded in 1872 by Enrico Rivoire, chocolatier to the House of Savoy. Under the arcades of Piazza della Signoria, with tables facing Palazzo Vecchio and the Fountain of Neptune. Famous for its thick hot chocolate and its pastries.",
    scena: { hannibal: "The historic café facing Palazzo Vecchio is among the Florence landmarks recognisable in Ridley Scott's film, shot in the city in 2000." },
  },
  "caffe-tucci-sulmona": {
    descrizione: "A family-run historic bar under the arcades of Piazza Garibaldi, Sulmona's great market square, dominated by the medieval aqueduct. Coffee bar with outdoor tables facing the square.",
    scena: { "the-american": "The bar on Piazza Garibaldi involved in the four days of filming in Sulmona for the George Clooney film: the owner took down his outdoor gazebo for the production." },
  },
  "del-cambio-torino": {
    descrizione: "A historic restaurant on Piazza Carignano, open since 1757 opposite the Teatro Carignano. Nineteenth-century rooms with mirrors, stucco and red velvet, today holding a Michelin star. Contemporary Piedmontese cuisine.",
    scena: { "stanley-tucci-searching-for-italy": "Among the restaurants listed by CNN for the Piedmont episode of Searching for Italy's second season.",
      "corro-da-te": "Gianni and Chiara's dinner after her performance at the Teatro Regio: the couple sit in the restaurant's historic dining room, she amused by his clumsiness.",
      "blocco-181-gangs-of-milano": "One of over a hundred Turin locations used for filming season 2, shot almost entirely in Turin despite the story being set in Milan.",
    },
  },
  "caffe-san-marco-trieste": {
    descrizione: "A literary café founded in 1914, at the heart of the Trieste of Svevo and Saba. Liberty-style interiors with wooden masks and marble tables, today also a bookshop and restaurant. One of Italy's most celebrated historic cafés.",
    scena: {
      "il-re": "Some scenes of the Sky series starring Luca Zingaretti are shot in the café's interiors, among the Trieste locations used by the production alongside Piazza Oberdan, Ponterosso and the Porto Vecchio.",
      "diabolik-ginko-allattacco": "A scene at the café's counter, shot while Trieste recreated the fictional city of Clerville alongside Bologna and Milan; nearby, in Piazza della Borsa, the chase between the police and Diabolik's Jaguar.",
      "la-porta-rossa": "The venue where the characters of judge Anna Mayer and magistrate Antonio Piras meet, in the Rai noir series set in Trieste.",
    },
  },
  "ristorante-paradiso-terrestre-roma": {
    descrizione: "A traditional Roman restaurant specialising in wedding receptions, in the Capannelle area south of the city. Classic Roman cuisine in large rooms built for big events.",
    scena: { "viaggi-di-nozze": "The wedding reception between Ivano and Jessica, after the ceremony at the Church of San Giuseppe Cottolengo, is filmed at this restaurant in the Capannelle area." },
  },
  "caffe-nazionale-aosta": {
    descrizione: "A 19th-century historic café under the arcades of the town hall, on Piazza Chanoux. Closed for years, it reopened in August 2022 with chef Paolo Griffa: today it combines a Michelin-starred restaurant, patisserie, salon de thé and cocktail bar, with the historic decagonal room known as \"la Chapelle\".",
    scena: { "rocco-schiavone": "The historic café on Piazza Chanoux used as a location in season 4 of the series: it was closed at the time and was reopened specifically for filming, under an agreement with the City of Aosta." },
  },
  "ristorante-savo-atrani": {
    descrizione: "A family restaurant on the little square of Atrani, Italy's smallest municipality. Amalfi Coast seafood cooking, run by the Savo family, now in its third generation.",
    scena: { "the-equalizer-3": "Dressed by the production as the film's \"Aminah's Cafe\": the venue where Denzel Washington's character orders his tea and builds his daily routine in the village." },
  },
  "caffe-parigi-milano": {
    descrizione: "The café-bistrot of the Palazzo Parigi Hotel & Grand Spa, a five-star hotel in the heart of Milan between Brera and the Fashion Quadrilateral. Elegant service, breakfasts and aperitivo in a refined setting.",
    scena: { "the-devil-wears-prada-2": "The hotel hosted the film's cast and crew and reports scenes shot in the lobby, at Caffè Parigi and in its exterior spaces." },
  },
  "buca-dellorafo-firenze": {
    descrizione: "A historic Florentine trattoria on Via dei Girolami, a stone's throw from Ponte Vecchio: one of the oldest \"buche\" in Florence, traditional Tuscan cooking in a simple, genuine setting.",
    scena: { "from-scratch": "The venue where Lino, the Sicilian chef at the centre of the show, works — set between Florence and Sicily." },
  },
  "gran-caffe-gambrinus-napoli": {
    descrizione: "A historic Neapolitan café founded in 1860, among the most celebrated in Italy, facing Piazza del Plebiscito and Piazza Trieste e Trento. A literary salon frequented by intellectuals and artists for over a century.",
    scena: { "il-commissario-ricciardi": "Transformed into the 1930s café frequented by the commissioner: scenes are set at his favourite table, overlooking Piazza del Plebiscito, in the room now named after Michele Sergio." },
  },
  "caffe-ducale-gubbio": {
    descrizione: "A historic café on Piazza Grande, Gubbio's main square overlooking the Umbrian valley. For many years the fixed set of the Rai series Don Matteo, it still keeps props from the show today.",
    scena: { "don-matteo": "The café where Sergeant Cecchini and Don Matteo play their daily chess games, for many seasons of the series. The venue still keeps props from the show." },
  },
  "lo-scoglio-nerano": {
    descrizione: "A family restaurant on the beach at Marina del Cantone, in Nerano, between Sorrento and the Amalfi Coast. Famous for spaghetti alla Nerano and seafood, with many guests arriving straight by boat.",
    scena: { "stanley-tucci-searching-for-italy": "Stanley Tucci tastes spaghetti alla Nerano — fried zucchini, provolone del Monaco and basil — which he calls his favourite dish, with a view over the coast." },
  },
  "la-notizia-napoli": {
    descrizione: "A historic pizzeria opened by Enzo Coccia in 1994 on Via Caravaggio, far from the tourist circuits. Coccia was the first pizza maker listed by the Michelin Guide; the menu even features a pizza named after Stanley Tucci.",
    scena: { "stanley-tucci-searching-for-italy": "Master pizzaiolo Enzo Coccia makes Stanley Tucci a classic Neapolitan pizza, then takes him to meet the producers of San Marzano tomatoes and buffalo mozzarella." },
  },
  "la-reginella-roma": {
    descrizione: "A Roman-Jewish restaurant on Via del Portico d'Ottavia, in the heart of Rome's Jewish Ghetto. Famous for carciofi alla giudia, whole artichokes fried in olive oil.",
    scena: { "stanley-tucci-searching-for-italy": "In the middle of artichoke season, Stanley Tucci tastes carciofi alla giudia, fried until crisp, the signature dish of Roman-Jewish cuisine." },
  },
  "casa-artusi-forlimpopoli": {
    descrizione: "A centre of food culture dedicated to Pellegrino Artusi, author of Italy's most famous cookbook, in his hometown. It brings together a museum, library, cooking school and a restaurant serving traditional Romagna cuisine.",
    scena: { "stanley-tucci-searching-for-italy": "In the Emilia-Romagna episode, CNN's cameras enter Casa Artusi's library and cooking school during a hand-rolled pasta workshop with the 'Mariette'." },
  },
  "al-covo-venezia": {
    descrizione: "A seafood restaurant in the Castello district, a few minutes from St Mark's Square, run by Cesare and his wife Diane. Lagoon cooking with the catch of the day.",
    scena: { "somebody-feed-phil-venezia": "Phil Rosenthal tastes boiled mantis shrimp and spider crab, and wonders whether this might be the best restaurant in Venice." },
  },
  "vini-da-arturo-venezia": {
    descrizione: "A small historic restaurant on Calle degli Assassini, in the San Marco district, open for over fifty years. Just a few tables, meat-focused cooking — rare in Venice — and cash only.",
    scena: { "somebody-feed-phil-venezia": "Phil Rosenthal tastes the house signature, the pork chop with vinegar, alongside marinated eggplant." },
  },
  "harrys-bar-roma": {
    descrizione: "A historic American Bar on Via Vittorio Veneto, open since 1918. One of the symbols of 1950s-60s Roman 'dolce vita', still in business at the same address today.",
    scena: { "la-dolce-vita": "Open since 1918 on Via Veneto, it was one of the real high-society hangouts where paparazzi photographed the jet set in the 1950s — the same phenomenon Fellini portrayed in the film." },
  },
  "roma-sparita-trastevere": {
    descrizione: "A family trattoria overlooking Piazza di Santa Cecilia, in the heart of Trastevere, run by the same family for over thirty years. Traditional Roman cuisine, famous for its tagliolini cacio e pepe served in a parmesan basket.",
    scena: { "no-reservations-rome": "Anthony Bourdain tastes his favourite cacio e pepe in Rome here, served in an edible parmesan basket: in the episode he initially kept its name secret, calling it 'Restaurant X'." },
  },
  "tonnara-di-scopello": {
    descrizione: "An old tuna fishery overlooking Scopello's famous sea stacks, today open to the public as a historic site with a café and beach area. One of Sicily's most photographed views.",
    scena: { "makari": "The set of Marilù's restaurant, overlooking the Scopello sea stacks, was built inside the old tuna fishery." },
  },
  "coco-lezzone-firenze": {
    descrizione: "A historic Florentine trattoria on Via del Parioncino, near Ponte Santa Trinita: traditional Tuscan cooking, from pappa al pomodoro and ribollita to bistecca.",
    scena: { "i-laureati": "A scene of the film is shot inside the venue, according to the film's listing on the Italy for Movies portal." },
  },
  "i-pupi-bagheria": {
    descrizione: "A one-Michelin-star restaurant by chef Tony Lo Coco in Bagheria, opened in 2009 and since 2025 in the lower buildings of Villa Palagonia, the villa of monsters.",
    scena: { "stanley-tucci-searching-for-italy": "In the Sicily episode, Stanley Tucci meets chef Tony Lo Coco and tastes spaghetti with bottarga and a fish antipasto." },
  },
  "me-cumpari-turiddu-catania": {
    descrizione: "A traditional Sicilian restaurant in Catania holding the Michelin Guide's Bib Gourmand, run by the Capizzi family.",
    scena: { "stanley-tucci-searching-for-italy": "In Catania Stanley Tucci dines with owner Roberta Capizzi: donkey carpaccio and pasta alla Norma." },
  },
  "osteria-cinghiale-bianco-firenze": {
    descrizione: "A Tuscan osteria in a 14th-century tower on Borgo San Jacopo, in the Oltrarno: ribollita, pappa al pomodoro and panzanella. Run by the Masselli family since 1984.",
    scena: { "stanley-tucci-searching-for-italy": "In the Tuscany episode, Stanley Tucci eats ribollita, pappa al pomodoro and panzanella." },
  },
  "ratana-milano": {
    descrizione: "Chef Cesare Battisti's restaurant on Via de Castillia, in the Isola district: contemporary takes on traditional Milanese and Lombard dishes.",
    scena: { "stanley-tucci-searching-for-italy": "In the Milan episode, chef Cesare Battisti prepares cotoletta alla milanese for Stanley Tucci and shows him how to make risotto alla milanese." },
  },
  "osteria-del-treno-milano": {
    descrizione: "A historic Milanese osteria on Via San Gregorio serving Italian and Lombard cooking in an informal setting. Booking is recommended.",
    scena: { "stanley-tucci-searching-for-italy": "After a visit to Lake Como, Stanley Tucci and his wife Felicity Blunt return to Milan to dine here; Tucci describes it as embodying the history and spirit of Milan." },
  },
  "trattoria-della-posta-monforte-dalba": {
    descrizione: "A historic trattoria in the Langhe, founded in 1875 as a resting point for travellers: Piedmontese cooking among the vineyards of Monforte d'Alba, listed in the Michelin Guide.",
    scena: { "the-trip-to-italy": "It is one of the Piedmont stops of Steve Coogan and Rob Brydon's food journey." },
  },
  "il-riccio-anacapri": {
    descrizione: "A Michelin-starred restaurant and beach club in Anacapri, run by the Capri Palace but open to all, with a sea-view terrace and seafood cooking.",
    scena: { "the-trip-to-italy": "It is one of the Capri stops of Steve Coogan and Rob Brydon's food journey." },
  },
  "osteria-io-e-simone-rimini": {
    descrizione: "A small family-run osteria in central Rimini, with handmade pasta, Slow Food cheeses and over 150 wine labels.",
    scena: { "stanley-tucci-searching-for-italy": "In Rimini, with Federico Fellini's niece Francesca, Stanley Tucci tastes handmade cappelletti and strozzapreti, closing the Emilia-Romagna episode." },
  },
  "osteria-francescana-modena": {
    descrizione: "Chef Massimo Bottura's three-Michelin-star restaurant on Via Stella in Modena: one of the world's most famous, with a tasting menu.",
    scena: { "master-of-none": "Dev and his friend Arnold dine at Osteria Francescana in season 2's episode The Thief.", "somebody-feed-phil-venezia": "Phil Rosenthal dines in the kitchen on a tasting menu that includes five ages of Parmigiano, in the Modena part of the episode." },
  },
  "bar-tiffany-modena": {
    descrizione: "A bar on Via Canalino in Modena, known for its Italian breakfast and gnocco fritto, the Modenese specialty fried in lard.",
    scena: { "somebody-feed-phil-venezia": "Phil Rosenthal and Caterina Schenetti taste gnocco fritto, the Modenese specialty fried in lard." },
  },
  "al-zocco-grisignano": {
    descrizione: "A historic restaurant-bar in Grisignano di Zocco, in the province of Vicenza, where a scene of La moglie del prete (1970) with Sophia Loren and Marcello Mastroianni was shot.",
    scena: { "la-moglie-del-prete": "The restaurant is where the two lovers, played by Marcello Mastroianni and Sophia Loren, have lunch." },
  },
  "all-arco-venezia": {
    descrizione: "A historic bacaro in San Polo, near the Rialto market, open since 1980 and run by the Zorzetto family: cicchetti with baccalà mantecato, anchovies and porchetta.",
    scena: { "stanley-tucci-searching-for-italy": "In the Veneto episode, Stanley Tucci stops at this family-run neighbourhood bacaro specialising in cicchetti." },
  },
  "villa-600-torcello": {
    descrizione: "A restaurant on the island of Torcello, in the Venetian lagoon, serving Venetian cooking with local produce, away from the crowds of the centre.",
    scena: { "stanley-tucci-searching-for-italy": "On the island of Torcello, Stanley Tucci tastes the classic duck ragù, to learn how Venetians cook duck." },
  },
  "venissa-mazzorbo": {
    descrizione: "A one-Michelin-star restaurant on the island of Mazzorbo, in the Venetian lagoon, tied to a winery and a small guesthouse; the tasting menus are by chefs Chiara Pavan and Francesco Brutto.",
    scena: { "stanley-tucci-searching-for-italy": "On the island of Mazzorbo, Stanley Tucci visits the restaurant tied to a winery, in the Veneto episode." },
  },
  "orient-experience-venezia": {
    descrizione: "A restaurant in Cannaregio that began as an inclusion project: Afghan and Middle Eastern cooking with refugee staff, founded by Afghan-Venetian Hamad Ahmadi.",
    scena: { "stanley-tucci-searching-for-italy": "In Cannaregio, Stanley Tucci visits the restaurant staffed by former refugees, with dishes from Afghanistan, Morocco, Iran and Pakistan/India." },
  },
  "christian-e-manuel-vercelli": {
    descrizione: "A one-Michelin-star restaurant run by two brothers at the back of Hotel Cinzia in Vercelli: a risotteria with over twenty risottos.",
    scena: { "stanley-tucci-searching-for-italy": "In Vercelli, Italy's rice capital, Stanley Tucci tastes risotto at brothers Christian and Manuel's restaurant." },
  },
  "osteria-paradiso-chioggia": {
    descrizione: "An osteria and bar on Fondamenta Canal Lombardo in Chioggia, frequented by fishermen, displaying photos and posters of the film Io sono Li.",
    scena: { "io-sono-li": "It is the osteria where protagonist Shun Li works, frequented by Chioggia's fishermen." },
  },
  "ristorante-san-giulio-orta": {
    descrizione: "A restaurant in an 18th-century villa on the island of San Giulio, on Lake Orta, reachable by boat from Piazza Motta: Piedmontese and lake cooking.",
    scena: { "la-corrispondenza": "The restaurant was temporarily dressed in Portuguese style for a scene of the film, according to Italy for Movies." },
  },
  "antichi-sapori-montegrosso": {
    descrizione: "Pietro Zito's restaurant in Montegrosso, a hamlet of Andria: Puglian cooking built on wild herbs, cheeses, grains and garden vegetables, a Bib Gourmand in the Michelin Guide Italia 2026.",
    scena: { "stanley-tucci-searching-for-italy": "In the Puglia episode, Stanley Tucci visits Pietro Zito, who turns simple ingredients into world-class dishes such as burnt-grain orecchiette with fava cream and burrata." },
  },
  "trattoria-bere-vecchie-cisternino": {
    descrizione: "A butcher shop and trattoria in the maze of alleyways of Cisternino, in the Itria Valley: the meat is bought and cooked on the spot, spit-roasted.",
    scena: { "stanley-tucci-searching-for-italy": "In the Puglia episode, Stanley Tucci stops at this butcher-shop trattoria in Cisternino's alleyways, run by young restaurateur Vito Zurlo." },
  },
  "vitantonio-lombardo-matera": {
    descrizione: "A one-Michelin-star restaurant set in a restored cave in the Sassi of Matera: tasting menus of 5, 7 or 10 courses by Lucanian chef Vitantonio Lombardo.",
    scena: { "stanley-tucci-searching-for-italy": "In the Puglia episode, Tucci reaches Matera, in Basilicata, in an abandoned cave turned into a Michelin-starred restaurant with inventively named dishes." },
  },
  "alla-via-di-mezzo-montefalco": {
    descrizione: "Giorgione's (Giorgio Barchesi) restaurant in a 14th-century oil mill, a short walk from the centre of Montefalco.",
    scena: { "stanley-tucci-searching-for-italy": "In the Umbria episode, Stanley Tucci's first Umbrian encounter is with Giorgione, the TV chef and cookbook author, at his restaurant in Montefalco." },
  },
  "mabrouk-alghero": {
    descrizione: "A seafood restaurant in Alghero's old town, on Via Santa Barbara, known for lobster alla catalana.",
    scena: { "stanley-tucci-searching-for-italy": "In the Sardinia episode, Tucci meets Antonietta Salaris in Alghero, who prepares lobster alla catalana." },
  },
  "luigi-pomata-cagliari": {
    descrizione: "A restaurant in Cagliari with three dining rooms and a terrace, on Viale Regina Margherita: Sardinian cooking following the Carloforte tradition, with house tuna as its speciality.",
    scena: { "stanley-tucci-searching-for-italy": "In the Sardinia episode, Tucci visits chef Luigi Pomata, known as the king of tuna, who prepares bluefin tuna with pesto in a pasta dish." },
  },
  "fradis-minoris-pula": {
    descrizione: "A restaurant on the Nora lagoon, in Pula, by chef Francesco Stara: no-waste seafood cooking, with a Michelin star and the Green Star for sustainability.",
    scena: { "stanley-tucci-searching-for-italy": "In the Sardinia episode, chef Francesco Stara prepares fregola with seafood for Tucci." },
  },
  "osteria-della-cipolla-rossa-tropea": {
    descrizione: "A tiny osteria near Tropea, run by Romana Schiariti and her husband Michele: a vegetarian menu that changes daily, with Tropea red onion in the starring role. Booking is mandatory.",
    scena: { "stanley-tucci-searching-for-italy": "In the Calabria episode, Stanley Tucci tastes red onion spaghetti from Tropea, an onion so sweet he bites into it raw like an apple." },
  },
  "cracco-portofino": {
    descrizione: "A one-Michelin-star restaurant on the Portofino quay, opened in 2021 in the historic premises of the former Pitosforo, with 7- or 11-course tasting menus.",
    scena: { "stanley-tucci-searching-for-italy": "In the Liguria episode, Tucci meets Carlo Cracco, whose head chef Mattia Pecis prepares pansotti preboggion with walnut sauce." },
  },
  "il-genovese-genova": {
    descrizione: "A Ligurian restaurant on Via Galata run by Roberto Panizza with his brother Sergio: the pesto is made in a mortar, and gnocchi with pesto is the signature dish.",
    scena: { "stanley-tucci-searching-for-italy": "In the Liguria episode, Tucci tastes pesto crushed by hand in an ancient mortar." },
  },
  "la-cantina-san-fruttuoso": {
    descrizione: "A seafood restaurant on the bay of San Fruttuoso di Camogli, next to the abbey, reachable on foot or by boat.",
    scena: { "the-trip-to-italy": "It is the second of the six meals of Steve Coogan and Rob Brydon's journey: a seaside restaurant in San Fruttuoso, Liguria." },
  },
  "relais-blu-massa-lubrense": {
    descrizione: "A one-Michelin-star restaurant in Massa Lubrense, on the Sorrento coast, overlooking Capri; the kitchen is now led by a Japanese chef.",
    scena: { "the-trip-to-italy": "It is the fifth meal of Steve Coogan and Rob Brydon's journey, on the Sorrento coast with a view of Capri." },
  },
  "uliassi-senigallia": {
    descrizione: "A three-Michelin-star restaurant on Senigallia's Banchina di Levante, born in 1990 as a beach kiosk: Mauro Uliassi in the kitchen, his sister Catia front of house.",
    scena: { "tucci-in-italy": "In the Marche episode, Stanley Tucci visits Mauro and Catia Uliassi's three-Michelin-star restaurant, the only one in the region with three stars." },
  },
  "la-beola-grand-hotel-majestic-verbania": {
    titoloSeo: "Grand Hotel Majestic, Verbania: The Gentlemen set",
    descrizione: "The restaurant of the Grand Hotel Majestic, a Belle Époque hotel on a headland in Pallanza, Verbania: lake fish, seafood and meat, with the summer terrace Il Portico overlooking the garden.",
    scena: { "the-gentlemen-2": "The Grand Hotel Majestic, which houses the restaurant, is among the main locations of season two: the crew's base during the Italian shoot and a hotel that appears in the series." },
  },
  "la-cambusa-giardini-naxos": {
    titoloSeo: "La Cambusa, Giardini Naxos: White Lotus set",
    descrizione: "A seafood restaurant on the Giardini Naxos seafront, on Via Schisò, overlooking the bay and Taormina: in season two of The White Lotus it is the resort's restaurant.",
    scena: { "the-white-lotus": "According to Italy for Movies, the resort restaurant La Cambusa of season two is in fact this venue on the beach at Giardini Naxos, a few kilometres from Taormina." },
  },
  "principe-cerami-taormina": {
    titoloSeo: "Principe Cerami, Taormina: linked to White Lotus",
    descrizione: "A one-Michelin-star restaurant (2026 guide) inside the San Domenico Palace in Taormina: Sicilian cooking reinterpreted by chef Massimo Mantarro. You can book without staying at the hotel.",
    scena: { "the-white-lotus": "It sits inside the San Domenico Palace, the hotel that becomes the White Lotus resort in the series. The restaurant itself isn't listed among the scenes: it is a venue tied to the set." },
  },
  "la-locanda-del-postino-procida": {
    titoloSeo: "La Locanda del Postino, Procida: from the film",
    descrizione: "An inn-restaurant on the harbour of Marina Corricella, in Procida, tied to Il Postino: fresh fish and shellfish in front of the village's colourful houses.",
    scena: { "il-postino": "According to italia.it it is the film's inn where Beatrice works. It is not confirmed that filming took place here: the interiors were rebuilt at Cinecittà (Italy for Movies), so we list it as a venue tied to the film." },
  },
  "pizzeria-starita-napoli": {
    titoloSeo: "Starita, Naples: the pizza of The Gold of Naples",
    descrizione: "A historic pizzeria born in 1901 as a cellar in the Materdei district, now family-run: known for fried pizza and for its claimed link to The Gold of Naples (1954).",
    scena: { "l-oro-di-napoli": "By tradition it is the pizzeria of the fried-pizza scene with Sophia Loren; the link is disputed by some Neapolitans, so we treat it as a venue tied to the film." },
  },
};

/* -------- Helper: restituiscono la versione nella lingua richiesta -------- */
export function tFilmTitolo(film: Film, lang: Lang): string {
  return lang === "en" ? filmsEn[film.id]?.titolo ?? film.data.titolo : film.data.titolo;
}
export function tFilmTitoloSeo(film: Film, lang: Lang): string | undefined {
  return lang === "en" ? filmsEn[film.id]?.titoloSeo : film.data.titoloSeo;
}
export function tLocaleTitoloSeo(locale: Restaurant, lang: Lang): string | undefined {
  return lang === "en" ? restaurantsEn[locale.id]?.titoloSeo : locale.data.titoloSeo;
}
export function tFilmAlt(film: Film, lang: Lang): string {
  return lang === "en" ? filmsEn[film.id]?.locandinaAlt ?? film.data.locandinaAlt : film.data.locandinaAlt;
}
export function tFilmSinossi(film: Film, lang: Lang): string {
  return lang === "en" ? filmsEn[film.id]?.sinossi ?? film.data.sinossi : film.data.sinossi;
}
export function tFilmFaq(film: Film, lang: Lang) {
  return lang === "en" ? filmsEn[film.id]?.faq ?? film.data.faq : film.data.faq;
}
export function tLocaleDesc(locale: Restaurant, lang: Lang): string {
  return lang === "en"
    ? restaurantsEn[locale.id]?.descrizione ?? locale.data.descrizione
    : locale.data.descrizione;
}
export function tScena(localeId: string, filmId: string, itText: string, lang: Lang): string {
  return lang === "en" ? restaurantsEn[localeId]?.scena?.[filmId] ?? itText : itText;
}
