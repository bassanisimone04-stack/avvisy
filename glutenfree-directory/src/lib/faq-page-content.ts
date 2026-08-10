import type { FaqItem } from "./types";

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS_IT: FaqGroup[] = [
  {
    title: "Celiachia e diagnosi",
    items: [
      { question: "Cosa non può mangiare un celiaco?", answer: "Un celiaco deve evitare grano, orzo, segale, farro e kamut e tutti i loro derivati (pane, pasta, pizza, biscotti tradizionali), oltre ai prodotti trasformati che possono contenere glutine nascosto come addensanti, dadi da brodo o salumi." },
      { question: "Come si scopre di essere celiaci? Quali esami si fanno?", answer: "La diagnosi si basa su esami del sangue per gli anticorpi anti-transglutaminasi, seguiti da una gastroscopia con biopsia duodenale. È fondamentale non eliminare il glutine dalla dieta prima di aver completato tutti gli accertamenti." },
      { question: "La celiachia si può guarire o passare con l'età?", answer: "No, non esiste una cura definitiva né la celiachia scompare con l'età: l'unica terapia efficace è una dieta rigorosamente senza glutine seguita per tutta la vita." },
      { question: "Quali sono i sintomi della celiachia negli adulti?", answer: "Gonfiore, dolore addominale, stanchezza cronica, anemia da carenza di ferro e aftosi ricorrente sono tra i sintomi più comuni, ma possono comparire anche manifestazioni extraintestinali come dermatite erpetiforme o osteoporosi precoce." },
      { question: "Qual è la differenza tra celiachia e sensibilità al glutine?", answer: "La celiachia è una malattia autoimmune con danno intestinale documentabile tramite esami del sangue e biopsia; la sensibilità al glutine non celiaca provoca sintomi simili ma senza questo danno, e si diagnostica per esclusione." },
    ],
  },
  {
    title: "Ristoranti e contaminazione crociata",
    items: [
      { question: "Come faccio a sapere se un ristorante è davvero sicuro per celiaci?", answer: "Verifica se il locale è certificato AIC, se dispone di cucina o forno dedicati e leggi le recensioni verificate della community: su Mappa Senza Glutine trovi tutte queste informazioni in ogni scheda attività." },
      { question: "Cosa vuol dire contaminazione da glutine e quanto è pericolosa?", answer: "È il contatto accidentale tra un alimento senza glutine e residui di farine o utensili non dedicati: anche poche briciole possono scatenare una reazione nei celiaci, per questo cucine e forni separati offrono le maggiori garanzie." },
      { question: "Un ristorante certificato AIC è sempre sicuro al 100%?", answer: "La certificazione AIC riduce sensibilmente il rischio grazie a controlli periodici su procedure e fornitori, ma nessun locale può garantire un rischio zero assoluto: restano comunque il segnale di affidabilità più forte disponibile." },
      { question: "Cosa significa \"cucina dedicata\"?", answer: "Una cucina dedicata è un'area separata usata esclusivamente per preparazioni senza glutine, senza contatto con farine o utensili \"normali\": è l'elemento che offre la massima garanzia contro la contaminazione crociata." },
      { question: "È necessario prenotare sempre nei ristoranti senza glutine?", answer: "Non è sempre obbligatorio, ma è fortemente consigliato nei locali più noti e nei weekend, perché la cucina dedicata gestisce un numero limitato di coperti gluten free." },
    ],
  },
  {
    title: "Prodotti, spesa e diritti",
    items: [
      { question: "Quanto costa in più fare la spesa senza glutine?", answer: "I prodotti senza glutine, in particolare pane e pasta, costano in media dal 2 al 4 volte in più rispetto agli equivalenti tradizionali, a causa di filiere produttive dedicate e volumi di produzione inferiori." },
      { question: "Come funzionano i buoni pasto AIC in farmacia?", answer: "Dopo la diagnosi, il medico rilascia una certificazione che permette di richiedere alla propria ASL un buono mensile, utilizzabile in farmacia e nei negozi convenzionati per l'acquisto di prodotti sostitutivi inseriti nel Prontuario AIC." },
      { question: "Cos'è la Spiga Barrata e come si riconosce un prodotto sicuro?", answer: "È il marchio registrato dall'Associazione Italiana Celiachia che identifica i prodotti sottoposti a controlli annuali rigorosi: è il modo più rapido per riconoscere un prodotto verificato sullo scaffale." },
      { question: "Come faccio a sapere se un prodotto trasformato contiene glutine nascosto?", answer: "Controlla sempre la lista ingredienti e cerca la dicitura \"senza glutine\" o il marchio della Spiga Barrata: in caso di dubbio, il Prontuario AIC è lo strumento più affidabile per verificare migliaia di prodotti." },
    ],
  },
  {
    title: "Mappa senza glutine e gluten free: come funziona",
    items: [
      { question: "Cos'è una mappa senza glutine e a cosa serve?", answer: "Una mappa senza glutine è uno strumento che geolocalizza ristoranti, pizzerie, hotel e negozi verificati per celiaci: Mappa Senza Glutine raccoglie certificazioni AIC, cucine dedicate e recensioni della community in un'unica mappa interattiva, gratuita da consultare via browser o smartphone." },
      { question: "Dove trovo una mappa dei ristoranti gluten free vicino a me?", answer: "Su mappasenzaglutine.it: apri la mappa interattiva in home o nella sezione Directory, attiva la geolocalizzazione e filtra per categoria o certificazione AIC per vedere subito i locali gluten free più vicini a te." },
      { question: "Qual è la differenza tra \"senza glutine\" e \"gluten free\"?", answer: "Nessuna: indicano la stessa cosa. \"Gluten free\" è semplicemente la dicitura inglese, molto usata in etichetta e nelle ricerche online, mentre \"senza glutine\" è il termine ufficiale in italiano." },
      { question: "Come trovo ristoranti senza glutine vicino a me?", answer: "Usa la mappa interattiva e la directory: filtra per certificazione AIC, categoria e distanza per trovare in pochi secondi i locali verificati più vicini a te, ovunque tu sia in Italia." },
      { question: "Cos'è la certificazione AIC e perché è importante?", answer: "È il marchio rilasciato dall'Associazione Italiana Celiachia ai locali che rispettano un protocollo rigoroso su acquisti, stoccaggio e preparazione dei pasti senza glutine, verificato con controlli periodici." },
      { question: "Posso segnalare un errore su un'attività o un prodotto?", answer: "Sì, dal tuo profilo utente puoi segnalare informazioni non aggiornate: il nostro team verifica ogni segnalazione entro 48 ore lavorative." },
      { question: "Posso aggiungere la mia attività alla directory?", answer: "Certo, le aziende possono richiedere l'inserimento tramite il pannello dedicato \"Inserisci la tua attività\": dopo una verifica dei requisiti la scheda viene pubblicata gratuitamente." },
    ],
  },
  {
    title: "Colazione e gelaterie senza glutine",
    items: [
      { question: "Dove posso fare colazione senza glutine in sicurezza?", answer: "Le pasticcerie 100% dedicate al senza glutine offrono le maggiori garanzie; nei bar tradizionali verifica che il prodotto sia conservato separatamente e non tagliato o riscaldato con strumenti usati per prodotti tradizionali." },
      { question: "Le gelaterie sono sicure per i celiaci?", answer: "Dipende da come vengono gestite palette e vaschette: il rischio principale è la contaminazione tra un gusto con biscotto o wafer e uno senza glutine tramite la stessa paletta non pulita tra un uso e l'altro." },
      { question: "Il cono gelato contiene glutine?", answer: "Sì, il cono tradizionale è a base di farina di frumento: se la gelateria non offre un'alternativa certificata senza glutine, la coppetta resta la scelta più sicura." },
      { question: "Cosa devo chiedere al bar prima di ordinare un cornetto senza glutine?", answer: "Se è conservato in un espositore separato dai prodotti tradizionali e se viene riscaldato in un tostapane o forno dedicato: un tostapane condiviso lascia residui che contaminano il prodotto successivo." },
    ],
  },
  {
    title: "Viaggi, hotel e fast food senza glutine",
    items: [
      { question: "Come trovo un hotel adatto ai celiaci per le vacanze?", answer: "Cerca strutture certificate AIC, che garantiscono colazione senza glutine sicura e staff formato: verifica la certificazione direttamente sul sito dell'hotel o nella directory prima di prenotare, senza fidarti di etichette generiche come \"gluten free friendly\"." },
      { question: "I villaggi turistici con pensione completa sono sicuri per celiaci?", answer: "Possono esserlo se certificati AIC o con postazioni dedicate ai buffet: senza queste garanzie, il rischio di contaminazione crociata nelle formule self-service è più alto rispetto a un ristorante à la carte." },
      { question: "McDonald's ha opzioni davvero senza glutine?", answer: "Solo il Gluten Free Burger, sviluppato con Dr. Schär, è garantito senza glutine nella composizione: McDonald's Italia non aderisce al programma AFC dell'AIC, quindi patatine, insalate e gelati non hanno garanzia contro la contaminazione crociata." },
      { question: "Cosa devo portare in viaggio se sono celiaco?", answer: "Una scorta di prodotti senza glutine di base (pane, snack, pasta) per le emergenze, soprattutto se la meta è poco turistica e trovarli sul posto può essere difficile." },
    ],
  },
];

export const FAQ_GROUPS_EN: FaqGroup[] = [
  {
    title: "Celiac disease and diagnosis",
    items: [
      { question: "What can't a celiac eat?", answer: "A celiac must avoid wheat, barley, rye, spelt and kamut and all their derivatives (bread, pasta, pizza, traditional biscuits), plus processed products that can contain hidden gluten like thickeners, stock cubes or cold cuts." },
      { question: "How is celiac disease diagnosed? What tests are done?", answer: "Diagnosis is based on blood tests for anti-transglutaminase antibodies, followed by an endoscopy with duodenal biopsy. It's essential not to remove gluten from the diet before completing all testing." },
      { question: "Can celiac disease be cured or go away with age?", answer: "No, there is no definitive cure and celiac disease doesn't go away with age: the only effective treatment is a strictly gluten-free diet followed for life." },
      { question: "What are the symptoms of celiac disease in adults?", answer: "Bloating, abdominal pain, chronic fatigue, iron-deficiency anemia and recurring mouth ulcers are among the most common symptoms, though extraintestinal signs like dermatitis herpetiformis or early osteoporosis can also occur." },
      { question: "What's the difference between celiac disease and gluten sensitivity?", answer: "Celiac disease is an autoimmune condition with intestinal damage documentable through blood tests and biopsy; non-celiac gluten sensitivity causes similar symptoms without this damage, and is diagnosed by exclusion." },
    ],
  },
  {
    title: "Restaurants and cross-contamination",
    items: [
      { question: "How do I know if a restaurant is really safe for celiacs?", answer: "Check whether the venue is AIC-certified, whether it has a dedicated kitchen or oven, and read verified community reviews: Mappa Senza Glutine shows all of this on every listing." },
      { question: "What does gluten contamination mean and how dangerous is it?", answer: "It's accidental contact between a gluten-free food and residue from flour or non-dedicated equipment: even a few crumbs can trigger a reaction in celiacs, which is why separate kitchens and ovens offer the strongest guarantees." },
      { question: "Is an AIC-certified restaurant always 100% safe?", answer: "AIC certification significantly reduces the risk thanks to periodic checks on procedures and suppliers, but no venue can guarantee absolute zero risk: it remains the strongest reliability signal available." },
      { question: "What does \"dedicated kitchen\" mean?", answer: "A dedicated kitchen is a separate area used exclusively for gluten-free preparation, with no contact with flour or \"regular\" utensils: it's the element that offers the strongest guarantee against cross-contamination." },
      { question: "Do I always need to book ahead at gluten-free restaurants?", answer: "Not always, but it's strongly recommended at well-known venues and on weekends, because the dedicated kitchen can only handle a limited number of gluten-free covers." },
    ],
  },
  {
    title: "Products, costs and rights",
    items: [
      { question: "How much more does gluten-free grocery shopping cost?", answer: "Gluten-free products, especially bread and pasta, cost on average 2 to 4 times more than their traditional equivalents, due to dedicated production chains and lower production volumes." },
      { question: "How do AIC pharmacy vouchers work?", answer: "After diagnosis, the doctor issues a certification that lets you apply at your local ASL for a monthly voucher, usable at pharmacies and partner stores to buy substitute products listed in the AIC Food Guide." },
      { question: "What is the Crossed Grain symbol and how do I recognize a safe product?", answer: "It's the trademark registered by the Italian Celiac Association that identifies products subject to strict annual audits: it's the fastest way to spot a verified product on the shelf." },
      { question: "How can I tell if a processed product contains hidden gluten?", answer: "Always check the ingredient list and look for the \"gluten-free\" claim or the Crossed Grain symbol: when in doubt, the AIC Food Guide is the most reliable tool for checking thousands of products." },
    ],
  },
  {
    title: "Gluten-free map: how it works",
    items: [
      { question: "What is a gluten-free map and what is it for?", answer: "A gluten-free map is a tool that geolocates verified restaurants, pizzerias, hotels and shops for celiacs: Mappa Senza Glutine brings together AIC certifications, dedicated kitchens and community reviews in a single interactive map, free to use from browser or smartphone." },
      { question: "Where can I find a map of gluten-free restaurants near me?", answer: "On mappasenzaglutine.it: open the interactive map on the homepage or in the Directory section, enable location and filter by category or AIC certification to instantly see the nearest gluten-free venues." },
      { question: "Is there a difference between \"gluten-free\" and \"senza glutine\"?", answer: "No, they mean the same thing: \"senza glutine\" is simply the Italian term for \"gluten-free\", used interchangeably on labels and in online searches in Italy." },
      { question: "How do I find gluten-free restaurants near me?", answer: "Use the interactive map and directory: filter by AIC certification, category and distance to find verified nearby venues in seconds, wherever you are in Italy." },
      { question: "What is AIC certification and why does it matter?", answer: "It's the trademark awarded by the Italian Celiac Association to venues that follow a strict protocol on purchasing, storage and preparation of gluten-free meals, verified through periodic audits." },
      { question: "Can I report an error on a business or product?", answer: "Yes, from your user profile you can report outdated information: our team reviews every report within 48 business hours." },
      { question: "Can I add my business to the directory?", answer: "Of course, businesses can request a listing through the dedicated \"Add your business\" panel: after a requirements check, the listing is published for free." },
    ],
  },
  {
    title: "Gluten-free breakfast and gelaterias",
    items: [
      { question: "Where can I get gluten-free breakfast safely?", answer: "100% dedicated gluten-free bakeries offer the strongest guarantees; at traditional cafés check that the product is stored separately and not cut or heated with tools used for traditional products." },
      { question: "Are gelaterias safe for celiacs?", answer: "It depends on how scoops and tubs are managed: the main risk is contamination between a cookie- or wafer-based flavor and a gluten-free one through the same unwashed scoop." },
      { question: "Does the ice cream cone contain gluten?", answer: "Yes, the traditional cone is made with wheat flour: if the gelateria doesn't offer a certified gluten-free alternative, a cup remains the safer choice." },
      { question: "What should I ask at a café before ordering a gluten-free croissant?", answer: "Whether it's stored in a display case separate from traditional products and whether it's heated in a dedicated toaster or oven: a shared toaster leaves residue that contaminates the next item." },
    ],
  },
  {
    title: "Travel, hotels and fast food gluten-free",
    items: [
      { question: "How do I find a hotel suitable for celiacs on vacation?", answer: "Look for AIC-certified properties, which guarantee safe gluten-free breakfast and trained staff: check the certification directly on the hotel's website or in the directory before booking, rather than trusting generic \"gluten-free friendly\" labels." },
      { question: "Are full-board resorts safe for celiacs?", answer: "They can be if AIC certified or with dedicated buffet stations: without these guarantees, the risk of cross-contamination in self-service formats is higher than at an à la carte restaurant." },
      { question: "Does McDonald's have truly gluten-free options?", answer: "Only the Gluten Free Burger, developed with Dr. Schär, is guaranteed gluten-free in composition: McDonald's Italy doesn't take part in AIC's Out-of-Home Eating program, so fries, salads and ice cream have no guarantee against cross-contamination." },
      { question: "What should I bring when traveling if I have celiac disease?", answer: "A stock of basic gluten-free products (bread, snacks, pasta) for emergencies, especially if the destination is less touristy and finding them locally can be difficult." },
    ],
  },
];
