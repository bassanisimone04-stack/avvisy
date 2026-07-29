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
    title: "Usare Mappa Senza Glutine",
    items: [
      { question: "Come trovo ristoranti senza glutine vicino a me?", answer: "Usa la mappa interattiva e la directory: filtra per certificazione AIC, categoria e distanza per trovare in pochi secondi i locali verificati più vicini a te, ovunque tu sia in Italia." },
      { question: "Cos'è la certificazione AIC e perché è importante?", answer: "È il marchio rilasciato dall'Associazione Italiana Celiachia ai locali che rispettano un protocollo rigoroso su acquisti, stoccaggio e preparazione dei pasti senza glutine, verificato con controlli periodici." },
      { question: "Posso segnalare un errore su un'attività o un prodotto?", answer: "Sì, dal tuo profilo utente puoi segnalare informazioni non aggiornate: il nostro team verifica ogni segnalazione entro 48 ore lavorative." },
      { question: "Posso aggiungere la mia attività alla directory?", answer: "Certo, le aziende possono richiedere l'inserimento tramite il pannello dedicato \"Inserisci la tua attività\": dopo una verifica dei requisiti la scheda viene pubblicata gratuitamente." },
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
    title: "Using Mappa Senza Glutine",
    items: [
      { question: "How do I find gluten-free restaurants near me?", answer: "Use the interactive map and directory: filter by AIC certification, category and distance to find verified nearby venues in seconds, wherever you are in Italy." },
      { question: "What is AIC certification and why does it matter?", answer: "It's the trademark awarded by the Italian Celiac Association to venues that follow a strict protocol on purchasing, storage and preparation of gluten-free meals, verified through periodic audits." },
      { question: "Can I report an error on a business or product?", answer: "Yes, from your user profile you can report outdated information: our team reviews every report within 48 business hours." },
      { question: "Can I add my business to the directory?", answer: "Of course, businesses can request a listing through the dedicated \"Add your business\" panel: after a requirements check, the listing is published for free." },
    ],
  },
];
