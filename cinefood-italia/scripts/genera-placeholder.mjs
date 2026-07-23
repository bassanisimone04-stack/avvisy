/**
 * Genera immagini placeholder per locali, film (locandine), città e hero.
 * Uso: `node scripts/genera-placeholder.mjs`
 * Cancella pure la cartella `scripts/` quando metti le foto reali.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dirname, "../src/assets");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function save(dir, file, svg, q = 82) {
  await mkdir(resolve(ASSETS, dir), { recursive: true });
  await sharp(Buffer.from(svg)).jpeg({ quality: q }).toFile(resolve(ASSETS, dir, file));
  console.log("✓", `${dir}/${file}`);
}

/* -------- Foto locali / città (landscape con etichetta) -------- */
function scene(label, subtitle, color, w, h) {
  const fs = Math.round(w / 14);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="#0a0a0d"/>
      </linearGradient>
      <radialGradient id="v" cx="50%" cy="42%" r="75%">
        <stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#v)"/>
    <text x="50%" y="47%" font-family="Georgia, serif" font-size="${fs}" fill="#f5c451" text-anchor="middle" font-weight="bold">${esc(label)}</text>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${Math.round(fs*0.42)}" fill="#fff" opacity="0.85" text-anchor="middle" letter-spacing="2">${esc(subtitle)}</text>
  </svg>`;
}

/* -------- Locandine film (stile manifesto con pellicola) -------- */
function poster(title, year, color) {
  const W = 800, H = 1200;
  // Perforazioni della pellicola su entrambi i lati.
  let perfs = "";
  for (let y = 20; y < H; y += 60) {
    perfs += `<rect x="14" y="${y}" width="26" height="34" rx="5" fill="#0a0a0d"/>`;
    perfs += `<rect x="${W-40}" y="${y}" width="26" height="34" rx="5" fill="#0a0a0d"/>`;
  }
  // Titolo a capo automatico (max ~12 caratteri per riga).
  const words = title.split(" ");
  const lines = [];
  let cur = "";
  for (const wd of words) {
    if ((cur + " " + wd).trim().length > 12) { lines.push(cur.trim()); cur = wd; }
    else cur += " " + wd;
  }
  if (cur.trim()) lines.push(cur.trim());
  const startY = 560 - (lines.length - 1) * 44;
  const titleSvg = lines
    .map((l, i) => `<text x="400" y="${startY + i * 88}" font-family="Georgia, serif" font-size="76" fill="#faf7f0" text-anchor="middle" font-weight="bold">${esc(l)}</text>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="pg" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stop-color="${color}"/><stop offset="55%" stop-color="#141017"/><stop offset="100%" stop-color="#0a0a0d"/>
      </linearGradient>
      <radialGradient id="pglow" cx="50%" cy="34%" r="52%">
        <stop offset="0%" stop-color="#f5c451" stop-opacity="0.30"/><stop offset="100%" stop-color="#f5c451" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#pg)"/>
    <rect width="100%" height="100%" fill="url(#pglow)"/>
    <!-- bande pellicola -->
    <rect x="0" y="0" width="54" height="100%" fill="#000" opacity="0.55"/>
    <rect x="${W-54}" y="0" width="54" height="100%" fill="#000" opacity="0.55"/>
    ${perfs}
    <text x="400" y="300" font-size="90" text-anchor="middle">🎬</text>
    ${titleSvg}
    <text x="400" y="${startY + lines.length * 88 + 30}" font-family="Arial, sans-serif" font-size="34" fill="#f5c451" text-anchor="middle" letter-spacing="3">${year}</text>
    <text x="400" y="1140" font-family="Arial, sans-serif" font-size="24" fill="#fff" opacity="0.6" text-anchor="middle" letter-spacing="2">LOCANDINA · CINEFOOD ITALIA</text>
  </svg>`;
}

/* ===== Locali (landscape 3:2) ===== */
const locali = [
  ["antico-caffe.jpg", "Antico Caffè", "#7c2d12"],
  ["trattoria-roma.jpg", "Trattoria", "#9a3412"],
  ["bar-vista-mare.jpg", "Bar Vitelli", "#0f766e"],
  ["pasticceria-storica.jpg", "Pasticceria", "#be185d"],
  ["osteria-navigli.jpg", "Osteria", "#3730a3"],
  ["caffe-piazza.jpg", "Caffè in Piazza", "#b45309"],
  ["ristorante-collina.jpg", "Ristorante", "#166534"],
  ["gran-caffe.jpg", "Gran Caffè", "#6b21a8"],
  ["trattoria-sordi.jpg", "Trattoria Romana", "#a16207"],
  ["caffe-crema.jpg", "Caffè di Crema", "#1e3a5f"],
  ["cinema-bistrot-milano.jpg", "Cinema Bistrot", "#4a044e"],
  ["gallery-1.jpg", "Sala", "#78350f"],
  ["gallery-2.jpg", "Dettaglio", "#1f2937"],
  // nuovi
  ["cafe-de-paris.jpg", "Café de Paris", "#a16207"],
  ["enzo-a-mare.jpg", "Enzo a Mare", "#0e7490"],
  ["bar-paradiso.jpg", "Bar Paradiso", "#7c2d12"],
  ["trattoria-isola.jpg", "Trattoria dell'Isola", "#1e3a5f"],
  ["caffe-navona.jpg", "Caffè Navona", "#9f1239"],
  ["ristorante-brera.jpg", "Ristorante Brera", "#292524"],
];
for (const [f, l, c] of locali) await save("placeholder", f, scene(l, "CineFood Italia", c, 1200, 800));

/* ===== Locandine film (2:3) ===== */
const film = [
  ["la-grande-bellezza.jpg", "La Grande Bellezza", "2013", "#7c2d12"],
  ["mangia-prega-ama.jpg", "Mangia Prega Ama", "2010", "#9a3412"],
  ["il-padrino.jpg", "Il Padrino", "1972", "#1c1917"],
  ["il-talento-di-mr-ripley.jpg", "Il Talento di Mr. Ripley", "1999", "#134e4a"],
  ["benvenuti-al-sud.jpg", "Benvenuti al Sud", "2010", "#0e7490"],
  ["un-americano-a-roma.jpg", "Un Americano a Roma", "1954", "#a16207"],
  ["chiamami-col-tuo-nome.jpg", "Chiamami col tuo Nome", "2017", "#3f6212"],
  ["la-dolce-vita.jpg", "La Dolce Vita", "1960", "#3f3f46"],
  ["il-commissario-montalbano.jpg", "Il Commissario Montalbano", "1999", "#b45309"],
  ["nuovo-cinema-paradiso.jpg", "Nuovo Cinema Paradiso", "1988", "#7c2d12"],
  ["il-postino.jpg", "Il Postino", "1994", "#1e3a5f"],
  ["to-rome-with-love.jpg", "To Rome with Love", "2012", "#9f1239"],
  ["house-of-gucci.jpg", "House of Gucci", "2021", "#292524"],
];
for (const [f, t, y, c] of film) await save("films", f, poster(t, y, c));

/* ===== Immagini blog (16:9) ===== */
const blog = [
  ["blog-roma-cinema.jpg", "Roma & Cinema", "#7c2d12"],
  ["blog-set-tavola.jpg", "A tavola nei film", "#9a3412"],
  ["blog-sicilia.jpg", "Sicilia da mangiare", "#b45309"],
  ["blog-dolce-vita.jpg", "La Dolce Vita", "#3f3f46"],
  ["blog-nord.jpg", "Cinema al Nord", "#1e3a5f"],
];
for (const [f, l, c] of blog) await save("placeholder", f, scene(l, "BLOG", c, 1200, 675));

/* ===== Card città (4:3) ===== */
const citta = [
  ["roma.jpg", "Roma", "#7c2d12"], ["milano.jpg", "Milano", "#3730a3"],
  ["napoli.jpg", "Napoli", "#b45309"], ["venezia.jpg", "Venezia", "#0f766e"],
  ["crema.jpg", "Crema", "#3f6212"], ["castellabate.jpg", "Castellabate", "#0e7490"],
  ["savoca.jpg", "Savoca", "#166534"],
  // nuove
  ["punta-secca.jpg", "Punta Secca", "#b45309"], ["palazzo-adriano.jpg", "Palazzo Adriano", "#7c2d12"],
  ["salina.jpg", "Salina", "#1e3a5f"], ["como.jpg", "Como", "#292524"],
];
for (const [f, l, c] of citta) await save("cities", f, scene(l, "ITALIA", c, 1000, 750));

/* ===== Hero (senza testo) + Open Graph ===== */
const hero = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <defs>
    <linearGradient id="hg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="#3a2410"/><stop offset="45%" stop-color="#1c1917"/><stop offset="100%" stop-color="#0a0a0d"/>
    </linearGradient>
    <radialGradient id="hglow" cx="30%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#e0a516" stop-opacity="0.35"/><stop offset="100%" stop-color="#e0a516" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#hg)"/><rect width="100%" height="100%" fill="url(#hglow)"/>
</svg>`;
await save("placeholder", "hero.jpg", hero);
await save("placeholder", "og-default.jpg", scene("CineFood Italia", "RISTORANTI DEL CINEMA", "#c4880f", 1200, 630));

console.log("\nFatto. Immagini generate in src/assets/");
