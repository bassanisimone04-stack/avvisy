/**
 * Generates the on-brand SVG placeholders shipped in /assets/img.
 *
 * They exist so every template renders standalone, with real <img> markup and
 * real intrinsic dimensions (no CLS). Swap the files for photography and the
 * markup does not change — keep the same path, width and height attributes.
 *
 *   node scripts/generate-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Botanical → champagne gradient pairs, cycled per asset. */
const PALETTES = [
  ["#0f2e21", "#2d6a4f", "#74c69d"],
  ["#1b4332", "#40916c", "#b7e4c7"],
  ["#081c15", "#245741", "#52b788"],
  ["#1b4332", "#2d6a4f", "#d4af37"],
  ["#0f2e21", "#8a6d1f", "#e9d48f"],
  ["#245741", "#40916c", "#f1e3bc"],
];

/** A stylised glasshouse: arched roof, glazing bars, planting silhouette. */
function glasshouse(w, h, i, label) {
  const [a, b, c] = PALETTES[i % PALETTES.length];
  const id = `g${i}`;
  const bars = [];
  const step = w / 9;
  for (let x = step; x < w; x += step) {
    bars.push(`<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${h}" />`);
  }
  const rows = [];
  const rstep = h / 6;
  for (let y = rstep; y < h; y += rstep) {
    rows.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}" />`);
  }
  const cx = w / 2;
  const arch = `M${w * 0.12} ${h} L${w * 0.12} ${h * 0.5} Q${cx} ${h * 0.03} ${w * 0.88} ${h * 0.5} L${w * 0.88} ${h}`;

  const fronds = Array.from({ length: 7 }, (_, n) => {
    const fx = (w / 8) * (n + 0.5);
    const fh = h * (0.16 + ((n * 37) % 11) / 60);
    return `<path d="M${fx} ${h} C${fx - fh * 0.5} ${h - fh * 0.5} ${fx + fh * 0.4} ${h - fh * 0.8} ${fx} ${h - fh}" />`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="55%" stop-color="${b}"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>
    <radialGradient id="${id}s" cx="0.7" cy="0.15" r="0.75">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#${id})"/>
  <rect width="${w}" height="${h}" fill="url(#${id}s)"/>
  <g stroke="#ffffff" stroke-opacity="0.14" stroke-width="1">${bars.join("")}${rows.join("")}</g>
  <path d="${arch}" fill="none" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2"/>
  <path d="${arch}" fill="#ffffff" fill-opacity="0.05"/>
  <g fill="none" stroke="#081c15" stroke-opacity="0.5" stroke-width="3" stroke-linecap="round">${fronds}</g>
  <rect y="${h - 3}" width="${w}" height="3" fill="#d4af37" fill-opacity="0.7"/>
</svg>
`;
}

const ASSETS = [
  // [path, width, height, aria label]
  ["assets/img/venues/crystal-conservatory-napa-01.svg", 1600, 1000, "Glasshouse ceremony hall"],
  ["assets/img/venues/crystal-conservatory-napa-02.svg", 800, 800, "Glasshouse aisle detail"],
  ["assets/img/venues/crystal-conservatory-napa-03.svg", 800, 800, "Reception under glass"],
  ["assets/img/venues/crystal-conservatory-napa-04.svg", 800, 800, "Evening glasshouse lighting"],
  ["assets/img/venues/crystal-conservatory-napa-05.svg", 800, 800, "Palm house interior"],
  ["assets/img/venues/palm-house-pasadena.svg", 800, 600, "Palm house venue"],
  ["assets/img/venues/orangery-hudson-valley.svg", 800, 600, "Orangery venue"],
  ["assets/img/venues/fern-glasshouse-austin.svg", 800, 600, "Fern glasshouse venue"],
  ["assets/img/venues/succulent-atrium-phoenix.svg", 800, 600, "Atrium venue"],
  ["assets/img/venues/citrus-orangery-charleston.svg", 800, 600, "Citrus orangery venue"],
  ["assets/img/venues/mangrove-conservatory-miami.svg", 800, 600, "Conservatory venue"],
  ["assets/img/venues/redwood-greenhouse-mendocino.svg", 800, 600, "Greenhouse venue"],
  ["assets/img/venues/rose-house-raleigh.svg", 800, 600, "Rose house venue"],
  ["assets/img/venues/lemon-house-tuscany.svg", 800, 600, "Limonaia venue"],
  ["assets/img/states/california.svg", 640, 480, "California greenhouse venues"],
  ["assets/img/states/texas.svg", 640, 480, "Texas greenhouse venues"],
  ["assets/img/states/florida.svg", 640, 480, "Florida greenhouse venues"],
  ["assets/img/states/new-york.svg", 640, 480, "New York greenhouse venues"],
  ["assets/img/states/north-carolina.svg", 640, 480, "North Carolina greenhouse venues"],
  ["assets/img/states/italy.svg", 640, 480, "Italy destination greenhouse venues"],
  ["assets/img/blog/greenhouse-wedding-cost-hero.svg", 1600, 900, "Greenhouse wedding cost guide"],
  ["assets/img/blog/greenhouse-wedding-cost-inline.svg", 1200, 675, "Glasshouse reception layout"],
  ["assets/img/blog/rain-proof-outdoor-venues.svg", 800, 600, "Rain-proof outdoor wedding venue"],
  ["assets/img/blog/small-greenhouse-weddings.svg", 800, 600, "Small greenhouse wedding"],
  ["assets/img/blog/botanical-garden-venues.svg", 800, 600, "Botanical garden wedding venue"],
];

let n = 0;
for (const [path, w, h, label] of ASSETS) {
  const out = resolve(ROOT, path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, glasshouse(w, h, n, label), "utf8");
  n += 1;
}
console.log(`✓ generated ${n} placeholder assets`);
