/**
 * Genera immagini placeholder (JPG) per le schede di esempio.
 * Uso: `node scripts/genera-placeholder.mjs`
 *
 * Puoi cancellare questa cartella `scripts/` quando sostituisci i
 * placeholder con le foto reali dei locali.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../src/assets/placeholder");

/** Elenco dei placeholder da generare: [nomeFile, etichetta, colore]. */
const immagini = [
  ["antico-caffe.jpg", "Antico Caffè", "#7c2d12"],
  ["trattoria-roma.jpg", "Trattoria", "#9a3412"],
  ["bar-vista-mare.jpg", "Bar Vista Mare", "#0f766e"],
  ["pasticceria-storica.jpg", "Pasticceria", "#be185d"],
  ["osteria-navigli.jpg", "Osteria", "#3730a3"],
  ["caffe-piazza.jpg", "Caffè in Piazza", "#b45309"],
  ["ristorante-collina.jpg", "Ristorante", "#166534"],
  ["gran-caffe.jpg", "Gran Caffè", "#6b21a8"],
  ["blog-roma-cinema.jpg", "Roma & Cinema", "#1e293b"],
  ["blog-set-tavola.jpg", "A tavola nei film", "#7c2d12"],
  ["og-default.jpg", "CineFood Italia", "#ea580c"],
];

const W = 1200;
const H = 800;

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svg(rawLabel, color) {
  const label = esc(rawLabel);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${color}"/>
        <stop offset="100%" stop-color="#000000"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="46%" font-family="Georgia, serif" font-size="64"
      fill="#ffffff" text-anchor="middle" font-weight="bold">${label}</text>
    <text x="50%" y="56%" font-family="Arial, sans-serif" font-size="28"
      fill="#ffffff" opacity="0.8" text-anchor="middle">CineFood Italia · foto placeholder</text>
  </svg>`;
}

await mkdir(OUT, { recursive: true });

for (const [file, label, color] of immagini) {
  await sharp(Buffer.from(svg(label, color)))
    .jpeg({ quality: 78 })
    .toFile(resolve(OUT, file));
  console.log("✓", file);
}

console.log("\nPlaceholder generati in src/assets/placeholder/");
