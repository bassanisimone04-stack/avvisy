import { writeFileSync } from "node:fs";
import { articles } from "../src/data/seed-articles";
const rows = articles.map((a, i) => `| ${i + 1} | ${a.title} | \`/blog/${a.slug}\` | ${a.targetKeyword} | ${a.searchIntent || "—"} | ${a.status === "brief" ? "Brief" : "Sviluppato (bozza per revisione)"} |`);
writeFileSync("docs/EDITORIAL-PLAN.md", `# Piano editoriale USA — 20 articoli

> **I volumi di ricerca NON sono stati verificati** (nessun accesso a Semrush/Ahrefs/Keyword Planner in questo ambiente). Nessun argomento va considerato "ad alto traffico" finché non importi i dati da CSV in **Admin → Keyword & cluster** e controlli la SERP.

| # | Titolo | URL | Keyword | Intento | Stato |
|---|---|---|---|---|---|
${rows.join("\n")}

## Regole per ogni articolo
Titolo SEO ≤ 60 caratteri · meta description ≤ 155 · risposta immediata all'intento · schede prodotto collegate · alternative acquistabili · link interni · FAQ · fonti con data · data di aggiornamento.
La pubblicazione è bloccata dall'admin finché mancano revisione umana, risposta, meta, corpo e almeno una fonte.

## Articoli sviluppati (pronti per revisione editoriale)
1. What Sunglasses Does Brad Pitt Wear in F1? — identificazione contesa, etichetta *Unconfirmed*
2. Top Gun Sunglasses: Tom Cruise's Iconic Aviators
3. Men in Black Sunglasses: Original Models
4. Audrey Hepburn's Breakfast at Tiffany's Sunglasses
5. The Blues Brothers Sunglasses

Ogni affermazione proviene da fonti elencate a fondo pagina e nelle schede modello (ricerca del 2026-10-15). Le fonti sono quasi tutte secondarie (rivenditori, database di appassionati, stampa): **nessuna fonte primaria (studio, costumista, asta) è stata consultata**. Per questo molte identificazioni risultano *Unconfirmed* per regola.
`);
console.log("ok");
