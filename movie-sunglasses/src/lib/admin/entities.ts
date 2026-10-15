import type { CollectionName } from "../types";
import { LICENSES } from "../photos";

export type FieldType = "text" | "textarea" | "number" | "select" | "ref" | "refs" | "boolean" | "date" | "datetime" | "tags" | "pairs" | "url";
export interface Field {
  name: string; label: string; type: FieldType; required?: boolean; nullable?: boolean;
  options?: [string, string][]; ref?: CollectionName; help?: string; pairKeys?: [string, string]; rows?: number; placeholder?: string;
}
export interface EntityConfig {
  key: CollectionName; label: string; singular: string; group: "Contenuti" | "Commercio" | "Editoriale" | "Sistema";
  fields: Field[]; columns: string[]; publicPath?: (row: Record<string, unknown>) => string;
  /** Blocks deletion while other rows still point to this one. */
  uses?: [CollectionName, string, boolean?][]; noCreate?: boolean; help?: string;
}

const MATCH: [string, string][] = [["exact", "Exact Match"], ["official_reissue", "Official Reissue"], ["similar", "Similar Style"], ["unconfirmed", "Unconfirmed"]];
const STATUS: [string, string][] = [["in_production", "In produzione"], ["discontinued", "Fuori produzione"], ["vintage", "Vintage"], ["unknown", "Non verificato"]];
const BAND: [string, string][] = [["under50", "Sotto $50"], ["under100", "Sotto $100"], ["under200", "Sotto $200"], ["over200", "Oltre $200"]];
const SHAPES = ["aviator", "wayfarer", "cat-eye", "rectangular", "oval", "round", "wrap", "browline", "other"].map((s) => [s, s] as [string, string]);

export const ENTITIES: EntityConfig[] = [
  { key: "movies", label: "Film e serie", singular: "film", group: "Contenuti", columns: ["title", "year", "kind", "genre"], publicPath: (r) => `/movies/${r.slug}`,
    uses: [["appearances", "movieId"], ["characters", "movieId"], ["articles", "movieIds", true], ["photos", "movieId"]],
    fields: [
      { name: "title", label: "Titolo", type: "text", required: true }, { name: "slug", label: "Slug (URL)", type: "text", help: "Lascia vuoto per generarlo dal titolo. Se lo cambi viene creato un redirect 301 automatico." },
      { name: "year", label: "Anno", type: "number", required: true }, { name: "kind", label: "Tipo", type: "select", required: true, options: [["film", "Film"], ["series", "Serie TV"]] },
      { name: "genre", label: "Genere", type: "text", required: true }, { name: "trailerUrl", label: "Trailer ufficiale (link YouTube)", type: "url", help: "Solo dal canale ufficiale dello studio. Il video parte solo quando il visitatore preme Play (nessun tracciamento prima)." }, { name: "synopsis", label: "Sinossi (breve, fattuale)", type: "textarea", required: true, rows: 3 },
    ] },
  { key: "actors", label: "Attori", singular: "attore", group: "Contenuti", columns: ["name"], publicPath: (r) => `/actors/${r.slug}`,
    uses: [["characters", "actorId"], ["appearances", "actorId"]],
    fields: [{ name: "name", label: "Nome", type: "text", required: true }, { name: "slug", label: "Slug (URL)", type: "text" }, { name: "bio", label: "Bio breve (opzionale)", type: "textarea", rows: 3 }] },
  { key: "characters", label: "Personaggi", singular: "personaggio", group: "Contenuti", columns: ["name", "movieId", "actorId"], uses: [["appearances", "characterId"]],
    fields: [{ name: "name", label: "Nome personaggio", type: "text", required: true }, { name: "movieId", label: "Film", type: "ref", ref: "movies", required: true }, { name: "actorId", label: "Attore", type: "ref", ref: "actors", required: true }] },
  { key: "brands", label: "Marchi", singular: "marchio", group: "Contenuti", columns: ["name", "country"], publicPath: (r) => `/brands/${r.slug}`, uses: [["models", "brandId"]],
    fields: [{ name: "name", label: "Nome", type: "text", required: true }, { name: "slug", label: "Slug (URL)", type: "text" }, { name: "country", label: "Paese", type: "text", required: true },
      { name: "description", label: "Descrizione", type: "textarea", required: true, rows: 3 }, { name: "website", label: "Sito ufficiale", type: "url" }] },
  { key: "models", label: "Occhiali (modelli)", singular: "modello", group: "Contenuti", columns: ["name", "brandId", "shape", "status", "reviewed"], publicPath: (r) => `/sunglasses/${r.slug}`,
    uses: [["appearances", "modelId"], ["offers", "modelId"], ["alternatives", "originalModelId"], ["alternatives", "alternativeModelId"], ["photos", "modelId"], ["articles", "modelIds", true]],
    help: "Un modello può comparire in più film: collegalo da «Identificazioni».",
    fields: [
      { name: "name", label: "Nome modello", type: "text", required: true }, { name: "slug", label: "Slug (URL)", type: "text" },
      { name: "brandId", label: "Marchio", type: "ref", ref: "brands", required: true }, { name: "modelCode", label: "Codice/riferimento", type: "text" },
      { name: "shape", label: "Forma", type: "select", required: true, options: SHAPES }, { name: "styleTags", label: "Tag stile (vintage, futuristic, folding…)", type: "tags" },
      { name: "frameColor", label: "Colore montatura", type: "text", required: true }, { name: "lensColor", label: "Colore lenti", type: "text", required: true },
      { name: "status", label: "Stato", type: "select", required: true, options: STATUS },
      { name: "priceBand", label: "Fascia di prezzo editoriale", type: "select", options: BAND, help: "Stima editoriale, mostrata come «est.». Se esistono offerte reali, prevale il prezzo reale." },
      { name: "description", label: "Descrizione", type: "textarea", required: true, rows: 4 },
      { name: "specs", label: "Caratteristiche tecniche verificate (una per riga: Etichetta | Valore)", type: "pairs", pairKeys: ["label", "value"], rows: 5 },
      { name: "reviewed", label: "Revisionato da un editor", type: "boolean" }, { name: "verifiedAt", label: "Data ultima verifica", type: "date", nullable: true },
    ] },
  { key: "appearances", label: "Identificazioni (modello ↔ film)", singular: "identificazione", group: "Contenuti", columns: ["modelId", "movieId", "actorId", "matchType"], uses: [["evidence", "appearanceId"]],
    help: "L'etichetta scelta qui è la proposta editoriale: il sito la mantiene solo se le prove (fonti) la sostengono.",
    fields: [
      { name: "modelId", label: "Modello", type: "ref", ref: "models", required: true }, { name: "movieId", label: "Film", type: "ref", ref: "movies", required: true },
      { name: "actorId", label: "Attore", type: "ref", ref: "actors", required: true }, { name: "characterId", label: "Personaggio", type: "ref", ref: "characters", required: true },
      { name: "matchType", label: "Etichetta proposta", type: "select", required: true, options: MATCH }, { name: "notes", label: "Note (cosa è certo e cosa no)", type: "textarea", rows: 4 },
    ] },
  { key: "evidence", label: "Prove e fonti", singular: "fonte", group: "Contenuti", columns: ["appearanceId", "sourceTitle", "sourceType", "stance", "checkedAt"],
    fields: [
      { name: "appearanceId", label: "Identificazione", type: "ref", ref: "appearances", required: true }, { name: "sourceType", label: "Tipo di fonte", type: "select", required: true, options: [["primary", "Primaria (studio, costumista, asta)"], ["brand", "Marchio"], ["press", "Stampa"], ["reference", "Enciclopedia/riferimento"], ["fan_database", "Database di appassionati"], ["retailer", "Rivenditore/blog commerciale"]] },
      { name: "sourceTitle", label: "Titolo fonte", type: "text", required: true }, { name: "sourceUrl", label: "URL", type: "url", required: true },
      { name: "supports", label: "Cosa sostiene", type: "text", required: true }, { name: "stance", label: "Posizione", type: "select", options: [["supports", "Sostiene"], ["disputes", "Contesta"]], required: true },
      { name: "checkedAt", label: "Data verifica", type: "date", required: true },
    ] },
  { key: "alternatives", label: "Alternative economiche", singular: "alternativa", group: "Contenuti", columns: ["originalModelId", "alternativeModelId", "reason"],
    fields: [{ name: "originalModelId", label: "Modello originale", type: "ref", ref: "models", required: true }, { name: "alternativeModelId", label: "Alternativa", type: "ref", ref: "models", required: true }, { name: "reason", label: "Perché è simile", type: "text", required: true }] },
  { key: "photos", label: "Fotografie autorizzate", singular: "foto", group: "Contenuti", columns: ["modelId", "movieId", "kind", "license", "approved"],
    help: "Una foto va online solo se «approvata», e si approva solo con prova dei diritti (vedi docs/PHOTOS.md). Carica il file su Supabase Storage (o un CDN tuo) e incolla qui l'URL https.",
    fields: [
      { name: "url", label: "URL immagine (https)", type: "url", required: true }, { name: "alt", label: "Testo alternativo (descrivi cosa si vede)", type: "text", required: true },
      { name: "kind", label: "Tipo", type: "select", required: true, options: [["product", "Prodotto (packshot: schede e card)"], ["scene", "Scena/fotogramma (film, articolo)"]] },
      { name: "credit", label: "Credito (autore / agenzia)", type: "text", required: true },
      { name: "license", label: "Come hai ottenuto i diritti", type: "select", required: true, options: LICENSES.map((l) => [l.value, l.label] as [string, string]), help: "Tutto tranne «Scatto nostro» richiede il link alla prova dei diritti." },
      { name: "licenseUrl", label: "Link alla prova dei diritti (licenza, ricevuta, termini presskit, pagina Commons)", type: "url" }, { name: "sourceUrl", label: "Pagina di origine (obbligatoria per il fair use)", type: "url" },
      { name: "rightsNote", label: "Solo fair use: motivazione scritta (commento/identificazione, come limiti l'uso)", type: "textarea", rows: 3, help: "Esempio: «Fotogramma ridotto, mostrato accanto all'analisi delle prove sul modello di occhiali indossato; non sostituisce il film; credito allo studio»." },
      { name: "modelId", label: "Modello", type: "ref", ref: "models" }, { name: "movieId", label: "Film", type: "ref", ref: "movies" }, { name: "articleId", label: "Articolo", type: "ref", ref: "articles" },
      { name: "approved", label: "Diritti verificati: pubblica", type: "boolean" }] },
  { key: "merchants", label: "Negozi / programmi affiliati", singular: "negozio", group: "Commercio", columns: ["name", "network", "active"], uses: [["offers", "merchantId"]],
    fields: [{ name: "name", label: "Nome", type: "text", required: true }, { name: "slug", label: "Slug", type: "text" }, { name: "network", label: "Rete affiliata / stato programma", type: "text", required: true }, { name: "domain", label: "Dominio", type: "text", required: true },
      { name: "searchUrlTemplate", label: "Template link di ricerca (usa {q})", type: "url", help: "Link di ricerca senza prezzo, usati quando non esistono offerte verificate." },
      { name: "affiliateParams", label: "Parametri affiliato (es. campid=123&customid=sito)", type: "text", help: "Aggiunti ai link in uscita. Compila solo dopo l'approvazione del programma." },
      { name: "estimatedEpc", label: "EPC stimato (USD per clic)", type: "number", nullable: true, help: "Ipotesi editoriale usata SOLO per la riga «ricavi stimati»." }, { name: "active", label: "Attivo", type: "boolean" }] },
  { key: "offers", label: "Offerte e prezzi", singular: "offerta", group: "Commercio", columns: ["modelId", "merchantId", "price", "availability", "lastChecked"],
    help: "Inserisci solo prezzi verificati sul negozio o provenienti da un feed affiliato. Il sito non ne inventa. Per molte offerte usa «Importa CSV» (link nella barra laterale).",
    fields: [{ name: "modelId", label: "Modello", type: "ref", ref: "models", required: true }, { name: "merchantId", label: "Negozio", type: "ref", ref: "merchants", required: true },
      { name: "price", label: "Prezzo (vuoto = sconosciuto)", type: "number", nullable: true }, { name: "currency", label: "Valuta", type: "select", required: true, options: [["USD", "USD"]] },
      { name: "availability", label: "Disponibilità", type: "select", required: true, options: [["in_stock", "Disponibile"], ["limited", "Scorte limitate"], ["out_of_stock", "Esaurito"], ["unknown", "Da verificare"]] },
      { name: "shipping", label: "Spedizione (es. «Free over $50», «$6.95»)", type: "text" }, { name: "url", label: "URL offerta/affiliato (https)", type: "url", required: true }, { name: "lastChecked", label: "Ultimo controllo", type: "date", required: true }] },
  { key: "revenue", label: "Ricavi (reali e stimati)", singular: "voce ricavo", group: "Commercio", columns: ["merchantId", "periodStart", "periodEnd", "amount", "kind"],
    help: "«Reale» = importo da report della rete affiliata. «Stimato» = ipotesi manuale. Restano sempre separati nelle statistiche.",
    fields: [{ name: "merchantId", label: "Negozio", type: "ref", ref: "merchants", required: true }, { name: "periodStart", label: "Dal", type: "date", required: true }, { name: "periodEnd", label: "Al", type: "date", required: true },
      { name: "amount", label: "Importo (USD)", type: "number", required: true }, { name: "kind", label: "Tipo", type: "select", required: true, options: [["reported", "Reale (da report affiliato)"], ["estimated", "Stimato"]] }, { name: "note", label: "Note / riferimento report", type: "text" }] },
  { key: "articles", label: "Articoli SEO", singular: "articolo", group: "Editoriale", columns: ["title", "status", "reviewed", "updatedAt"], publicPath: (r) => `/blog/${r.slug}`, uses: [["photos", "articleId"]],
    fields: [
      { name: "title", label: "Titolo (H1)", type: "text", required: true }, { name: "slug", label: "Slug (URL)", type: "text" },
      { name: "metaTitle", label: "Meta title (≤ 60 caratteri)", type: "text" }, { name: "metaDescription", label: "Meta description (≤ 155 caratteri)", type: "textarea", rows: 2 },
      { name: "excerpt", label: "Estratto", type: "textarea", rows: 2 }, { name: "answer", label: "Risposta immediata all'intento di ricerca", type: "textarea", rows: 3 },
      { name: "body", label: "Corpo (## titoli, - elenchi, **grassetto**, [testo](/percorso))", type: "textarea", rows: 18 },
      { name: "faq", label: "FAQ (una per riga: Domanda | Risposta)", type: "pairs", pairKeys: ["q", "a"], rows: 5 }, { name: "sources", label: "Fonti (una per riga: Titolo | URL)", type: "pairs", pairKeys: ["title", "url"], rows: 5 },
      { name: "modelIds", label: "Modelli collegati", type: "refs", ref: "models" }, { name: "movieIds", label: "Film collegati", type: "refs", ref: "movies" },
      { name: "category", label: "Categoria", type: "text", required: true }, { name: "targetKeyword", label: "Keyword principale", type: "text" }, { name: "searchIntent", label: "Intento di ricerca", type: "text" },
      { name: "status", label: "Stato", type: "select", required: true, options: [["brief", "Brief"], ["draft", "Bozza"], ["in_review", "In revisione"], ["scheduled", "Programmato"], ["published", "Pubblicato"]] },
      { name: "publishAt", label: "Pubblica il (per «Programmato»)", type: "datetime", nullable: true },
      { name: "reviewed", label: "Revisione umana completata (obbligatoria per pubblicare)", type: "boolean" },
    ] },
  { key: "keywords", label: "Keyword", singular: "keyword", group: "Editoriale", columns: ["term", "volume", "targetUrl", "cluster", "intent"],
    help: "Importa un CSV dalla pagina «Keyword & cluster». Il volume resta vuoto finché non lo verifichi con Semrush, Ahrefs o Keyword Planner.",
    fields: [{ name: "term", label: "Keyword", type: "text", required: true }, { name: "volume", label: "Volume mensile (verificato)", type: "number", nullable: true }, { name: "difficulty", label: "Difficoltà", type: "number", nullable: true },
      { name: "intent", label: "Intento", type: "text" }, { name: "cluster", label: "Cluster", type: "text" }, { name: "source", label: "Fonte del dato", type: "text" }, { name: "articleId", label: "Articolo collegato", type: "ref", ref: "articles" }, { name: "targetUrl", label: "Pagina di destinazione (es. /movies/top-gun)", type: "text", help: "Una keyword → una pagina, per evitare cannibalizzazione." }] },
  { key: "redirects", label: "Redirect", singular: "redirect", group: "Sistema", columns: ["from", "to", "permanent"],
    fields: [{ name: "from", label: "Da (percorso, es. /vecchio)", type: "text", required: true }, { name: "to", label: "A (percorso interno)", type: "text", required: true }, { name: "permanent", label: "Permanente (301)", type: "boolean" }] },
  { key: "messages", label: "Messaggi dal sito", singular: "messaggio", group: "Sistema", columns: ["at", "name", "email", "subject", "handled"], noCreate: true,
    fields: [{ name: "name", label: "Nome", type: "text", required: true }, { name: "email", label: "Email", type: "text", required: true }, { name: "subject", label: "Oggetto", type: "text" }, { name: "body", label: "Messaggio", type: "textarea", rows: 8 }, { name: "handled", label: "Gestito", type: "boolean" }] },
];

export const entityByKey = (k: string) => ENTITIES.find((e) => e.key === k);

/** Human label for any row, used in lists and ref selects. */
export function rowLabel(name: CollectionName, r: Record<string, unknown>): string {
  const s = (k: string) => String(r[k] ?? "");
  switch (name) {
    case "movies": return `${s("title")} (${s("year")})`;
    case "characters": return `${s("name")} — ${s("movieId")}`;
    case "articles": return s("title");
    case "keywords": return s("term");
    case "appearances": return `${s("modelId")} ↔ ${s("movieId")} (${s("characterId")})`;
    case "evidence": return `${s("sourceTitle")}`;
    case "offers": return `${s("modelId")} @ ${s("merchantId")}`;
    case "alternatives": return `${s("originalModelId")} → ${s("alternativeModelId")}`;
    case "redirects": return `${s("from")} → ${s("to")}`;
    case "photos": return `${s("alt")}`;
    case "revenue": return `${s("merchantId")} ${s("periodStart")}`;
    case "messages": return `${s("name")}: ${s("subject")}`;
    default: return s("name") || s("id");
  }
}
