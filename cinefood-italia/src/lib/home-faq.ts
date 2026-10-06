/** Domande frequenti della homepage (IT/EN), con link interni reali. */
import type { Lang } from "../i18n/ui";

export function faqHome(lang: Lang, s: { locali: number; film: number; citta: number }) {
  if (lang === "en") {
    return [
      { domanda: "What is CineFood Italia?", risposta: `A directory of the real Italian restaurants, bars and cafés seen in films and TV shows: ${s.locali} venues in ${s.citta} cities, linked to ${s.film} films and series, each with its address, the scene and a link to the venue.` },
      { domanda: "Where did Julia Roberts eat pizza in Eat Pray Love?", risposta: `At <a class="underline" href="/en/locale/pizzeria-da-michele-napoli">L'Antica Pizzeria da Michele</a>, on Via Cesare Sersale in Naples. The full story is in <a class="underline" href="/en/blog/eat-pray-love-pizza-da-michele-napoli">the article on the Eat Pray Love pizza place</a>.` },
      { domanda: "Are all these venues really film locations?", risposta: `Most are: the scene was actually shot there. A few are marked "film-related", meaning a real venue that was not filmed in the movie but sits next to the set or is tied to the story. We always say which is which on the venue page and on the <a class="underline" href="/en/mappa">map</a>.` },
      { domanda: "How do you check the information?", risposta: "Every venue-film pairing needs a verifiable source: the venue's own website, a regional film commission such as Italy for Movies, or recognised national press. If two sources disagree, we leave the pairing out." },
      { domanda: "Can I plan a trip with the site?", risposta: `Yes. Start from the <a class="underline" href="/en/mappa">map</a> to see what is near you, open a city page to get all its venues together, or read the <a class="underline" href="/en/blog">blog itineraries</a>, film by film.` },
      { domanda: "Is there a guide to download?", risposta: `Yes: a <a class="underline" href="/en/guida">PDF guide</a> with every venue by region plus four ready-made itineraries, handy offline.` },
      { domanda: "Do I have to book?", risposta: "It's advisable, especially for small venues and starred restaurants. Opening hours and availability change, so check the venue's official website before you travel." },
      { domanda: "My venue was in a film: how do I add it?", risposta: `Use the <a class="underline" href="/en/aggiungi-locale">Add a venue</a> page. We publish only pairings we can verify with a source.` },
    ];
  }
  return [
    { domanda: "Cos'è CineFood Italia?", risposta: `Una directory dei ristoranti, bar e caffè italiani veri visti nei film e nelle serie TV: ${s.locali} locali in ${s.citta} città, collegati a ${s.film} film e serie, ognuno con l'indirizzo, la scena e il link alla scheda.` },
    { domanda: "Dove ha mangiato la pizza Julia Roberts in Mangia prega ama?", risposta: `All'<a class="underline" href="/locale/pizzeria-da-michele-napoli">Antica Pizzeria da Michele</a>, in Via Cesare Sersale a Napoli. La storia completa è nell'<a class="underline" href="/blog/eat-pray-love-pizza-da-michele-napoli">articolo sulla pizzeria di Eat Pray Love</a>.` },
    { domanda: "Tutti i locali sono davvero location dei film?", risposta: `Quasi tutti sì: la scena è stata girata lì. Alcuni sono segnati come "legato al film", cioè locali reali non girati nel film ma vicini al set o legati alla storia raccontata. Lo diciamo sempre nella scheda e sulla <a class="underline" href="/mappa">mappa</a>.` },
    { domanda: "Come verificate le informazioni?", risposta: "Ogni abbinamento film-locale deve avere una fonte verificabile: il sito del locale, una film commission come Italy for Movies, o la stampa nazionale riconosciuta. Se due fonti si contraddicono, l'abbinamento non viene pubblicato." },
    { domanda: "Posso organizzare un viaggio con il sito?", risposta: `Sì. Parti dalla <a class="underline" href="/mappa">mappa</a> per vedere cosa hai vicino, apri la pagina di una città per averne tutti i locali insieme, oppure leggi gli <a class="underline" href="/blog">itinerari del blog</a>, film per film.` },
    { domanda: "C'è una guida da scaricare?", risposta: `Sì: una <a class="underline" href="/guida">guida PDF</a> con tutti i locali per regione e quattro itinerari pronti, comoda offline.` },
    { domanda: "Serve prenotare?", risposta: "È consigliato, soprattutto per i locali piccoli e per i ristoranti stellati. Orari e disponibilità cambiano: controlla il sito ufficiale del locale prima di partire." },
    { domanda: "Il mio locale è stato in un film: come lo aggiungo?", risposta: `Usa la pagina <a class="underline" href="/aggiungi-locale">Aggiungi locale</a>. Pubblichiamo solo abbinamenti che possiamo verificare con una fonte.` },
  ];
}
