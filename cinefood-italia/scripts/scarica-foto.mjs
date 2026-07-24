/**
 * ============================================================
 *  SCARICA FOTO REALI, GRATUITE E A TEMA (per film, città, blog)
 * ============================================================
 *
 *  Le foto vengono cercate su OPENVERSE (openverse.org), filtrando solo
 *  immagini con licenza **CC0 / Public Domain** (uso libero, anche
 *  commerciale, SENZA obbligo di attribuzione). Se una ricerca non dà
 *  risultati, si usa come riserva Lorem Picsum (licenza Unsplash).
 *
 *  ⚠️ IMPORTANTE: sono foto della CITTÀ/AMBIENTAZIONE, non le scene o le
 *  locandine dei film (protette da copyright). Per una foto specifica di un
 *  locale, sostituisci semplicemente il file in src/assets/ con una tua
 *  immagine avente lo stesso nome.
 *
 *  USO (dove la rete è libera: tuo PC o build di Netlify):
 *      node scripts/scarica-foto.mjs
 *  Richiede Node 18+ (fetch) e sharp (già installato).
 * ============================================================
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dirname, "../src/assets");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Cerca su Openverse una foto CC0/PD per la query; restituisce un Buffer o null. */
async function fromOpenverse(query) {
  try {
    const api =
      "https://api.openverse.org/v1/images/?" +
      new URLSearchParams({
        q: query,
        license: "cc0,pdm",
        size: "large",
        mature: "false",
        page_size: "8",
      });
    const res = await fetch(api, { headers: { "User-Agent": "CineFoodItalia/1.0 (placeholder images)" } });
    if (!res.ok) return null;
    const data = await res.json();
    for (const item of data.results || []) {
      const src = item.url || item.thumbnail;
      if (!src) continue;
      try {
        const img = await fetch(src);
        if (!img.ok) continue;
        const buf = Buffer.from(await img.arrayBuffer());
        if (buf.length > 3000) return buf; // scarta immagini vuote/errate
      } catch (e) {
        /* prova la prossima */
      }
    }
  } catch (e) {
    /* rete non disponibile */
  }
  return null;
}

/** Riserva: Lorem Picsum (licenza Unsplash). */
async function fromPicsum(seed, w, h) {
  try {
    const r = await fetch(`https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`, { redirect: "follow" });
    if (!r.ok) return null;
    return Buffer.from(await r.arrayBuffer());
  } catch (e) {
    return null;
  }
}

async function getPhoto(query, seed, w, h) {
  return (await fromOpenverse(query)) || (await fromPicsum(seed, w, h));
}

/** Overlay "key-art" per le locandine film: sfumatura + titolo. */
function posterOverlay() {
  // Solo una sfumatura scura in basso: il titolo del film è sovrapposto in
  // HTML nella pagina, così è sempre nitido sopra la foto.
  const W = 800, H = 1200;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d0d10" stop-opacity="0"/>
      <stop offset="60%" stop-color="#0d0d10" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0d0d10" stop-opacity="0.92"/></linearGradient></defs>
    <rect x="0" y="480" width="100%" height="720" fill="url(#b)"/>
  </svg>`);
}

/** Leggero scurimento in basso (città e blog). */
function bottomShade(w, h) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
      <stop offset="55%" stop-color="#0a0a0d" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0a0a0d" stop-opacity="0.5"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#c)"/></svg>`);
}

/* Query a tema (ambientazione del film, NON la scena) */
const FILM = [
  ["la-grande-bellezza", "The Great Beauty", "2013", "Rome rooftop sunset"],
  ["mangia-prega-ama", "Eat Pray Love", "2010", "Rome italian pasta food"],
  ["il-padrino", "The Godfather", "1972", "Sicily hill village"],
  ["il-talento-di-mr-ripley", "The Talented Mr. Ripley", "1999", "Venice Saint Mark square"],
  ["benvenuti-al-sud", "Welcome to the South", "2010", "Cilento coast Italy sea"],
  ["un-americano-a-roma", "An American in Rome", "1954", "Rome old street trattoria"],
  ["chiamami-col-tuo-nome", "Call Me by Your Name", "2017", "Lombardy countryside summer"],
  ["la-dolce-vita", "La Dolce Vita", "1960", "Rome fountain black and white"],
  ["il-commissario-montalbano", "Inspector Montalbano", "1999", "Sicily baroque sea Ragusa"],
  ["nuovo-cinema-paradiso", "Cinema Paradiso", "1988", "Sicily village square fountain"],
  ["il-postino", "Il Postino", "1994", "Aeolian islands sea Italy"],
  ["to-rome-with-love", "To Rome with Love", "2012", "Piazza Navona Rome"],
  ["house-of-gucci", "House of Gucci", "2021", "Milan cathedral fashion"],
];

const CITTA = [
  ["roma", "Rome Italy skyline"], ["milano", "Milan Italy cathedral"],
  ["napoli", "Naples Italy bay"], ["venezia", "Venice Italy canal"],
  ["crema", "Crema Lombardy Italy"], ["castellabate", "Castellabate Cilento Italy"],
  ["savoca", "Savoca Sicily village"], ["punta-secca", "Punta Secca Sicily sea"],
  ["palazzo-adriano", "Palazzo Adriano Sicily"], ["salina", "Salina Aeolian island"],
  ["como", "Lake Como Italy"],
];

const BLOG = [
  ["blog-roma-cinema", "Rome trattoria dinner"],
  ["blog-set-tavola", "italian food table"],
  ["blog-sicilia", "Sicily seafood dish"],
  ["blog-dolce-vita", "Rome Via Veneto cafe"],
  ["blog-nord", "Northern Italy lake sunset"],
  ["blog-borghi", "Italian village alley"],
  ["blog-weekend", "travel map suitcase"],
  ["blog-scene", "italian pasta table"],
  ["blog-set-tema", "cinema clapperboard"],
];

let ok = 0, ko = 0;

console.log("Film…");
await mkdir(resolve(ASSETS, "films"), { recursive: true });
for (const [slug, title, year, q] of FILM) {
  const photo = await getPhoto(q, `film-${slug}`, 800, 1200);
  if (!photo) { console.log("  ✗", slug); ko++; continue; }
  try {
    await sharp(photo).resize(800, 1200, { fit: "cover" })
      .composite([{ input: posterOverlay() }])
      .jpeg({ quality: 80 }).toFile(resolve(ASSETS, "films", `${slug}.jpg`));
    console.log("  ✓", slug); ok++;
  } catch (e) { console.log("  ✗", slug, e.message); ko++; }
}

console.log("Città…");
await mkdir(resolve(ASSETS, "cities"), { recursive: true });
for (const [slug, q] of CITTA) {
  const photo = await getPhoto(q, `city-${slug}`, 1000, 750);
  if (!photo) { console.log("  ✗", slug); ko++; continue; }
  try {
    await sharp(photo).resize(1000, 750, { fit: "cover" })
      .composite([{ input: bottomShade(1000, 750) }])
      .jpeg({ quality: 80 }).toFile(resolve(ASSETS, "cities", `${slug}.jpg`));
    console.log("  ✓", slug); ok++;
  } catch (e) { console.log("  ✗", slug, e.message); ko++; }
}

console.log("Blog…");
await mkdir(resolve(ASSETS, "placeholder"), { recursive: true });
for (const [slug, q] of BLOG) {
  const photo = await getPhoto(q, `blog-${slug}`, 1200, 675);
  if (!photo) { console.log("  ✗", slug); ko++; continue; }
  try {
    await sharp(photo).resize(1200, 675, { fit: "cover" })
      .composite([{ input: bottomShade(1200, 675) }])
      .jpeg({ quality: 80 }).toFile(resolve(ASSETS, "placeholder", `${slug}.jpg`));
    console.log("  ✓", slug); ok++;
  } catch (e) { console.log("  ✗", slug, e.message); ko++; }
}

console.log("Hero…");
{
  const photo = await getPhoto("Rome Italy restaurant night lights", "hero-cinefood", 1920, 1080);
  if (photo) {
    try {
      await sharp(photo).resize(1920, 1080, { fit: "cover" })
        .modulate({ brightness: 0.7 })
        .jpeg({ quality: 82 }).toFile(resolve(ASSETS, "placeholder", "hero.jpg"));
      console.log("  ✓ hero"); ok++;
    } catch (e) { console.log("  ✗ hero", e.message); ko++; }
  } else { console.log("  ✗ hero"); ko++; }
}

console.log(`\nFatto: ${ok} immagini scaricate, ${ko} non riuscite (restano i placeholder).`);
