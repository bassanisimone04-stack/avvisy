/**
 * ============================================================
 *  SCARICA FOTO REALI (LIBERE) PER FILM, CITTÀ E LOCALI
 * ============================================================
 *
 *  Sostituisce i placeholder con VERE FOTOGRAFIE prese da Lorem Picsum,
 *  servite sotto **licenza Unsplash** (uso gratuito, anche commerciale,
 *  senza obbligo di attribuzione — vedi https://unsplash.com/license).
 *
 *  ⚠️ NOTA IMPORTANTE: sono foto reali ma NON sono le scene o le locandine
 *  dei film (quelle sono protette da copyright). Sono immagini d'atmosfera,
 *  perfette come sfondo. Per una foto SPECIFICA di un locale/città, sostituisci
 *  semplicemente il file corrispondente in src/assets/ con una tua immagine.
 *
 *  COME USARLO (sul TUO computer, dove la rete è libera):
 *      cd cinefood-italia
 *      node scripts/scarica-foto.mjs
 *  Poi riavvia/ricostruisci il sito (npm run dev / npm run build).
 *
 *  Richiede Node 18+ (per fetch) e sharp (già installato).
 * ============================================================
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dirname, "../src/assets");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Scarica una foto (stabile per "seed") da Lorem Picsum. */
async function fetchPhoto(seed, w, h) {
  const url = `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Overlay SVG per le locandine film: tinta + gradiente + titolo. */
function posterOverlay(title, year, tint) {
  const W = 800, H = 1200;
  const words = title.split(" ");
  const lines = [];
  let cur = "";
  for (const wd of words) {
    if ((cur + " " + wd).trim().length > 13) { lines.push(cur.trim()); cur = wd; }
    else cur += " " + wd;
  }
  if (cur.trim()) lines.push(cur.trim());
  const baseY = 1010 - (lines.length - 1) * 74;
  const titleSvg = lines
    .map((l, i) => `<text x="60" y="${baseY + i * 74}" font-family="Georgia, serif" font-size="64" fill="#faf7f0" font-weight="bold">${esc(l)}</text>`)
    .join("");
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d0d10" stop-opacity="0"/>
      <stop offset="70%" stop-color="#0d0d10" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#0d0d10" stop-opacity="0.97"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="${tint}" opacity="0.38"/>
    <rect x="0" y="560" width="100%" height="640" fill="url(#b)"/>
    <rect x="60" y="${baseY - 96}" width="70" height="6" rx="3" fill="#f5c451"/>
    <text x="60" y="${baseY - 54}" font-family="Arial, sans-serif" font-size="30" fill="#f5c451" letter-spacing="4">${year}</text>
    ${titleSvg}
    <text x="60" y="1150" font-family="Arial, sans-serif" font-size="20" fill="#fff" opacity="0.5" letter-spacing="2">FOTO LIBERA (Unsplash) · CINEFOOD ITALIA</text>
  </svg>`);
}

/** Leggero scurimento in basso per le foto città (il nome è aggiunto dal sito). */
function cityOverlay(w, h) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
      <stop offset="55%" stop-color="#0a0a0d" stop-opacity="0"/>
      <stop offset="100%" stop-color="#0a0a0d" stop-opacity="0.55"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#c)"/></svg>`);
}

const FILM = [
  ["la-grande-bellezza", "La Grande Bellezza", "2013", "#b4531a"],
  ["mangia-prega-ama", "Mangia Prega Ama", "2010", "#c2681a"],
  ["il-padrino", "Il Padrino", "1972", "#4a3b23"],
  ["il-talento-di-mr-ripley", "Il Talento di Mr. Ripley", "1999", "#1f7a72"],
  ["benvenuti-al-sud", "Benvenuti al Sud", "2010", "#1a86a8"],
  ["un-americano-a-roma", "Un Americano a Roma", "1954", "#bb8a2a"],
  ["chiamami-col-tuo-nome", "Chiamami col tuo Nome", "2017", "#6f9440"],
  ["la-dolce-vita", "La Dolce Vita", "1960", "#70707e"],
  ["il-commissario-montalbano", "Il Commissario Montalbano", "1999", "#cc7c1c"],
  ["nuovo-cinema-paradiso", "Nuovo Cinema Paradiso", "1988", "#a03e1a"],
  ["il-postino", "Il Postino", "1994", "#2a76a0"],
  ["to-rome-with-love", "To Rome with Love", "2012", "#b23a5a"],
  ["house-of-gucci", "House of Gucci", "2021", "#3f3f4a"],
];

const CITTA = ["roma", "milano", "napoli", "venezia", "crema", "castellabate", "savoca", "punta-secca", "palazzo-adriano", "salina", "como"];

let ok = 0, ko = 0;

console.log("Scarico le locandine film…");
await mkdir(resolve(ASSETS, "films"), { recursive: true });
for (const [slug, title, year, tint] of FILM) {
  try {
    const photo = await fetchPhoto(`cinefood-film-${slug}`, 800, 1200);
    await sharp(photo).resize(800, 1200, { fit: "cover" })
      .composite([{ input: posterOverlay(title, year, tint) }])
      .jpeg({ quality: 82 }).toFile(resolve(ASSETS, "films", `${slug}.jpg`));
    console.log("  ✓", slug); ok++;
  } catch (e) { console.log("  ✗", slug, "-", e.message); ko++; }
}

console.log("Scarico le foto città…");
await mkdir(resolve(ASSETS, "cities"), { recursive: true });
for (const slug of CITTA) {
  try {
    const photo = await fetchPhoto(`cinefood-citta-${slug}`, 1000, 750);
    await sharp(photo).resize(1000, 750, { fit: "cover" })
      .composite([{ input: cityOverlay(1000, 750) }])
      .jpeg({ quality: 82 }).toFile(resolve(ASSETS, "cities", `${slug}.jpg`));
    console.log("  ✓", slug); ok++;
  } catch (e) { console.log("  ✗", slug, "-", e.message); ko++; }
}

console.log(`\nFatto: ${ok} immagini scaricate, ${ko} errori.`);
if (ko === 0) console.log("Ora riavvia il sito: npm run dev (o npm run build).");
else console.log("Se vedi errori di rete, riprova più tardi: le foto non riuscite mantengono il placeholder attuale.");
