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
    titolo: "The Godfather",
    sinossi:
      "Coppola's masterpiece about the Corleone family. The 'Sicilian' scenes were shot in the villages of Savoca and Forza d'Agrò, near Messina.",
    faq: [
      { domanda: "Where was the Sicilian part of The Godfather filmed?", risposta: "In the villages of Savoca and Forza d'Agrò, near Messina: the town of Corleone looked too modern, so Coppola chose these untouched hamlets." },
      { domanda: "Where can you eat like in The Godfather in Savoca?", risposta: "At Bar Vitelli, in Piazza Fossia, the bar where Michael Corleone asks the owner for Apollonia's hand: it's still open and almost unchanged since 1972." },
    ],
  },
  "il-talento-di-mr-ripley": {
    titolo: "The Talented Mr. Ripley",
    sinossi:
      "A psychological thriller with Matt Damon and Jude Law, set in 1950s Italy between the coast, Rome and Venice.",
    faq: [
      { domanda: "Where was The Talented Mr. Ripley filmed in Venice?", risposta: "Its Venetian locations include the famous Caffè Florian in St Mark's Square, where Tom meets Marge and Dickie's father." },
      { domanda: "Does Caffè Florian still exist?", risposta: "Yes: opened in 1720, it is considered Italy's oldest café still in business, under the Procuratie Nuove in St Mark's Square." },
    ],
  },
  "mangia-prega-ama": {
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
    titolo: "Welcome to the South",
    sinossi:
      "A blockbuster comedy with Claudio Bisio and Alessandro Siani, largely shot in Castellabate, in the Cilento area.",
    faq: [
      { domanda: "Where was Welcome to the South filmed?", risposta: "Mainly in Castellabate, a village in the Cilento (province of Salerno), among the little square, the port of San Marco and the old alleys." },
      { domanda: "Where to eat like in the film in Castellabate?", risposta: "At the Le Gatte restaurant, on the port, where the colleagues' dinner is set, and in the bars of the little square overlooking the sea." },
    ],
  },
  "la-grande-bellezza": {
    titolo: "The Great Beauty",
    sinossi:
      "Winner of the Oscar for Best Foreign Film. A baroque, melancholic portrait of Rome, among terraces, palaces and atmospheric restaurants.",
    faq: [
      { domanda: "Where was The Great Beauty filmed in Rome?", risposta: "In many of the city's landmarks. Among the restaurants, Jep's dinner with Ramona is set at La Veranda of Hotel Columbus, in Borgo Santo Spirito, near the Vatican." },
      { domanda: "Where can you eat like in The Great Beauty?", risposta: "At La Veranda of Hotel Columbus, beneath Renaissance frescoes, to relive the elegance of the film's Roman scenes." },
    ],
  },
  "un-americano-a-roma": {
    titolo: "An American in Rome",
    sinossi:
      "A cult comedy with Alberto Sordi as Nando Mericoni, the Roman obsessed with America. His is the legendary 'macaroni' scene.",
    faq: [
      { domanda: "What is the most famous scene of An American in Rome?", risposta: "The 'macaroni' scene: after scorning American food, Nando gives in to Roman pasta with the line 'Macaroni, you provoked me and now I'll destroy you'." },
      { domanda: "Where can you eat the Roman cuisine of the film?", risposta: "In Rome's historic trattorias serving traditional dishes, like those loved by Nando Mericoni." },
    ],
  },
  "chiamami-col-tuo-nome": {
    titolo: "Call Me by Your Name",
    sinossi:
      "An Oscar-winning summer love story (Best Adapted Screenplay), filmed in the Lombard lowlands, with Crema and its surroundings at its scenic heart.",
    faq: [
      { domanda: "Where was Call Me by Your Name filmed?", risposta: "Around Crema, in Lombardy: the villa in Moscazzano, the squares and alleys of Crema's old town, and the surrounding countryside." },
      { domanda: "What to see and where to stop in Crema following the film?", risposta: "Piazza del Duomo and the cafés of the historic centre, perfect for a break while touring the film's locations." },
    ],
  },
  "la-dolce-vita": {
    titolo: "La Dolce Vita",
    sinossi:
      "Fellini's masterpiece with Marcello Mastroianni: the worldly, night-time Rome of Via Veneto, its cafés and the Trevi Fountain, between glamour and melancholy.",
    faq: [
      { domanda: "Where is La Dolce Vita set in Rome?", risposta: "Mostly on Via Veneto, with its elegant cafés and hotels, and at the Trevi Fountain (Anita Ekberg's famous bathe)." },
      { domanda: "Where to soak up the film's atmosphere today?", risposta: "At the historic cafés of Via Veneto, the heart of Rome's 'dolce vita' in the 1960s." },
    ],
  },
  "il-commissario-montalbano": {
    titolo: "Inspector Montalbano",
    sinossi:
      "The cult TV series based on Camilleri's novels, filmed in south-eastern Sicily (Ragusa, Scicli, Punta Secca). The inspector is also famous for his love of Sicilian food.",
    faq: [
      { domanda: "Where was the Montalbano series filmed?", risposta: "In the Ragusa area: Montalbano's house is in Punta Secca (Santa Croce Camerina), while the police station is in Scicli. Ragusa Ibla and the local baroque form the backdrop." },
      { domanda: "Where can you eat like Montalbano?", risposta: "In the seaside trattorias of the Ragusa coast, serving the Sicilian dishes the inspector loves: pasta 'ncasciata, arancini and fresh fish." },
    ],
  },
  "nuovo-cinema-paradiso": {
    titolo: "Cinema Paradiso",
    sinossi:
      "Winner of the Oscar for Best Foreign Film. A Sicilian boy's love story with cinema, with the famous square of Palazzo Adriano at the heart of the tale.",
    faq: [
      { domanda: "Where was Cinema Paradiso filmed?", risposta: "Mainly in Palazzo Adriano, in the province of Palermo, whose square with the octagonal fountain became the set of the town of Giancaldo." },
      { domanda: "What to see in Palazzo Adriano following the film?", risposta: "The beautiful Piazza Umberto I and the bars overlooking the square, where you can stop while visiting the village." },
    ],
  },
  "il-postino": {
    titolo: "Il Postino (The Postman)",
    sinossi:
      "Massimo Troisi's last, poetic film: the friendship between a humble postman and the poet Pablo Neruda, shot on the islands of Salina and Procida.",
    faq: [
      { domanda: "Where was Il Postino filmed?", risposta: "Across the Aeolian island of Salina (especially Pollara) and Procida, in the Gulf of Naples, with their almost untouched seascapes." },
      { domanda: "What to eat in Salina?", risposta: "Aeolian flavours: pane cunzato, Salina capers, malvasia wine and fish dishes in the trattorias overlooking the sea." },
    ],
  },
  "to-rome-with-love": {
    titolo: "To Rome with Love",
    sinossi:
      "Woody Allen's ensemble comedy set in Rome, among squares, alleys and restaurants of the Eternal City, in an ironic tribute to the capital.",
    faq: [
      { domanda: "Where was To Rome with Love filmed?", risposta: "In several Roman landmarks: Piazza Navona, the Capitoline Hill, Via Margutta and the streets of the historic centre." },
      { domanda: "Where to eat like in the film in Rome?", risposta: "In the cafés and trattorias of the historic centre, between Piazza Navona and the Pantheon, the heart of the film's Roman strolls." },
    ],
  },
  "house-of-gucci": {
    titolo: "House of Gucci",
    sinossi:
      "Ridley Scott's drama about the Gucci dynasty with Lady Gaga and Adam Driver, filmed between Milan, Lake Como and Rome, amid elegance and ambition.",
    faq: [
      { domanda: "Where was House of Gucci filmed in Italy?", risposta: "Between Milan (with its fashion and palaces), Lake Como and Rome, plus some Alpine locations." },
      { domanda: "Where to feel the film's atmosphere in Milan?", risposta: "In the elegant restaurants of the Brera district and the centre, the chic heart of the Milan portrayed in the film." },
    ],
  },
  "master-of-none": {
    sinossi:
      "The Netflix series created by Aziz Ansari and Alan Yang. Season 2 (2017) opens in Modena, where Dev learns the art of pasta and dines at Osteria Francescana, Massimo Bottura's three-Michelin-star restaurant.",
    faq: [
      { domanda: "Was Master of None really filmed in Modena?", risposta: "Yes: the start of season 2 (2017) was filmed entirely in Modena, where Dev moves to learn how to make fresh pasta." },
      { domanda: "What is the real restaurant that appears in the show?", risposta: "Osteria Francescana, chef Massimo Bottura's three-Michelin-star restaurant, voted the world's best restaurant in both 2016 and 2018." },
      { domanda: "Did Aziz Ansari really learn to make pasta for the role?", risposta: "Yes: the actor and co-creator actually moved to Modena for weeks, studying Italian and the art of hand-rolled pasta before filming." },
    ],
  },
  "succession": {
    sinossi:
      "The Emmy-winning HBO series about the Roy family. The wedding in the season 3 finale is filmed in Tuscany, between Villa La Foce and Villa Cetinale, in the Val d'Orcia.",
    faq: [
      { domanda: "Where was Succession filmed in Tuscany?", risposta: "In the Val d'Orcia: the Roy family stays at Villa La Foce, while the season 3 finale wedding is filmed at Villa Cetinale, near Siena." },
      { domanda: "Can you eat at one of Succession's real locations?", risposta: "Yes: Dopolavoro La Foce, the restaurant on the Villa La Foce estate, is open to the public near Pienza." },
    ],
  },
  "l-amica-geniale": {
    titolo: "My Brilliant Friend",
    sinossi:
      "The HBO/Rai series based on Elena Ferrante's novels, set in 1950s Naples. The neighbourhood is a built set, but many scenes are filmed in real locations across the city, including the historic Galleria Principe di Napoli.",
    faq: [
      { domanda: "Is My Brilliant Friend really filmed in Naples?", risposta: "Partly: the Rione Luzzatti where Lila and Elena live is actually a set built in Marcianise, near Caserta. Many other scenes, though, are shot in real Naples locations: the Galleria Principe di Napoli, the Caracciolo seafront, Piazza dei Martiri, the Teatro San Carlo." },
      { domanda: "What real venue appears in the show?", risposta: "Season 4 features ScottoJonno, a real café-bistrot inside the Galleria Principe di Napoli, reopened in 2023 in a 19th-century former café-chantant." },
    ],
  },
  "e-stata-la-mano-di-dio": {
    titolo: "The Hand of God",
    sinossi:
      "Paolo Sorrentino's Netflix film, Silver Lion winner in Venice and Oscar nominee, tells the story of his native Naples. Filmed in real city locations, including the Vomero district and Villa Giusso, on the Sorrentine Peninsula.",
    faq: [
      { domanda: "Was The Hand of God really filmed in Naples?", risposta: "Yes: among the real locations, the Schisa family home is filmed on Via San Domenico, in the Vomero district, one floor from Sorrentino's real childhood home. Piazza del Plebiscito and the Galleria Umberto I also appear." },
      { domanda: "Where was the family lunch scene filmed?", risposta: "At Villa Giusso, an agriturismo set in a 17th-century former monastery in Vico Equense, on the Sorrentine Peninsula, overlooking the Gulf of Naples." },
    ],
  },
  hannibal: {
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
    titolo: "The Devil Wears Prada 2",
    sinossi:
      "Twenty years after the first film, Andy Sachs (Anne Hathaway), now a media executive, has to work with her former boss Miranda Priestly (Meryl Streep), whose publishing empire is in crisis. Partly filmed in Milan in summer 2025, released in cinemas on 1 May 2026.",
    faq: [
      { domanda: "Was The Devil Wears Prada 2 really filmed in Milan?", risposta: "Yes. The cast and crew stayed for several weeks at the Palazzo Parigi Hotel & Grand Spa, where scenes were shot in the lobby, at Caffè Parigi, and in the hotel's exterior spaces, during Milan Fashion Week." },
      { domanda: "Did the film have a real tourism impact on Milan?", risposta: "Yes: according to Confcommercio Milano data (Cities Analytics), reported by Variety and Il Sole 24 Ore in August 2026, the film's locations saw an 18% rise in international visitors in summer 2026, peaking at +28% around Palazzo Clerici." },
      { domanda: "Who stars in The Devil Wears Prada 2?", risposta: "Meryl Streep (Miranda Priestly), Anne Hathaway (Andy Sachs) and Emily Blunt (Emily Charlton), twenty years after the first film, directed by David Frankel." },
    ],
  },
  "from-scratch": {
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
    titolo: "Honeymoons",
    sinossi:
      "A three-story comedy about disastrous honeymoons. In the first, Ivano (Carlo Verdone) and Jessica (Claudia Gerini) celebrate an 'off-key' wedding between Rome and Sardinia, before the trip turns into a string of mishaps.",
    faq: [
      { domanda: "Where do Ivano and Jessica get married in Honeymoons?", risposta: "At the Church of San Giuseppe Cottolengo, on Viale Valle Aurelia in Rome, with the reception filmed at Ristorante Paradiso Terrestre, on Via delle Capannelle." },
      { domanda: "Who directed Honeymoons?", risposta: "Carlo Verdone, who also stars as one of the leads (Ivano) alongside Claudia Gerini (Jessica), in a three-story film about honeymoons gone wrong." },
    ],
  },
  "diabolik-ginko-allattacco": {
    titolo: "Diabolik - Ginko Attacks!",
    sinossi:
      "The second chapter of the Italian trilogy about Diabolik, based on the famous comic by the Giussani sisters. Inspector Ginko hunts the masked thief through the fictional city of Clerville, recreated across Bologna, Trieste and Milan.",
    faq: [
      { domanda: "Where was Diabolik - Ginko Attacks! filmed?", risposta: "The fictional city of Clerville was recreated across Bologna, Trieste and Milan. In Trieste, filming included a car chase in Piazza della Borsa and a scene at the Antico Caffè San Marco." },
      { domanda: "Which historic café appears in the film?", risposta: "The Antico Caffè San Marco in Trieste, open since 1914: a scene was shot at the venue's counter, while the nearby Piazza della Borsa hosts the chase between police cars and Diabolik's Jaguar E-Type." },
      { domanda: "Who directed Diabolik - Ginko Attacks!?", risposta: "The Manetti Bros., for the second chapter of the Italian trilogy based on the Giussani sisters' comic, starring Luca Marinelli as Diabolik and Valerio Mastandrea as Inspector Ginko." },
    ],
  },
  "il-commissario-ricciardi": {
    titolo: "Commissioner Ricciardi",
    sinossi:
      "A Rai 1 series based on Maurizio De Giovanni's novels. Naples, the 1930s: Commissioner Luigi Alfredo Ricciardi (Lino Guanciale) has a supernatural gift — he perceives the last thoughts of murder victims — which he uses to solve cases amid fascism and Neapolitan high society.",
    faq: [
      { domanda: "Was Commissioner Ricciardi really filmed in Naples?", risposta: "Yes. Among the official locations, documented by the Campania Region Film Commission, are the Teatro San Carlo, the Teatro Sannazaro, Capodimonte, Villa Pignatelli, the Royal Palace of Portici and the Gran Caffè Gambrinus." },
      { domanda: "Which historic café appears in the show?", risposta: "The Gran Caffè Gambrinus, on Piazza Trieste e Trento: for filming it was transformed into the 1930s café frequented by the commissioner, with scenes set at his favourite table overlooking Piazza del Plebiscito." },
      { domanda: "Who plays Commissioner Ricciardi?", risposta: "Lino Guanciale in the title role, in a Rai 1 series based on Maurizio De Giovanni's novels, airing since 2021 across several seasons." },
    ],
  },
  "no-reservations-rome": {
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
    titolo: "Don Matteo",
    sinossi:
      "A Rai 1 series on air since 2000, still in production. Terence Hill plays Don Matteo, a detective priest who helps the local police solve cases alongside Sergeant Cecchini (Nino Frassica). Filmed in Gubbio for the first eight seasons (2000-2011), then in Spoleto.",
    faq: [
      { domanda: "Where is Don Matteo filmed?", risposta: "The first eight seasons (2000-2011) were shot in Gubbio, Umbria; from season nine on, production moved to Spoleto, also in Umbria." },
      { domanda: "Which café appears in Don Matteo in Gubbio?", risposta: "Caffè Ducale, on Piazza Grande: it's the café where Sergeant Cecchini and Don Matteo play their daily chess games. The venue still keeps props from the show." },
      { domanda: "Who plays Don Matteo?", risposta: "Terence Hill in the title role, with Nino Frassica as Sergeant Cecchini, in a series created by Enrico Oldoini and airing on Rai 1 since 2000." },
    ],
  },
};

interface RestEn {
  descrizione?: string;
  /** Descrizione della scena, per slug di film. */
  scena?: Record<string, string>;
}

export const restaurantsEn: Record<string, RestEn> = {
  "pizzeria-da-michele-napoli": {
    descrizione: "Founded in 1870 in the Forcella district, it is one of the most historic and famous pizzerias in Naples. An essential menu — marinara and margherita — baked in a wood-fired oven according to tradition. A simple, authentic setting, often with a queue outside.",
    scena: { "mangia-prega-ama": "It is the pizzeria where Liz (Julia Roberts) savours the famous Neapolitan margherita pizza, in one of the film's most iconic food scenes." },
  },
  "bar-vitelli-savoca": {
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
    descrizione: "A restaurant with Renaissance frescoes a short walk from the Vatican, inside Hotel Columbus in Borgo Santo Spirito. Elegant atmosphere and refined cuisine.",
    scena: { "la-grande-bellezza": "In the refined frescoed restaurant, Jep Gambardella dines with Ramona: one of the Roman scenes of the Oscar-winning film." },
  },
  "ristorante-le-gatte": {
    descrizione: "A seafood restaurant on the port of Castellabate, in the Cilento. Fresh fish dishes and sea views, among the locations of the blockbuster comedy.",
    scena: { "benvenuti-al-sud": "The restaurant is where the dinner among post-office colleagues is set, one of the film's funniest moments." },
  },
  "bar-la-piazzetta-castellabate": {
    descrizione: "A bar on the main square of Castellabate, a meeting point of the Cilento village made famous by 'Welcome to the South'. Perfect for a coffee with a sea view.",
    scena: { "benvenuti-al-sud": "The village's little square — the heart of town life in the film — where the bar overlooks the main square of Castellabate." },
  },
  "caffe-del-duomo-crema": {
    descrizione: "A café overlooking Crema's scenic Piazza del Duomo, an ideal stop along the tour of Guadagnino's film locations.",
    scena: { "chiamami-col-tuo-nome": "Piazza Duomo, the scenic heart of Crema, the film's real location: here Duomocafè is a real stop among the squares and arcades that form the backdrop to the characters' summer days." },
  },
  "cinema-bistrot-milano": {
    descrizione: "A Milanese cinema-themed bistro: vintage posters, soft lighting and a menu that plays with the great Italian films. An example of a 'themed' venue, not a real location.",
    scena: { "la-grande-bellezza": "THEMED venue (not a real location): the room pays homage to the baroque elegance and atmosphere of The Great Beauty." },
  },
  "cafe-de-paris-roma": {
    descrizione: "A historic café on Via Vittorio Veneto, opened in 1948, the real heart of the Roman 'dolce vita' that inspired Fellini's film. A symbol of glamorous 1960s Rome, it closed in 2008.",
    scena: { "la-dolce-vita": "The real worldly hangout on Via Veneto that inspired Fellini: here, in real late-1950s Rome, paparazzi photographed stars and the jet set — the very scene the director later recreated on a soundstage at Cinecittà for the film." },
  },
  "enzo-a-mare-punta-secca": {
    descrizione: "A seafood restaurant on the seafront of Punta Secca, the village with the famous house of Inspector Montalbano. Sea cuisine of the Ragusa tradition.",
    scena: { "il-commissario-montalbano": "A few steps from Montalbano's house in Punta Secca, on the seafront where the inspector loves to enjoy the fresh fish of the Ragusa coast." },
  },
  "bar-paradiso-palazzo-adriano": {
    descrizione: "A restaurant and pizzeria in Palazzo Adriano, the village-set of Tornatore's Oscar winner, a short walk from the scenic Piazza Umberto I. Ideal for a break between history and cinema.",
    scena: { "nuovo-cinema-paradiso": "In the village of Palazzo Adriano, where the scenic Piazza Umberto I was turned into the town of Giancaldo, heart of the Cinema Paradiso set: this historic hotel-restaurant is a real stop to eat in the same village as the film." },
  },
  "trattoria-dell-isola-salina": {
    descrizione: "A historic trattoria in the centre of Santa Marina Salina, the island of Il Postino: pane cunzato, capers, malvasia wine and fresh fish with a view over the Aeolian sea.",
    scena: { "il-postino": "In the historic centre of Santa Marina Salina, the island-set of Il Postino where Massimo Troisi gave life to the last, poetic role of his career: a real trattoria to taste the island's flavours." },
  },
  "caffe-di-piazza-navona": {
    descrizione: "A café overlooking the scenic Piazza Navona, among Bernini's fountains. One of Rome's finest open-air salons, dear to cinema.",
    scena: { "to-rome-with-love": "Among the tables of Piazza Navona, one of the squares featured in the Roman strolls of Woody Allen's comedy: Bar Navona is a real address for a stop here." },
  },
  "ristorante-brera-milano": {
    descrizione: "A historic restaurant since 1970 in the heart of Brera, Milan's bohemian-chic district. Signature Italian cuisine in an elegant setting, between art and fashion.",
    scena: { "house-of-gucci": "In the elegant, ambitious Milan portrayed by Ridley Scott, between the Brera district and the fashion salons of the Gucci dynasty: Nabucco, open since 1970, is a real address in the same district." },
  },
  "hosteria-giusti-modena": {
    descrizione: "A four-table osteria in the heart of Modena, carved out in 1989 from the former slaughterhouse behind the historic Giusti delicatessen, running since 1598: one of Europe's oldest food shops.",
    scena: { "master-of-none": "Among the real locations of Master of None season 2, set in Modena while Dev learns the art of fresh pasta." },
  },
  "dopolavoro-la-foce": {
    descrizione: "A restaurant on the historic Villa La Foce estate, in the Val d'Orcia: built in 1939 as a recreational club for the estate's workers, it now serves Tuscan cuisine grown in the villa's own gardens, minutes from Pienza and Montepulciano.",
    scena: { "succession": "The restaurant on the Villa La Foce estate, where the Roy family stays in season 3 of Succession, filmed in the Val d'Orcia." },
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
    scena: {
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
    scena: { "the-devil-wears-prada-2": "For several weeks the hotel hosted the film's cast and crew: scenes were shot in the lobby, at Caffè Parigi, and in the hotel's exterior spaces during Milan Fashion Week." },
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
    descrizione: "A historic café on Piazza Grande, Gubbio's main square overlooking the Umbrian valley. For thirteen years the fixed set of the Rai series Don Matteo, it still keeps props from the show today.",
    scena: { "don-matteo": "The café where Sergeant Cecchini and Don Matteo play their daily chess games, for thirteen seasons of the series. The venue still keeps props from the show." },
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
};

/* -------- Helper: restituiscono la versione nella lingua richiesta -------- */
export function tFilmTitolo(film: Film, lang: Lang): string {
  return lang === "en" ? filmsEn[film.id]?.titolo ?? film.data.titolo : film.data.titolo;
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
