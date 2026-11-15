/**
 * Frasario per turisti: frasi in italiano con una pronuncia approssimata
 * all'inglese (le maiuscole indicano la sillaba accentata). La pronuncia e'
 * una trascrizione di servizio, non fonetica ufficiale.
 */
export const PHRASES: { it: string; say: string; en: string }[] = [
  { it: "Sono celiaco / Sono celiaca", say: "SOH-noh cheh-LEE-ah-koh / cheh-LEE-ah-kah", en: "I have celiac disease (celiaco if you're a man, celiaca if you're a woman)" },
  { it: "Senza glutine, per favore", say: "SEN-tsah GLOO-tee-neh, pehr fah-VOH-reh", en: "Gluten-free, please" },
  { it: "Non posso mangiare il glutine", say: "nohn POHS-soh mahn-JAH-reh eel GLOO-tee-neh", en: "I can't eat gluten" },
  { it: "Avete un menu senza glutine?", say: "ah-VEH-teh oon meh-NOO SEN-tsah GLOO-tee-neh", en: "Do you have a gluten-free menu?" },
  { it: "La friggitrice è separata?", say: "lah freed-jee-TREE-cheh eh seh-pah-RAH-tah", en: "Is the fryer separate?" },
  { it: "Il forno è dedicato?", say: "eel FOR-noh eh deh-dee-KAH-toh", en: "Is the oven dedicated?" },
  { it: "Cuocete la pasta senza glutine in acqua separata?", say: "kwoh-CHEH-teh lah PAH-stah SEN-tsah GLOO-tee-neh een AH-kwah seh-pah-RAH-tah", en: "Do you cook the gluten-free pasta in separate water?" },
  { it: "Aderite al programma AIC?", say: "ah-deh-REE-teh ahl proh-GRAHM-mah AH-ee-CHEE", en: "Do you take part in the AIC program?" },
];

export function phrasebookList(): string {
  return (
    "<ul>" +
    PHRASES.map((p) => `<li><strong>${p.it}</strong><br /><em>say: ${p.say}</em><br />${p.en}</li>`).join("") +
    "</ul>"
  );
}

/** Sezione inglese da aggiungere alle guide delle citta' e alla guida per turisti. */
export const PHRASEBOOK_EN_SECTION = {
  h2: "Phrasebook: how to say it in Italian",
  body:
    "Show these on your phone or say them out loud. The pronunciation is an approximate English-style respelling: the capital letters mark the stressed syllable. Always say you have celiac disease («Sono celiaco/a»), not that you prefer gluten-free: it changes how the kitchen handles the order." +
    phrasebookList() +
    'A printable version of the questions is in our <a href="/en/checklist-ristorante">restaurant checklist</a>.',
};

// Guide delle citta' (id articolo) a cui si aggiunge il frasario nella versione inglese.
export const CITY_GUIDE_IDS = new Set(["art-15", "art-19", "art-28", "art-29", "art-30", "art-31", "art-32", "art-33", "art-73"]);
