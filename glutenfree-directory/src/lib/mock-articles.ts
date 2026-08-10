import type { Article, ArticleHeading } from "./types";
import { slugify } from "./format";
import type { Locale } from "./i18n/locale";

interface Seed {
  title: string;
  category: Article["category"];
  excerpt: string;
  coverSeed: number;
  author: string;
  authorRole: string;
  publishedAt: string;
  tags: string[];
  keyTakeaways: string[];
  sections: { h2: string; body: string; h3?: { title: string; body: string; image?: { src: string; alt: string } }[] }[];
  faqs: { question: string; answer: string }[];
  featured?: boolean;
}

const seeds: Seed[] = [
  {
    title: "Celiachia: cos'è, sintomi e come si diagnostica",
    category: "Celiachia",
    excerpt: "Una guida completa alla celiachia: cause, sintomi più comuni nell'adulto e nel bambino, percorso diagnostico e cosa fare dopo la diagnosi.",
    coverSeed: 101, author: "Dott.ssa Elena Rossi", authorRole: "Biologa nutrizionista", publishedAt: "2026-06-02",
    tags: ["celiachia", "diagnosi", "salute"],
    keyTakeaways: [
      "La celiachia è una malattia autoimmune scatenata dal glutine, non un'allergia o un'intolleranza alimentare.",
      "La diagnosi richiede esami del sangue e biopsia duodenale: non eliminare il glutine prima di completarli.",
      "L'unica terapia è la dieta senza glutine per tutta la vita, che permette la remissione dei sintomi.",
      "È consigliato lo screening anche per i parenti di primo grado, per la componente genetica della malattia.",
    ],
    sections: [
      { h2: "Che cos'è la celiachia", body: "La celiachia è una condizione autoimmune scatenata dall'ingestione di glutine, la proteina presente in grano, orzo e segale. Nei soggetti predisposti geneticamente, il glutine innesca una risposta immunitaria che danneggia i villi intestinali, compromettendo l'assorbimento dei nutrienti." },
      { h2: "I sintomi più comuni", body: "I sintomi variano molto da persona a persona e possono comparire a qualunque età.", h3: [
        { title: "Sintomi gastrointestinali", body: "Gonfiore, dolore addominale, diarrea o stitichezza alternate, nausea sono i segnali più frequenti, soprattutto nei bambini." },
        { title: "Sintomi extraintestinali", body: "Stanchezza cronica, anemia da carenza di ferro, dermatite erpetiforme, aftosi ricorrente e osteoporosi precoce sono manifestazioni tipiche negli adulti." },
      ] },
      { h2: "Come avviene la diagnosi", body: "La diagnosi si basa su esami del sangue per gli anticorpi anti-transglutaminasi, seguiti da una gastroscopia con biopsia duodenale per confermare il danno ai villi intestinali. È fondamentale non eliminare il glutine dalla dieta prima di aver completato gli accertamenti." },
      { h2: "Dopo la diagnosi: la dieta senza glutine", body: "L'unica terapia efficace oggi disponibile è una dieta rigorosamente priva di glutine per tutta la vita. Con il tempo la mucosa intestinale si rigenera e i sintomi regrediscono. Affidarsi a locali e prodotti certificati AIC aiuta a evitare le contaminazioni crociate nella vita quotidiana." },
    ],
    faqs: [
      { question: "La celiachia si può guarire?", answer: "No, non esiste una cura definitiva: la gestione consiste in una dieta senza glutine seguita rigorosamente e per tutta la vita." },
      { question: "Quanto tempo serve per stare meglio dopo la diagnosi?", answer: "I sintomi migliorano generalmente entro poche settimane dall'eliminazione del glutine, mentre la mucosa intestinale può impiegare mesi o anni per rigenerarsi completamente." },
      { question: "I familiari di un celiaco devono fare gli esami?", answer: "Sì, la celiachia ha una componente genetica: è consigliato lo screening per i parenti di primo grado anche in assenza di sintomi evidenti." },
    ],
    featured: true,
  },
  {
    title: "Come leggere le etichette alimentari se sei celiaco",
    category: "Guide",
    excerpt: "La guida pratica per riconoscere in etichetta gli ingredienti a rischio, il marchio della spiga barrata e le diciture da controllare sempre.",
    coverSeed: 102, author: "Marco Bianchi", authorRole: "Content specialist food safety", publishedAt: "2026-05-20",
    tags: ["etichette", "guide", "sicurezza alimentare"],
    keyTakeaways: [
      "La Spiga Barrata è il modo più rapido per riconoscere un prodotto verificato da AIC sullo scaffale.",
      "Amido, aromi e lieviti possono nascondere glutine: in caso di dubbio consulta il Prontuario AIC.",
      "La dicitura 'senza glutine' in Europa è regolamentata e garantisce un contenuto sotto i 20 ppm.",
      "Anche un prodotto certificato può contaminarsi in cucina: usa utensili dedicati alla preparazione gluten free.",
    ],
    sections: [
      { h2: "Il marchio della Spiga Barrata", body: "La Spiga Barrata è il marchio registrato dall'Associazione Italiana Celiachia che identifica i prodotti sottoposti a un rigoroso controllo annuale. È il modo più rapido e affidabile per riconoscere un prodotto sicuro sullo scaffale." },
      { h2: "Ingredienti da tenere sott'occhio", body: "Alcuni ingredienti richiedono attenzione perché possono nascondere glutine anche in prodotti insospettabili.", h3: [
        { title: "Amido e amido modificato", body: "Se non è specificata la fonte (mais, riso), l'amido può derivare da frumento: in Europa la normativa impone comunque di dichiarare il glutine come allergene, ma la verifica resta importante." },
        { title: "Aromi e lieviti", body: "Lieviti ed estratti di malto d'orzo possono contenere glutine: controllare sempre la dicitura 'senza glutine' o il Prontuario AIC in caso di dubbio." },
      ] },
      { h2: "Il Prontuario AIC: come si usa", body: "Il Prontuario degli Alimenti è l'app e il volume annuale che raccoglie migliaia di prodotti verificati da AIC, aggiornato mensilmente. È lo strumento più completo per fare la spesa in sicurezza, anche per i marchi che non riportano il logo in etichetta." },
      { h2: "Attenzione alla contaminazione crociata in cucina", body: "Anche un prodotto certificato può essere contaminato se manipolato con utensili non dedicati. In cucina è utile avere un tagliere, un tostapane e un set di pentole riservati esclusivamente alla preparazione gluten free." },
    ],
    faqs: [
      { question: "Cosa significa 'può contenere tracce di glutine'?", answer: "Indica un rischio di contaminazione crociata durante la produzione: per i soggetti celiaci è preferibile evitare questi prodotti, anche se il glutine non è un ingrediente diretto." },
      { question: "I prodotti 'senza glutine' sono automaticamente sicuri per i celiaci?", answer: "In Europa la dicitura 'senza glutine' è regolamentata e indica un contenuto inferiore a 20 ppm, il limite considerato sicuro per la maggior parte dei celiaci." },
      { question: "Dove si trova il Prontuario AIC aggiornato?", answer: "È disponibile come app ufficiale AIC per smartphone, aggiornata mensilmente con i nuovi prodotti verificati." },
    ],
  },
  {
    title: "Ricetta: Pasta fresca senza glutine fatta in casa",
    category: "Ricette",
    excerpt: "Il procedimento passo passo per preparare una pasta fresca gluten free elastica e saporita, con il giusto mix di farine.",
    coverSeed: 103, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-05-05",
    tags: ["ricette", "pasta", "cucina"],
    keyTakeaways: [
      "Un buon mix per pane e pasta a base di riso, patate e mais dà i risultati più simili alla pasta tradizionale.",
      "L'impasto gluten free è più delicato: va lavorato con dolcezza e steso tra due fogli di carta forno.",
      "La pasta senza glutine cuoce più rapidamente di quella tradizionale: va controllata spesso in cottura.",
      "Un pizzico di gomma di xantano e 30 minuti di riposo migliorano sensibilmente l'elasticità dell'impasto.",
    ],
    sections: [
      { h2: "Ingredienti per 4 persone", body: "250 g di mix di farine senza glutine per pane e pasta, 2 uova intere, 1 cucchiaio di olio extravergine, un pizzico di sale, acqua tiepida quanto basta." },
      { h2: "Procedimento", body: "Impastare farina, uova, olio e sale fino a ottenere un composto omogeneo, aggiungendo acqua tiepida un cucchiaio alla volta. A differenza dell'impasto tradizionale, quello gluten free è più delicato e va lavorato con dolcezza.", h3: [
        { title: "La stesura", body: "Stendere l'impasto tra due fogli di carta forno per evitare che si attacchi, con matterello o macchina per la pasta, fino allo spessore desiderato." },
        { title: "La cottura", body: "Cuocere in abbondante acqua salata per 3-4 minuti: la pasta senza glutine cuoce più rapidamente di quella tradizionale, va quindi controllata spesso." },
      ] },
      { h2: "Consigli per non sbagliare", body: "Riposare l'impasto avvolto nella pellicola per almeno 30 minuti prima di stenderlo aiuta a renderlo più lavorabile. Un cucchiaino di gomma di xantano può migliorare ulteriormente l'elasticità." },
    ],
    faqs: [
      { question: "Quale mix di farine funziona meglio?", answer: "I mix specifici per pane e pasta, a base di farina di riso, fecola di patate e amido di mais, danno generalmente i risultati più simili alla pasta tradizionale." },
      { question: "Si può congelare la pasta fresca senza glutine?", answer: "Sì, va congelata cruda, ben infarinata e distanziata, e cotta direttamente da congelata aggiungendo un minuto di cottura." },
    ],
  },
  {
    title: "Viaggiare senza glutine: 7 consigli per le vacanze sicure",
    category: "Viaggi",
    excerpt: "Come organizzare un viaggio in Italia e all'estero da celiaco, tra app utili, tesserini di traduzione e prenotazioni sicure.",
    coverSeed: 104, author: "Marco Bianchi", authorRole: "Travel writer", publishedAt: "2026-04-18",
    tags: ["viaggi", "vacanze", "consigli"],
    keyTakeaways: [
      "Cerca ristoranti e hotel certificati a destinazione prima di partire e salvali in una mappa condivisa.",
      "Il tesserino AIC multilingue aiuta a comunicare la celiachia al personale di sala all'estero.",
      "Richiedi i pasti gluten free in aereo con almeno 48 ore d'anticipo e porta sempre snack sicuri di scorta.",
      "Le directory locali e le community online restano la risorsa più affidabile fuori dai circuiti turistici.",
    ],
    sections: [
      { h2: "Prima della partenza", body: "Cercare in anticipo ristoranti e hotel certificati nella destinazione scelta, salvando gli indirizzi in una mappa condivisa, riduce lo stress durante il viaggio." },
      { h2: "Il tesserino di traduzione per celiaci", body: "AIC mette a disposizione un tesserino con la spiegazione della celiachia tradotta in più lingue, utilissimo per comunicare con il personale di sala nei paesi esteri." },
      { h2: "In aereo e in treno", body: "Molte compagnie aeree offrono pasti gluten free su richiesta, da prenotare almeno 48 ore prima. Meglio comunque portare sempre snack sicuri per ogni evenienza." },
      { h2: "Trovare locali sicuri sul posto", body: "Le directory locali e le community online dedicate ai celiaci sono la risorsa più affidabile per scoprire attività verificate anche fuori dai circuiti turistici principali." },
    ],
    faqs: [
      { question: "Cos'è il tesserino AIC per celiaci in viaggio?", answer: "È un documento multilingue che spiega la celiachia e le esigenze alimentari legate ad essa, utile da mostrare al personale di ristoranti e hotel all'estero." },
      { question: "Le compagnie aeree garantiscono sempre pasti senza glutine?", answer: "La disponibilità dipende dalla compagnia: è necessario richiederlo in fase di prenotazione o comunque con adeguato anticipo rispetto al volo." },
    ],
  },
  {
    title: "Bambini celiaci a scuola: come gestire mensa e gite",
    category: "Bambini",
    excerpt: "Consigli pratici per genitori su come organizzare la mensa scolastica, le gite e le feste di compleanno per un bambino celiaco.",
    coverSeed: 105, author: "Dott.ssa Elena Rossi", authorRole: "Biologa nutrizionista", publishedAt: "2026-04-02",
    tags: ["bambini", "scuola", "celiachia"],
    keyTakeaways: [
      "Il pasto senza glutine nelle mense scolastiche è un diritto garantito per legge, senza costi extra per la famiglia.",
      "Basta il certificato medico in segreteria per concordare il menu con il servizio di ristorazione.",
      "Informare gli insegnanti in anticipo e portare snack sicuri evita disagi durante le gite scolastiche.",
      "Coinvolgere il bambino nella scelta di dolci gluten free aiuta a vivere la socialità senza sentirsi diverso.",
    ],
    sections: [
      { h2: "La mensa scolastica", body: "La legge italiana garantisce il diritto al pasto senza glutine nelle mense scolastiche: è sufficiente presentare il certificato medico alla segreteria e concordare il menu con il servizio di ristorazione." },
      { h2: "Gite e uscite didattiche", body: "Informare per tempo gli insegnanti e, se necessario, fornire snack sicuri da portare con sé evita situazioni di disagio durante le uscite fuori dal contesto scolastico." },
      { h2: "Feste di compleanno e socialità", body: "Coinvolgere il bambino nella scelta di dolci e snack gluten free da condividere con i compagni aiuta a vivere la socialità senza sentirsi diversi." },
    ],
    faqs: [
      { question: "La mensa senza glutine è gratuita?", answer: "Sì, la normativa italiana prevede che il pasto senza glutine nelle mense scolastiche non comporti costi aggiuntivi per la famiglia." },
      { question: "Serve un certificato medico per la mensa scolastica?", answer: "Sì, è necessario presentare la certificazione della diagnosi rilasciata dal centro specialistico di riferimento." },
    ],
  },
  {
    title: "Prodotti senza glutine: le novità più interessanti del 2026",
    category: "Prodotti",
    excerpt: "Una rassegna dei prodotti gluten free più innovativi arrivati sugli scaffali quest'anno, tra farine, snack e sostituti del pane.",
    coverSeed: 106, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-03-22",
    tags: ["prodotti", "novità", "spesa"],
    keyTakeaways: [
      "I mix di ultima generazione a base di grano saraceno e teff si avvicinano molto al pane tradizionale.",
      "Crescono gli snack proteici a base di legumi certificati, pratici per una spuntino sano fuori casa.",
      "Il pane fresco surgelato gluten free è sempre più diffuso anche nella grande distribuzione.",
      "I nuovi prodotti si trovano in supermercati con corner dedicato, negozi specializzati e online.",
    ],
    sections: [
      { h2: "Nuove farine e mix per il pane", body: "I mix di ultima generazione a base di farina di grano saraceno e teff offrono un sapore più ricco e una struttura più simile al pane tradizionale rispetto ai mix classici a base di amido." },
      { h2: "Snack proteici gluten free", body: "Crescono le proposte di snack proteici a base di legumi certificati, pensati per chi cerca alternative sane e pratiche fuori casa." },
      { h2: "Sostituti del pane fresco", body: "Diverse panetterie artigianali stanno introducendo linee di pane fresco surgelato gluten free distribuite anche nella grande distribuzione, ampliando le opzioni disponibili." },
    ],
    faqs: [
      { question: "Dove si trovano questi nuovi prodotti?", answer: "Sono disponibili nei supermercati con corner dedicato, nei negozi specializzati e in molti casi anche online sui siti dei singoli produttori." },
    ],
  },
  {
    title: "Eventi e fiere dedicate al mondo senza glutine nel 2026",
    category: "Eventi",
    excerpt: "Il calendario delle principali fiere, mercatini e giornate informative dedicate alla celiachia e al senza glutine in Italia.",
    coverSeed: 107, author: "Marco Bianchi", authorRole: "Content specialist food safety", publishedAt: "2026-03-10",
    tags: ["eventi", "fiere", "community"],
    keyTakeaways: [
      "Ogni anno diverse città italiane ospitano fiere food senza glutine con degustazioni e workshop aperti al pubblico.",
      "Le sedi regionali AIC organizzano incontri gratuiti su diagnosi e novità normative per i neo-diagnosticati.",
      "Le community di celiaci organizzano sempre più cene sociali presso locali certificati.",
      "Il blog di Mappa Senza Glutine e i canali social delle associazioni locali sono il modo più semplice per restare aggiornati.",
    ],
    sections: [
      { h2: "Le fiere nazionali", body: "Ogni anno diverse città italiane ospitano fiere dedicate al food senza glutine, con degustazioni, workshop e incontri con nutrizionisti aperti al pubblico." },
      { h2: "Giornate informative locali", body: "Le sedi regionali AIC organizzano periodicamente incontri gratuiti su diagnosi, alimentazione e novità normative, un'occasione utile per neo-diagnosticati e famiglie." },
      { h2: "Eventi social e community online", body: "Sempre più community di celiaci organizzano cene sociali e raduni presso locali certificati, un modo semplice per scoprire nuove attività affidabili nella propria zona." },
    ],
    faqs: [
      { question: "Come restare aggiornati sugli eventi in programma?", answer: "Seguendo il blog di Mappa Senza Glutine e i canali social delle associazioni locali si ricevono aggiornamenti periodici sugli eventi in calendario." },
    ],
  },
  {
    title: "Dieta senza glutine e sport: cosa sapere per le performance",
    category: "Salute",
    excerpt: "Come impostare l'alimentazione sportiva quando si segue una dieta senza glutine, tra carboidrati, integrazione e idee pratiche.",
    coverSeed: 108, author: "Dott.ssa Elena Rossi", authorRole: "Biologa nutrizionista", publishedAt: "2026-02-27",
    tags: ["sport", "salute", "alimentazione"],
    keyTakeaways: [
      "Riso, quinoa, grano saraceno e patate dolci sono carboidrati complessi ideali per pre-gara e recupero.",
      "Una dieta senza glutine sbilanciata può essere povera di fibre e ferro: varia i cereali integrali disponibili.",
      "Molte barrette energetiche contengono glutine come addensante: scegli sempre prodotti certificati.",
      "Monitora periodicamente ferro, vitamina D e vitamine del gruppo B con il tuo medico o nutrizionista.",
    ],
    sections: [
      { h2: "Carboidrati senza glutine per l'energia", body: "Riso, quinoa, grano saraceno e patate dolci sono fonti eccellenti di carboidrati complessi, perfette per il pre-gara e il recupero post-allenamento." },
      { h2: "Attenzione a carenze nutrizionali", body: "Una dieta senza glutine mal bilanciata può essere povera di fibre e ferro: è importante variare i cereali integrali senza glutine disponibili e monitorare periodicamente i valori ematici." },
      { h2: "Integrazione e barrette sicure", body: "Molte barrette energetiche contengono glutine come addensante: scegliere sempre prodotti certificati evita brutte sorprese durante gare e allenamenti intensi." },
    ],
    faqs: [
      { question: "Gli sportivi celiaci hanno bisogno di integratori specifici?", answer: "Non necessariamente, ma è utile monitorare ferro, vitamina D e vitamine del gruppo B con il proprio medico o nutrizionista di riferimento." },
    ],
  },
  {
    title: "Alimentazione senza glutine equilibrata: guida ai macronutrienti",
    category: "Alimentazione",
    excerpt: "Come costruire una dieta senza glutine varia ed equilibrata, evitando gli eccessi di prodotti industriali sostitutivi.",
    coverSeed: 109, author: "Dott.ssa Elena Rossi", authorRole: "Biologa nutrizionista", publishedAt: "2026-02-10",
    tags: ["alimentazione", "nutrizione", "salute"],
    keyTakeaways: [
      "Riso, mais, grano saraceno, quinoa, legumi e verdure sono naturalmente senza glutine e dovrebbero essere la base della dieta.",
      "Le versioni integrali di riso e mais aiutano a coprire un apporto di fibre spesso carente nei prodotti raffinati.",
      "Un piano alimentare semplice, ripetibile ogni giorno, riduce la dipendenza dai sostituti industriali.",
      "Non tutti i prodotti gluten free industriali sono uguali: hanno spesso indice glicemico più alto e meno fibre.",
    ],
    sections: [
      { h2: "Non solo sostituti industriali", body: "Riso, mais, grano saraceno, quinoa, legumi e verdure sono naturalmente privi di glutine e dovrebbero costituire la base della dieta, più dei prodotti confezionati sostitutivi." },
      { h2: "Fibre e cereali integrali gluten free", body: "Scegliere versioni integrali di riso e mais, insieme a legumi e semi, aiuta a mantenere un adeguato apporto di fibre spesso carente nelle diete a base di prodotti raffinati senza glutine." },
      { h2: "Un esempio di giornata alimentare", body: "Colazione con fiocchi di grano saraceno e frutta, pranzo con cereali integrali e proteine magre, cena leggera con verdure e legumi: un impianto semplice e replicabile ogni giorno." },
    ],
    faqs: [
      { question: "I prodotti gluten free industriali fanno ingrassare di più?", answer: "Non necessariamente, ma spesso hanno un indice glicemico più alto e meno fibre: è bene alternarli con cereali naturalmente senza glutine." },
    ],
  },
  {
    title: "Novità normative 2026: cosa cambia per i celiaci in Italia",
    category: "News",
    excerpt: "Le ultime novità su rimborsi, buoni spesa e normative per le persone celiache in Italia aggiornate al 2026.",
    coverSeed: 110, author: "Marco Bianchi", authorRole: "Content specialist food safety", publishedAt: "2026-01-15",
    tags: ["news", "normativa", "aic"],
    keyTakeaways: [
      "Il tetto di spesa mensile per prodotti senza glutine erogato dal SSN viene rivisto periodicamente.",
      "Verifica sempre gli importi aggiornati direttamente presso la tua ASL di riferimento.",
      "Diverse regioni stanno aggiornando le linee guida HACCP per la certificazione dei locali per celiaci.",
      "Il buono spesa è utilizzabile in farmacia e nei punti vendita convenzionati dopo la presentazione della diagnosi.",
    ],
    sections: [
      { h2: "Aggiornamento dei buoni spesa mensili", body: "Il tetto di spesa mensile erogato dal Servizio Sanitario Nazionale per i prodotti senza glutine viene periodicamente rivisto: è consigliato verificare gli importi aggiornati presso la propria ASL di riferimento." },
      { h2: "Nuove linee guida per la ristorazione", body: "Diverse regioni stanno aggiornando le linee guida HACCP per la ristorazione, con requisiti più stringenti per i locali che vogliono ottenere la certificazione per celiaci." },
    ],
    faqs: [
      { question: "Dove si ritira il buono spesa per prodotti senza glutine?", answer: "Il buono viene erogato dalla ASL di residenza dopo la presentazione della diagnosi ed è utilizzabile in farmacia e nei punti vendita convenzionati." },
    ],
  },
  {
    title: "Pizza senza glutine perfetta: i segreti per un impasto leggero e croccante",
    category: "Ricette",
    excerpt: "I segreti per un impasto senza glutine leggero, elastico e croccante, con tempi di lievitazione e cottura per una pizza da vera pizzeria.",
    coverSeed: 111, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-07-20",
    tags: ["ricette", "pizza", "cucina"],
    keyTakeaways: [
      "Un mix con farina di riso, fecola e amido di mais dà una base elastica e ben lievitabile.",
      "La lievitazione lunga in frigo (12-24h) migliora sapore e digeribilità dell'impasto gluten free.",
      "Cuocere su pietra refrattaria o con teglia già calda aiuta a ottenere un fondo croccante.",
      "Aggiungere un cucchiaino di miele nell'impasto favorisce la doratura e la lievitazione.",
    ],
    sections: [
      { h2: "Il mix di farine giusto", body: "Un impasto per pizza senza glutine riuscito parte da un buon mix di farine: riso, fecola di patate e amido di mais in proporzioni bilanciate garantiscono elasticità e una struttura alveolata, evitando il risultato gommoso o troppo friabile." },
      { h2: "L'impasto e la lievitazione", body: "Impastare farina, acqua tiepida, lievito, olio e un pizzico di sale fino a un composto liscio e appiccicoso, tipico delle farine senza glutine. Una lievitazione lunga, anche 12-24 ore in frigorifero, migliora sapore, struttura e digeribilità.", h3: [
        { title: "Il riposo a temperatura ambiente", body: "Prima di stendere l'impasto, farlo tornare a temperatura ambiente per almeno un'ora: renderà la lavorazione più semplice e la cottura più uniforme." },
        { title: "La stesura senza rompere l'impasto", body: "Stendere direttamente sulla teglia leggermente unta o su carta forno, aiutandosi con le mani bagnate: l'impasto gluten free si rompe facilmente se steso con il matterello." },
      ] },
      { h2: "La cottura perfetta", body: "Cuocere su pietra refrattaria preriscaldata o su una teglia già calda in forno statico al massimo della temperatura aiuta a ottenere un fondo croccante e una cottura uniforme anche in pochi minuti." },
      { h2: "Consigli per farciture leggere", body: "Evitare di sovraccaricare la pizza con troppi ingredienti umidi, che potrebbero ammorbidire eccessivamente la base: meglio farciture semplici ed equilibrate, aggiungendo eventuali verdure già cotte." },
    ],
    faqs: [
      { question: "Perché l'impasto senza glutine è più appiccicoso?", answer: "Le farine senza glutine assorbono l'acqua in modo diverso e non hanno la maglia glutinica che dà struttura: è normale che il composto risulti più morbido e vada lavorato con le mani bagnate." },
      { question: "Si può congelare l'impasto della pizza senza glutine?", answer: "Sì, si può congelare già steso nella forma di base, pronto per essere farcito e cotto direttamente da congelato aggiungendo qualche minuto di cottura." },
    ],
    featured: true,
  },
  {
    title: "Contaminazione crociata in cucina: le regole d'oro per una casa sicura",
    category: "Guide",
    excerpt: "Le buone pratiche per evitare la contaminazione da glutine in una cucina condivisa con familiari non celiaci, dalla dispensa ai fornelli.",
    coverSeed: 112, author: "Dott.ssa Elena Rossi", authorRole: "Biologa nutrizionista", publishedAt: "2026-07-10",
    tags: ["guide", "sicurezza alimentare", "celiachia"],
    keyTakeaways: [
      "Anche pochi milligrammi di glutine possono scatenare una reazione nei celiaci: bastano briciole o utensili condivisi.",
      "Tagliere, tostapane e colino andrebbero sempre dedicati, oppure lavati accuratamente prima dell'uso.",
      "In dispensa conviene tenere i prodotti senza glutine in contenitori chiusi e ben etichettati, separati dagli altri.",
      "Le mani, i piani di lavoro e gli utensili vanno sempre lavati tra la preparazione di piatti con e senza glutine.",
    ],
    sections: [
      { h2: "Perché la contaminazione crociata è pericolosa", body: "Per una persona celiaca anche tracce minime di glutine, pari a poche briciole, possono scatenare una risposta immunitaria e danneggiare i villi intestinali: per questo la contaminazione crociata va evitata con la stessa attenzione dell'eliminazione diretta del glutine dalla dieta." },
      { h2: "Gli utensili più a rischio", body: "Alcuni strumenti da cucina trattengono facilmente residui di farina o briciole e andrebbero gestiti con particolare cura.", h3: [
        { title: "Tostapane e griglie", body: "Il tostapane è tra gli oggetti più a rischio: meglio averne uno dedicato esclusivamente al pane senza glutine, oppure usare appositi sacchetti tostapane." },
        { title: "Taglieri e colini", body: "Taglieri in legno e colini per la pasta trattengono facilmente residui di glutine nelle porosità: è preferibile avere versioni dedicate, magari di colore diverso per riconoscerle a colpo d'occhio." },
      ] },
      { h2: "Organizzare la dispensa", body: "Conservare i prodotti senza glutine in contenitori chiusi, ben etichettati e possibilmente su un ripiano separato riduce il rischio di contatto accidentale con farine o pane tradizionali, soprattutto in una cucina condivisa con familiari non celiaci." },
      { h2: "Le buone abitudini quotidiane", body: "Lavare sempre accuratamente mani, piani di lavoro e utensili tra la preparazione di un piatto con glutine e uno senza, e cucinare prima gli alimenti gluten free quando si usano gli stessi fornelli, sono abitudini semplici che riducono drasticamente il rischio." },
    ],
    faqs: [
      { question: "Basta lavare bene un utensile per renderlo sicuro?", answer: "Nella maggior parte dei casi un lavaggio accurato con acqua calda e detersivo è sufficiente, ma per oggetti porosi come legno o plastica graffiata è più sicuro avere versioni dedicate." },
      { question: "Il forno può essere condiviso tra pane con e senza glutine?", answer: "Sì, ma è importante pulire bene le griglie e cuocere il pane senza glutine su una teglia propria, evitando il contatto diretto con superfici che hanno cotto prodotti con glutine." },
    ],
  },
  {
    title: "Celiachia e gravidanza: cosa sapere per una gestazione serena",
    category: "Celiachia",
    excerpt: "Come gestire la dieta senza glutine in gravidanza, tra fabbisogni nutrizionali aumentati, controlli di routine e false credenze da sfatare.",
    coverSeed: 113, author: "Dott.ssa Elena Rossi", authorRole: "Biologa nutrizionista", publishedAt: "2026-06-25",
    tags: ["celiachia", "gravidanza", "salute"],
    keyTakeaways: [
      "Una dieta senza glutine ben bilanciata non comporta rischi aggiuntivi per la gravidanza rispetto a una dieta con glutine.",
      "In gravidanza aumenta il fabbisogno di ferro, acido folico e calcio: vanno scelte fonti gluten free adeguate.",
      "La celiachia non diagnosticata è invece associata a un rischio maggiore di complicanze, da qui l'importanza dello screening.",
      "È utile confrontarsi con un nutrizionista per un piano alimentare personalizzato durante i nove mesi.",
    ],
    sections: [
      { h2: "Dieta senza glutine e gravidanza: nessun rischio aggiuntivo", body: "Una dieta senza glutine correttamente bilanciata non comporta rischi particolari per la gravidanza: l'importante è garantire un apporto adeguato di tutti i nutrienti necessari, proprio come per qualsiasi altra gestante." },
      { h2: "I nutrienti da monitorare", body: "In gravidanza aumenta il fabbisogno di alcuni nutrienti chiave, che vanno reperiti da fonti sicure per chi segue una dieta senza glutine.", h3: [
        { title: "Ferro e acido folico", body: "Legumi, verdure a foglia verde e cereali senza glutine fortificati sono buone fonti, da integrare secondo le indicazioni del ginecologo." },
        { title: "Calcio e vitamina D", body: "Latticini, bevande vegetali fortificate e pesce azzurro aiutano a coprire il fabbisogno, particolarmente importante nel terzo trimestre." },
      ] },
      { h2: "Celiachia non diagnosticata: i rischi da conoscere", body: "La celiachia non diagnosticata, a differenza di quella correttamente gestita con la dieta, è associata a un rischio maggiore di complicanze come anemia, parto pretermine e basso peso alla nascita: per questo un percorso diagnostico tempestivo è importante anche in ottica di programmazione della gravidanza." },
      { h2: "Il supporto di un nutrizionista", body: "Confrontarsi con un nutrizionista esperto in celiachia permette di costruire un piano alimentare personalizzato per i nove mesi, tenendo conto di eventuali carenze pregresse e delle esigenze specifiche di ogni trimestre." },
    ],
    faqs: [
      { question: "La celiachia può essere scoperta per la prima volta in gravidanza?", answer: "Sì, in alcuni casi i sintomi si manifestano o si aggravano proprio durante la gravidanza, portando a una diagnosi che prima non era emersa." },
      { question: "Serve un'integrazione speciale per le donne celiache in gravidanza?", answer: "Le integrazioni standard raccomandate in gravidanza (acido folico, ferro, vitamina D) restano valide: è importante scegliere formulazioni certificate senza glutine e confrontarsi con il proprio medico." },
    ],
  },
  {
    title: "Le migliori città italiane per una vacanza senza glutine",
    category: "Viaggi",
    excerpt: "Da Bologna a Milano fino alla Puglia: una panoramica delle mete italiane con la maggiore densità di locali certificati per celiaci.",
    coverSeed: 114, author: "Marco Bianchi", authorRole: "Travel writer", publishedAt: "2026-06-15",
    tags: ["viaggi", "italia", "ristoranti"],
    keyTakeaways: [
      "Emilia-Romagna e Lombardia sono tra le regioni con più locali certificati AIC per densità di popolazione.",
      "Molte città d'arte offrono ormai percorsi gastronomici gluten free pensati apposta per i turisti celiaci.",
      "Prenotare in anticipo nei ristoranti più richiesti aiuta a evitare l'attesa o il tutto esaurito nei weekend.",
      "Le directory locali restano lo strumento più aggiornato per scoprire nuove aperture certificate.",
    ],
    sections: [
      { h2: "Bologna e l'Emilia-Romagna", body: "Bologna, storicamente capitale della tradizione gastronomica italiana, ha visto crescere negli anni un'offerta molto ampia di ristoranti e pastifici artigianali specializzati in preparazioni senza glutine, spesso con menu dedicati alla pasta fresca fatta in casa." },
      { h2: "Milano, tra ristoranti e street food", body: "Milano offre una delle concentrazioni più alte di locali certificati in Italia, dalle pizzerie gluten free ai ristoranti gourmet, passando per un'offerta crescente di street food e panetterie dedicate in centro e nei quartieri limitrofi." },
      { h2: "Puglia e il sud Italia", body: "Anche il sud Italia, con Puglia e Sicilia in testa, ha ampliato negli ultimi anni l'offerta di strutture ricettive e ristoranti certificati, rendendo più semplice organizzare una vacanza al mare senza rinunce a livello alimentare." },
      { h2: "Consigli pratici per organizzare il viaggio", body: "Prenotare con anticipo nei locali più richiesti, soprattutto nei weekend e in alta stagione, e consultare directory aggiornate con recensioni verificate aiuta a costruire un itinerario gastronomico sicuro e senza sorprese." },
    ],
    faqs: [
      { question: "Quali regioni italiane hanno più locali certificati per celiaci?", answer: "Emilia-Romagna, Lombardia e Lazio sono generalmente tra le regioni con la maggiore concentrazione di locali certificati, ma l'offerta sta crescendo rapidamente in tutta Italia." },
      { question: "È necessario prenotare sempre in anticipo?", answer: "Non sempre, ma nei locali più noti e nei weekend è consigliabile prenotare per essere sicuri di trovare posto ed evitare attese." },
    ],
  },
  {
    title: "I migliori ristoranti e pizzerie senza glutine a Milano: la guida completa 2026",
    category: "Guide",
    excerpt: "Dove mangiare senza glutine a Milano in sicurezza: la nostra selezione di ristoranti, pizzerie e pasticcerie certificate, tra cucine dedicate e attenzione scrupolosa alla contaminazione crociata.",
    coverSeed: 115, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-07-29",
    tags: ["milano", "ristoranti", "pizzerie", "guide"],
    keyTakeaways: [
      "Milano offre ormai decine di locali certificati AIC, dai ristoranti con cucina 100% gluten free alle pizzerie con forno dedicato.",
      "Avvisare sempre della celiachia al momento della prenotazione, non solo al tavolo, riduce il rischio di errori in cucina.",
      "I locali con certificazione AIC e cucina/forno separati offrono le maggiori garanzie contro la contaminazione crociata.",
      "Prenotare con anticipo è quasi obbligatorio nei locali più noti, soprattutto nei weekend.",
    ],
    sections: [
      { h2: "Mangiare senza glutine a Milano: la paura della contaminazione non deve fermarti", body: "Chi è celiaco lo sa bene: la parte più difficile di una cena fuori non è scegliere cosa mangiare, ma fidarsi del locale. La paura della contaminazione crociata può trasformare anche una semplice pizza tra amici in una fonte d'ansia. La buona notizia è che <strong>Milano è oggi una delle città italiane più attrezzate per chi cerca ristoranti senza glutine</strong>: dalle pizzerie con forno dedicato ai ristoranti con cucina interamente gluten free, i locali celiaci a Milano sono in costante crescita. In questa guida raccogliamo i nostri indirizzi di fiducia, verificati dalla community di Mappa Senza Glutine, per aiutarti a scoprire dove mangiare senza glutine a Milano senza rinunciare alla sicurezza." },
      { h2: "Domande frequenti su dove mangiare senza glutine a Milano", body: "Prima di partire con gli indirizzi, rispondiamo alle domande che ci fanno più spesso i celiaci che devono organizzare una cena o un weekend in città.", h3: [
        { title: "Dove posso mangiare senza glutine in sicurezza a Milano?", body: "A Milano i locali più sicuri sono quelli con certificazione AIC, cucina o forno dedicati e un buon riscontro tra i celiaci, come La Rosa dei Venti o Be Bop. Evita i locali che offrono solo \"opzioni gluten free\" generiche senza controlli specifici sulla contaminazione: verifica sempre sulla directory di Mappa Senza Glutine prima di prenotare." },
        { title: "È rischioso mangiare fuori a Milano se sono celiaco?", body: "Non è rischioso se scegli locali attrezzati con procedure anti-contaminazione verificate, sempre più diffusi in città. Il rischio aumenta nei ristoranti generici che aggiungono piatti \"senza glutine\" al menu senza formare lo staff o separare gli strumenti di cottura: informarsi prima resta la regola d'oro." },
        { title: "Come faccio a trovare velocemente un ristorante senza glutine vicino a me a Milano?", body: "Il modo più rapido è usare una directory geolocalizzata con filtri per certificazione AIC e categoria di locale. Cercare solo su Google Maps generico spesso restituisce locali non verificati: meglio affidarsi a fonti come la nostra, che raccolgono segnalazioni reali della community celiaca." },
      ] },
      { h2: "Le migliori pizzerie senza glutine a Milano", body: "La pizza resta uno dei piatti più a rischio contaminazione, perché la farina di grano vola facilmente in un forno condiviso: per questo cerchiamo sempre locali con <strong>forno separato o dedicato</strong> alle pizze gluten free.", h3: [
        { title: "Be Bop", body: "A due passi dai Navigli, <a href=\"/directory/be-bop-milano\">Be Bop</a> è un ristorante e pizzeria attivo dal 1986 che propone pizza e piatti tradizionali anche in versione senza glutine, oltre a opzioni vegan. Un indirizzo comodo per chi cerca la pizza gluten free in zona Navigli senza rinunciare alla scelta del menu.", image: { src: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=75", alt: "Pizza senza glutine appena sfornata" } },
      ] },
      { h2: "Ristoranti senza glutine a Milano: dove sedersi senza pensieri", body: "Per una cena più strutturata, questo è il ristorante che consigliamo a chi cerca il massimo della tranquillità in fatto di contaminazione crociata.", h3: [
        { title: "La Rosa dei Venti", body: "Nella zona Sempione/Bullona, <a href=\"/directory/la-rosa-dei-venti-milano\">La Rosa dei Venti</a> è uno storico ristorante di pesce aperto dal 2001, segnalato anche dalla Guida Michelin e <strong>certificato AIC</strong>: propone una selezione di piatti senza glutine, tra cui pane e pasta preparati per l'occasione.", image: { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=75", alt: "Piatto servito in ristorante elegante" } },
      ] },
      { h2: "AIC, menu e cucina dedicata: le domande tecniche sulla sicurezza", body: "Dopo aver visto i locali, è utile capire cosa distingue davvero un'esperienza sicura da una rischiosa: ecco le domande più tecniche che riceviamo sulla sicurezza alimentare.", h3: [
        { title: "Qual è la differenza tra un ristorante certificato AIC e uno non certificato?", body: "Un locale certificato AIC ha superato controlli annuali su procedure, fornitori e formazione dello staff sulla contaminazione crociata. Un locale non certificato può comunque essere sicuro, ma la garanzia dipende solo dall'esperienza diretta di chi lo ha provato: la certificazione riduce il margine di errore." },
        { title: "Come si legge un menu senza glutine al ristorante?", body: "Un buon menu senza glutine indica chiaramente i piatti \"gluten free\" e specifica se sono preparati in area dedicata o con la stessa attrezzatura degli altri piatti. Se il menu non lo chiarisce, è sempre meglio chiedere direttamente in sala prima di ordinare, senza dare nulla per scontato." },
        { title: "Cosa significa \"cucina dedicata\" e perché è così importante?", body: "Una cucina dedicata è un'area separata usata esclusivamente per preparazioni senza glutine, senza contatto con farine o utensili \"normali\". È l'elemento che offre la massima garanzia contro la contaminazione crociata, più della semplice presenza di piatti gluten free in menu." },
        { title: "Un piatto \"senza glutine\" può comunque contaminarsi durante la cottura?", body: "Sì, se cucinato con la stessa acqua di cottura, friggitrice o griglia usata per alimenti con glutine, anche se l'ingrediente di partenza è gluten free. È per questo che chiedere se la cottura avviene con strumenti dedicati è più importante della semplice etichetta sul piatto." },
      ] },
      { h2: "Pasticcerie e colazioni senza glutine a Milano", body: "Anche la colazione può diventare un momento di relax, non di ansia: cerca laboratori con un angolo o un forno interamente dedicato al senza glutine, verificato da certificazione AIC o da recensioni reali della community, prima di scegliere dove fare colazione. Sulla directory di Mappa Senza Glutine trovi le pasticcerie e i bar di Milano verificati, aggiornati man mano che nuovi locali vengono controllati." },
      { h2: "Consigli pratici per mangiare senza glutine a Milano in sicurezza", body: "Qualche accorgimento in più aiuta a vivere l'esperienza senza stress: <ul><li><strong>Prenota in anticipo</strong>, soprattutto nei locali più noti e nei weekend, quando la cucina lavora a pieno ritmo.</li><li><strong>Avvisa sempre della celiachia</strong> già in fase di prenotazione, non solo al tavolo, così lo staff può organizzarsi per tempo.</li><li><strong>Chiedi se cucina o forno sono dedicati</strong> oppure condivisi: uno staff preparato risponderà con sicurezza e senza esitazioni.</li><li><strong>Verifica la certificazione AIC</strong> del locale, un'ulteriore garanzia di controlli periodici sulla sicurezza alimentare.</li><li><strong>Porta sempre con te qualche snack sicuro</strong>, utile in caso di imprevisti o lunghe attese.</li></ul>" },
      { h2: "Prenotazioni, asporto e bambini: le domande pratiche prima di uscire", body: "Un'ultima serie di dubbi pratici, utili per organizzare al meglio la tua uscita senza glutine a Milano.", h3: [
        { title: "È necessario prenotare in anticipo nei ristoranti senza glutine a Milano?", body: "Sì, è fortemente consigliato nei locali più noti, soprattutto nei weekend, perché la cucina dedicata gestisce un numero limitato di coperti gluten free. Prenotando puoi anche avvisare in anticipo della celiachia, così lo staff si organizza prima del tuo arrivo." },
        { title: "Posso portare bambini celiaci in un ristorante senza glutine a Milano?", body: "Sì, i locali con cucina dedicata sono generalmente la scelta più sicura anche per i bambini celiaci, spesso con menu specifici pensati per loro. È comunque utile avvisare al momento della prenotazione, specificando l'età del bambino per un servizio più attento." },
        { title: "Esistono opzioni di asporto o take away senza glutine sicure a Milano?", body: "Sì, molti locali certificati offrono anche asporto preparato con le stesse procedure dedicate del servizio al tavolo. Verifica sempre che l'imballaggio sia sigillato separatamente dagli altri ordini, per evitare contaminazioni durante il trasporto." },
      ] },
    ],
    faqs: [
      { question: "Quali sono i migliori ristoranti senza glutine a Milano?", answer: "Tra gli indirizzi di Milano segnaliamo La Rosa dei Venti, ristorante di pesce certificato AIC, e Be Bop, ristorante e pizzeria vicino ai Navigli con pizza senza glutine: entrambi presenti nella directory di Mappa Senza Glutine." },
      { question: "Come faccio a sapere se un ristorante a Milano è davvero sicuro per celiaci?", answer: "Controlla la certificazione AIC, chiedi se cucina e forno sono dedicati o separati e affidati a recensioni verificate da altri celiaci, come quelle presenti nella nostra directory." },
      { question: "È necessario prenotare sempre nei ristoranti senza glutine a Milano?", answer: "Non è sempre obbligatorio, ma è fortemente consigliato nei locali più conosciuti e nei weekend, quando la richiesta è più alta e i posti dedicati possono esaurirsi rapidamente." },
    ],
  },
  {
    title: "Cosa può mangiare un celiaco: la guida completa agli alimenti sì e no",
    category: "Alimentazione",
    excerpt: "Quali alimenti sono sicuri per chi è celiaco e quali vanno evitati sempre: la guida pratica per fare la spesa e cucinare senza glutine senza dubbi né rischi di contaminazione.",
    coverSeed: 116, author: "Dott.ssa Elena Rossi", authorRole: "Biologa nutrizionista", publishedAt: "2026-07-20",
    tags: ["alimentazione", "celiachia", "guide"],
    keyTakeaways: [
      "Cereali come grano, orzo, segale e i loro derivati vanno sempre evitati: sono le principali fonti di glutine nella dieta italiana.",
      "Riso, mais, grano saraceno, quinoa e legumi sono naturalmente senza glutine e possono essere consumati liberamente.",
      "Molti alimenti trasformati (salse, dadi da brodo, salumi) possono contenere glutine nascosto: va sempre controllata l'etichetta o il Prontuario AIC.",
      "La Spiga Barrata sulla confezione resta il modo più rapido per riconoscere un prodotto sicuro sullo scaffale.",
    ],
    sections: [
      { h2: "Cosa significa davvero \"mangiare senza glutine\"", body: "Ricevere una diagnosi di celiachia significa dover ripensare da zero la spesa e le abitudini in cucina, e nelle prime settimane la domanda più frequente è sempre la stessa: <strong>cosa posso mangiare, davvero, senza rischiare?</strong> La buona notizia è che gli alimenti naturalmente senza glutine sono moltissimi e la dieta può restare varia e gustosa. La difficoltà, semmai, sta negli alimenti trasformati, dove il glutine può nascondersi in ingredienti che non ti aspetteresti, come addensanti, dadi da brodo o salse pronte." },
      { h2: "Gli alimenti sempre sicuri per un celiaco", body: "Questi sono i gruppi di alimenti su cui puoi contare senza pensieri, naturalmente privi di glutine.", h3: [
        { title: "Cereali e farine senza glutine", body: "Riso, mais, grano saraceno, quinoa, amaranto, miglio e le farine da essi derivate sono naturalmente privi di glutine e rappresentano la base sicura della dieta di un celiaco, purché non contaminati durante la lavorazione o il confezionamento." },
        { title: "Frutta, verdura, carne e pesce freschi", body: "Frutta e verdura fresche, carne, pesce e uova al naturale non contengono glutine: il rischio compare solo se vengono impanati, infarinati o cucinati insieme ad alimenti contenenti glutine sulla stessa superficie." },
        { title: "Legumi e frutta secca", body: "Legumi come ceci, lenticchie e fagioli, così come la frutta secca al naturale, sono sicuri e rappresentano un'ottima fonte di proteine vegetali e fibre nella dieta gluten free." },
      ] },
      { h2: "Gli alimenti da evitare sempre", body: "Al contrario, questi alimenti contengono glutine per natura e vanno sempre esclusi dalla dieta di un celiaco.", h3: [
        { title: "Grano, orzo, segale e derivati", body: "Frumento, farro, orzo, segale, kamut e i loro derivati (pane, pasta, pizza, biscotti tradizionali) contengono glutine e vanno sempre evitati, a meno che non siano espressamente formulati e certificati senza glutine." },
        { title: "L'avena: un caso a parte", body: "L'avena non contiene glutine in natura, ma viene spesso contaminata durante la coltivazione o la lavorazione: va consumata solo se certificata specificamente \"senza glutine\" sulla confezione." },
      ] },
      { h2: "Gli alimenti a rischio nascosto: quando serve leggere l'etichetta", body: "Alcuni prodotti trasformati possono contenere glutine anche se non è affatto scontato: <ul><li><strong>Salse e condimenti pronti</strong>, spesso addensati con farina di frumento.</li><li><strong>Dadi da brodo e preparati per minestre</strong>, che possono contenere amido di frumento.</li><li><strong>Salumi e affettati</strong>, in cui il glutine può comparire come addensante o aromatizzante.</li><li><strong>Gelati e dolci industriali</strong>, per la presenza di cialde, biscotti sbriciolati o addensanti a base di frumento.</li><li><strong>Birra tradizionale</strong>, prodotta con orzo maltato, a differenza delle birre gluten free certificate.</li></ul> In tutti questi casi, la regola d'oro resta una sola: <strong>controllare sempre l'etichetta</strong> o consultare il Prontuario degli Alimenti AIC prima di acquistare." },
      { h2: "Come riconoscere un prodotto sicuro: la Spiga Barrata e le diciture in etichetta", body: "Il marchio della Spiga Barrata, gestito da AIC, è il modo più rapido per individuare un prodotto verificato annualmente sullo scaffale. In alternativa, la dicitura \"senza glutine\" è regolamentata a livello europeo e garantisce un contenuto inferiore a 20 ppm, la soglia di sicurezza riconosciuta anche dai celiaci più sensibili." },
    ],
    faqs: [
      { question: "Un celiaco può mangiare riso e mais senza problemi?", answer: "Sì, riso e mais sono naturalmente privi di glutine e rappresentano una base sicura della dieta, a patto che non siano stati lavorati in stabilimenti a rischio di contaminazione incrociata con cereali contenenti glutine." },
      { question: "L'avena senza glutine esiste davvero?", answer: "Sì, esistono varietà di avena coltivate e lavorate in filiere dedicate, certificate \"senza glutine\" in etichetta: solo queste sono sicure per i celiaci, l'avena comune va invece evitata per il rischio di contaminazione." },
      { question: "Come faccio a sapere se un prodotto trasformato contiene glutine nascosto?", answer: "Controlla sempre la lista ingredienti e cerca la dicitura \"senza glutine\" o il marchio della Spiga Barrata: in caso di dubbio, il Prontuario AIC è lo strumento più affidabile per verificare migliaia di prodotti." },
    ],
  },
  {
    title: "Quanto costa la dieta senza glutine: guida a costi, buoni pasto AIC e detrazioni fiscali",
    category: "Guide",
    excerpt: "Quanto spende in più chi segue una dieta senza glutine, come funzionano il tesserino AIC e i buoni pasto in farmacia, e quali detrazioni fiscali spettano ai celiaci in Italia.",
    coverSeed: 117, author: "Marco Bianchi", authorRole: "Content specialist food safety", publishedAt: "2026-07-12",
    tags: ["celiachia", "buoni pasto", "guide", "diritti"],
    keyTakeaways: [
      "I prodotti senza glutine costano in media dal 2 al 4 volte di più rispetto agli equivalenti con glutine, soprattutto pane e pasta.",
      "Il Servizio Sanitario Nazionale eroga un buono mensile spendibile in farmacia e nei negozi convenzionati per l'acquisto di prodotti sostitutivi certificati.",
      "L'importo del buono varia in base a età e sesso ed è aggiornato periodicamente dal Ministero della Salute.",
      "Alcune spese sanitarie collegate alla celiachia sono inoltre detraibili nella dichiarazione dei redditi.",
    ],
    sections: [
      { h2: "Perché la dieta senza glutine costa di più", body: "Chi riceve una diagnosi di celiachia si scontra presto con una realtà pratica: i prodotti senza glutine, in particolare pane, pasta e prodotti da forno, hanno un prezzo mediamente più alto rispetto agli equivalenti tradizionali, a causa di filiere produttive dedicate, controlli più severi e volumi di produzione inferiori. Conoscere gli strumenti di supporto economico previsti dal Servizio Sanitario Nazionale aiuta a gestire questa spesa senza rinunciare alla qualità o alla sicurezza alimentare." },
      { h2: "Il tesserino AIC e il buono mensile per prodotti senza glutine", body: "Ecco come funziona nella pratica il principale strumento di sostegno economico per i celiaci in Italia.", h3: [
        { title: "Come si ottiene il buono mensile", body: "Dopo la diagnosi di celiachia, il medico specialista rilascia una certificazione che permette di richiedere presso la propria ASL di riferimento un buono mensile, utilizzabile in farmacia e nei negozi convenzionati per l'acquisto di prodotti sostitutivi senza glutine inseriti nel Prontuario AIC." },
        { title: "Quanto vale il buono e come si usa", body: "L'importo varia in base a fasce di età e sesso, definite e aggiornate dal Ministero della Salute, ed è generalmente più alto per gli adolescenti in fase di crescita. Il buono viene caricato su tessera sanitaria o tramite elenco cartaceo, a seconda della regione di residenza, ed è utilizzabile solo per prodotti effettivamente inseriti nel Prontuario." },
      ] },
      { h2: "Le detrazioni fiscali collegate alla celiachia", body: "Oltre al buono mensile, alcune spese sanitarie strettamente collegate alla gestione della celiachia, come visite specialistiche o esami diagnostici non coperti dal SSN, possono rientrare tra le spese detraibili nella dichiarazione dei redditi: è sempre consigliato conservare le ricevute e verificare con un commercialista o CAF le voci effettivamente detraibili nell'anno fiscale di riferimento." },
      { h2: "Come risparmiare senza rinunciare alla sicurezza", body: "Qualche accorgimento aiuta a contenere la spesa senza mai scendere a compromessi sulla sicurezza alimentare: <ul><li><strong>Usa sempre il buono mensile</strong> per i prodotti di base come pane, pasta e farine, dove il risparmio è maggiore.</li><li><strong>Punta su alimenti naturalmente senza glutine</strong> come riso, mais, legumi e verdure, spesso più economici dei prodotti sostitutivi confezionati.</li><li><strong>Confronta i prezzi tra farmacia, supermercato e negozi specializzati</strong>, che possono variare sensibilmente sullo stesso prodotto.</li><li><strong>Cucina in casa quando possibile</strong>, ad esempio la pasta fresca, per ridurre il costo dei prodotti pronti.</li></ul>" },
    ],
    faqs: [
      { question: "A chi spetta il buono mensile per prodotti senza glutine?", answer: "Il buono spetta a tutte le persone con diagnosi di celiachia o dermatite erpetiforme certificata da uno specialista, richiedibile presso la ASL di residenza indipendentemente dall'età." },
      { question: "Il buono copre tutta la spesa per i prodotti senza glutine?", answer: "Non sempre: l'importo è calcolato su base mensile e per fasce di età, quindi può non coprire l'intera spesa, soprattutto per famiglie con più consumi o esigenze particolari." },
      { question: "Le spese per mangiare al ristorante senza glutine sono detraibili?", answer: "No, il buono e le detrazioni fiscali riguardano principalmente i prodotti sostitutivi acquistati in farmacia o nei negozi convenzionati e alcune spese sanitarie, non i pasti al ristorante." },
    ],
  },
  {
    title: "Sensibilità al glutine o celiachia? Le differenze che devi conoscere",
    category: "Celiachia",
    excerpt: "Celiachia, sensibilità al glutine non celiaca e allergia al grano non sono la stessa cosa: ecco come si distinguono sintomi, diagnosi e gestione di ciascuna condizione.",
    coverSeed: 118, author: "Dott.ssa Elena Rossi", authorRole: "Biologa nutrizionista", publishedAt: "2026-07-05",
    tags: ["celiachia", "sensibilità al glutine", "salute"],
    keyTakeaways: [
      "La celiachia è una malattia autoimmune con danno intestinale documentabile, la sensibilità al glutine no.",
      "La sensibilità al glutine non celiaca provoca sintomi simili ma senza gli anticorpi né il danno ai villi tipici della celiachia.",
      "L'allergia al grano è una terza condizione distinta, di tipo immunitario ma non autoimmune, con reazioni anche rapide dopo l'ingestione.",
      "Solo la diagnosi medica, non l'autovalutazione dei sintomi, può distinguere con certezza tra le tre condizioni.",
    ],
    sections: [
      { h2: "Perché è facile confondere celiachia e sensibilità al glutine", body: "Gonfiore, stanchezza, mal di testa e fastidi intestinali dopo aver mangiato alimenti con glutine possono avere origini molto diverse tra loro, ed è comune che chi li sperimenta si chieda se si tratti di celiachia, di una semplice sensibilità o di qualcos'altro. Distinguere correttamente queste condizioni non è solo una questione di terminologia: cambia radicalmente il percorso diagnostico e la gestione quotidiana." },
      { h2: "Celiachia: una malattia autoimmune con danno documentabile", body: "La celiachia è una condizione autoimmune in cui il glutine scatena una risposta del sistema immunitario che danneggia i villi intestinali, un danno rilevabile con esami del sangue specifici e confermabile con biopsia duodenale. È l'unica delle tre condizioni per cui esiste un percorso diagnostico oggettivo e standardizzato a livello internazionale." },
      { h2: "Sensibilità al glutine non celiaca: sintomi simili, meccanismo diverso", body: "Una condizione reale ma ancora meno conosciuta della celiachia, che merita di essere distinta con attenzione.", h3: [
        { title: "Come si manifesta", body: "Chi soffre di sensibilità al glutine non celiaca può avere sintomi molto simili alla celiachia, come gonfiore, dolore addominale e stanchezza, ma senza gli anticorpi specifici della celiachia né danni ai villi intestinali riscontrabili in biopsia." },
        { title: "Come si arriva alla diagnosi", body: "Non esiste un test specifico per la sensibilità al glutine: la diagnosi si raggiunge per esclusione, dopo aver escluso celiachia e allergia al grano con gli esami appropriati, osservando poi il miglioramento dei sintomi con una dieta priva di glutine." },
      ] },
      { h2: "Allergia al grano: una terza condizione, da non confondere con le prime due", body: "L'allergia al grano è una reazione del sistema immunitario mediata da anticorpi IgE, simile ad altre allergie alimentari, che può manifestarsi anche rapidamente dopo l'ingestione con sintomi come orticaria, gonfiore o, nei casi più gravi, difficoltà respiratorie. A differenza della celiachia, non riguarda solo il glutine ma le proteine del grano nel loro complesso, e si diagnostica con test allergologici specifici come prick test o dosaggio delle IgE specifiche." },
      { h2: "Perché la diagnosi medica è sempre indispensabile", body: "Eliminare il glutine dalla dieta senza una diagnosi chiara comporta più di un rischio concreto: <ul><li><strong>Rende impossibile la diagnosi di celiachia</strong>, che richiede la presenza di glutine nella dieta al momento degli esami.</li><li><strong>Può mascherare altre condizioni</strong> che richiedono un trattamento specifico e diverso dalla sola dieta.</li><li><strong>Rischia di portare a una dieta sbilanciata</strong> se avviata senza il supporto di uno specialista o nutrizionista.</li></ul> Per questo, davanti a sintomi persistenti dopo il consumo di glutine, il primo passo dovrebbe sempre essere una valutazione medica, non l'eliminazione autonoma del glutine dalla dieta." },
    ],
    faqs: [
      { question: "La sensibilità al glutine è pericolosa quanto la celiachia?", answer: "No, la sensibilità al glutine non celiaca non provoca il danno autoimmune ai villi intestinali tipico della celiachia, anche se i sintomi percepiti possono essere ugualmente fastidiosi nella vita quotidiana." },
      { question: "Posso fare il test per la sensibilità al glutine da solo?", answer: "No, non esiste un esame di laboratorio specifico per la sensibilità al glutine: la diagnosi richiede prima di escludere celiachia e allergia al grano con il supporto di un medico specialista." },
      { question: "Devo togliere il glutine prima di fare gli esami se sospetto la celiachia?", answer: "No, è fondamentale continuare a consumare glutine fino al termine di tutti gli accertamenti: eliminarlo in anticipo può falsare i risultati degli esami del sangue e della biopsia." },
    ],
  },
  {
    title: "I migliori ristoranti e pizzerie senza glutine a Roma: la guida completa 2026",
    category: "Guide",
    excerpt: "Dove mangiare senza glutine a Roma in sicurezza: trattorie di cucina romana, pizzerie con forno dedicato e pasticcerie certificate, tra cacio e pepe gluten free e la massima attenzione alla contaminazione crociata.",
    coverSeed: 119, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-07-25",
    tags: ["roma", "ristoranti", "pizzerie", "guide"],
    keyTakeaways: [
      "Roma offre oggi trattorie e pizzerie certificate AIC capaci di reinterpretare senza glutine anche i grandi classici, dalla cacio e pepe alla pizza romana scrocchiarella.",
      "Avvisare della celiachia già in fase di prenotazione, non solo al tavolo, aiuta lo staff a organizzarsi per tempo.",
      "I locali con cucina o forno dedicati e certificazione AIC offrono le maggiori garanzie contro la contaminazione crociata.",
      "Nei weekend e nei quartieri più turistici, prenotare con anticipo è quasi sempre necessario.",
    ],
    sections: [
      { h2: "Mangiare senza glutine a Roma: tra grandi classici e paura della contaminazione", body: "Cacio e pepe, amatriciana, supplì: la cucina romana è tra le più amate d'Italia, ma per chi è celiaco può sembrare anche tra le più difficili da affrontare in sicurezza, viste le tante preparazioni a base di pasta fresca e frittura condivisa. La buona notizia è che <strong>Roma conta oggi un numero crescente di locali certificati</strong>, capaci di reinterpretare senza glutine anche i piatti più tradizionali. In questa guida raccogliamo i nostri indirizzi di fiducia, verificati dalla community di Mappa Senza Glutine, per aiutarti a scoprire dove mangiare senza glutine a Roma senza rinunciare alla tradizione né alla sicurezza." },
      { h2: "Domande frequenti su dove mangiare senza glutine a Roma", body: "Prima di partire con gli indirizzi, rispondiamo alle domande che ci fanno più spesso i celiaci in visita o residenti in città.", h3: [
        { title: "Dove posso mangiare senza glutine in sicurezza a Roma?", body: "A Roma i locali più sicuri sono quelli con certificazione AIC, cucina o forno dedicati e un buon riscontro tra i celiaci, come Il Secchio e l'Olivaro o Fornerie Alessandrino. Evita i locali che offrono solo \"opzioni gluten free\" generiche senza controlli specifici sulla contaminazione: verifica sempre sulla directory di Mappa Senza Glutine prima di prenotare." },
        { title: "È rischioso mangiare fuori a Roma se sono celiaco?", body: "Non è rischioso se scegli locali attrezzati con procedure anti-contaminazione verificate, sempre più diffusi anche nei quartieri più turistici. Il rischio aumenta nelle trattorie generiche che aggiungono piatti \"senza glutine\" al menu senza formare lo staff o separare gli strumenti di cottura: informarsi prima resta la regola d'oro." },
        { title: "Come faccio a trovare velocemente un ristorante senza glutine vicino a me a Roma?", body: "Il modo più rapido è usare una directory geolocalizzata con filtri per certificazione AIC e categoria di locale. Cercare solo su Google Maps generico spesso restituisce locali non verificati: meglio affidarsi a fonti come la nostra, che raccolgono segnalazioni reali della community celiaca." },
      ] },
      { h2: "Le migliori pizzerie senza glutine a Roma", body: "La pizza romana, sottile e scrocchiarella, richiede un impasto delicato da gestire: per questo cerchiamo sempre locali con <strong>forno separato o dedicato</strong> alle pizze gluten free.", h3: [
        { title: "Il Secchio e l'Olivaro", body: "Nel quartiere Ostiense, <a href=\"/directory/il-secchio-e-l-olivaro-roma\">Il Secchio e l'Olivaro</a> è una pizzeria e bruschetteria attiva dal 1999, nota per le pizze alte cotte in <strong>forno a legna</strong>: propone un menu senza glutine preparato in un laboratorio dedicato.", image: { src: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=800&q=75", alt: "Pizza alta appena sfornata" } },
      ] },
      { h2: "Ristoranti e trattorie senza glutine a Roma: dove sedersi senza pensieri", body: "Per una cena più strutturata, questo è il locale che consigliamo a chi cerca il massimo della tranquillità in fatto di contaminazione crociata.", h3: [
        { title: "Fornerie Alessandrino", body: "Nel quartiere Alessandrino, <a href=\"/directory/fornerie-alessandrino-roma\">Fornerie Alessandrino</a> unisce ristorante, braceria, pizzeria e hamburgheria con una <strong>cucina interamente certificata AIC</strong> e separata dal resto della struttura: propone pizza, griglia e hamburger senza glutine, oltre a opzioni vegan e senza lattosio.", image: { src: "https://images.unsplash.com/photo-1428515613728-6b4607e44363?auto=format&fit=crop&w=800&q=75", alt: "Tavola con piatti in ristorante" } },
      ] },
      { h2: "Pasticcerie e colazioni senza glutine a Roma", body: "Anche la colazione può diventare un momento di relax, non di ansia: cerca laboratori con un angolo o un forno interamente dedicato al senza glutine, verificato da certificazione AIC o da recensioni reali della community, prima di scegliere dove fare colazione. Sulla directory di Mappa Senza Glutine trovi le pasticcerie e i bar di Roma verificati, aggiornati man mano che nuovi locali vengono controllati." },
      { h2: "AIC, menu e cucina dedicata: le domande tecniche sulla sicurezza", body: "Dopo aver visto i locali, è utile capire cosa distingue davvero un'esperienza sicura da una rischiosa a Roma.", h3: [
        { title: "Qual è la differenza tra un locale certificato AIC e uno non certificato?", body: "Un locale certificato AIC ha superato controlli annuali su procedure, fornitori e formazione del personale sulla contaminazione crociata. Un locale non certificato può comunque risultare sicuro, ma la garanzia si basa solo sull'esperienza diretta di chi lo ha provato: la certificazione riduce sensibilmente il margine di errore." },
        { title: "Come si legge un menu senza glutine in una trattoria romana?", body: "Un buon menu senza glutine indica chiaramente quali piatti sono \"gluten free\" e se vengono preparati in un'area dedicata o con la stessa attrezzatura usata per gli altri piatti. Se non è specificato, meglio chiedere direttamente in sala prima di ordinare, soprattutto per preparazioni complesse come la pasta fresca." },
        { title: "Perché la cucina dedicata è così importante per piatti come la cacio e pepe?", body: "Piatti come cacio e pepe o carbonara richiedono pasta fresca preparata a mano: senza un'area di lavoro dedicata, il rischio di contatto con farine di grano durante la stesura è molto alto. Una cucina separata riduce drasticamente questo rischio rispetto a una semplice variante \"senza glutine\" del piatto tradizionale." },
        { title: "Un piatto romano \"senza glutine\" può comunque contaminarsi in cottura?", body: "Sì, se cotto nella stessa acqua di cottura, friggitrice o padella usata per piatti con glutine, anche partendo da un ingrediente gluten free. Per questo, davanti a piatti come i supplì o i fritti romani, è sempre utile chiedere se la frittura avviene in olio dedicato." },
      ] },
      { h2: "Consigli pratici per mangiare senza glutine a Roma in sicurezza", body: "Qualche accorgimento in più aiuta a vivere l'esperienza senza stress, soprattutto nei quartieri più turistici della città: <ul><li><strong>Prenota in anticipo</strong>, specialmente vicino alle zone più turistiche come il centro storico, dove i tavoli si esauriscono in fretta.</li><li><strong>Avvisa sempre della celiachia</strong> già in fase di prenotazione, non solo al tavolo, così lo staff può organizzarsi per tempo.</li><li><strong>Chiedi se cucina o forno sono dedicati</strong> oppure condivisi: uno staff preparato risponderà con sicurezza e senza esitazioni.</li><li><strong>Verifica la certificazione AIC</strong> del locale, un'ulteriore garanzia di controlli periodici sulla sicurezza alimentare.</li><li><strong>Porta sempre con te qualche snack sicuro</strong>, utile per le lunghe giornate tra un monumento e l'altro.</li></ul>" },
      { h2: "Prenotazioni, asporto e bambini: le domande pratiche prima di uscire", body: "Un'ultima serie di dubbi pratici, utili per organizzare al meglio la tua uscita senza glutine a Roma.", h3: [
        { title: "È necessario prenotare in anticipo nei ristoranti senza glutine a Roma?", body: "Sì, è fortemente consigliato soprattutto nelle zone più turistiche e nei weekend, perché la cucina dedicata gestisce un numero limitato di coperti gluten free. Prenotando puoi anche avvisare in anticipo della celiachia, così lo staff si organizza prima del tuo arrivo." },
        { title: "Posso portare bambini celiaci in un ristorante senza glutine a Roma?", body: "Sì, i locali con cucina dedicata sono generalmente la scelta più sicura anche per i bambini celiaci, spesso con piatti pensati apposta per loro. È comunque utile avvisare al momento della prenotazione, specificando l'età del bambino per un servizio più attento." },
        { title: "Esistono opzioni di asporto senza glutine sicure a Roma?", body: "Sì, molti locali certificati offrono asporto preparato con le stesse procedure dedicate del servizio al tavolo, comodo anche per un pranzo veloce tra una visita e l'altra. Verifica sempre che l'imballaggio sia sigillato separatamente dagli altri ordini, per evitare contaminazioni durante il trasporto." },
      ] },
    ],
    faqs: [
      { question: "Quali sono i migliori ristoranti senza glutine a Roma?", answer: "Tra gli indirizzi di Roma segnaliamo Il Secchio e l'Olivaro a Ostiense, pizzeria con menu senza glutine dedicato, e Fornerie Alessandrino, con cucina interamente certificata AIC: entrambi presenti nella directory di Mappa Senza Glutine." },
      { question: "Come faccio a sapere se una trattoria romana è davvero sicura per celiaci?", answer: "Controlla la certificazione AIC, chiedi se cucina e forno sono dedicati o separati e affidati a recensioni verificate da altri celiaci, come quelle presenti nella nostra directory." },
      { question: "È necessario prenotare sempre nei ristoranti senza glutine a Roma?", answer: "Non è sempre obbligatorio, ma è fortemente consigliato nelle zone più turistiche e nei weekend, quando la richiesta è più alta e i posti dedicati possono esaurirsi rapidamente." },
    ],
  },
  {
    title: "Come evitare la contaminazione crociata al ristorante: la guida completa per mangiare senza glutine in sicurezza",
    category: "Guide",
    excerpt: "Come evitare la contaminazione crociata al ristorante: le domande da fare allo staff, i segnali di un locale davvero sicuro e i rischi specifici di pizzerie, ristoranti e bakery.",
    coverSeed: 120, author: "Marco Bianchi", authorRole: "Content specialist food safety", publishedAt: "2026-07-30",
    tags: ["contaminazione crociata", "sicurezza alimentare", "AIC", "ristoranti senza glutine"],
    keyTakeaways: [
      "La contaminazione crociata avviene quando anche tracce minime di glutine entrano in contatto con un piatto senza glutine tramite utensili, superfici o oli di frittura condivisi.",
      "I locali certificati AIC hanno superato controlli su procedure, fornitori e formazione dello staff, ma l'assenza di certificazione non significa automaticamente che un locale sia pericoloso.",
      "Cucina o forno dedicati, un menu chiaro e uno staff formato sono i segnali più concreti di attenzione verso la celiachia, anche in locali non certificati.",
      "Comunicare sempre la celiachia, non una generica intolleranza, resta il gesto più efficace per ridurre il rischio in qualsiasi tipo di locale.",
    ],
    sections: [
      { h2: "Cos'è la contaminazione crociata e perché fa paura a chi è celiaco", body: "Se sei celiaco, probabilmente conosci già quella sensazione: seduto al tavolo, il menu propone un piatto \"senza glutine\", ma un dubbio resta. Sapere <strong>come evitare la contaminazione crociata al ristorante</strong> è la domanda più importante da farsi prima di ordinare, perché per chi ha la celiachia anche una quantità minima di glutine, poche briciole o un utensile usato per due preparazioni diverse, può scatenare una reazione autoimmune, spesso senza sintomi visibili nell'immediato. In questa guida trovi i segnali che indicano un locale davvero sicuro, le domande giuste da fare allo staff e cosa fare se qualcosa va storto." },
      { h2: "Come evitare la contaminazione crociata al ristorante: le domande giuste prima di ordinare", body: "Prima ancora di guardare il menu, alcune domande aiutano a capire subito il livello di attenzione di un locale verso la celiachia.", h3: [
        { title: "La cucina o il forno sono dedicati?", body: "Chiedilo sempre, senza timore di sembrare invadente: un'area di lavoro o un forno usato esclusivamente per preparazioni senza glutine, separato da quello per i piatti tradizionali, è la garanzia più concreta contro la contaminazione crociata. Se la risposta è vaga, è già un primo segnale a cui prestare attenzione." },
        { title: "Come vengono puliti utensili, taglieri e piani di lavoro?", body: "Taglieri in legno, colini per la pasta e griglie sono superfici porose che trattengono facilmente residui di farina anche dopo il lavaggio: un locale attento ha in genere utensili dedicati, spesso di colore diverso per riconoscerli a colpo d'occhio, mai condivisi con le preparazioni tradizionali." },
        { title: "Lo staff conosce davvero la celiachia?", body: "Un cameriere formato sa spiegarti con naturalezza come viene gestito un ordine senza glutine, dalla cucina al servizio in sala. Se la richiesta genera esitazione o viene rimandata genericamente allo chef senza altri dettagli, è probabile che la contaminazione crociata non sia una priorità del locale." },
        { title: "Come arriva il piatto in tavola?", body: "Un piatto senza glutine dovrebbe essere riconoscibile anche visivamente, ad esempio con un segnaposto colorato o una descrizione chiara al momento del servizio, e non dovrebbe mai passare per lo stesso vassoio o la stessa friggitrice di portate con glutine. Anche per l'asporto, l'imballaggio va sigillato separatamente dagli altri ordini." },
      ] },
      { h2: "I segnali che un ristorante è davvero sicuro per i celiaci", body: "Oltre alle domande dirette, alcuni elementi oggettivi aiutano a valutare l'affidabilità di un locale ancora prima di sedersi.", h3: [
        { title: "La certificazione AIC: cosa garantisce davvero", body: "I locali certificati dall'Associazione Italiana Celiachia hanno superato controlli periodici su fornitori, procedure di cucina e formazione del personale, verifiche che si ripetono nel tempo. Non è un obbligo di legge, quindi la sua assenza non significa automaticamente che un locale sia pericoloso, ma la presenza del marchio riduce sensibilmente il margine di errore rispetto a un locale che si autodefinisce \"gluten free\" senza controlli esterni." },
        { title: "Un menu senza glutine chiaro, non generico", body: "Un buon menu senza glutine specifica quali piatti sono preparati in area dedicata e quali condividono solo l'ingrediente base con le versioni tradizionali: la differenza non è cosmetica, perché nel secondo caso il rischio di contaminazione durante la cottura resta concreto anche se l'ingrediente di partenza è privo di glutine." },
        { title: "Recensioni e segnalazioni di altri celiaci", body: "Le esperienze dirette di altre persone celiache raccontano spesso più di qualunque etichetta: i locali segnalati ripetutamente come sicuri dalla community, raccolti in directory verificate come quella di <a href=\"/directory\">Mappa Senza Glutine</a>, sono un punto di partenza più affidabile di una semplice ricerca generica su Google Maps." },
      ] },
      { h2: "Pizzerie, ristoranti à la carte e bakery: i rischi cambiano in base al locale", body: "Non tutti i locali gestiscono la contaminazione crociata allo stesso modo: il tipo di cucina influisce parecchio sul livello di attenzione richiesto.", h3: [
        { title: "Pizzerie: il forno condiviso è il primo rischio", body: "Anche con un impasto perfettamente senza glutine, infornare la pizza nello stesso forno a legna usato per impasti tradizionali espone al rischio di farina residua sulla base refrattaria: le pizzerie più attente hanno una zona di infornata separata o un forno elettrico dedicato solo alle pizze gluten free." },
        { title: "Ristoranti à la carte: attenzione a friggitrici e piani di lavoro condivisi", body: "In un ristorante con menu ampio, il rischio maggiore riguarda friggitrici uniche per patatine e altri fritti impanati, oltre ai piani di lavoro dove si stende la pasta fresca: la farina di grano che resta nell'aria o sulle superfici può depositarsi anche su preparazioni pensate per essere senza glutine." },
        { title: "Bakery e pasticcerie: la farina vola, letteralmente", body: "Nei laboratori di panificazione e pasticceria la farina tradizionale si disperde facilmente nell'aria durante le lavorazioni, motivo per cui le bakery davvero sicure per celiaci hanno spesso un laboratorio fisicamente separato, o lavorano in giornate e orari dedicati esclusivamente alla produzione senza glutine." },
      ] },
      { h2: "La checklist essenziale prima di sedersi a tavola", body: "Prima di ordinare, ripassa mentalmente questi punti: aiutano a valutare in pochi secondi il livello di attenzione di un locale verso la celiachia. <ul><li><strong>Chiedi se cucina o forno sono dedicati</strong> alle preparazioni senza glutine, non solo se \"sanno cucinare senza glutine\".</li><li><strong>Verifica la certificazione AIC</strong>, se presente, o cerca recensioni di altri celiaci sul locale.</li><li><strong>Chiedi allo staff come viene gestito l'ordine</strong>, dalla cucina fino al servizio in sala.</li><li><strong>Osserva come arriva il piatto</strong>: dovrebbe essere riconoscibile e non condividere vassoi o utensili con altre portate.</li><li><strong>Comunica sempre la celiachia</strong>, non una generica intolleranza, così lo staff comprende la reale necessità di zero contaminazione.</li></ul>" },
      { h2: "Cosa fare se sospetti una contaminazione dopo aver mangiato fuori", body: "Anche scegliendo con attenzione, può capitare di avvertire gonfiore, dolore addominale o stanchezza nelle ore successive a un pasto fuori casa: non significa necessariamente che il locale abbia sbagliato, ma vale la pena segnalarlo. Contattare il locale con calma, spiegando i sintomi e l'orario della prenotazione, aiuta lo staff a individuare eventuali falle nella procedura; se il locale è certificato AIC, l'episodio può essere segnalato anche all'associazione, che utilizza queste informazioni per i controlli successivi. Sintomi isolati non richiedono necessariamente una visita urgente, ma episodi ripetuti dopo aver mangiato fuori meritano un confronto con il proprio specialista di riferimento." },
      { h2: "Domande frequenti sulla contaminazione crociata al ristorante", body: "Le domande più comuni di chi è celiaco e vuole mangiare fuori in sicurezza.", h3: [
        { title: "Come si evita la contaminazione crociata al ristorante?", body: "Si evita scegliendo locali con cucina o forno dedicati, chiedendo allo staff come vengono gestite le preparazioni senza glutine e verificando che utensili e superfici non siano condivisi con i piatti tradizionali. Nessuna di queste precauzioni da sola azzera il rischio, ma insieme lo riducono in modo significativo, soprattutto se il locale gestisce ordini per celiaci con regolarità." },
        { title: "I ristoranti non certificati AIC sono sicuri per i celiaci?", body: "Possono esserlo, ma la sicurezza dipende interamente dall'esperienza diretta e dalle procedure interne, senza una verifica esterna periodica a garantirle. La certificazione AIC non è un obbligo di legge, quindi molti locali sicuri semplicemente non l'hanno richiesta: informarsi su cucina dedicata e formazione dello staff resta comunque indispensabile, certificazione o meno." },
        { title: "Basta ordinare il piatto \"senza glutine\" dal menu per essere al sicuro?", body: "No, non sempre: un piatto segnalato come \"senza glutine\" può comunque contaminarsi se cotto con la stessa acqua, friggitrice o griglia usata per alimenti con glutine. L'etichetta sul menu indica l'assenza di glutine tra gli ingredienti, non necessariamente l'assenza di rischio durante la preparazione." },
        { title: "Quanta contaminazione serve per stare male se sono celiaco?", body: "Bastano quantità minime, anche pochi milligrammi di glutine, per scatenare una risposta immunitaria in una persona celiaca, motivo per cui la normativa europea fissa la soglia \"senza glutine\" a non più di 20 mg/kg (20 ppm) di prodotto. Per questo la contaminazione crociata resta pericolosa anche quando sembra trascurabile, indipendentemente dai sintomi percepiti nell'immediato." },
      ] },
    ],
    faqs: [
      { question: "Come si evita la contaminazione crociata al ristorante?", answer: "Scegliendo locali con cucina o forno dedicati, chiedendo allo staff come vengono gestite le preparazioni senza glutine e verificando che utensili e superfici non siano condivisi con i piatti tradizionali." },
      { question: "I ristoranti non certificati AIC sono sicuri per i celiaci?", answer: "Possono esserlo, ma senza una verifica esterna periodica la sicurezza dipende solo dall'esperienza diretta e dalle procedure interne del locale: informarsi su cucina dedicata e formazione dello staff resta indispensabile." },
      { question: "Basta ordinare il piatto \"senza glutine\" dal menu per essere al sicuro?", answer: "No: un piatto segnalato come \"senza glutine\" può comunque contaminarsi se cotto con la stessa acqua, friggitrice o griglia usata per alimenti con glutine." },
      { question: "Quanta contaminazione serve per stare male se sono celiaco?", answer: "Bastano quantità minime, anche pochi milligrammi di glutine: la normativa europea fissa la soglia \"senza glutine\" a non più di 20 mg/kg (20 ppm) di prodotto." },
    ],
  },
  {
    title: "McDonald's senza glutine in Italia: cosa può mangiare davvero un celiaco",
    category: "Guide",
    excerpt: "McDonald's senza glutine in Italia: cosa garantisce davvero il Gluten Free Burger, perché la catena non è certificata AIC e quali altri prodotti comportano un rischio di contaminazione crociata.",
    coverSeed: 121, author: "Marco Bianchi", authorRole: "Content specialist food safety", publishedAt: "2026-07-30",
    tags: ["McDonald's", "fast food", "sicurezza alimentare", "AIC"],
    keyTakeaways: [
      "Il Gluten Free Burger, sviluppato con Dr. Schär, è l'unico prodotto del menu McDonald's Italia esplicitamente garantito senza glutine.",
      "McDonald's Italia non aderisce al programma Alimentazione Fuori Casa dell'AIC, che quindi non verifica le sue procedure di preparazione.",
      "Patatine, insalate e alcuni gelati non contengono glutine tra gli ingredienti, ma McDonald's non ne garantisce l'assenza di contaminazione crociata.",
      "Per un pasto fuori casa con le massime garanzie, i locali certificati AIC o con cucina dedicata restano la scelta più sicura per i celiaci.",
    ],
    sections: [
      { h2: "McDonald's senza glutine in Italia: cosa dice davvero l'azienda", body: "Chi cerca informazioni su McDonald's senza glutine in Italia trova spesso indicazioni contrastanti online: c'è chi dice che i celiaci possono mangiarci tranquillamente, chi lo sconsiglia del tutto. La realtà, verificata sulle fonti ufficiali di McDonald's Italia e dell'Associazione Italiana Celiachia (AIC), è più sfumata: un solo prodotto del menu è garantito senza glutine, mentre il resto comporta un margine di rischio che l'azienda stessa non è in grado di escludere." },
      { h2: "Il Gluten Free Burger: l'unico prodotto davvero garantito", body: "Il Gluten Free Burger, sviluppato da McDonald's Italia in collaborazione con Dr. Schär, è l'unico prodotto del menu esplicitamente garantito senza glutine: il panino rispetta i limiti previsti dalla normativa europea per l'etichettatura \"senza glutine\", non oltre 20 mg/kg (20 ppm) di prodotto. A livello di composizione dell'ingrediente, è quindi un'opzione verificata per chi è celiaco." },
      { h2: "McDonald's e la certificazione AIC: perché non c'è", body: "A differenza dei locali certificati AIC che trovi nella nostra directory, McDonald's Italia non aderisce al programma Alimentazione Fuori Casa (AFC) dell'Associazione Italiana Celiachia. Questo significa che l'AIC non si esprime sull'idoneità degli alimenti serviti, sulle procedure di preparazione né sulla formazione del personale nei punti vendita. L'azienda comunica autonomamente le informazioni su allergeni e composizione dei prodotti, tramite il proprio sito e nei ristoranti, ma senza una verifica esterna periodica come quella prevista dal marchio AIC." },
      { h2: "Patatine, insalate e gelati: perché non sono garantiti nonostante non contengano glutine tra gli ingredienti", body: "Diversi prodotti del menu non contengono glutine come ingrediente, ma questo non basta a renderli sicuri per un celiaco in un ambiente di cucina condiviso.", h3: [
        { title: "Le patatine fritte", body: "Le patatine di McDonald's non contengono glutine tra gli ingredienti, ma vengono fritte in un ambiente di cucina condiviso: l'azienda stessa non garantisce l'assenza di contaminazione crociata, soprattutto nei periodi in cui le friggitrici vengono utilizzate anche per altri prodotti impanati. Il consiglio ufficiale è chiedere sempre al personale del punto vendita prima di ordinare." },
        { title: "Insalate e gelati", body: "Anche le insalate verdi senza pollo e alcuni gelati non contengono glutine come ingrediente, ma condividono superfici, utensili o macchinari con altri prodotti del menu: per questo McDonald's non può garantirne la totale sicurezza per i celiaci, allo stesso modo delle patatine." },
      ] },
      { h2: "Quindi McDonald's è sicuro per un celiaco?", body: "Dipende da quanto rischio sei disposto ad accettare. Il Gluten Free Burger, preso da solo, è un'opzione verificata in termini di composizione. Il resto del menu, incluse le patatine, comporta invece un margine di rischio che McDonald's stesso non azzera, per l'assenza di una cucina dedicata e di una certificazione AIC. Chi ha una celiachia particolarmente sensibile alla contaminazione crociata, o sta valutando dove mangiare fuori con la massima tranquillità, trova generalmente più garanzie nei locali certificati AIC o con cucina dedicata, come quelli raccolti nella <a href=\"/directory\">directory di Mappa Senza Glutine</a>." },
      { h2: "Domande frequenti su McDonald's e la dieta senza glutine", body: "Le domande più cercate su McDonald's e celiachia in Italia.", h3: [
        { title: "Il Gluten Free Burger di McDonald's è davvero senza glutine?", body: "Sì, il panino rispetta i limiti di legge per l'etichettatura \"senza glutine\" (non oltre 20 mg/kg), grazie alla collaborazione tra McDonald's Italia e Dr. Schär nello sviluppo del prodotto. Riguarda però solo la composizione del panino, non l'intero ambiente di preparazione del punto vendita." },
        { title: "McDonald's è certificato AIC?", body: "No, McDonald's Italia non aderisce al programma Alimentazione Fuori Casa dell'Associazione Italiana Celiachia, che quindi non si esprime sulla sicurezza delle sue preparazioni né sulla formazione del personale nei ristoranti." },
        { title: "Le patatine di McDonald's sono sicure per i celiaci?", body: "Non sono garantite: pur non contenendo glutine tra gli ingredienti, McDonald's stessa non esclude la contaminazione crociata durante la frittura in un ambiente di cucina condiviso, specialmente quando le friggitrici sono usate anche per altri prodotti impanati." },
        { title: "Dove trovo l'elenco degli allergeni dei prodotti McDonald's?", body: "L'elenco completo è disponibile sul sito ufficiale di McDonald's Italia, alla pagina dedicata agli allergeni, e nei singoli punti vendita, aggiornato periodicamente dall'azienda." },
      ] },
    ],
    faqs: [
      { question: "Il Gluten Free Burger di McDonald's è davvero senza glutine?", answer: "Sì, il panino rispetta i limiti di legge per l'etichettatura \"senza glutine\" (non oltre 20 mg/kg), sviluppato da McDonald's Italia in collaborazione con Dr. Schär." },
      { question: "McDonald's è certificato AIC?", answer: "No, McDonald's Italia non aderisce al programma Alimentazione Fuori Casa dell'Associazione Italiana Celiachia, che quindi non verifica le sue procedure di preparazione." },
      { question: "Le patatine di McDonald's sono sicure per i celiaci?", answer: "Non sono garantite: non contengono glutine tra gli ingredienti, ma McDonald's non esclude la contaminazione crociata durante la frittura in cucina condivisa." },
      { question: "Dove trovo l'elenco degli allergeni dei prodotti McDonald's?", answer: "Sul sito ufficiale di McDonald's Italia, alla pagina dedicata agli allergeni, e nei singoli punti vendita." },
    ],
  },
  {
    title: "Gelaterie senza glutine: come riconoscere quelle davvero senza contaminazione crociata",
    category: "Guide",
    excerpt: "Gelaterie senza glutine: come capire se palette, vaschette e coni sono davvero sicuri per un celiaco, quali gusti evitare e perché l'estate aumenta il rischio di contaminazione crociata.",
    coverSeed: 122, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-07-30",
    tags: ["gelaterie", "estate", "contaminazione crociata", "sicurezza alimentare"],
    keyTakeaways: [
      "Il rischio principale nelle gelaterie non certificate è la contaminazione tramite palette e vaschette condivise tra gusti con glutine e gusti senza glutine.",
      "Le gelaterie davvero sicure usano palette dedicate per ogni gusto, o le puliscono a ogni utilizzo tra un gusto e l'altro.",
      "Anche coni, cialde e coppette possono essere fonte di contaminazione se non certificati senza glutine.",
      "Le gelaterie certificate AIC o segnalate come sicure nella directory offrono le maggiori garanzie, soprattutto nei mesi estivi quando l'afflusso è più alto.",
    ],
    sections: [
      { h2: "Perché una gelateria può essere rischiosa per un celiaco", body: "Il gelato artigianale, di per sé, è spesso naturalmente senza glutine: latte, panna, zucchero e frutta non ne contengono. Il problema nelle gelaterie senza glutine non è quasi mai l'ingrediente di base, ma la contaminazione crociata durante la preparazione e il servizio: palette che passano da un gusto al biscotto a uno alla crema, vaschette vicine senza separazione, coni non certificati. Capire dove si nasconde davvero il rischio è il primo passo per scegliere con sicurezza." },
      { h2: "Gelaterie senza glutine: cosa chiedere prima di ordinare", body: "Poche domande dirette allo staff aiutano a capire subito il livello di attenzione della gelateria.", h3: [
        { title: "Le palette sono dedicate o condivise?", body: "È la domanda più importante: se la stessa paletta viene usata per un gusto con biscotto sbriciolato e poi per un gusto \"senza glutine\", la contaminazione è quasi inevitabile. Le gelaterie più attente usano una paletta diversa per ogni vaschetta, o la puliscono accuratamente tra un gusto e l'altro." },
        { title: "Il gelato alla base è senza glutine?", body: "Alcuni gusti apparentemente semplici possono contenere glutine nascosto, ad esempio come addensante o negli aromi: chiedere conferma allo staff, soprattutto per gusti creme e non alla frutta, evita sorprese." },
        { title: "Coni, cialde e coppette sono certificati?", body: "Il cono tradizionale contiene glutine: se non viene offerta un'alternativa certificata senza glutine, meglio optare per la coppetta, verificando comunque che non sia stata a contatto con briciole di cono nella stessa area di servizio." },
      ] },
      { h2: "I segnali di una gelateria davvero sicura per celiaci", body: "Alcuni elementi aiutano a riconoscere una gelateria affidabile ancora prima di ordinare.", h3: [
        { title: "Certificazione AIC", body: "Le gelaterie certificate AIC hanno superato controlli su procedure e formazione del personale specifici per la celiachia, con verifiche periodiche nel tempo. Non è un obbligo di legge, quindi la sua assenza non significa automaticamente rischio, ma la presenza del marchio è una garanzia in più." },
        { title: "Vaschette e gusti separati fisicamente", body: "Le gelaterie più attente dedicano un'area separata, o quantomeno ben distanziata, ai gusti senza glutine, riducendo il rischio di contatto accidentale durante il servizio nelle ore di maggiore affluenza." },
        { title: "Staff che sa rispondere senza esitazioni", body: "Un addetto formato risponde con sicurezza alle domande su palette, vaschette e coni. Se la richiesta genera esitazione o una risposta vaga, è un segnale a cui prestare attenzione." },
      ] },
      { h2: "Attenzione ai gusti più a rischio", body: "Alcuni gusti richiedono più attenzione di altri: quelli con biscotto sbriciolato, wafer, cialde o croccante alle nocciole comportano un rischio maggiore, perché gli ingredienti solidi possono lasciare residui nella paletta o nella vaschetta usata poi per altri gusti. Anche il malto e alcuni topping pronti possono contenere glutine: in caso di dubbio, meglio orientarsi su gusti alla frutta o creme semplici, verificati direttamente con lo staff." },
      { h2: "Perché l'estate aumenta il rischio di contaminazione", body: "Nei mesi estivi le gelaterie gestiscono un afflusso molto più alto rispetto al resto dell'anno, spesso con personale stagionale meno formato sulla gestione della celiachia. La fretta del servizio nelle ore di punta aumenta il rischio di errori nell'uso di palette e vaschette: è il momento in cui vale ancora di più scegliere locali verificati, come quelli segnalati nella <a href=\"/directory?categoria=gelateria\">directory di Mappa Senza Glutine</a>, invece di affidarsi a una gelateria scelta a caso." },
      { h2: "Domande frequenti sulle gelaterie senza glutine", body: "Le domande più comuni di chi è celiaco e cerca un gelato sicuro.", h3: [
        { title: "Il gelato alla frutta è sempre senza glutine?", body: "Nella maggior parte dei casi sì, ma non è garantito automaticamente: il rischio principale resta la contaminazione tramite palette o vaschette condivise con gusti a base di biscotto o cialde, indipendentemente dall'ingrediente di partenza." },
        { title: "Come faccio a sapere se una gelateria è sicura per celiaci?", body: "Verifica se è certificata AIC, chiedi allo staff se le palette sono dedicate o pulite tra un gusto e l'altro, e osserva se le vaschette senza glutine sono separate fisicamente dalle altre." },
        { title: "Il cono tradizionale contiene glutine?", body: "Sì, il cono classico è a base di farina di frumento e contiene glutine: se la gelateria non offre un'alternativa certificata, la coppetta resta la scelta più sicura." },
        { title: "Perché d'estate è più rischioso mangiare un gelato senza glutine?", body: "Perché l'afflusso di clienti aumenta e spesso lavora personale stagionale meno formato: la fretta del servizio nelle ore di punta alza il rischio di contaminazione accidentale tra palette e vaschette." },
      ] },
    ],
    faqs: [
      { question: "Il gelato alla frutta è sempre senza glutine?", answer: "Nella maggior parte dei casi sì, ma il rischio principale resta la contaminazione tramite palette o vaschette condivise con gusti a base di biscotto o cialde." },
      { question: "Come faccio a sapere se una gelateria è sicura per celiaci?", answer: "Verifica se è certificata AIC, chiedi se le palette sono dedicate o pulite tra un gusto e l'altro, e controlla che le vaschette senza glutine siano separate dalle altre." },
      { question: "Il cono tradizionale contiene glutine?", answer: "Sì, il cono classico contiene farina di frumento: se non c'è un'alternativa certificata, la coppetta è la scelta più sicura." },
      { question: "Perché d'estate è più rischioso mangiare un gelato senza glutine?", answer: "Perché l'afflusso aumenta e spesso lavora personale stagionale meno formato, con più rischio di contaminazione accidentale nelle ore di punta." },
    ],
  },
  {
    title: "Hotel e villaggi turistici certificati AIC per celiaci: come scegliere una vacanza senza pensieri",
    category: "Viaggi",
    excerpt: "Hotel e villaggi turistici certificati AIC: cosa garantisce davvero la certificazione, la differenza tra colazione e pensione completa, e come organizzare una vacanza senza glutine senza sorprese.",
    coverSeed: 123, author: "Marco Bianchi", authorRole: "Travel writer", publishedAt: "2026-07-30",
    tags: ["hotel", "viaggi", "AIC", "vacanze"],
    keyTakeaways: [
      "Un hotel certificato AIC garantisce una colazione senza glutine sicura e staff formato sulla celiachia, non solo generiche \"opzioni gluten free\".",
      "Nei villaggi con pensione completa la certificazione riguarda l'intera gestione dei pasti in cucina, non solo la colazione.",
      "Anche senza certificazione, alcune strutture offrono cucine attrezzate in camera o accordi con ristoranti certificati nelle vicinanze.",
      "Prenotare con anticipo e segnalare la celiachia al momento della prenotazione, non all'arrivo, resta la regola d'oro per una vacanza senza sorprese.",
    ],
    sections: [
      { h2: "Hotel certificati AIC: perché fanno la differenza in vacanza", body: "In vacanza, la gestione della celiachia cambia rispetto alla routine di casa: non hai la tua cucina, mangi fuori più spesso e spesso in strutture che non conosci. Scegliere hotel e villaggi turistici certificati AIC per celiaci significa affidarsi a strutture che hanno superato controlli specifici su colazione, gestione della cucina e formazione del personale, invece di scoprire all'arrivo se la struttura è davvero attrezzata. In questa guida vediamo cosa garantisce realmente la certificazione e come organizzare una vacanza senza pensieri." },
      { h2: "Cosa garantisce davvero un hotel certificato AIC", body: "La certificazione non è un'etichetta generica: copre aspetti specifici e verificabili della struttura.", h3: [
        { title: "Colazione senza glutine sicura", body: "Pane, biscotti, cereali e dolci senza glutine preparati o conservati separatamente dagli altri prodotti, per evitare la contaminazione crociata tipica dei buffet condivisi." },
        { title: "Staff formato sulla celiachia", body: "Il personale di sala e cucina riceve una formazione specifica su come gestire richieste e preparazioni senza glutine, riducendo il rischio di errori dovuti a disattenzione o scarsa conoscenza del tema." },
        { title: "Cucina attrezzata per pasti completi", body: "Nelle strutture con ristorante interno, la certificazione può coprire anche pranzo e cena, con piatti preparati evitando il contatto con ingredienti contenenti glutine." },
      ] },
      { h2: "Villaggi turistici e pensione completa: cosa cambia rispetto a un hotel classico", body: "Nei villaggi con pensione completa la gestione della celiachia è più complessa, perché coinvolge tutti i pasti della giornata, spesso in formula buffet.", h3: [
        { title: "Il rischio dei buffet condivisi", body: "I buffet self-service, tipici dei villaggi turistici, aumentano il rischio di contaminazione: posate condivise tra vassoi diversi, briciole che passano da un piatto all'altro. Un villaggio certificato AIC prevede postazioni dedicate o personale che serve direttamente i piatti senza glutine." },
        { title: "Ristoranti a tema e show cooking", body: "Le serate a tema e gli show cooking, molto diffusi nei villaggi, richiedono attenzione extra: verifica sempre con lo staff se sono previste alternative senza glutine per quella specifica serata, idealmente comunicandolo al check-in." },
      ] },
      { h2: "Come trovare hotel e villaggi certificati AIC per la tua vacanza", body: "Il modo più affidabile è verificare la certificazione direttamente sul sito della struttura o chiedendo conferma prima di prenotare, evitando di fidarsi solo di autodichiarazioni generiche come \"gluten free friendly\" trovate su portali di prenotazione. Nella <a href=\"/directory?categoria=hotel\">directory di Mappa Senza Glutine</a> trovi le strutture verificate, con indicazione chiara se la certificazione è confermata o meno." },
      { h2: "Cosa fare se l'hotel non è certificato AIC", body: "Anche senza certificazione, una vacanza senza glutine è possibile con qualche accorgimento in più: verifica se la camera ha un angolo cottura o un piccolo frigo per conservare snack e prodotti sicuri portati da casa, cerca ristoranti certificati AIC o segnalati dalla community nella zona per pranzo e cena, e porta sempre con te una scorta di prodotti senza glutine per le emergenze, soprattutto in mete poco turistiche dove trovarli sul posto può essere difficile." },
      { h2: "Domande frequenti su hotel e villaggi senza glutine", body: "Le domande più comuni di chi organizza una vacanza da celiaco.", h3: [
        { title: "Cosa significa che un hotel è certificato AIC?", body: "Significa che la struttura ha superato controlli specifici dell'Associazione Italiana Celiachia su colazione, eventuale ristorazione interna e formazione del personale, con verifiche periodiche nel tempo." },
        { title: "I villaggi con pensione completa sono sicuri per celiaci?", body: "Possono esserlo se certificati AIC o con procedure dedicate per i buffet: senza queste garanzie, il rischio di contaminazione crociata nelle formule self-service è più alto rispetto a un ristorante à la carte." },
        { title: "Devo avvisare l'hotel della celiachia prima di arrivare?", body: "Sì, è fortemente consigliato segnalarlo già in fase di prenotazione, non al check-in: la cucina ha bisogno di tempo per organizzare colazione e pasti in sicurezza, soprattutto nei periodi di alta stagione." },
        { title: "Cosa porto con me in vacanza se l'hotel non è certificato?", body: "Una scorta di prodotti senza glutine di base (pane, snack, pasta) per le emergenze, soprattutto se la meta è poco turistica: può essere difficile trovarli sul posto fuori dalle grandi città." },
      ] },
    ],
    faqs: [
      { question: "Cosa significa che un hotel è certificato AIC?", answer: "Significa che la struttura ha superato controlli specifici dell'AIC su colazione, eventuale ristorazione interna e formazione del personale, con verifiche periodiche." },
      { question: "I villaggi con pensione completa sono sicuri per celiaci?", answer: "Possono esserlo se certificati AIC o con procedure dedicate per i buffet, altrimenti il rischio di contaminazione crociata nelle formule self-service è più alto." },
      { question: "Devo avvisare l'hotel della celiachia prima di arrivare?", answer: "Sì, è fortemente consigliato segnalarlo in fase di prenotazione, non al check-in, così la cucina può organizzarsi in anticipo." },
      { question: "Cosa porto con me in vacanza se l'hotel non è certificato?", answer: "Una scorta di prodotti senza glutine di base per le emergenze, soprattutto in mete poco turistiche dove trovarli sul posto può essere difficile." },
    ],
  },
  {
    title: "Dove fare colazione senza glutine: cornetti, brioches e pasticcerie dedicate",
    category: "Guide",
    excerpt: "Dove fare colazione senza glutine senza rischi: la differenza tra un cornetto industriale e una pasticceria dedicata, cosa chiedere al bar e come organizzarsi quando si è fuori casa o in viaggio.",
    coverSeed: 124, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-07-30",
    tags: ["colazione", "pasticcerie", "contaminazione crociata", "bar"],
    keyTakeaways: [
      "Molti bar tradizionali offrono solo un cornetto industriale preconfezionato: non è la stessa cosa di una pasticceria con laboratorio dedicato.",
      "Le pasticcerie 100% senza glutine offrono le maggiori garanzie contro la contaminazione crociata, ma sono ancora concentrate soprattutto nelle grandi città.",
      "Anche nei bar con un \"angolo senza glutine\", il rischio dipende da come vengono conservati, tagliati e serviti i prodotti.",
      "Portare la propria colazione o cercare pasticcerie verificate nella directory resta la scelta più sicura quando si è fuori casa o in viaggio.",
    ],
    sections: [
      { h2: "Colazione senza glutine: perché il bar sotto casa spesso non basta", body: "Per chi è celiaco, la colazione al bar è spesso una delle rinunce più sentite: il cornetto caldo appena sfornato, il profumo del bancone, il rito della colazione fuori casa. Trovare dove fare colazione senza glutine in sicurezza significa però andare oltre il semplice \"hanno il prodotto senza glutine\": un cornetto confezionato tenuto nello stesso espositore di quelli tradizionali, tagliato con lo stesso coltello o tostato nello stesso tostapane, può contaminarsi facilmente. In questa guida vediamo dove cercare e cosa chiedere per una colazione davvero sicura." },
      { h2: "Dove fare colazione senza glutine in sicurezza", body: "Non tutti i locali offrono lo stesso livello di garanzia: ecco le opzioni più affidabili, in ordine di sicurezza.", h3: [
        { title: "Pasticcerie 100% dedicate al senza glutine", body: "Sono l'opzione più sicura in assoluto: laboratorio, forno e utensili usati esclusivamente per prodotti senza glutine, senza alcun rischio di contaminazione da farine tradizionali. Sono ancora poche, ma in crescita nelle grandi città." },
        { title: "Bar con angolo senza glutine certificato", body: "Molti bar tradizionali propongono un piccolo assortimento di prodotti senza glutine, spesso confezionati da fornitori esterni: verifica che siano conservati in un espositore separato e non tagliati o riscaldati con gli stessi strumenti usati per i prodotti tradizionali." },
        { title: "Supermercati e prodotti da forno confezionati", body: "Cornetti e brioches confezionati con marchio senza glutine, reperibili al supermercato o in farmacia, sono un'alternativa sicura per la colazione a casa o da portare con sé, anche se meno \"esperienziale\" di una pasticceria." },
      ] },
      { h2: "Cosa chiedere prima di ordinare un cornetto o una brioche", body: "Prima di ordinare, alcune domande aiutano a capire il livello di attenzione del locale: il prodotto è confezionato singolarmente o sfuso? Viene conservato separato dagli altri prodotti da forno? Viene riscaldato in un tostapane o forno dedicato, o nello stesso usato per i cornetti tradizionali? Se il personale non sa rispondere con sicurezza, meglio optare per un prodotto confezionato non manipolato sul posto." },
      { h2: "I rischi nascosti della colazione al bar", body: "Anche quando il prodotto di partenza è certificato senza glutine, alcuni passaggi al bancone possono comprometterlo: un tostapane condiviso lascia residui di briciole che si depositano sul prodotto successivo, un espositore comune permette il contatto accidentale tra cornetti tradizionali e senza glutine, e le mani o i guanti dello staff che passano da un prodotto all'altro senza cambiarli sono un veicolo di contaminazione spesso sottovalutato." },
      { h2: "Colazione in viaggio: come organizzarsi", body: "Fuori dalla propria città o zona abituale, trovare una colazione sicura richiede un po' di pianificazione in più: cerca pasticcerie e bar verificati nella <a href=\"/directory?categoria=bar-pasticceria\">directory di Mappa Senza Glutine</a> prima di partire, e porta sempre con te qualche prodotto da forno confezionato come riserva per le mattine in cui non trovi un'alternativa sicura nelle vicinanze." },
      { h2: "Domande frequenti sulla colazione senza glutine", body: "Le domande più comuni di chi cerca un bar o una pasticceria sicura per la colazione.", h3: [
        { title: "I cornetti confezionati senza glutine sono sempre sicuri?", body: "Sì, se rimangono sigillati nella confezione originale fino al momento del consumo: il rischio aumenta solo se vengono aperti, tagliati o riscaldati a contatto con superfici o utensili usati per prodotti tradizionali." },
        { title: "Come riconosco una pasticceria davvero dedicata al senza glutine?", body: "Verifica se il laboratorio è interamente dedicato al senza glutine oppure se produce anche prodotti tradizionali: nel primo caso il rischio di contaminazione è pressoché azzerato, nel secondo dipende dalle procedure di separazione adottate." },
        { title: "Posso fidarmi di un bar che ha solo un cornetto senza glutine nel menu?", body: "Dipende da come viene gestito: chiedi sempre se è conservato separatamente e se viene manipolato con strumenti dedicati prima di ordinarlo, non basarti solo sulla presenza del prodotto nel menu." },
        { title: "Cosa porto con me se non trovo un bar sicuro in viaggio?", body: "Prodotti da forno confezionati senza glutine con marchio certificato, facili da trasportare e da conservare, utili come riserva per le mattine in cui non trovi un'alternativa verificata nelle vicinanze." },
      ] },
    ],
    faqs: [
      { question: "I cornetti confezionati senza glutine sono sempre sicuri?", answer: "Sì, se rimangono sigillati fino al consumo: il rischio aumenta solo se vengono aperti, tagliati o riscaldati a contatto con prodotti tradizionali." },
      { question: "Come riconosco una pasticceria davvero dedicata al senza glutine?", answer: "Verifica se il laboratorio è interamente dedicato o se produce anche prodotti tradizionali: nel primo caso il rischio di contaminazione è pressoché azzerato." },
      { question: "Posso fidarmi di un bar che ha solo un cornetto senza glutine nel menu?", answer: "Dipende da come viene gestito: chiedi sempre se è conservato separatamente e manipolato con strumenti dedicati." },
      { question: "Cosa porto con me se non trovo un bar sicuro in viaggio?", answer: "Prodotti da forno confezionati senza glutine con marchio certificato, facili da trasportare come riserva." },
    ],
  },
  {
    title: "Pasta al pesto senza glutine: la ricetta con i fusilli in 15 minuti",
    category: "Ricette",
    excerpt: "Il piatto veloce per eccellenza, senza glutine: fusilli o eliche di mais, pesto alla genovese o pesto bio, pronto in un quarto d'ora.",
    coverSeed: 130, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "pasta", "pesto", "primi piatti"],
    keyTakeaways: [
      "I fusilli o le eliche di mais senza glutine cuociono in 8-11 minuti: assaggiare sempre un minuto prima del tempo indicato in confezione.",
      "Diluire il pesto con un mestolo di acqua di cottura rende il condimento più cremoso e aiuta ad amalgamarlo alla pasta.",
      "Il pesto alla genovese Barilla contiene Parmigiano Reggiano DOP; chi cerca un'opzione certificata AIC può scegliere il pesto bio Sarchio.",
      "Attenzione alla contaminazione crociata: scolare la pasta senza glutine con un colino dedicato, mai lo stesso usato per pasta di grano.",
    ],
    sections: [
      { h2: "Ingredienti per 2 persone", body: "160 g di <a href=\"/prodotti/barilla-fusilli-senza-glutine-400g\">fusilli senza glutine Barilla</a> (o le <a href=\"/prodotti/le-veneziane-eliche-di-mais-250g\">eliche di mais Le Veneziane</a>), 1 vasetto di <a href=\"/prodotti/barilla-pesto-alla-genovese-190g\">pesto alla genovese Barilla</a> oppure di <a href=\"/prodotti/sarchio-pesto-bio-130g\">pesto bio Sarchio</a> se preferisci un'opzione certificata AIC, un mestolo dell'acqua di cottura, pinoli e basilico fresco per guarnire (facoltativi)." },
      { h2: "Procedimento", body: "Porta a bollore abbondante acqua salata in una pentola dedicata alla cottura senza glutine. Versa la pasta e cuoci seguendo i tempi in confezione, assaggiando un minuto prima della scadenza indicata: la pasta di mais e riso tende a scuocere più in fretta di quella di grano.", h3: [
        { title: "Il trucco della crema", body: "Prima di scolare, preleva un mestolo di acqua di cottura amidacea: aiuta a legare il pesto alla pasta senza doverne usare troppo, per un risultato più cremoso e meno asciutto." },
        { title: "Attenzione alla contaminazione crociata", body: "Se in casa si cucina anche pasta di grano, usa una pentola, un colino e un cucchiaio di legno dedicati esclusivamente alla preparazione senza glutine, per evitare contaminazioni anche minime." },
      ] },
      { h2: "Il tocco finale", body: "Scola la pasta al dente, versala in una ciotola capiente insieme al pesto scelto e a un cucchiaio di acqua di cottura, mescola bene fuori dal fuoco per non far perdere aroma al basilico. Completa con pinoli tostati e qualche foglia di basilico fresco." },
    ],
    faqs: [
      { question: "Posso usare la pasta di riso invece del mais?", answer: "Sì, qualsiasi formato di pasta senza glutine funziona: cambiano solo i tempi di cottura, sempre indicati in confezione." },
      { question: "Il pesto alla genovese Barilla contiene glutine?", answer: "No, è senza glutine, ma non porta la certificazione AIC (Spiga Barrata): se la cerchi, il pesto bio Sarchio ce l'ha." },
      { question: "Come conservo il pesto avanzato?", answer: "In frigorifero, ben chiuso, per pochi giorni: verifica sempre le indicazioni di conservazione riportate in etichetta dal produttore." },
    ],
  },
  {
    title: "Colazione senza glutine: 6 idee veloci con pane, fette e biscotti",
    category: "Ricette",
    excerpt: "Dolce o salata, pronta in pochi minuti: le combinazioni più semplici per una colazione senza glutine varia tutta la settimana.",
    coverSeed: 131, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "colazione", "prima colazione"],
    keyTakeaways: [
      "Alternare pane a fette, fette croccanti e biscotti aiuta a variare la colazione senza glutine durante la settimana.",
      "Le versioni salate (avocado, formaggio) sono un'alternativa proteica a quelle dolci con marmellata o cioccolato.",
      "I prodotti in monoporzione (crackers, biscotti) sono comodi da portare fuori casa, a scuola o al lavoro.",
      "Controllare sempre la certificazione AIC in etichetta resta la regola, anche per una colazione veloce.",
    ],
    sections: [
      { h2: "Colazione dolce con pane casereccio", body: "Tosta due fette di <a href=\"/prodotti/schar-pane-casereccio-240g\">pane casereccio Schär</a> e spalmale con marmellata o miele: la mollica morbida e il gusto rustico del grano saraceno reggono bene la tostatura." },
      { h2: "Toast salato con le panfette", body: "Le <a href=\"/prodotti/nutrifree-panfette-pane-casereccio-300g\">panfette Nutrifree</a>, già porzionate, sono perfette per un toast veloce con avocado schiacciato, un filo d'olio e un pizzico di sale, o con formaggio fresco e pomodorini per chi preferisce." },
      { h2: "Fette croccanti con marmellata o miele", body: "Le <a href=\"/prodotti/cereal-fette-croccanti-150g\">fette croccanti Céréal</a> non richiedono il tostapane: sono già pronte, croccanti, ideali da spalmare al volo o da sgranocchiare da sole.", h3: [
        { title: "Versione salata", body: "Le stesse fette croccanti si abbinano bene anche a formaggio spalmabile o hummus, per chi preferisce iniziare la giornata senza dolce." },
      ] },
      { h2: "Crackers per chi va di corsa", body: "I <a href=\"/prodotti/schar-crackers-210g\">crackers Schär</a>, già divisi in monoporzioni da 35g, sono comodi da portare in borsa: abbinali a un formaggio spalmabile o a della frutta secca." },
      { h2: "L'opzione dolce pronta: biscotti o barretta", body: "Nei giorni di fretta, i <a href=\"/prodotti/cereal-buoni-senza-biscotti-con-gocce-di-cioccolato-150g\">biscotti Buoni Senza Céréal</a> con gocce di cioccolato o la barretta <a href=\"/prodotti/schar-chocolix-110g\">Chocolix Schär</a> sono pronti da mangiare senza preparazione, comunque certificati senza glutine." },
    ],
    faqs: [
      { question: "Meglio la colazione dolce o salata?", answer: "Non c'è una regola: la colazione salata con avocado o formaggio dà più sazietà proteica, quella dolce è più tradizionale. L'importante è variare durante la settimana." },
      { question: "Questi prodotti sono adatti anche ai bambini celiaci?", answer: "Sono prodotti generici senza indicazioni di età: verifica sempre etichetta e quantità con il pediatra o il nutrizionista di riferimento." },
      { question: "Posso congelare il pane casereccio o le panfette?", answer: "Molti pani senza glutine si congelano bene già a fette: verifica le indicazioni di conservazione riportate in confezione dal produttore." },
    ],
  },
  {
    title: "Torta senza glutine facile: la ricetta base con il mix per dolci",
    category: "Ricette",
    excerpt: "La torta \"salva-cena\" per chi ha poco tempo: pochi ingredienti, il mix di farine già pronto e un risultato soffice e sicuro.",
    coverSeed: 132, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "dolci", "torte", "farine"],
    keyTakeaways: [
      "Un mix di farine specifico per dolci dà risultati più affidabili di un mix fai-da-te per chi inizia a cucinare senza glutine.",
      "Le proporzioni base (mix, uova, zucchero, olio, lievito) restano quelle di una torta tradizionale: cambia solo la farina.",
      "Il forno statico a 175-180°C con cottura di 35-40 minuti è il punto di partenza più sicuro: la prova stecchino resta il test definitivo.",
      "Il mix universale Schär funziona anche per questa torta, con una consistenza leggermente diversa rispetto al mix specifico per dolci.",
    ],
    sections: [
      { h2: "Ingredienti per una torta da 22 cm", body: "300 g di <a href=\"/prodotti/nutrifree-mix-per-dolci-1kg\">mix per dolci Nutrifree</a> (o, in alternativa, <a href=\"/prodotti/schar-mix-it-universale-1kg\">Mix It! Universale Schär</a>), 3 uova, 150 g di zucchero, 100 ml di olio di semi o burro fuso, 150 ml di latte (o bevanda vegetale), una bustina di lievito per dolci senza glutine, la scorza di un limone." },
      { h2: "Procedimento", body: "Accendi il forno statico a 175-180°C. Monta le uova con lo zucchero fino a ottenere un composto chiaro e spumoso, poi incorpora l'olio a filo continuando a mescolare.", h3: [
        { title: "Unire gli ingredienti secchi", body: "Setaccia il mix di farine con il lievito e incorporalo al composto di uova alternandolo al latte, un po' alla volta, per evitare grumi. Aggiungi infine la scorza di limone." },
        { title: "Cottura e prova stecchino", body: "Versa l'impasto in uno stampo imburrato e infarinato (con lo stesso mix) e cuoci per 35-40 minuti. Verifica la cottura infilando uno stecchino al centro: se esce asciutto, la torta è pronta." },
      ] },
      { h2: "Varianti", body: "Per una versione al cioccolato, sostituisci 30 g di mix con altrettanto cacao amaro; per una torta più rustica, aggiungi mele a cubetti o gocce di cioccolato fondente all'impasto prima di infornare." },
    ],
    faqs: [
      { question: "Posso usare farine sciolte al posto del mix già pronto?", answer: "Sì, ma un mix specifico per dolci ha già le proporzioni tra amidi e farine bilanciate per la lievitazione: per chi inizia è il modo più sicuro per ottenere un risultato soffice." },
      { question: "La torta viene più asciutta di una tradizionale?", answer: "Se rispetti tempi e temperature indicati, il risultato è paragonabile: le farine senza glutine tendono ad asciugare un po' più in fretta, quindi conservala ben coperta." },
      { question: "Il mix per dolci Nutrifree è certificato AIC?", answer: "Sì, come tutti i prodotti Nutrifree porta il marchio Spiga Barrata dell'Associazione Italiana Celiachia." },
    ],
  },
  {
    title: "Pasta fredda senza glutine con pesto e verdure: la ricetta estiva",
    category: "Ricette",
    excerpt: "Il primo piatto perfetto per il caldo: pasta di mais o riso, pesto e verdure di stagione, da preparare in anticipo e servire fredda.",
    coverSeed: 133, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "pasta", "estate", "pesto"],
    keyTakeaways: [
      "Per la pasta fredda scegli formati corti come eliche o fusilli: trattengono meglio pesto e verdure a cubetti.",
      "Raffredda la pasta passandola sotto l'acqua fredda subito dopo la cottura, per fermarla ed evitare che scuocia.",
      "Prepara la pasta fredda con qualche ora di anticipo: il riposo in frigorifero aiuta i sapori ad amalgamarsi.",
      "Aggiungi il pesto solo poco prima di servire, per mantenere il colore verde brillante del basilico.",
    ],
    sections: [
      { h2: "Ingredienti per 4 persone", body: "320 g di <a href=\"/prodotti/le-veneziane-eliche-di-mais-250g\">eliche di mais Le Veneziane</a> (o <a href=\"/prodotti/barilla-fusilli-senza-glutine-400g\">fusilli Barilla</a>), 1 vasetto di <a href=\"/prodotti/sarchio-pesto-bio-130g\">pesto bio Sarchio</a> o di <a href=\"/prodotti/barilla-pesto-alla-genovese-190g\">pesto alla genovese Barilla</a>, pomodorini, mozzarella o feta a cubetti, olive, un filo d'olio extravergine." },
      { h2: "Procedimento", body: "Cuoci la pasta in acqua bollente salata seguendo i tempi in confezione, poi scolala e passala subito sotto l'acqua fredda per bloccare la cottura: è il passaggio che fa la differenza tra una pasta fredda gommosa e una al punto giusto.", h3: [
        { title: "Il riposo in frigo", body: "Condisci la pasta con un filo d'olio appena scolata, per evitare che si attacchi, e lasciala raffreddare in frigorifero per almeno un'ora prima di aggiungere gli altri ingredienti." },
        { title: "Quando aggiungere il pesto", body: "Unisci il pesto solo negli ultimi 15-20 minuti prima di servire: a contatto prolungato con gli altri ingredienti tende a scurirsi e perdere aroma." },
      ] },
      { h2: "Assemblaggio finale", body: "Aggiungi pomodorini tagliati a metà, cubetti di mozzarella o feta, olive e un cucchiaio abbondante di pesto. Mescola delicatamente e servi a temperatura ambiente." },
    ],
    faqs: [
      { question: "Posso prepararla il giorno prima?", answer: "Sì, la pasta condita con olio si conserva bene in frigorifero fino al giorno dopo: aggiungi il pesto solo al momento di servire." },
      { question: "Quale formato di pasta senza glutine tiene meglio per la pasta fredda?", answer: "I formati corti come eliche, fusilli o penne trattengono meglio condimento e verdure a cubetti rispetto a formati lunghi." },
      { question: "Posso sostituire la mozzarella con un'alternativa vegetale?", answer: "Sì, qualsiasi formaggio o alternativa vegetale a cubetti funziona bene: verifica solo che sia senza glutine in etichetta." },
    ],
  },
  {
    title: "Aperitivo senza glutine: crackers, pesto e stuzzichini veloci",
    category: "Ricette",
    excerpt: "Idee semplici per un aperitivo senza glutine in casa: crackers, fette croccanti, due salse pronte e pochi minuti di preparazione.",
    coverSeed: 134, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "aperitivo", "stuzzichini"],
    keyTakeaways: [
      "Crackers e fette croccanti già pronti riducono i tempi di preparazione di un aperitivo senza glutine a pochi minuti.",
      "Il pesto, alla genovese o bio, funziona anche come salsa da intingere e non solo come condimento per la pasta.",
      "Servire ogni prodotto nella propria confezione o ciotola separata evita contaminazioni crociate con snack tradizionali.",
      "Un aperitivo vario alterna un'opzione a base di formaggio, una vegetale e una più sfiziosa.",
    ],
    sections: [
      { h2: "La base: crackers e fette croccanti", body: "Disponi in due ciotole separate i <a href=\"/prodotti/schar-crackers-210g\">crackers Schär</a> e le <a href=\"/prodotti/cereal-fette-croccanti-150g\">fette croccanti Céréal</a>: sono già porzionati e pronti da servire, senza cottura." },
      { h2: "Le salse da intingere", body: "Versa in due ciotoline il <a href=\"/prodotti/barilla-pesto-alla-genovese-190g\">pesto alla genovese Barilla</a> e il <a href=\"/prodotti/sarchio-pesto-bio-130g\">pesto bio Sarchio</a>, diluiti con un cucchiaio di olio extravergine per renderli più cremosi da intingere.", h3: [
        { title: "Attenzione alla contaminazione", body: "Se in casa hai anche snack tradizionali, usa piatti e ciotole separati per i prodotti senza glutine e servili prima di aprire quelli con glutine, per ridurre il rischio di contatto." },
      ] },
      { h2: "Come completare il tagliere", body: "Aggiungi formaggi stagionati (naturalmente senza glutine, ma verifica sempre l'etichetta per eventuali trattamenti), olive, verdure crude a bastoncino e frutta secca per un aperitivo completo e vario." },
    ],
    faqs: [
      { question: "Il pesto va bene anche come salsa da intingere e non solo per la pasta?", answer: "Sì, diluito con un filo d'olio diventa una salsa cremosa perfetta per crackers e verdure crude." },
      { question: "Come evito la contaminazione crociata durante un aperitivo misto?", answer: "Usa ciotole e taglieri separati per i prodotti senza glutine e serviteli prima di aprire snack tradizionali, per ridurre il rischio di contatto con briciole." },
      { question: "I formaggi stagionati sono sempre senza glutine?", answer: "Generalmente sì, ma alcuni trattamenti superficiali (es. cenere aromatizzata) possono contenere glutine: verifica sempre l'etichetta o chiedi al produttore." },
    ],
  },
  {
    title: "Pizza senza glutine fatta in casa: l'impasto con il mix universale",
    category: "Ricette",
    excerpt: "La ricetta base per un impasto di pizza senza glutine con il mix universale: pochi ingredienti e un risultato più simile alla pizza tradizionale.",
    coverSeed: 135, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "pizza", "impasti"],
    keyTakeaways: [
      "Un mix di farine pensato anche per pizza e focacce dà un impasto più elastico di un mix generico per dolci.",
      "L'impasto senza glutine va steso tra due fogli di carta forno, perché è più appiccicoso di quello tradizionale.",
      "Una precottura di 8-10 minuti in bianco prima di aggiungere il condimento aiuta la base a non restare cruda al centro.",
      "Il lievito di birra fresco o secco funziona come nell'impasto tradizionale: verifica solo che sia certificato senza glutine.",
    ],
    sections: [
      { h2: "Ingredienti per 2 pizze medie", body: "500 g di <a href=\"/prodotti/schar-mix-it-universale-1kg\">Mix It! Universale Schär</a>, 320 ml di acqua tiepida, 7 g di lievito di birra secco (o 20 g fresco), 2 cucchiai di olio extravergine, un cucchiaino di sale, un pizzico di zucchero." },
      { h2: "Procedimento", body: "Sciogli il lievito nell'acqua tiepida con lo zucchero e lascia riposare 10 minuti. Nella ciotola con il mix e il sale, versa l'acqua con il lievito e l'olio, impastando fino a ottenere un composto liscio e omogeneo, più morbido di un impasto tradizionale.", h3: [
        { title: "Stesura e lievitazione", body: "Stendi l'impasto direttamente nella teglia unta, aiutandoti con le mani bagnate o un foglio di carta forno: l'impasto senza glutine è più appiccicoso e va steso con questo accorgimento. Lascia lievitare 30-40 minuti in luogo tiepido." },
        { title: "Cottura in due tempi", body: "Cuoci la base in bianco per 8-10 minuti a 220°C, poi aggiungi il condimento e completa la cottura per altri 10-12 minuti, finché i bordi non sono dorati." },
      ] },
      { h2: "Il condimento", body: "Pomodoro, mozzarella e origano restano la base più sicura, ma puoi usare anche il pesto alla genovese al posto del pomodoro per una variante bianca aromatica." },
    ],
    faqs: [
      { question: "Perché l'impasto va steso tra due fogli di carta forno?", answer: "L'impasto senza glutine è più appiccicoso di quello tradizionale e tende ad attaccarsi alle mani: stenderlo con carta forno o mani bagnate rende il lavoro più semplice." },
      { question: "Posso congelare l'impasto già steso?", answer: "Sì, molti impasti senza glutine si congelano bene già stesi nella teglia, prima della lievitazione finale: verifica comunque le indicazioni del produttore del mix." },
      { question: "Perché cuocere la base in bianco prima del condimento?", answer: "Aiuta la base a cuocersi uniformemente al centro senza restare cruda sotto il peso del condimento, soprattutto con impasti senza glutine più delicati." },
    ],
  },
  {
    title: "Focaccia senza glutine morbida: la ricetta base",
    category: "Ricette",
    excerpt: "Una focaccia soffice e alveolata anche senza glutine: la ricetta con il mix universale, olio extravergine e sale grosso in superficie.",
    coverSeed: 136, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "focaccia", "impasti"],
    keyTakeaways: [
      "L'acqua in eccesso rispetto a un impasto tradizionale è il segreto per una focaccia senza glutine più soffice.",
      "I classici buchi con le dita si fanno dopo la lievitazione, non prima, per non far sgonfiare l'impasto.",
      "Un filo abbondante di olio extravergine prima della cottura aiuta a formare la crosticina dorata tipica della focaccia.",
      "La focaccia senza glutine si mantiene morbida più a lungo se conservata in un sacchetto chiuso a temperatura ambiente.",
    ],
    sections: [
      { h2: "Ingredienti per una teglia da 30x20 cm", body: "400 g di <a href=\"/prodotti/schar-mix-it-universale-1kg\">Mix It! Universale Schär</a>, 320 ml di acqua tiepida, 8 g di lievito di birra secco, 4 cucchiai di olio extravergine (più altro per la superficie), un cucchiaino di sale, sale grosso e rosmarino per guarnire." },
      { h2: "Procedimento", body: "Sciogli il lievito nell'acqua tiepida, poi uniscilo al mix con il sale e 2 cucchiai di olio, impastando fino a ottenere un composto morbido e piuttosto idratato: è normale che risulti più liquido di un impasto per pane tradizionale.", h3: [
        { title: "Prima lievitazione e stesura", body: "Versa l'impasto direttamente nella teglia oliata, senza bisogno di stenderlo con il mattarello, e lascia lievitare coperto per 40-50 minuti in luogo tiepido." },
        { title: "I buchi e la finitura", body: "Dopo la lievitazione, con le dita unte d'olio forma i classici buchi sulla superficie, versa un filo abbondante di olio extravergine e completa con sale grosso e rosmarino." },
      ] },
      { h2: "Cottura", body: "Cuoci a 200°C per 20-25 minuti, finché la superficie non risulta dorata. Sforna e lascia intiepidire prima di tagliare a quadrotti." },
    ],
    faqs: [
      { question: "Perché l'impasto della focaccia senza glutine è più liquido del solito?", answer: "Le farine senza glutine assorbono l'acqua in modo diverso: un impasto più idratato aiuta a ottenere una mollica soffice e alveolata invece che compatta." },
      { question: "Posso farcire la focaccia prima di infornarla?", answer: "Sì, pomodorini, olive o cipolla si possono aggiungere prima della cottura, premendoli leggermente nell'impasto insieme alla formazione dei buchi." },
      { question: "Come si conserva la focaccia senza glutine avanzata?", answer: "In un sacchetto per alimenti chiuso, a temperatura ambiente, si mantiene morbida per un paio di giorni; si può anche congelare già a porzioni." },
    ],
  },
  {
    title: "Merenda scuola senza glutine: 5 idee pratiche per la schiscetta",
    category: "Bambini",
    excerpt: "Cosa mettere nello zaino per la merenda senza rischi: prodotti confezionati singolarmente, facili da controllare e da far portare a scuola.",
    coverSeed: 137, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["bambini", "merenda", "scuola"],
    keyTakeaways: [
      "I prodotti in monoporzione sigillata sono la scelta più sicura per la merenda a scuola: nessuna manipolazione fuori casa.",
      "Segnalare sempre alla scuola e alle maestre la celiachia del bambino, anche se la merenda è portata da casa.",
      "Alternare opzioni dolci e salate aiuta a variare la merenda durante la settimana senza annoiare il bambino.",
      "Un'etichetta con il nome sulla confezione evita scambi accidentali con la merenda di altri compagni.",
    ],
    sections: [
      { h2: "Le opzioni pronte in monoporzione", body: "I <a href=\"/prodotti/cereal-buoni-senza-biscotti-con-gocce-di-cioccolato-150g\">biscotti Buoni Senza Céréal</a> e la barretta <a href=\"/prodotti/schar-chocolix-110g\">Chocolix Schär</a> sono confezionati singolarmente: comodi da mettere nello zaino senza doverli dividere o incartare a casa." },
      { h2: "L'alternativa salata", body: "Le <a href=\"/prodotti/cereal-fette-croccanti-150g\">fette croccanti Céréal</a> si possono preparare la sera prima con un velo di formaggio spalmabile e conservare in un contenitore ermetico per il giorno dopo." },
      { h2: "Consigli pratici per la schiscetta", body: "Scegli sempre prodotti nella confezione originale sigillata quando possibile, per evitare che il bambino li scambi con quelli di un compagno. Se prepari qualcosa in casa, usa un contenitore dedicato, lavato separatamente da quelli usati per alimenti con glutine.", h3: [
        { title: "Parlarne con la scuola", body: "Anche se la merenda arriva da casa, è utile informare le maestre della celiachia, per gestire eventuali scambi spontanei di cibo tra compagni durante l'intervallo." },
      ] },
    ],
    faqs: [
      { question: "È meglio dare merenda confezionata o preparata in casa?", answer: "Entrambe vanno bene: la confezione sigillata originale riduce al minimo il rischio di contaminazione fuori casa, mentre la merenda fatta in casa richiede un contenitore dedicato lavato separatamente." },
      { question: "Devo avvisare la scuola anche se porto la merenda da casa?", answer: "Sì, è comunque utile informare le maestre della celiachia, per gestire situazioni come lo scambio spontaneo di cibo tra bambini durante la ricreazione." },
      { question: "Come evito che il bambino scambi la merenda con i compagni?", answer: "Un'etichetta con il nome sulla confezione e una breve spiegazione al bambino stesso, adatta alla sua età, aiutano a prevenire scambi accidentali." },
    ],
  },
  {
    title: "Panzanella senza glutine: la ricetta estiva con il pane raffermo",
    category: "Ricette",
    excerpt: "Il classico piatto povero toscano, in versione senza glutine: pane raffermo, pomodori maturi, cipolla e basilico.",
    coverSeed: 138, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "estate", "pane", "piatti unici"],
    keyTakeaways: [
      "Il pane senza glutine raffermo funziona come quello tradizionale per la panzanella: basta lasciarlo un giorno fuori dal sacchetto.",
      "Ammollare il pane in acqua e aceto, poi strizzarlo bene, evita che la panzanella diventi troppo bagnata e sfaldata.",
      "Un riposo di 30 minuti in frigorifero prima di servire aiuta i sapori di pomodoro, cipolla e basilico ad amalgamarsi.",
      "La panzanella è un piatto estivo senza cottura: perfetta quando si vuole evitare di accendere il forno o i fornelli.",
    ],
    sections: [
      { h2: "Ingredienti per 4 persone", body: "4 fette di <a href=\"/prodotti/schar-pane-casereccio-240g\">pane casereccio Schär</a> raffermo (o <a href=\"/prodotti/nutrifree-panfette-pane-casereccio-300g\">panfette Nutrifree</a>), 4 pomodori maturi, mezza cipolla rossa, basilico fresco, olio extravergine, aceto di vino, sale." },
      { h2: "Procedimento", body: "Taglia il pane a cubetti e ammollalo per qualche minuto in acqua fredda con un cucchiaio di aceto, poi strizzalo bene con le mani per eliminare l'acqua in eccesso: deve restare umido ma non bagnato.", h3: [
        { title: "Il taglio delle verdure", body: "Taglia i pomodori a spicchi, elimina i semi in eccesso e affetta sottilmente la cipolla rossa, meglio se lasciata in ammollo in acqua fredda per 10 minuti per renderla più delicata." },
      ] },
      { h2: "Assemblaggio e riposo", body: "Unisci pane, pomodori e cipolla in una ciotola capiente, condisci con olio, un filo di aceto, sale e basilico spezzettato a mano. Lascia riposare in frigorifero almeno 30 minuti prima di servire, per far insaporire bene tutti gli ingredienti." },
    ],
    faqs: [
      { question: "Il pane deve essere per forza raffermo?", answer: "Sì, un pane fresco si sfalda troppo facilmente durante l'ammollo: se hai solo pane fresco, lascialo un giorno fuori dal sacchetto prima di usarlo." },
      { question: "Posso aggiungere altri ingredienti alla panzanella?", answer: "Sì, cetrioli, olive o tonno sono aggiunte comuni alla ricetta classica: adatta la panzanella ai gusti di famiglia mantenendo pane, pomodoro e cipolla come base." },
      { question: "Quanto si conserva la panzanella preparata?", answer: "Si mantiene bene in frigorifero per un giorno, ma il pane continua ad ammorbidirsi col tempo: è più buona consumata entro poche ore dalla preparazione." },
    ],
  },
  {
    title: "Crostini e tartine senza glutine per una cena tra amici",
    category: "Ricette",
    excerpt: "Idee veloci per crostini e tartine senza glutine, con basi pronte e pochi ingredienti freschi da assemblare all'ultimo momento.",
    coverSeed: 139, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "aperitivo", "cena"],
    keyTakeaways: [
      "Fette croccanti e panfette tostate sono basi pronte per crostini, senza bisogno di preparare il pane in casa.",
      "Il pesto funziona come base per tartine tanto quanto le classiche creme spalmabili.",
      "Assemblare i crostini solo poco prima di servire evita che la base si inumidisca e perda croccantezza.",
      "Variare le basi (croccante o morbida) aiuta a proporre più consistenze nello stesso tagliere.",
    ],
    sections: [
      { h2: "Le basi", body: "Usa le <a href=\"/prodotti/cereal-fette-croccanti-150g\">fette croccanti Céréal</a> così come sono per una base croccante, oppure tosta leggermente le <a href=\"/prodotti/nutrifree-panfette-pane-casereccio-300g\">panfette Nutrifree</a> per una base più morbida al centro e dorata ai bordi." },
      { h2: "Tre combinazioni veloci", body: "Prova queste combinazioni, pronte in pochi minuti.", h3: [
        { title: "Crostino al pesto e pomodorini", body: "Uno strato di <a href=\"/prodotti/sarchio-pesto-bio-130g\">pesto bio Sarchio</a>, mezzo pomodorino tagliato sopra e un filo d'olio." },
        { title: "Tartina con formaggio spalmabile e noci", body: "Formaggio spalmabile, gherigli di noce spezzettati e un giro di miele per un contrasto dolce-salato." },
        { title: "Crostino con hummus e verdure crude", body: "Uno strato di hummus con julienne di carota o zucchina cruda, per un'opzione più leggera." },
      ] },
    ],
    faqs: [
      { question: "Meglio preparare i crostini in anticipo o all'ultimo momento?", answer: "Meglio assemblarli poco prima di servire: la base a contatto con condimenti umidi tende ad ammorbidirsi e perdere croccantezza nel tempo." },
      { question: "Posso usare anche il pane casereccio al posto delle fette croccanti?", answer: "Sì, tostato leggermente funziona altrettanto bene come base per crostini e tartine." },
      { question: "Queste basi sono adatte anche a un buffet numeroso?", answer: "Sì, essendo già porzionate permettono di preparare rapidamente grandi quantità: calcola 3-4 pezzi a persona per un aperitivo." },
    ],
  },
  {
    title: "Muffin salati senza glutine con il mix universale",
    category: "Ricette",
    excerpt: "Muffin sofficissimi e salati, perfetti per un buffet o un pranzo veloce: la ricetta base con il mix universale, da farcire come preferisci.",
    coverSeed: 140, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "muffin", "salato"],
    keyTakeaways: [
      "Un mix universale funziona anche per impasti salati, non solo per pane e pizza: basta bilanciare gli ingredienti umidi.",
      "Non riempire gli stampi oltre i due terzi: i muffin senza glutine lievitano meno di quelli tradizionali in altezza.",
      "Farciture come prosciutto cotto, formaggio o zucchine grigliate reggono bene la cottura senza appesantire l'impasto.",
      "I muffin salati si conservano bene anche il giorno dopo, ideali da preparare in anticipo per un buffet.",
    ],
    sections: [
      { h2: "Ingredienti per 12 muffin", body: "250 g di <a href=\"/prodotti/schar-mix-it-universale-1kg\">Mix It! Universale Schär</a>, 3 uova, 100 ml di olio di semi, 150 ml di latte, una bustina di lievito per torte salate senza glutine, 100 g di formaggio a cubetti, 80 g di prosciutto cotto a dadini, sale e pepe." },
      { h2: "Procedimento", body: "Accendi il forno statico a 180°C. Sbatti le uova con l'olio e il latte, poi incorpora il mix setacciato con il lievito, mescolando fino a ottenere un composto omogeneo senza grumi.", h3: [
        { title: "Aggiungere il ripieno", body: "Unisci formaggio a cubetti e prosciutto all'impasto, mescolando delicatamente per distribuirli in modo uniforme senza lavorare troppo il composto." },
        { title: "Cottura", body: "Riempi gli stampini per muffin fino a due terzi e cuoci per 20-25 minuti, finché la superficie non risulta dorata. Verifica la cottura con uno stecchino." },
      ] },
    ],
    faqs: [
      { question: "Posso fare una versione vegetariana?", answer: "Sì, sostituisci il prosciutto con zucchine grigliate, spinaci saltati o pomodori secchi, mantenendo le stesse proporzioni di formaggio." },
      { question: "Perché i muffin senza glutine lievitano meno di quelli tradizionali?", answer: "Le farine senza glutine hanno una struttura diversa dal glutine, che normalmente trattiene meglio l'aria durante la lievitazione: il risultato è comunque soffice, solo con meno sviluppo in altezza." },
      { question: "Si possono congelare i muffin salati?", answer: "Sì, si congelano bene già cotti: scongelali a temperatura ambiente e scaldali qualche minuto in forno prima di servirli." },
    ],
  },
  {
    title: "Grissini senza glutine fatti in casa, croccanti e sottili",
    category: "Ricette",
    excerpt: "La ricetta per grissini senza glutine fatti in casa, con il mix universale: pochi ingredienti e una lavorazione semplice, anche con i bambini.",
    coverSeed: 141, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "grissini", "impasti"],
    keyTakeaways: [
      "L'impasto dei grissini senza glutine va steso più sottile del solito, perché in cottura si gonfia meno di quello tradizionale.",
      "Un doppio passaggio in olio prima della cottura aiuta a ottenere grissini più dorati e croccanti.",
      "I grissini fatti in casa si conservano fino a una settimana in un contenitore ermetico, lontano dall'umidità.",
      "Lavorare l'impasto è un'attività semplice da fare anche con i bambini, essendo poco elastico e facile da modellare.",
    ],
    sections: [
      { h2: "Ingredienti per circa 30 grissini", body: "300 g di <a href=\"/prodotti/schar-mix-it-universale-1kg\">Mix It! Universale Schär</a>, 180 ml di acqua tiepida, 5 g di lievito di birra secco, 3 cucchiai di olio extravergine, un cucchiaino di sale, semi di sesamo o rosmarino tritato (facoltativi)." },
      { h2: "Procedimento", body: "Sciogli il lievito nell'acqua tiepida, poi impasta con il mix, il sale e l'olio fino a ottenere un composto liscio e non appiccicoso. Lascia riposare 20 minuti coperto con un canovaccio.", h3: [
        { title: "Formatura", body: "Stacca piccole porzioni di impasto e stendile con le mani in bastoncini sottili e regolari, direttamente sulla teglia foderata di carta forno, distanziandoli tra loro." },
        { title: "Cottura", body: "Spennella i grissini con un filo d'olio, aggiungi semi o rosmarino se graditi, e cuoci a 190°C per 15-18 minuti, finché non risultano dorati e croccanti." },
      ] },
    ],
    faqs: [
      { question: "Perché i miei grissini non sono croccanti come quelli in commercio?", answer: "Verifica lo spessore: più sono sottili, più risultano croccanti dopo la cottura. Un ulteriore passaggio in forno di 2-3 minuti a fine cottura aiuta ad asciugarli meglio." },
      { question: "Quanto si conservano i grissini fatti in casa?", answer: "Fino a una settimana in un contenitore ermetico, in un luogo asciutto: l'umidità è il loro nemico principale." },
      { question: "Posso aggiungere semi o spezie all'impasto?", answer: "Sì, semi di sesamo, papavero o rosmarino tritato si possono incorporare direttamente nell'impasto oppure cospargere in superficie prima della cottura." },
    ],
  },
  {
    title: "Pasta al forno senza glutine filante e gratinata",
    category: "Ricette",
    excerpt: "Il piatto della domenica in versione senza glutine: fusilli, pesto, besciamella e un generoso strato di formaggio filante gratinato al forno.",
    coverSeed: 142, author: "Giulia Ferri", authorRole: "Food blogger gluten free", publishedAt: "2026-08-10",
    tags: ["ricette", "pasta al forno", "domenica"],
    keyTakeaways: [
      "Per la pasta al forno cuoci la pasta 2-3 minuti in meno rispetto ai tempi indicati: completerà la cottura in forno.",
      "Una besciamella fatta con farina senza glutine si prepara esattamente come quella tradizionale, cambia solo la farina usata.",
      "Il pesto alla genovese, oltre che condimento a crudo, funziona bene anche mescolato alla besciamella per un gusto più ricco.",
      "Lasciar riposare la pasta al forno 5-10 minuti dopo la cottura rende più facile porzionarla senza che si sfaldi.",
    ],
    sections: [
      { h2: "Ingredienti per una teglia da 4-6 persone", body: "350 g di <a href=\"/prodotti/barilla-fusilli-senza-glutine-400g\">fusilli senza glutine Barilla</a>, 1 vasetto di <a href=\"/prodotti/barilla-pesto-alla-genovese-190g\">pesto alla genovese Barilla</a>, 500 ml di besciamella (fatta con farina di riso o mais), 200 g di mozzarella a cubetti, parmigiano grattugiato." },
      { h2: "Procedimento", body: "Cuoci la pasta in acqua bollente salata per 2-3 minuti in meno rispetto al tempo indicato in confezione, poi scolala e condiscila con il pesto e metà della besciamella.", h3: [
        { title: "Comporre la teglia", body: "Versa metà della pasta condita in una pirofila imburrata, distribuisci metà della mozzarella a cubetti, copri con il resto della pasta e completa con la besciamella rimasta, la mozzarella e una spolverata di parmigiano." },
        { title: "Cottura in forno", body: "Cuoci a 200°C per 20-25 minuti, finché la superficie non è dorata e gratinata. Lascia riposare 5-10 minuti prima di servire, per facilitare il taglio delle porzioni." },
      ] },
    ],
    faqs: [
      { question: "Perché cuocere la pasta meno del tempo indicato?", answer: "Perché completerà la cottura in forno insieme al condimento: cuocendola al tempo pieno rischia di risultare scotta dopo la seconda cottura." },
      { question: "Posso preparare la pasta al forno in anticipo?", answer: "Sì, puoi assemblarla in teglia il giorno prima, coprirla e conservarla in frigorifero: aggiungi qualche minuto al tempo di cottura se la inforni fredda di frigo." },
      { question: "Come faccio la besciamella senza glutine?", answer: "Come quella tradizionale, sostituendo la farina di grano con farina di riso o di mais nella stessa quantità: il procedimento con burro, farina e latte caldo resta identico." },
    ],
  },
];

export function makeHeadings(sections: Seed["sections"]): ArticleHeading[] {
  const list: ArticleHeading[] = [];
  sections.forEach((s) => {
    list.push({ id: slugify(s.h2), text: s.h2, level: 2 });
    s.h3?.forEach((sub) => list.push({ id: slugify(sub.title), text: sub.title, level: 3 }));
  });
  return list;
}

export function makeContentHtml(sections: Seed["sections"]): string {
  return sections
    .map((s) => {
      const h3html = s.h3?.map((sub) => {
        const img = sub.image ? `<img src="${sub.image.src}" alt="${sub.image.alt}" loading="lazy" class="article-inline-photo" />` : "";
        return `<h3 id="${slugify(sub.title)}">${sub.title}</h3>${img}<p>${sub.body}</p>`;
      }).join("") ?? "";
      return `<h2 id="${slugify(s.h2)}">${s.h2}</h2><p>${s.body}</p>${h3html}`;
    })
    .join("");
}

function wordCount(sections: Seed["sections"]): number {
  return sections.reduce((sum, s) => sum + s.body.split(" ").length + (s.h3?.reduce((a, x) => a + x.body.split(" ").length, 0) ?? 0), 0);
}

const commentPool = [
  { author: "Sara V.", avatarSeed: 201, body: "Articolo molto chiaro, mi ha aiutato tantissimo appena diagnosticata. Grazie!" },
  { author: "Paolo N.", avatarSeed: 202, body: "Utilissimo, lo condivido nel gruppo di supporto che seguo." },
  { author: "Ilaria C.", avatarSeed: 203, body: "Finalmente una spiegazione senza tecnicismi eccessivi, complimenti." },
];

export const ARTICLES: Article[] = seeds.map((s, idx) => {
  const words = wordCount(s.sections);
  return {
    id: `art-${idx + 1}`,
    slug: slugify(s.title),
    title: s.title,
    metaTitle: `${s.title} | Mappa Senza Glutine`,
    metaDescription: s.excerpt,
    category: s.category,
    excerpt: s.excerpt,
    coverSeed: s.coverSeed,
    author: s.author,
    authorRole: s.authorRole,
    authorAvatarSeed: (idx % 5) + 300,
    publishedAt: s.publishedAt,
    updatedAt: s.publishedAt,
    readingTime: Math.max(2, Math.round(words / 180)),
    headings: makeHeadings(s.sections),
    contentHtml: makeContentHtml(s.sections),
    keyTakeaways: s.keyTakeaways,
    faqs: s.faqs,
    tags: s.tags,
    comments: [commentPool[idx % commentPool.length], commentPool[(idx + 1) % commentPool.length]].map((c, i) => ({
      ...c,
      id: `c-${idx}-${i}`,
      date: s.publishedAt,
    })),
    featured: s.featured,
  };
});

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getLatestArticles(limit = 3) {
  return [...ARTICLES].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)).slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 3) {
  return ARTICLES.filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some((t) => article.tags.includes(t)))).slice(0, limit);
}

export const BLOG_CATEGORIES: Article["category"][] = [
  "Alimentazione", "Celiachia", "News", "Ricette", "Viaggi", "Salute", "Guide", "Prodotti", "Bambini", "Eventi",
];

export const BLOG_CATEGORY_EN: Record<Article["category"], string> = {
  Alimentazione: "Nutrition",
  Celiachia: "Celiac disease",
  News: "News",
  Ricette: "Recipes",
  Viaggi: "Travel",
  Salute: "Health",
  Guide: "Guides",
  Prodotti: "Products",
  Bambini: "Kids",
  Eventi: "Events",
};

export function blogCategoryLabel(category: Article["category"], locale: Locale) {
  return locale === "en" ? BLOG_CATEGORY_EN[category] : category;
}
