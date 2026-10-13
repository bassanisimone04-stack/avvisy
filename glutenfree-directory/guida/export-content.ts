/**
 * Estrae dai dati del sito i capitoli della guida PDF "Vivere Senza Glutine".
 * Uso: npx tsx guida/export-content.ts   (scrive guida/content.json)
 * Tutto il testo viene dagli articoli gia' pubblicati e verificati: nulla e' scritto qui,
 * tranne i titoli e le introduzioni delle parti.
 */
import { writeFileSync } from "node:fs";
import { ARTICLES } from "../src/lib/mock-articles";
import { getLocalizedArticle } from "../src/lib/i18n/content-article";
import { CHECKLIST_BEFORE, CHECKLIST_TABLE, CHECKLIST_FLAGS } from "../src/lib/checklist-items";
import { PHRASES } from "../src/lib/phrasebook";

const PARTS: { id: string; it: { title: string; intro: string }; en: { title: string; intro: string }; articles: string[] }[] = [
  {
    id: "capire",
    it: { title: "Capire la celiachia", intro: "Prima di cambiare tavola conviene capire cosa succede nel corpo: cos'è la celiachia, in cosa si distingue da altre condizioni e dove si nasconde il glutine." },
    en: { title: "Understanding celiac disease", intro: "Before changing what's on your table it helps to understand what happens in the body: what celiac disease is, how it differs from other conditions and where gluten hides." },
    articles: ["art-1", "art-18", "art-52"],
  },
  {
    id: "mangiare",
    it: { title: "Cosa mangiare e come leggere le etichette", intro: "Le scelte di ogni giorno passano dall'etichetta. Questa parte mette in fila gli alimenti sicuri, quelli da evitare e i casi che confondono di più." },
    en: { title: "What to eat and how to read labels", intro: "Everyday choices go through the label. This part lines up the safe foods, the ones to avoid and the cases that confuse people most." },
    articles: ["art-16", "art-2", "art-67", "art-62", "art-54"],
  },
  {
    id: "casa-fuori",
    it: { title: "In cucina e fuori casa", intro: "Il glutine non serve in grande quantità per fare danni: bastano poche briciole. Qui si impara a gestire la cucina di casa, una cena con amici e il ristorante." },
    en: { title: "In the kitchen and eating out", intro: "It doesn't take much gluten to do damage: a few crumbs are enough. Here you learn to manage the home kitchen, a dinner with friends and the restaurant." },
    articles: ["art-12", "art-70", "art-20", "art-45", "art-64", "art-63", "art-21"],
  },
  {
    id: "pratica",
    it: { title: "Vita pratica: costi, regole e spesa", intro: "Quanto costa la dieta senza glutine, quali regole la tutelano e dove si fa la spesa." },
    en: { title: "Practical life: costs, rules and shopping", intro: "How much the gluten-free diet costs, which rules protect it and where to shop." },
    articles: ["art-17", "art-10", "art-58"],
  },
  {
    id: "viaggi-famiglia",
    it: { title: "Viaggi, famiglia e imprevisti", intro: "Quando si esce dalla routine: le vacanze, i bambini a scuola, lo svezzamento e cosa fare se il glutine arriva per errore." },
    en: { title: "Travel, family and the unexpected", intro: "When you step out of your routine: holidays, children at school, weaning and what to do if gluten arrives by mistake." },
    articles: ["art-4", "art-23", "art-5", "art-42", "art-68"],
  },
];

function chapters(locale: "it" | "en") {
  return PARTS.map((p) => ({
    id: p.id,
    title: p[locale].title,
    intro: p[locale].intro,
    chapters: p.articles.map((id) => {
      const base = ARTICLES.find((a) => a.id === id);
      if (!base) throw new Error(`articolo mancante: ${id}`);
      const a = getLocalizedArticle(base, locale);
      return { id, slug: a.slug, title: a.title, takeaways: a.keyTakeaways, html: a.contentHtml, updatedAt: a.updatedAt };
    }),
  }));
}

const out = {
  generatedFrom: "mappasenzaglutine.it",
  it: { parts: chapters("it") },
  en: { parts: chapters("en") },
  checklist: { before: CHECKLIST_BEFORE, table: CHECKLIST_TABLE, flags: CHECKLIST_FLAGS },
  phrases: PHRASES,
};
writeFileSync(new URL("./content.json", import.meta.url), JSON.stringify(out, null, 1));
const words = (h: string) => h.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
for (const l of ["it", "en"] as const) {
  const ch = out[l].parts.flatMap((p) => p.chapters);
  console.log(l, "capitoli:", ch.length, "| parole:", ch.reduce((s, c) => s + words(c.html), 0));
}
