/**
 * Genera immagini placeholder per le schede, i film, le città e l'hero.
 * Uso: `node scripts/genera-placeholder.mjs`
 *
 * Puoi cancellare questa cartella `scripts/` quando sostituisci i
 * placeholder con le foto reali.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = resolve(__dirname, "../src/assets");

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Crea uno sfondo sfumato "cinematografico" con etichetta al centro. */
function svg(rawLabel, subtitle, color, w, h) {
  const label = esc(rawLabel);
  const sub = esc(subtitle);
  const fs = Math.round(w / 14);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0.7" y2="1">
        <stop offset="0%" stop-color="${color}"/>
        <stop offset="100%" stop-color="#0a0a0d"/>
      </linearGradient>
      <radialGradient id="v" cx="50%" cy="42%" r="75%">
        <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.55"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#v)"/>
    <text x="50%" y="47%" font-family="Georgia, 'Times New Roman', serif" font-size="${fs}"
      fill="#f5c451" text-anchor="middle" font-weight="bold">${label}</text>
    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${Math.round(fs * 0.42)}"
      fill="#ffffff" opacity="0.85" text-anchor="middle" letter-spacing="2">${sub}</text>
  </svg>`;
}

async function gen(dir, file, label, subtitle, color, w, h) {
  await mkdir(resolve(ASSETS, dir), { recursive: true });
  await sharp(Buffer.from(svg(label, subtitle, color, w, h)))
    .jpeg({ quality: 80 })
    .toFile(resolve(ASSETS, dir, file));
  console.log("✓", `${dir}/${file}`);
}

// --- Foto locali (landscape 3:2) ---
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
];
for (const [file, label, color] of locali)
  await gen("placeholder", file, label, "CineFood Italia", color, 1200, 800);

// --- Locandine film (portrait 2:3) ---
const film = [
  ["la-grande-bellezza.jpg", "La Grande Bellezza", "#7c2d12"],
  ["mangia-prega-ama.jpg", "Mangia Prega Ama", "#9a3412"],
  ["il-padrino.jpg", "Il Padrino", "#1c1917"],
  ["il-talento-di-mr-ripley.jpg", "Mr. Ripley", "#134e4a"],
  ["benvenuti-al-sud.jpg", "Benvenuti al Sud", "#0e7490"],
  ["un-americano-a-roma.jpg", "Un Americano a Roma", "#a16207"],
  ["chiamami-col-tuo-nome.jpg", "Chiamami col tuo nome", "#3f6212"],
];
for (const [file, label, color] of film)
  await gen("films", file, label, "LOCANDINA", color, 800, 1200);

// --- Card città (landscape 4:3) ---
const citta = [
  ["roma.jpg", "Roma", "#7c2d12"],
  ["milano.jpg", "Milano", "#3730a3"],
  ["napoli.jpg", "Napoli", "#b45309"],
  ["venezia.jpg", "Venezia", "#0f766e"],
  ["crema.jpg", "Crema", "#3f6212"],
  ["castellabate.jpg", "Castellabate", "#0e7490"],
  ["savoca.jpg", "Savoca", "#166534"],
];
for (const [file, label, color] of citta)
  await gen("cities", file, label, "ITALIA", color, 1000, 750);

// --- Hero: immagine cinematografica SENZA testo (il titolo è nell'HTML) ---
const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
  <defs>
    <linearGradient id="hg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="#3a2410"/>
      <stop offset="45%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#0a0a0d"/>
    </linearGradient>
    <radialGradient id="hglow" cx="30%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#e0a516" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#e0a516" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#hg)"/>
  <rect width="100%" height="100%" fill="url(#hglow)"/>
</svg>`;
await mkdir(resolve(ASSETS, "placeholder"), { recursive: true });
await sharp(Buffer.from(heroSvg)).jpeg({ quality: 82 }).toFile(resolve(ASSETS, "placeholder/hero.jpg"));
console.log("✓ placeholder/hero.jpg (senza testo)");

// --- Open Graph ---
await gen("placeholder", "og-default.jpg", "CineFood Italia", "RISTORANTI DEL CINEMA", "#c4880f", 1200, 630);

console.log("\nPlaceholder generati in src/assets/");
