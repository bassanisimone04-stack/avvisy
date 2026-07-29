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
      "La newsletter di Mappa Senza Glutine e i canali social locali sono il modo più semplice per restare aggiornati.",
    ],
    sections: [
      { h2: "Le fiere nazionali", body: "Ogni anno diverse città italiane ospitano fiere dedicate al food senza glutine, con degustazioni, workshop e incontri con nutrizionisti aperti al pubblico." },
      { h2: "Giornate informative locali", body: "Le sedi regionali AIC organizzano periodicamente incontri gratuiti su diagnosi, alimentazione e novità normative, un'occasione utile per neo-diagnosticati e famiglie." },
      { h2: "Eventi social e community online", body: "Sempre più community di celiaci organizzano cene sociali e raduni presso locali certificati, un modo semplice per scoprire nuove attività affidabili nella propria zona." },
    ],
    faqs: [
      { question: "Come restare aggiornati sugli eventi in programma?", answer: "Iscrivendosi alla newsletter di Mappa Senza Glutine o seguendo i canali social delle associazioni locali si ricevono aggiornamenti periodici sugli eventi in calendario." },
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
