import type { Article, ArticleHeading } from "./types";
import { slugify } from "./format";

interface Seed {
  title: string;
  category: Article["category"];
  excerpt: string;
  coverSeed: number;
  author: string;
  authorRole: string;
  publishedAt: string;
  tags: string[];
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
    sections: [
      { h2: "Le fiere nazionali", body: "Ogni anno diverse città italiane ospitano fiere dedicate al food senza glutine, con degustazioni, workshop e incontri con nutrizionisti aperti al pubblico." },
      { h2: "Giornate informative locali", body: "Le sedi regionali AIC organizzano periodicamente incontri gratuiti su diagnosi, alimentazione e novità normative, un'occasione utile per neo-diagnosticati e famiglie." },
      { h2: "Eventi social e community online", body: "Sempre più community di celiaci organizzano cene sociali e raduni presso locali certificati, un modo semplice per scoprire nuove attività affidabili nella propria zona." },
    ],
    faqs: [
      { question: "Come restare aggiornati sugli eventi in programma?", answer: "Iscrivendosi alla newsletter di GlutenFree Directory o seguendo i canali social delle associazioni locali si ricevono aggiornamenti periodici sugli eventi in calendario." },
    ],
  },
  {
    title: "Dieta senza glutine e sport: cosa sapere per le performance",
    category: "Salute",
    excerpt: "Come impostare l'alimentazione sportiva quando si segue una dieta senza glutine, tra carboidrati, integrazione e idee pratiche.",
    coverSeed: 108, author: "Dott.ssa Elena Rossi", authorRole: "Biologa nutrizionista", publishedAt: "2026-02-27",
    tags: ["sport", "salute", "alimentazione"],
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
    sections: [
      { h2: "Aggiornamento dei buoni spesa mensili", body: "Il tetto di spesa mensile erogato dal Servizio Sanitario Nazionale per i prodotti senza glutine viene periodicamente rivisto: è consigliato verificare gli importi aggiornati presso la propria ASL di riferimento." },
      { h2: "Nuove linee guida per la ristorazione", body: "Diverse regioni stanno aggiornando le linee guida HACCP per la ristorazione, con requisiti più stringenti per i locali che vogliono ottenere la certificazione per celiaci." },
    ],
    faqs: [
      { question: "Dove si ritira il buono spesa per prodotti senza glutine?", answer: "Il buono viene erogato dalla ASL di residenza dopo la presentazione della diagnosi ed è utilizzabile in farmacia e nei punti vendita convenzionati." },
    ],
  },
];

function makeHeadings(sections: Seed["sections"]): ArticleHeading[] {
  const list: ArticleHeading[] = [];
  sections.forEach((s) => {
    list.push({ id: slugify(s.h2), text: s.h2, level: 2 });
    s.h3?.forEach((sub) => list.push({ id: slugify(sub.title), text: sub.title, level: 3 }));
  });
  return list;
}

function makeContentHtml(sections: Seed["sections"]): string {
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
    metaTitle: `${s.title} | GlutenFree Directory`,
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
