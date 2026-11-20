/**
 * Genera i PDF de "La Guida CineFood Italia" (IT + EN) dai contenuti del sito.
 *
 *   node scripts/guida-pdf.mjs
 *
 * Legge src/content/restaurants/*.md e src/content/films/*.md (+ traduzioni EN da
 * src/i18n/content-en.ts) e scrive in docs/guida/. Il PDF NON va messo in public/:
 * si carica a mano su Payhip (checkoutUrl in src/config/site.ts).
 * Richiede Chromium (Playwright) e `pdfunite` (poppler-utils) per unire copertina e corpo.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import yaml from "js-yaml";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright"); // Playwright può essere installato globalmente (NODE_PATH)
import { build } from "esbuild";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "docs", "guida");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "guida-"));
fs.mkdirSync(OUT, { recursive: true });

// ---------- dati ----------
const split = (p) => {
  const t = fs.readFileSync(p, "utf8");
  const m = t.match(/^---\n([\s\S]*?)\n---/);
  return yaml.load(m[1]);
};
const list = (dir) =>
  fs.readdirSync(path.join(ROOT, "src/content", dir)).filter((f) => f.endsWith(".md") && !f.startsWith("_"));

const films = {};
for (const f of list("films")) films[f.slice(0, -3)] = split(path.join(ROOT, "src/content/films", f));
const venues = list("restaurants").map((f) => ({ slug: f.slice(0, -3), ...split(path.join(ROOT, "src/content/restaurants", f)) }));

// traduzioni EN (file TS -> bundle temporaneo)
await build({
  entryPoints: [path.join(ROOT, "src/i18n/content-en.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: path.join(TMP, "content-en.mjs"),
  logLevel: "silent",
});
const { filmsEn, restaurantsEn } = await import(path.join(TMP, "content-en.mjs"));

// ---------- testi ----------
const REGION_EN = {
  Toscana: "Tuscany", Lombardia: "Lombardy", Piemonte: "Piedmont", Sardegna: "Sardinia", Sicilia: "Sicily",
  "Valle d'Aosta": "Aosta Valley",
};
const CITY_EN = { Roma: "Rome", Milano: "Milan", Napoli: "Naples", Venezia: "Venice", Torino: "Turin", Firenze: "Florence" };
const TIPO = {
  it: { ristorante: "Ristorante", trattoria: "Trattoria", bar: "Bar", "caffè": "Caffè", pasticceria: "Pasticceria", pizzeria: "Pizzeria" },
  en: { ristorante: "Restaurant", trattoria: "Trattoria", bar: "Bar", "caffè": "Café", pasticceria: "Pastry shop", pizzeria: "Pizzeria" },
};
const AREAS = [
  { id: "roma", it: "Roma e Lazio", en: "Rome and Lazio", regions: ["Lazio"] },
  { id: "napoli", it: "Napoli e la costa", en: "Naples and the coast", regions: ["Campania"] },
  { id: "sicilia", it: "Sicilia", en: "Sicily", regions: ["Sicilia"] },
  {
    id: "nord", it: "Nord Italia", en: "Northern Italy",
    regions: ["Lombardia", "Piemonte", "Veneto", "Liguria", "Friuli-Venezia Giulia", "Valle d'Aosta", "Emilia-Romagna"],
  },
];
const MONTHS = {
  it: ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
};
const EDITION = { y: 2026, m: 10 }; // novembre 2026

const T = {
  it: {
    file: "La-Guida-CineFood-Italia.pdf",
    title: "La Guida CineFood Italia",
    sub: "Dove hanno mangiato i tuoi personaggi preferiti",
    edition: `Edizione ${MONTHS.it[EDITION.m]} ${EDITION.y}`,
    welcomeH: "Come usare questa guida",
    welcome: (n) => `Questa guida raccoglie <strong>${n.venues} ristoranti, bar, caffè e trattorie reali</strong> d'Italia legati a <strong>${n.films} film e serie TV</strong>, in <strong>${n.regions} regioni</strong>. Ogni scheda riporta indirizzo, fascia di prezzo, la scena a cui il locale è collegato e la data dell'ultimo controllo.`,
    legendH: "Come leggere le schede",
    legend: [
      ["Set reale", "Il film o la serie è stato girato davvero in questo locale."],
      ["Legato al film", "Il locale esiste ed è collegato all'opera (vicino al set o al fenomeno raccontato), ma <strong>non è stato girato lì</strong>."],
      ["Chiuso", "Locale non più attivo, mantenuto per il suo valore storico. Non andare a cercarlo."],
    ],
    fasciaH: "Fasce di prezzo",
    fascia: "€ economico · €€ medio · €€€ alto · €€€€ molto alto (indicative, per persona).",
    verifyH: "Come sono verificate le informazioni",
    verify: "Gli abbinamenti locale–film vengono pubblicati solo se supportati da una fonte verificabile: sito del locale, film commission o materiali di produzione, stampa riconosciuta. Quando le fonti si contraddicono, l'abbinamento viene scartato. Orari, prezzi e disponibilità cambiano: <strong>controlla sempre prima di partire</strong>; ogni scheda indica la data dell'ultimo controllo.",
    tocH: "Indice",
    areasH: "Percorsi per area",
    areasIntro: "Quattro aree con più locali: i locali raggruppati per città, con link alla mappa. Non sono itinerari con tempi di percorrenza: usali come punto di partenza per organizzare il viaggio.",
    regionsH: "Tutti i locali per regione",
    filmsH: "Indice per film e serie",
    filmsIntro: "Trova subito il tuo film preferito e i locali collegati.",
    closing: "Grazie per aver scelto la guida",
    closingText: "Trovi ogni scheda, aggiornata e con la mappa, su <strong>cinefooditalia.com</strong>. Se vedi un dato cambiato o sbagliato, scrivici: lo controlliamo e lo correggiamo.",
    cover: "Immagine di copertina generata con intelligenza artificiale.",
    legalNote: "Guida a scopo informativo e turistico, non sponsorizzata dai locali citati. I marchi e i titoli appartengono ai rispettivi proprietari.",
    page: "pag.",
    address: "Indirizzo", price: "Prezzo", status: "Stato", scene: "La scena", site: "Sito", map: "Mappa", checked: "Ultimo controllo",
    open: "Aperto", closed: "Chiuso", tempClosed: "Temporaneamente chiuso",
    setReale: "Set reale", legato: "Legato al film", tema: "A tema cinema",
    venuesWord: "locali", series: "serie TV", film: "film",
    inFilm: "Nel film/serie",
    openMap: "Apri su Google Maps",
  },
  en: {
    file: "The-CineFood-Italia-Guide.pdf",
    title: "The CineFood Italia Guide",
    sub: "Where your favourite characters ate",
    edition: `${MONTHS.en[EDITION.m]} ${EDITION.y} edition`,
    welcomeH: "How to use this guide",
    welcome: (n) => `This guide collects <strong>${n.venues} real restaurants, bars, cafés and trattorias</strong> across Italy linked to <strong>${n.films} films and TV series</strong>, in <strong>${n.regions} regions</strong>. Each entry gives the address, price range, the scene the venue is linked to and the date of the last check.`,
    legendH: "How to read the entries",
    legend: [
      ["Real set", "The film or series was actually shot in this venue."],
      ["Linked to the film", "The venue exists and is linked to the work (near the set or to the phenomenon it portrays), but <strong>it was not filmed there</strong>."],
      ["Closed", "No longer operating, kept for its historical value. Don't go looking for it."],
    ],
    fasciaH: "Price ranges",
    fascia: "€ budget · €€ mid-range · €€€ upscale · €€€€ very high (indicative, per person).",
    verifyH: "How the information is verified",
    verify: "Venue–film pairings are published only when backed by a verifiable source: the venue's own website, film commissions or production materials, recognised press. When sources contradict each other, the pairing is dropped. Hours, prices and availability change: <strong>always check before you travel</strong>; each entry shows the date of the last check.",
    tocH: "Contents",
    areasH: "Routes by area",
    areasIntro: "Four areas with the most venues: venues grouped by city, with map links. These are not timed itineraries: use them as a starting point to plan your trip.",
    regionsH: "All venues by region",
    filmsH: "Index by film and series",
    filmsIntro: "Find your favourite title and the linked venues.",
    closing: "Thank you for choosing the guide",
    closingText: "Every entry, kept up to date and with a map, is on <strong>cinefooditalia.com</strong>. If you spot something that has changed or is wrong, write to us: we will check and correct it.",
    cover: "Cover image generated with artificial intelligence.",
    legalNote: "Guide for information and tourism purposes, not sponsored by the venues mentioned. Brands and titles belong to their respective owners.",
    page: "p.",
    address: "Address", price: "Price", status: "Status", scene: "The scene", site: "Website", map: "Map", checked: "Last checked",
    open: "Open", closed: "Closed", tempClosed: "Temporarily closed",
    setReale: "Real set", legato: "Linked to the film", tema: "Cinema-themed",
    venuesWord: "venues", series: "TV series", film: "film",
    inFilm: "In the film/series",
    openMap: "Open in Google Maps",
  },
};

// ---------- helpers ----------
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const fmtDate = (d, lang) => {
  const dt = new Date(d);
  return `${dt.getUTCDate()} ${MONTHS[lang][dt.getUTCMonth()]} ${dt.getUTCFullYear()}`;
};
const regionName = (r, lang) => (lang === "en" ? REGION_EN[r] ?? r : r);
const cityName = (c, lang) => (lang === "en" ? CITY_EN[c] ?? c : c);
const filmTitle = (slug, lang) => (lang === "en" ? filmsEn[slug]?.titolo ?? films[slug].titolo : films[slug].titolo);
const mapUrl = (v) => `https://www.google.com/maps/search/?api=1&query=${v.coordinate?.lat ?? v.coordinate?.lat}`;
const gmap = (v) => `https://www.google.com/maps/search/?api=1&query=${v.coordinate.lat},${v.coordinate.lng}`;
const filmId = (f) => (typeof f === "string" ? f : f.id ?? f);

const cmpIt = new Intl.Collator("it", { sensitivity: "base" });
venues.sort((a, b) => cmpIt.compare(a.regione, b.regione) || cmpIt.compare(a.citta, b.citta) || cmpIt.compare(a.nome, b.nome));

const filmsWithVenues = [...new Set(venues.flatMap((v) => v.film.map((x) => filmId(x.film))))].filter((s) => films[s]);
const regionsList = [...new Set(venues.map((v) => v.regione))].sort(cmpIt.compare);
const nums = { venues: venues.length, films: filmsWithVenues.length, regions: regionsList.length };

const fonts = `
@font-face{font-family:"PF";font-weight:700;src:url("file://${ROOT}/node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2")}
@font-face{font-family:"PF";font-weight:800;src:url("file://${ROOT}/node_modules/@fontsource/playfair-display/files/playfair-display-latin-800-normal.woff2")}
@font-face{font-family:"PF";font-weight:700;font-style:italic;src:url("file://${ROOT}/node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-italic.woff2")}
@font-face{font-family:"IN";font-weight:100 900;src:url("file://${ROOT}/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")}
`;

const css = `
${fonts}
@page{size:A4;margin:18mm 17mm 20mm 17mm}
*{box-sizing:border-box}
body{font-family:"IN",sans-serif;font-size:9.6pt;line-height:1.5;color:#2b2420;margin:0}
h1,h2,h3{font-family:"PF",Georgia,serif;margin:0}
h2.part{position:relative;font-size:23pt;color:#7a1f2b;border-bottom:2px solid #c99a2e;padding-bottom:6px;margin:0 0 14px;break-before:page}
h3.region{font-size:17pt;color:#7a1f2b;margin:18px 0 8px;break-after:avoid;position:relative}
h3.region small{font:600 9pt "IN";color:#8a7a6a;margin-left:8px}
.marker{position:absolute;color:#fff;font-size:1px;line-height:1px;left:0;top:0}
.lead{font-size:11pt;color:#4a3f38}
.box{background:#faf3e3;border-left:4px solid #c99a2e;border-radius:4px;padding:9px 12px;margin:10px 0}
.venue{border:1px solid #e6dcc6;border-radius:8px;padding:10px 13px;margin:0 0 10px;break-inside:avoid;background:#fffdf8}
.venue h4{font:700 12.5pt "PF",serif;margin:0 0 2px;color:#2b2420}
.meta{font-size:8.6pt;color:#6b5d52;margin-bottom:5px}
.badge{display:inline-block;font:700 7.2pt "IN";letter-spacing:.04em;text-transform:uppercase;border-radius:20px;padding:1px 8px;margin-right:4px}
.b-set{background:#1f6b45;color:#fff}.b-leg{background:#c99a2e;color:#2b2420}.b-cl{background:#8b1e1e;color:#fff}.b-ok{background:#efe6d0;color:#4a3f38}
.scene{margin:5px 0;padding-left:9px;border-left:2px solid #c99a2e}
.scene b{color:#7a1f2b}
.small{font-size:8.2pt;color:#6b5d52}
a{color:#7a1f2b;text-decoration:none}
.toc{columns:2;column-gap:28px;margin-top:8px}
.toc div{display:flex;justify-content:space-between;border-bottom:1px dotted #cdbf9f;padding:2px 0;break-inside:avoid}
.area{margin:8px 0 14px;break-inside:avoid}
.area h3{font-size:14pt;color:#7a1f2b;margin:10px 0 4px}
.area .city{font-weight:700;margin-top:6px}
.area li{margin:1px 0}
ul{margin:2px 0 6px 16px;padding:0}
.filmidx .f{break-inside:avoid;margin:0 0 7px}
.filmidx .f b{font-family:"PF",serif;font-size:10.5pt}
.cols{columns:2;column-gap:26px}
.closing{text-align:center;margin-top:60px}
`;

function venueHtml(v, lang) {
  const t = T[lang];
  const re = restaurantsEn[v.slug] ?? {};
  const desc = lang === "en" ? re.descrizione ?? v.descrizione : v.descrizione;
  const cat = v.categoria === "set-reale" ? [t.setReale, "b-set"] : v.categoria === "legato-al-film" ? [t.legato, "b-leg"] : [t.tema, "b-ok"];
  const st = v.stato === "chiuso" ? [t.closed, "b-cl"] : v.stato === "temporaneamente-chiuso" ? [t.tempClosed, "b-cl"] : [t.open, "b-ok"];
  const scenes = v.film
    .map((x) => {
      const id = filmId(x.film);
      const txt = lang === "en" ? re.scena?.[id] ?? x.descrizioneScena : x.descrizioneScena;
      return `<div class="scene"><b>${esc(filmTitle(id, lang))}</b> (${films[id].anno}) — ${esc(txt)}</div>`;
    })
    .join("");
  return `<div class="venue" id="v-${v.slug}">
    <h4>${esc(v.nome)}</h4>
    <div class="meta">${esc(TIPO[lang][v.tipo])} · ${esc(cityName(v.citta, lang))} (${esc(regionName(v.regione, lang))}) · ${esc(v.prezzo)}</div>
    <div><span class="badge ${cat[1]}">${esc(cat[0])}</span><span class="badge ${st[1]}">${esc(st[0])}</span></div>
    ${scenes}
    <p style="margin:5px 0">${esc(desc)}</p>
    <div class="small"><b>${t.address}:</b> ${esc(v.indirizzo)} · <a href="${gmap(v)}">${t.openMap}</a>${v.sitoWeb ? ` · <b>${t.site}:</b> <a href="${esc(v.sitoWeb)}">${esc(v.sitoWeb.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a>` : ""}${v.orari ? `<br><b>${lang === "en" ? "Hours" : "Orari"}:</b> ${esc(v.orari)}` : ""}<br>${t.checked}: ${fmtDate(v.ultimoAggiornamento, lang)}</div>
  </div>`;
}

function bodyHtml(lang, pages = {}, markers = true) {
  const mk = (s) => (markers ? `<span class="marker">§§${s}§§</span>` : "");
  const t = T[lang];
  const pg = (k) => (pages[k] ? pages[k] : "");
  const regionsHtml = regionsList
    .map((r) => {
      const vs = venues.filter((v) => v.regione === r);
      return `<h3 class="region" id="r-${esc(r)}">${mk("R:" + r)}${esc(regionName(r, lang))}<small>${vs.length} ${t.venuesWord}</small></h3>${vs.map((v) => venueHtml(v, lang)).join("")}`;
    })
    .join("");

  const areasHtml = AREAS.map((a) => {
    const vs = venues.filter((v) => a.regions.includes(v.regione));
    const cities = [...new Set(vs.map((v) => v.citta))].sort(cmpIt.compare);
    return `<div class="area"><h3>${esc(a[lang])} <span class="small">(${vs.length} ${t.venuesWord})</span></h3>${cities
      .map(
        (c) => `<div class="city">${esc(cityName(c, lang))}</div><ul>${vs
          .filter((v) => v.citta === c)
          .map((v) => `<li><a href="#v-${v.slug}">${esc(v.nome)}</a> — ${esc(TIPO[lang][v.tipo])}${v.stato === "chiuso" ? ` (${t.closed.toLowerCase()})` : ""} · <a href="${gmap(v)}">${t.map}</a></li>`)
          .join("")}</ul>`
      )
      .join("")}</div>`;
  }).join("");

  const filmIdx = filmsWithVenues
    .slice()
    .sort((a, b) => cmpIt.compare(filmTitle(a, lang), filmTitle(b, lang)))
    .map((id) => {
      const vs = venues.filter((v) => v.film.some((x) => filmId(x.film) === id));
      const f = films[id];
      return `<div class="f"><b>${esc(filmTitle(id, lang))}</b> <span class="small">(${f.anno}${f.serieTv ? ", " + t.series : ""})</span><ul>${vs
        .map((v) => `<li><a href="#v-${v.slug}">${esc(v.nome)}</a>, ${esc(cityName(v.citta, lang))}</li>`)
        .join("")}</ul></div>`;
    })
    .join("");

  const toc = `<div class="toc">
    <div><span>${t.areasH}</span><span>${pg("areas")}</span></div>
    ${regionsList.map((r) => `<div><span><a href="#r-${esc(r)}">${esc(regionName(r, lang))}</a></span><span>${pg("R:" + r)}</span></div>`).join("")}
    <div><span>${t.filmsH}</span><span>${pg("films")}</span></div>
  </div>`;

  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(t.title)}</title><style>${css}</style></head><body>
  <h2 class="part" style="break-before:avoid">${t.welcomeH}</h2>
  <p class="lead">${t.welcome(nums)}</p>
  <h3 style="font-size:13pt;margin:14px 0 4px;color:#7a1f2b">${t.legendH}</h3>
  ${t.legend.map((l, i) => `<div class="box"><span class="badge ${["b-set", "b-leg", "b-cl"][i]}">${l[0]}</span> ${l[1]}</div>`).join("")}
  <div class="box"><b>${t.fasciaH}.</b> ${t.fascia}</div>
  <h3 style="font-size:13pt;margin:14px 0 4px;color:#7a1f2b">${t.verifyH}</h3>
  <p>${t.verify}</p>
  <h3 style="font-size:13pt;margin:18px 0 4px;color:#7a1f2b">${t.tocH}</h3>
  ${toc}

  <h2 class="part">${mk("areas")}${t.areasH}</h2>
  <p>${t.areasIntro}</p>
  ${areasHtml}

  <h2 class="part">${t.regionsH}</h2>
  ${regionsHtml}

  <h2 class="part">${mk("films")}${t.filmsH}</h2>
  <p>${t.filmsIntro}</p>
  <div class="cols filmidx">${filmIdx}</div>

  <div class="closing" style="break-inside:avoid">
    <h2 style="font-size:20pt;color:#7a1f2b">${t.closing}</h2>
    <p>${t.closingText}</p>
    <p class="small" style="margin-top:30px">${t.legalNote}<br>${t.cover}</p>
  </div>
  </body></html>`;
}

function coverHtml(lang) {
  const img = path.join(ROOT, "src/assets/placeholder", lang === "en" ? "guida-cover-preview-en.jpg" : "guida-cover-preview.jpg");
  const t = T[lang];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @page{size:A4;margin:0}html,body{margin:0;height:297mm}
  .c{width:210mm;height:297mm;background:#2a0a10 url("file://${img}") center/cover no-repeat;position:relative}
  .e{position:absolute;bottom:16mm;left:0;right:0;text-align:center;font:600 11pt "Helvetica",sans-serif;letter-spacing:.2em;color:#e9c874;text-transform:uppercase;text-shadow:0 1px 6px #000}
  </style></head><body><div class="c"><div class="e">${t.edition}</div></div></body></html>`;
}

// ---------- render ----------
const browser = await chromium.launch();
async function render(html, file, opts) {
  const f = path.join(TMP, file + ".html");
  fs.writeFileSync(f, html);
  const p = await browser.newPage();
  await p.goto("file://" + f, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(TMP, file + ".pdf"), ...opts });
  await p.close();
}
const pdfPages = (file) => {
  const txt = execFileSync("pdftotext", ["-layout", path.join(TMP, file + ".pdf"), "-"], { encoding: "utf8", maxBuffer: 1 << 28 });
  return txt.split("\f");
};

for (const lang of ["it", "en"]) {
  const t = T[lang];
  const footer = `<div style="font:8pt 'Helvetica',sans-serif;color:#8a7a6a;width:100%;text-align:center;padding:0 17mm">${esc(t.title)} · cinefooditalia.com · <span class="pageNumber"></span></div>`;
  const base = { format: "A4", printBackground: true, displayHeaderFooter: true, headerTemplate: "<span></span>", footerTemplate: footer, margin: { top: "18mm", bottom: "20mm", left: "17mm", right: "17mm" } };
  // pass 1: indice senza numeri; pass 2: con i numeri di pagina trovati (+1 per la copertina)
  await render(bodyHtml(lang), "body1-" + lang, base);
  const txt = pdfPages("body1-" + lang);
  const pages = {};
  const find = (m) => {
    const i = txt.findIndex((p) => p.includes(`§§${m}§§`));
    return i < 0 ? "" : String(i + 1); // numerazione del corpo (la copertina non è numerata)
  };
  pages.areas = find("areas");
  pages.films = find("films");
  for (const r of regionsList) pages["R:" + r] = find("R:" + r);
  await render(bodyHtml(lang, pages, false), "body2-" + lang, base);
  await render(coverHtml(lang), "cover-" + lang, { format: "A4", printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  const out = path.join(OUT, t.file);
  execFileSync("pdfunite", [path.join(TMP, "cover-" + lang + ".pdf"), path.join(TMP, "body2-" + lang + ".pdf"), out]);
  console.log(lang, out, (fs.statSync(out).size / 1024).toFixed(0) + " KB", txt.length - 1 + 1, "pagine corpo");
}
await browser.close();
console.log("numeri", nums);
fs.rmSync(TMP, { recursive: true, force: true });
