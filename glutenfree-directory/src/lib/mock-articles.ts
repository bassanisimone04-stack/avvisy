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
  sections: { h2: string; body: string; h3?: { title: string; body: string }[] }[];
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
      { h2: "Le migliori pizzerie senza glutine a Milano", body: "La pizza resta uno dei piatti più a rischio contaminazione, perché la farina di grano vola facilmente in un forno condiviso: per questo cerchiamo sempre locali con <strong>forno separato o dedicato</strong> alle pizze gluten free.", h3: [
        { title: "Pizzeria La Spiga d'Oro", body: "A pochi passi da Milano, a Monza, la <a href=\"/directory/pizzeria-la-spiga-d-oro-monza\">Pizzeria La Spiga d'Oro</a> è uno dei nostri indirizzi di fiducia: <strong>forno separato certificato AIC</strong> e impasto a lunga lievitazione senza glutine, cotto rigorosamente a legna. Da provare la margherita gluten free e la pizza al padellino, oltre ai fritti senza glutine per chi vuole iniziare con un antipasto sfizioso." },
        { title: "Forno di Brera", body: "Nel cuore del quartiere di Brera, questo piccolo forno riserva un angolo dedicato esclusivamente alla preparazione gluten free, con pizza al trancio da asporto perfetta per una pausa pranzo veloce in totale sicurezza." },
      ] },
      { h2: "Ristoranti senza glutine a Milano: dove sedersi senza pensieri", body: "Per una cena più strutturata, questi sono i ristoranti che consigliamo a chi cerca il massimo della tranquillità in fatto di contaminazione crociata.", h3: [
        { title: "Osteria Senza Confini", body: "L'<a href=\"/directory/osteria-senza-confini-milano\">Osteria Senza Confini</a>, in zona Tortona, propone <strong>cucina milanese contemporanea interamente gluten free</strong>, con un laboratorio interno dedicato alla pasta fresca e un forno separato per il pane. Imperdibili la tagliata di manzo e il tiramisù gluten free." },
        { title: "Il Molo dei Navigli", body: "Specializzato in cucina di mare, questo ristorante lungo i Navigli utilizza un olio di frittura dedicato esclusivamente alle preparazioni senza glutine e prepara in casa sia la pasta che il pane, riducendo al minimo il rischio di contaminazione." },
        { title: "Trattoria Meneghina Gluten Free", body: "Per chi cerca la tradizione meneghina in totale sicurezza, questa trattoria propone cotoletta, risotto allo zafferano e ossobuco, con una <strong>postazione di impanatura dedicata</strong> per evitare qualsiasi contatto con farine di grano." },
      ] },
      { h2: "Pasticcerie e colazioni senza glutine a Milano", body: "Anche la colazione può diventare un momento di relax, non di ansia, grazie a questi indirizzi.", h3: [
        { title: "Pasticceria Dolce Vita Gluten Free", body: "Laboratorio interamente dedicato al senza glutine, con cornetti, torte e biscotti sfornati ogni giorno: la scelta ideale per una colazione o un dolce da portare a casa senza pensieri." },
        { title: "Caffè Corso Senza Glutine", body: "In pieno centro, propone una vetrina di paste fresche rinnovata quotidianamente e un'ampia scelta di pane e panini senza glutine, perfetti anche per un pranzo veloce tra un appuntamento e l'altro." },
      ] },
      { h2: "Consigli pratici per mangiare senza glutine a Milano in sicurezza", body: "Qualche accorgimento in più aiuta a vivere l'esperienza senza stress: <ul><li><strong>Prenota in anticipo</strong>, soprattutto nei locali più noti e nei weekend, quando la cucina lavora a pieno ritmo.</li><li><strong>Avvisa sempre della celiachia</strong> già in fase di prenotazione, non solo al tavolo, così lo staff può organizzarsi per tempo.</li><li><strong>Chiedi se cucina o forno sono dedicati</strong> oppure condivisi: uno staff preparato risponderà con sicurezza e senza esitazioni.</li><li><strong>Verifica la certificazione AIC</strong> del locale, un'ulteriore garanzia di controlli periodici sulla sicurezza alimentare.</li><li><strong>Porta sempre con te qualche snack sicuro</strong>, utile in caso di imprevisti o lunghe attese.</li></ul>" },
    ],
    faqs: [
      { question: "Quali sono i migliori ristoranti senza glutine a Milano?", answer: "Tra i nostri indirizzi di fiducia spiccano l'Osteria Senza Confini a Milano e la Pizzeria La Spiga d'Oro a Monza, entrambi verificati dalla nostra community e presenti nella directory di Mappa Senza Glutine." },
      { question: "Come faccio a sapere se un ristorante a Milano è davvero sicuro per celiaci?", answer: "Controlla la certificazione AIC, chiedi se cucina e forno sono dedicati o separati e affidati a recensioni verificate da altri celiaci, come quelle presenti nella nostra directory." },
      { question: "È necessario prenotare sempre nei ristoranti senza glutine a Milano?", answer: "Non è sempre obbligatorio, ma è fortemente consigliato nei locali più conosciuti e nei weekend, quando la richiesta è più alta e i posti dedicati possono esaurirsi rapidamente." },
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
      const h3html = s.h3?.map((sub) => `<h3 id="${slugify(sub.title)}">${sub.title}</h3><p>${sub.body}</p>`).join("") ?? "";
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
