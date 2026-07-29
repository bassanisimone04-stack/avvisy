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
  { question: "Posso segnalare un errore su un'attività o un prodotto?", answer: "Sì, dal tuo profilo utente puoi segnalare informazioni non aggiornate: il nostro team verifica ogni segnalazione entro 48 ore lavorative." },
  { question: "Il sito è gratuito per gli utenti?", answer: "Sì, la ricerca, le recensioni e la lettura degli articoli sono completamente gratuite per tutti gli utenti registrati e non." },
  { question: "Come vengono selezionati i prodotti consigliati?", answer: "I prodotti mostrati sono certificati o dichiarati senza glutine dal produttore e vengono ordinati in base a valutazioni e recensioni della community." },
  { question: "Posso aggiungere la mia attività alla directory?", answer: "Certo, le aziende possono richiedere l'inserimento tramite il pannello dedicato: dopo una verifica dei requisiti la scheda viene pubblicata gratuitamente." },
];
