import type { FaqItem, Testimonial } from "./types";

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Chiara Marini", role: "Celiaca dal 2015", avatarSeed: 501, rating: 5, quote: "Da quando uso Mappa Senza Glutine non improvviso più: trovo locali affidabili ovunque vada in Italia, anche nei paesi più piccoli." },
  { id: "t2", name: "Davide Ricci", role: "Papà di una bimba celiaca", avatarSeed: 502, rating: 5, quote: "Le recensioni verificate dalla community mi hanno fatto scoprire pizzerie sicure per mia figlia anche in vacanza." },
  { id: "t3", name: "Federica Sanna", role: "Content creator gluten free", avatarSeed: 503, rating: 5, quote: "La sezione prodotti è aggiornatissima e mi risparmia tempo ogni volta che faccio la spesa." },
  { id: "t4", name: "Luca Pellegrini", role: "Celiaco dal 2019", avatarSeed: 504, rating: 4, quote: "Filtri per certificazione AIC e apertura in tempo reale: esattamente quello che serve quando si viaggia per lavoro." },
  { id: "t5", name: "Martina Bruno", role: "Nutrizionista", avatarSeed: 505, rating: 5, quote: "Consiglio il sito ai miei pazienti neo-diagnosticati: gli articoli sono chiari e scientificamente accurati." },
  { id: "t6", name: "Giorgio Testa", role: "Celiaco e food blogger", avatarSeed: 506, rating: 5, quote: "Il blog è diventato la mia prima fonte per scoprire nuovi ristoranti prima ancora di partire." },
];

export const HOME_FAQS: FaqItem[] = [
  { question: "Come faccio a sapere se un ristorante è davvero sicuro per celiaci?", answer: "Ogni scheda attività su Mappa Senza Glutine riporta se il locale è certificato AIC, se dispone di cucina o forno dedicati e le recensioni verificate della community celiaca, così puoi valutare il livello di sicurezza prima di prenotare." },
  { question: "Cos'è la certificazione AIC e perché è importante?", answer: "È il marchio rilasciato dall'Associazione Italiana Celiachia ai locali che rispettano un protocollo rigoroso su acquisti, stoccaggio e preparazione dei pasti senza glutine, verificato con controlli periodici." },
  { question: "Cosa non può mangiare un celiaco?", answer: "Un celiaco deve evitare grano, orzo, segale, farro e kamut e tutti i loro derivati (pane, pasta, pizza tradizionali), oltre ai prodotti trasformati che possono contenere glutine nascosto come addensanti o dadi da brodo." },
  { question: "Cosa vuol dire contaminazione da glutine e quanto è pericolosa?", answer: "È il contatto accidentale tra un alimento senza glutine e residui di farine o utensili non dedicati: anche poche briciole possono scatenare una reazione nei celiaci, per questo cucine e forni dedicati sono la garanzia più importante." },
  { question: "Quanto costa in più fare la spesa senza glutine?", answer: "I prodotti senza glutine, in particolare pane e pasta, costano in media dal 2 al 4 volte in più rispetto agli equivalenti tradizionali: il buono mensile del Servizio Sanitario Nazionale aiuta a coprire parte della spesa." },
  { question: "Come trovo ristoranti senza glutine vicino a me?", answer: "Usa la mappa interattiva e la directory di Mappa Senza Glutine: filtra per certificazione AIC, categoria e distanza per trovare in pochi secondi i locali verificati più vicini a te." },
];
