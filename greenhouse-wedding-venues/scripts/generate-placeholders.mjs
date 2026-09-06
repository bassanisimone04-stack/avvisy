/**
 * Generates the abstract brand patterns shipped in /assets/img/patterns.
 *
 * These are DECORATIVE GRAPHICS, not photographs, and the templates treat them
 * that way: alt="" aria-hidden, with a visible "No photo on file" label on venue
 * cards. That matters — a generated illustration presented as a picture of a
 * real venue would misrepresent it.
 *
 * When you licence real photography, drop it in with the same intrinsic
 * dimensions, give it descriptive alt text, and remove the label.
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
  // [path, width, height] — abstract patterns only, no venue-specific names
  ["assets/img/patterns/pattern-01.svg", 800, 600],
  ["assets/img/patterns/pattern-02.svg", 800, 600],
  ["assets/img/patterns/pattern-03.svg", 800, 600],
  ["assets/img/patterns/pattern-04.svg", 800, 600],
  ["assets/img/patterns/pattern-05.svg", 800, 600],
  ["assets/img/patterns/pattern-06.svg", 800, 600],
  ["assets/img/patterns/hero.svg", 1600, 1000],
  ["assets/img/patterns/wide-01.svg", 1600, 900],
  ["assets/img/patterns/wide-02.svg", 1600, 900],
  ["assets/img/patterns/square-01.svg", 800, 800],
  ["assets/img/patterns/square-02.svg", 800, 800],
  ["assets/img/patterns/square-03.svg", 800, 800],
];

let n = 0;
for (const [path, w, h] of ASSETS) {
  const out = resolve(ROOT, path);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, glasshouse(w, h, n, "Decorative botanical pattern"), "utf8");
  n += 1;
}
console.log(`✓ generated ${n} decorative pattern assets`);
