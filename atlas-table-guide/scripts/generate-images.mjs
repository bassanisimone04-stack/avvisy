/**
 * Procedurally generated, art-directed editorial illustrations in the brand palette.
 * Output: public/images/generated/*.webp + src/data/generated/image-manifest.json (with blur placeholders).
 * Every output is flagged "REPLACE BEFORE LAUNCH" in docs/REPORT.md — they are illustrations, not photos.
 * Run: node scripts/generate-images.mjs
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = new URL("../public/images/generated/", import.meta.url);
const MANIFEST = new URL("../src/data/generated/image-manifest.json", import.meta.url);
mkdirSync(OUT, { recursive: true });
mkdirSync(new URL("../src/data/generated/", import.meta.url), { recursive: true });

// ---------- helpers ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hashStr = (s) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const lerp = (a, b, t) => a + (b - a) * t;
const f = (n) => n.toFixed(1);
const lg = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`).join("")}</linearGradient>`;
const rg = (id, stops, cx = 0.5, cy = 0.5, r = 0.5) =>
  `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`).join("")}</radialGradient>`;
const svg = (w, h, defs, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs>${defs}<filter id="soft"><feGaussianBlur stdDeviation="6"/></filter><filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter><filter id="blur20"><feGaussianBlur stdDeviation="20"/></filter></defs>${body}</svg>`;
const grain = (w, h, r, n = 900, color = "#000", op = 0.05) => {
  let s = "";
  for (let i = 0; i < n; i++) s += `<circle cx="${f(r() * w)}" cy="${f(r() * h)}" r="${f(r() * 1.4 + 0.3)}" fill="${color}" opacity="${f(r() * op)}"/>`;
  return s;
};
const vignette = (w, h) => `<rect width="${w}" height="${h}" fill="url(#vig)"/>`;
const vigDef = rg("vig", [[0.55, "#000", 0], [1, "#1A1415", 0.35]], 0.5, 0.5, 0.75);

// ---------- scenes ----------
function wineGlass(x, y, s, fill = "#ffffff", op = 0.55, wine = null) {
  const bowl = `M${x - 14 * s},${y} C${x - 16 * s},${y + 26 * s} ${x - 6 * s},${y + 38 * s} ${x},${y + 38 * s} C${x + 6 * s},${y + 38 * s} ${x + 16 * s},${y + 26 * s} ${x + 14 * s},${y} Z`;
  return `<g opacity="${op}"><path d="${bowl}" fill="${fill}" fill-opacity="0.35" stroke="${fill}" stroke-width="${1.5 * s}"/>${wine ? `<path d="M${x - 13 * s},${y + 18 * s} C${x - 11 * s},${y + 32 * s} ${x - 5 * s},${y + 37 * s} ${x},${y + 37 * s} C${x + 5 * s},${y + 37 * s} ${x + 11 * s},${y + 32 * s} ${x + 13 * s},${y + 18 * s} Z" fill="${wine}"/>` : ""}<rect x="${x - 1 * s}" y="${y + 38 * s}" width="${2 * s}" height="${30 * s}" fill="${fill}"/><ellipse cx="${x}" cy="${y + 69 * s}" rx="${12 * s}" ry="${3 * s}" fill="${fill}"/></g>`;
}

function terrace(w, h, seed = 1) {
  const r = rng(seed);
  const horizon = h * 0.5;
  let body = `<rect width="${w}" height="${horizon}" fill="url(#sky)"/>`;
  body += `<circle cx="${w * 0.68}" cy="${horizon - h * 0.04}" r="${h * 0.09}" fill="url(#sun)"/>`;
  body += `<circle cx="${w * 0.68}" cy="${horizon - h * 0.04}" r="${h * 0.3}" fill="url(#glow)"/>`;
  // distant headland
  body += `<path d="M0,${horizon} L0,${horizon - h * 0.06} C${w * 0.08},${horizon - h * 0.1} ${w * 0.18},${horizon - h * 0.05} ${w * 0.3},${horizon - h * 0.03} L${w * 0.36},${horizon} Z" fill="#6E3A44" opacity="0.55"/>`;
  body += `<rect y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#sea)"/>`;
  for (let i = 0; i < 70; i++) {
    const yy = horizon + Math.pow(r(), 1.6) * h * 0.25;
    const ww = lerp(10, 90, (yy - horizon) / (h * 0.25)) * (0.5 + r());
    body += `<rect x="${f(w * 0.68 - ww / 2 + (r() - 0.5) * w * 0.12)}" y="${f(yy)}" width="${f(ww)}" height="${f(1.2 + r() * 2)}" rx="1" fill="#FFE2B0" opacity="${f(0.25 + r() * 0.5)}"/>`;
  }
  // terrace floor & balustrade
  const ty = h * 0.72;
  body += `<rect y="${ty}" width="${w}" height="${h - ty}" fill="url(#floor)"/>`;
  body += `<rect y="${ty - h * 0.075}" width="${w}" height="${h * 0.018}" fill="#F3E6D4"/>`;
  for (let x = 10; x < w; x += w / 46) body += `<rect x="${f(x)}" y="${f(ty - h * 0.058)}" width="${f(w / 120)}" height="${f(h * 0.058)}" rx="3" fill="#E9D8C0"/>`;
  body += `<rect y="${ty - 4}" width="${w}" height="8" fill="#D9C2A5"/>`;
  // lemon trees in pots
  for (const lx of [w * 0.06, w * 0.94]) {
    body += `<rect x="${lx - 26}" y="${ty - h * 0.02}" width="52" height="${h * 0.09}" rx="6" fill="#B85C38"/>`;
    body += `<rect x="${lx - 3}" y="${ty - h * 0.2}" width="6" height="${h * 0.19}" fill="#5B3A29"/>`;
    for (let i = 0; i < 60; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * h * 0.12;
      body += `<ellipse cx="${f(lx + Math.cos(a) * d * 1.2)}" cy="${f(ty - h * 0.27 + Math.sin(a) * d)}" rx="${f(9 + r() * 7)}" ry="${f(5 + r() * 3)}" transform="rotate(${f(r() * 180)} ${f(lx + Math.cos(a) * d * 1.2)} ${f(ty - h * 0.27 + Math.sin(a) * d)})" fill="${pick(r, ["#2F5D3A", "#3B6E45", "#4A7F4F", "#27492F"])}"/>`;
    }
    for (let i = 0; i < 12; i++) {
      const a = r() * Math.PI * 2, d = Math.sqrt(r()) * h * 0.1;
      body += `<ellipse cx="${f(lx + Math.cos(a) * d)}" cy="${f(ty - h * 0.27 + Math.sin(a) * d)}" rx="7" ry="5.5" fill="#F2C230"/>`;
    }
  }
  // tables with white linen
  const tables = [[0.22, 0.86, 1.25], [0.5, 0.8, 0.95], [0.78, 0.88, 1.3], [0.36, 0.76, 0.7], [0.64, 0.75, 0.68]];
  for (const [tx, tyy, s] of tables.sort((a, b) => a[1] - b[1])) {
    const cx = w * tx, cy = h * tyy, rx = 120 * s * (w / 1920), ry = 36 * s * (w / 1920);
    body += `<ellipse cx="${cx}" cy="${cy + ry * 2.6}" rx="${rx * 1.1}" ry="${ry * 0.6}" fill="#000" opacity="0.18" filter="url(#soft)"/>`;
    body += `<path d="M${cx - rx},${cy} L${cx - rx * 0.97},${cy + ry * 2.4} Q${cx},${cy + ry * 2.9} ${cx + rx * 0.97},${cy + ry * 2.4} L${cx + rx},${cy} Z" fill="#F7F2EA"/>`;
    body += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFFFF"/>`;
    const gs = s * (w / 1920);
    body += wineGlass(cx - rx * 0.35, cy - 62 * gs, gs, "#ffffff", 0.8, "#8E0E22");
    body += wineGlass(cx + rx * 0.3, cy - 58 * gs, gs * 0.95, "#ffffff", 0.8);
    body += `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.22}" ry="${ry * 0.3}" fill="#E9E2D6"/>`;
    body += `<circle cx="${cx}" cy="${cy - 8 * gs}" r="${5 * gs}" fill="#FFD48A"/><circle cx="${cx}" cy="${cy - 8 * gs}" r="${16 * gs}" fill="#FFD48A" opacity="0.25"/>`;
  }
  const defs = lg("sky", [[0, "#5B1A2E"], [0.35, "#B3122B"], [0.7, "#E9785A"], [1, "#F6C38A"]]) + rg("sun", [[0, "#FFF3D6"], [1, "#FFC977"]]) +
    rg("glow", [[0, "#FFD9A0", 0.55], [1, "#FFD9A0", 0]]) + lg("sea", [[0, "#C9605A"], [0.4, "#6F2C45"], [1, "#2E1630"]]) +
    lg("floor", [[0, "#E7D3B8"], [1, "#C8A987"]]) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 1600, "#2A1A14", 0.06) + vignette(w, h));
}

const CITY = {
  paris: { sky: ["#2D3A6B", "#C86B5C", "#F2C08A"], motif: "mansard", water: true, accent: "#F3D9A4" },
  tokyo: { sky: ["#0E1838", "#2B3A73", "#6C5B9E"], motif: "towers", water: false, accent: "#FFB34D" },
  milan: { sky: ["#3B2F5C", "#C9775E", "#F4CE95"], motif: "spires", water: false, accent: "#FCE1A8" },
  london: { sky: ["#141D3D", "#3A4C7E", "#9C8FB0"], motif: "mixed", water: true, accent: "#FFD27A" },
  "new-york": { sky: ["#0D1430", "#2A3F78", "#D9876D"], motif: "skyscrapers", water: true, accent: "#FFD58A" },
  dubai: { sky: ["#4B3B6B", "#D98A5A", "#F7D49A"], motif: "needles", water: true, accent: "#FFE3A3" },
  rome: { sky: ["#4E2E4C", "#D47E58", "#F6CD8F"], motif: "domes", water: false, accent: "#FFE0A6" },
  barcelona: { sky: ["#36456E", "#E08A63", "#F8D39A"], motif: "organic", water: true, accent: "#FFE1A0" },
  copenhagen: { sky: ["#18264A", "#4B5F93", "#B7A6C4"], motif: "gables", water: true, accent: "#FFD07A" },
  singapore: { sky: ["#0F1B3C", "#3A3F7E", "#C5729A"], motif: "bay", water: true, accent: "#FFC66E" },
};

function building(r, x, base, bw, bh, color, motif, lit, accent) {
  let s = "";
  const top = base - bh;
  if (motif === "mansard" || motif === "gables") {
    s += `<rect x="${f(x)}" y="${f(top)}" width="${f(bw)}" height="${f(bh)}" fill="${color}"/>`;
    if (motif === "mansard") s += `<path d="M${f(x - 3)},${f(top)} L${f(x + bw * 0.12)},${f(top - bh * 0.18)} L${f(x + bw * 0.88)},${f(top - bh * 0.18)} L${f(x + bw + 3)},${f(top)} Z" fill="${color}" opacity="0.92"/>` + `<rect x="${f(x + bw * 0.7)}" y="${f(top - bh * 0.3)}" width="${f(bw * 0.08)}" height="${f(bh * 0.14)}" fill="${color}"/>`;
    else s += `<path d="M${f(x)},${f(top)} L${f(x + bw / 2)},${f(top - bw * 0.55)} L${f(x + bw)},${f(top)} Z" fill="${color}"/>`;
  } else if (motif === "domes" && r() < 0.25) {
    s += `<rect x="${f(x)}" y="${f(top)}" width="${f(bw)}" height="${f(bh)}" fill="${color}"/><path d="M${f(x + bw * 0.1)},${f(top)} A${f(bw * 0.4)},${f(bw * 0.45)} 0 0 1 ${f(x + bw * 0.9)},${f(top)} Z" fill="${color}"/><rect x="${f(x + bw * 0.47)}" y="${f(top - bw * 0.62)}" width="${f(bw * 0.06)}" height="${f(bw * 0.2)}" fill="${color}"/>`;
  } else if (motif === "spires" && r() < 0.3) {
    s += `<rect x="${f(x)}" y="${f(top)}" width="${f(bw)}" height="${f(bh)}" fill="${color}"/>`;
    for (let k = 0; k < 5; k++) { const px = x + (bw / 5) * (k + 0.5); s += `<path d="M${f(px - 3)},${f(top)} L${f(px)},${f(top - bh * 0.35 * (0.6 + r() * 0.6))} L${f(px + 3)},${f(top)} Z" fill="${color}"/>`; }
  } else if (motif === "needles" && r() < 0.2) {
    s += `<path d="M${f(x)},${f(base)} L${f(x + bw * 0.35)},${f(top)} L${f(x + bw * 0.5)},${f(top - bh * 0.5)} L${f(x + bw * 0.65)},${f(top)} L${f(x + bw)},${f(base)} Z" fill="${color}"/>`;
  } else if (motif === "organic" && r() < 0.2) {
    for (let k = 0; k < 4; k++) { const px = x + (bw / 4) * (k + 0.5); s += `<path d="M${f(px - bw * 0.09)},${f(base)} Q${f(px)},${f(top - bh * 0.5)} ${f(px + bw * 0.09)},${f(base)} Z" fill="${color}"/>`; }
  } else {
    s += `<rect x="${f(x)}" y="${f(top)}" width="${f(bw)}" height="${f(bh)}" fill="${color}"/>`;
    if ((motif === "skyscrapers" || motif === "towers") && r() < 0.4) s += `<rect x="${f(x + bw * 0.2)}" y="${f(top - bh * 0.12)}" width="${f(bw * 0.6)}" height="${f(bh * 0.12)}" fill="${color}"/><rect x="${f(x + bw * 0.47)}" y="${f(top - bh * 0.25)}" width="${f(bw * 0.06)}" height="${f(bh * 0.13)}" fill="${color}"/><circle cx="${f(x + bw * 0.5)}" cy="${f(top - bh * 0.25)}" r="2.2" fill="#FF4A4A"/>`;
  }
  if (lit) {
    const cols = Math.max(2, Math.floor(bw / 11)), rows = Math.max(2, Math.floor(bh / 15));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) if (r() < 0.28)
      s += `<rect x="${f(x + 4 + i * (bw - 8) / cols)}" y="${f(top + 6 + j * (bh - 10) / rows)}" width="${f(Math.max(2, (bw - 8) / cols - 4))}" height="4" fill="${accent}" opacity="${f(0.5 + r() * 0.5)}"/>`;
  }
  return s;
}

function skyline(w, h, city) {
  const c = CITY[city];
  const r = rng(hashStr(city));
  const base = h * 0.7;
  let body = `<rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  for (let i = 0; i < 60; i++) body += `<circle cx="${f(r() * w)}" cy="${f(r() * h * 0.35)}" r="${f(r() * 1.3)}" fill="#fff" opacity="${f(r() * 0.6)}"/>`;
  body += `<circle cx="${f(w * (0.2 + r() * 0.6))}" cy="${f(h * 0.22)}" r="${f(w * 0.06)}" fill="${c.accent}" opacity="0.35" filter="url(#blur20)"/>`;
  const layers = [
    { col: "#00000000", op: 0.35, hMin: 0.12, hMax: 0.32, lit: false, shade: 0.45 },
    { op: 0.6, hMin: 0.08, hMax: 0.26, lit: true, shade: 0.65 },
    { op: 1, hMin: 0.05, hMax: 0.18, lit: true, shade: 0.85 },
  ];
  const dark = (k) => `rgb(${Math.round(lerp(70, 22, k))},${Math.round(lerp(55, 18, k))},${Math.round(lerp(85, 30, k))})`;
  const tall = c.motif === "skyscrapers" || c.motif === "needles" || c.motif === "towers" ? 1.6 : c.motif === "gables" ? 0.6 : 1;
  layers.forEach((L, li) => {
    let x = -20;
    const color = dark(L.shade);
    while (x < w + 20) {
      const bw = (c.motif === "gables" ? 40 : 30) + r() * (c.motif === "gables" ? 30 : 70);
      const bh = h * (L.hMin + r() * (L.hMax - L.hMin)) * tall * (li === 0 ? 1.15 : 1);
      body += `<g opacity="${L.op}">${building(r, x, base + li * 6, bw, bh, color, c.motif, L.lit, c.accent)}</g>`;
      x += bw + (r() < 0.3 ? r() * 12 : -2);
    }
    if (c.motif === "domes" || c.motif === "bay") {
      for (let k = 0; k < 4; k++) { const px = r() * w; body += `<g opacity="${L.op}"><rect x="${f(px - 3)}" y="${f(base - 50)}" width="6" height="60" fill="${color}"/><ellipse cx="${f(px)}" cy="${f(base - 60)}" rx="${f(38 + r() * 20)}" ry="20" fill="${color}"/></g>`; }
    }
  });
  if (c.motif === "gables") {
    const cols = ["#C1443A", "#E0A33B", "#2E6F6A", "#D8C6A5", "#9C3B52", "#3E5C8A"];
    let x = 0;
    while (x < w) { const bw = 52 + r() * 22, bh = h * (0.12 + r() * 0.06); body += `<rect x="${f(x)}" y="${f(base - bh)}" width="${f(bw)}" height="${f(bh)}" fill="${pick(r, cols)}" opacity="0.9"/><path d="M${f(x)},${f(base - bh)} L${f(x + bw / 2)},${f(base - bh - bw * 0.5)} L${f(x + bw)},${f(base - bh)} Z" fill="#2A1E2A" opacity="0.8"/>`; for (let i = 0; i < 6; i++) body += `<rect x="${f(x + 8 + (i % 3) * (bw - 16) / 3)}" y="${f(base - bh + 12 + Math.floor(i / 3) * 26)}" width="9" height="14" fill="${c.accent}" opacity="${f(0.4 + r() * 0.6)}"/>`; x += bw + 1; }
  }
  // water or street
  if (c.water) {
    body += `<rect y="${base}" width="${w}" height="${h - base}" fill="url(#water)"/>`;
    for (let i = 0; i < 90; i++) { const yy = base + r() * (h - base) * 0.5; body += `<rect x="${f(r() * w)}" y="${f(yy)}" width="${f(10 + r() * 50)}" height="1.6" fill="${c.accent}" opacity="${f(r() * 0.45)}"/>`; }
  } else body += `<rect y="${base}" width="${w}" height="${h - base}" fill="url(#street)"/>`;
  // foreground dining table with candle & glasses
  const ty = h * 0.86;
  body += `<rect y="${ty}" width="${w}" height="${h - ty}" fill="#F5EFE6"/><rect y="${ty}" width="${w}" height="6" fill="#E4DBD1"/>`;
  body += `<ellipse cx="${w * 0.5}" cy="${ty + (h - ty) * 0.55}" rx="${w * 0.28}" ry="${(h - ty) * 0.3}" fill="#FFFFFF" stroke="#E4DBD1"/>`;
  body += `<ellipse cx="${w * 0.5}" cy="${ty + (h - ty) * 0.55}" rx="${w * 0.17}" ry="${(h - ty) * 0.18}" fill="#F4EEE5"/>`;
  const gs = w / 600;
  body += wineGlass(w * 0.18, ty - 70 * gs, gs, "#ffffff", 0.85, "#8E0E22");
  body += wineGlass(w * 0.84, ty - 66 * gs, gs * 0.95, "#ffffff", 0.85);
  body += `<rect x="${w * 0.68 - 5 * gs}" y="${ty - 46 * gs}" width="${10 * gs}" height="${46 * gs}" rx="2" fill="#FBF4E6"/><ellipse cx="${w * 0.68}" cy="${ty - 54 * gs}" rx="${4 * gs}" ry="${9 * gs}" fill="#FFC75E"/><circle cx="${w * 0.68}" cy="${ty - 52 * gs}" r="${40 * gs}" fill="#FFC75E" opacity="0.18" filter="url(#blur20)"/>`;
  const defs = lg("sky", [[0, c.sky[0]], [0.55, c.sky[1]], [1, c.sky[2]]]) + lg("water", [[0, c.sky[1]], [1, "#120B1E"]]) + lg("street", [[0, "#2B2232"], [1, "#140E18"]]) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 1200, "#000", 0.06) + vignette(w, h));
}

const TABLES = [
  { bg: ["#EFE7DA", "#E2D6C3"], kind: "linen" },
  { bg: ["#7A5638", "#5C3E27"], kind: "oak" },
  { bg: ["#2B2A2E", "#1C1B1F"], kind: "slate" },
  { bg: ["#F1EEEA", "#DAD4CC"], kind: "marble" },
];
const PLATES = [
  { fill: ["#FFFFFF", "#ECE7DF"], rim: "#D8D0C4" },
  { fill: ["#F3EEE6", "#D9CFC0"], rim: "#BFAF98", speck: true },
  { fill: ["#3A3438", "#221E22"], rim: "#4A4448" },
  { fill: ["#DCE5DA", "#B9C9B7"], rim: "#A1B39F" },
];
const FOOD = [
  ["#C7522A", "#E9A23B", "#F4D58D", "#5E8C3A"],
  ["#8E1B3A", "#C2456B", "#F2B5C4", "#3F6B3A"],
  ["#E9DCC4", "#C9A66B", "#7C5A35", "#4F7F45"],
  ["#F08A4B", "#FFD6A5", "#FFF1D6", "#6A994E"],
  ["#4A2C2A", "#9C5B3B", "#E8C07D", "#2F5D3A"],
  ["#EDE6D6", "#B7C68B", "#6C8E3E", "#C0392B"],
];

function dish(w, h, seed) {
  const r = rng(seed * 7919);
  const T = TABLES[seed % TABLES.length], P = PLATES[(seed >> 1) % PLATES.length], F = FOOD[seed % FOOD.length];
  const cx = w * (0.48 + (r() - 0.5) * 0.06), cy = h * 0.5, R = h * 0.42;
  let body = `<rect width="${w}" height="${h}" fill="url(#table)"/>`;
  if (T.kind === "oak") for (let i = 0; i < 40; i++) body += `<path d="M0,${f(r() * h)} C${w * 0.3},${f(r() * h)} ${w * 0.6},${f(r() * h)} ${w},${f(r() * h)}" stroke="#3E2817" stroke-opacity="${f(0.08 + r() * 0.12)}" stroke-width="${f(1 + r() * 3)}" fill="none"/>`;
  if (T.kind === "marble") for (let i = 0; i < 14; i++) body += `<path d="M${f(r() * w)},0 C${f(r() * w)},${h * 0.3} ${f(r() * w)},${h * 0.7} ${f(r() * w)},${h}" stroke="#9A9188" stroke-opacity="${f(0.1 + r() * 0.2)}" stroke-width="${f(0.6 + r() * 1.5)}" fill="none"/>`;
  if (T.kind === "linen") for (let i = 0; i < 120; i++) body += `<rect x="0" y="${f(r() * h)}" width="${w}" height="0.8" fill="#BFAE95" opacity="0.12"/>`;
  // cutlery + glass shadow
  body += `<rect x="${f(cx - R - w * 0.07)}" y="${f(cy - R * 0.85)}" width="10" height="${f(R * 1.7)}" rx="5" fill="#C9C4BD" opacity="0.9"/><rect x="${f(cx + R + w * 0.05)}" y="${f(cy - R * 0.8)}" width="12" height="${f(R * 1.6)}" rx="6" fill="#C9C4BD" opacity="0.9"/>`;
  body += `<ellipse cx="${f(cx + R * 1.25)}" cy="${f(cy - R * 0.95)}" rx="${f(R * 0.28)}" ry="${f(R * 0.28)}" fill="#fff" opacity="0.18"/>`;
  // plate
  body += `<circle cx="${f(cx + 14)}" cy="${f(cy + 18)}" r="${f(R)}" fill="#000" opacity="0.25" filter="url(#blur20)"/>`;
  body += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R)}" fill="url(#plate)" stroke="${P.rim}" stroke-width="2"/>`;
  body += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.68)}" fill="none" stroke="${P.rim}" stroke-opacity="0.5" stroke-width="2"/>`;
  if (P.speck) for (let i = 0; i < 200; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R; body += `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${f(r() * 1.6)}" fill="#6B5A48" opacity="0.4"/>`; }
  const style = seed % 4;
  // sauce
  body += `<path d="M${f(cx - R * 0.45)},${f(cy + R * 0.1)} C${f(cx - R * 0.2)},${f(cy - R * 0.35)} ${f(cx + R * 0.4)},${f(cy - R * 0.3)} ${f(cx + R * 0.42)},${f(cy + R * 0.05)} C${f(cx + R * 0.35)},${f(cy + R * 0.35)} ${f(cx - R * 0.3)},${f(cy + R * 0.4)} Z" fill="${F[1]}" opacity="0.75"/>`;
  if (style === 0) {
    body += `<rect x="${f(cx - R * 0.22)}" y="${f(cy - R * 0.16)}" width="${f(R * 0.44)}" height="${f(R * 0.3)}" rx="${f(R * 0.06)}" fill="${F[0]}"/><rect x="${f(cx - R * 0.2)}" y="${f(cy - R * 0.16)}" width="${f(R * 0.4)}" height="${f(R * 0.08)}" rx="6" fill="#fff" opacity="0.22"/>`;
  } else if (style === 1) {
    for (let i = 0; i < 9; i++) { const a = (i / 9) * 6.283; body += `<ellipse cx="${f(cx + Math.cos(a) * R * 0.34)}" cy="${f(cy + Math.sin(a) * R * 0.34)}" rx="${f(R * 0.14)}" ry="${f(R * 0.07)}" transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(cx + Math.cos(a) * R * 0.34)} ${f(cy + Math.sin(a) * R * 0.34)})" fill="${F[0]}" opacity="0.92"/>`; }
  } else if (style === 2) {
    for (let i = 0; i < 5; i++) { const a = r() * 6.283, d = R * (0.05 + r() * 0.2); body += `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${f(R * (0.09 + r() * 0.05))}" fill="${F[2]}" stroke="${F[1]}" stroke-width="2"/><circle cx="${f(cx + Math.cos(a) * d - 6)}" cy="${f(cy + Math.sin(a) * d - 6)}" r="${f(R * 0.03)}" fill="#fff" opacity="0.5"/>`; }
  } else {
    body += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.24)}" fill="${F[2]}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R * 0.16)}" fill="${F[0]}" opacity="0.85"/>`;
  }
  // herbs, dots, petals, crumbs
  for (let i = 0; i < 26; i++) { const a = r() * 6.283, d = R * (0.1 + r() * 0.42); const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; body += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(4 + r() * 8)}" ry="${f(2 + r() * 3)}" transform="rotate(${f(r() * 180)} ${f(x)} ${f(y)})" fill="${F[3]}" opacity="${f(0.7 + r() * 0.3)}"/>`; }
  for (let i = 0; i < 14; i++) { const a = r() * 6.283, d = R * (0.3 + r() * 0.25); body += `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${f(3 + r() * 5)}" fill="${pick(r, [F[1], F[2], F[0]])}"/>`; }
  for (let i = 0; i < 5; i++) { const a = r() * 6.283, d = R * (0.15 + r() * 0.3); const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d; body += `<path d="M${f(x)},${f(y)} q6,-10 12,0 q-6,10 -12,0" fill="${pick(r, ["#F7E07A", "#F3A6B8", "#FFFFFF", "#B08AD9"])}" transform="rotate(${f(r() * 360)} ${f(x)} ${f(y)})"/>`; }
  for (let i = 0; i < 40; i++) { const a = r() * 6.283, d = R * (0.05 + r() * 0.45); body += `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${f(r() * 1.8 + 0.4)}" fill="${F[1]}" opacity="0.8"/>`; }
  // window light
  body += `<rect width="${w}" height="${h}" fill="url(#light)"/>`;
  const defs = lg("table", [[0, T.bg[0]], [1, T.bg[1]]], 0, 0, 1, 1) + rg("plate", [[0, P.fill[0]], [0.85, P.fill[0]], [1, P.fill[1]]]) + lg("light", [[0, "#FFF6E5", 0.28], [0.5, "#FFF6E5", 0], [1, "#000", 0.18]], 0, 0, 1, 1) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 1100, "#1A1415", 0.05) + vignette(w, h));
}

const ROOMS = [
  { wall: ["#EDE3D3", "#D9C7AE"], floor: ["#9A6B43", "#5E3E24"], cloth: "#FFFFFF", accent: "#B3122B", chair: "#4A0A15" },
  { wall: ["#2F3B33", "#1F2823"], floor: ["#6B4A30", "#3A2718"], cloth: "#F7F2EA", accent: "#B8955A", chair: "#7A2E2E" },
  { wall: ["#F2EEE8", "#E1DAD0"], floor: ["#C9BFB2", "#9E948A"], cloth: "#FFFFFF", accent: "#1F5B57", chair: "#2B2A2E" },
  { wall: ["#4A0A15", "#2E060D"], floor: ["#5C3E27", "#2B1C12"], cloth: "#F8F1E7", accent: "#B8955A", chair: "#8E0E22" },
];

function interior(w, h, seed) {
  const r = rng(seed * 104729 + 7);
  const R = ROOMS[seed % ROOMS.length];
  const vpX = w * (0.45 + r() * 0.1), back = { l: w * 0.18, r: w * 0.82, t: h * 0.12, b: h * 0.56 };
  let body = `<rect width="${w}" height="${h}" fill="url(#wall)"/>`;
  body += `<path d="M0,${h} L${back.l},${back.b} L${back.r},${back.b} L${w},${h} Z" fill="url(#floor)"/>`;
  for (let i = -12; i <= 12; i++) body += `<line x1="${f(vpX + i * (w / 20))}" y1="${h}" x2="${f(lerp(back.l, back.r, (i + 12) / 24))}" y2="${back.b}" stroke="#000" stroke-opacity="0.12" stroke-width="1.5"/>`;
  body += `<path d="M0,0 L${back.l},${back.t} L${back.l},${back.b} L0,${h} Z" fill="#000" opacity="0.12"/><path d="M${w},0 L${back.r},${back.t} L${back.r},${back.b} L${w},${h} Z" fill="#000" opacity="0.08"/>`;
  body += `<path d="M0,0 L${back.l},${back.t} L${back.r},${back.t} L${w},0 Z" fill="#000" opacity="0.15"/>`;
  // windows on back wall
  const nW = 3 + (seed % 2);
  for (let i = 0; i < nW; i++) {
    const ww = (back.r - back.l) / nW, x = back.l + i * ww + ww * 0.12, y = back.t + (back.b - back.t) * 0.1;
    const wh = (back.b - back.t) * 0.72;
    body += `<rect x="${f(x)}" y="${f(y)}" width="${f(ww * 0.76)}" height="${f(wh)}" rx="${seed % 3 === 0 ? f(ww * 0.38) : 2}" fill="url(#win)"/>`;
    body += `<rect x="${f(x + ww * 0.37)}" y="${f(y)}" width="3" height="${f(wh)}" fill="${R.wall[1]}"/>`;
    body += `<path d="M${f(x)},${f(y + wh)} L${f(x - ww * 0.3)},${h} L${f(x + ww * 1.1)},${h} L${f(x + ww * 0.76)},${f(y + wh)} Z" fill="#FFF4DC" opacity="0.08"/>`;
    for (let k = 0; k < 6; k++) body += `<ellipse cx="${f(x + r() * ww * 0.76)}" cy="${f(y + wh - r() * wh * 0.3)}" rx="${f(10 + r() * 16)}" ry="${f(8 + r() * 10)}" fill="#3B6E45" opacity="0.55"/>`;
  }
  // pendant lights
  for (let i = 0; i < 4; i++) {
    const t = (i + 0.5) / 4, x = lerp(w * 0.15, w * 0.85, t), y = h * (0.18 + 0.05 * Math.abs(t - 0.5));
    body += `<line x1="${f(x)}" y1="0" x2="${f(x)}" y2="${f(y)}" stroke="#1A1415" stroke-width="2"/><path d="M${f(x - 26)},${f(y + 20)} Q${f(x)},${f(y - 16)} ${f(x + 26)},${f(y + 20)} Z" fill="${R.accent}"/><circle cx="${f(x)}" cy="${f(y + 26)}" r="60" fill="#FFD48A" opacity="0.18" filter="url(#blur20)"/><ellipse cx="${f(x)}" cy="${f(y + 21)}" rx="16" ry="4" fill="#FFE7B0"/>`;
  }
  // tables (perspective rows)
  const rows = [[0.62, 0.6], [0.72, 0.8], [0.86, 1.08]];
  for (const [ty, s] of rows) {
    const n = ty > 0.8 ? 2 : 3;
    for (let k = 0; k < n; k++) {
      const x = lerp(w * 0.2, w * 0.8, n === 1 ? 0.5 : k / (n - 1)) + (r() - 0.5) * 30;
      const y = h * ty, tw = w * 0.11 * s, th = h * 0.025 * s;
      body += `<rect x="${f(x - tw * 0.9)}" y="${f(y - th * 6)}" width="${f(tw * 0.28)}" height="${f(th * 7)}" rx="6" fill="${R.chair}"/><rect x="${f(x + tw * 0.62)}" y="${f(y - th * 6)}" width="${f(tw * 0.28)}" height="${f(th * 7)}" rx="6" fill="${R.chair}"/>`;
      body += `<path d="M${f(x - tw)},${f(y)} L${f(x - tw * 0.95)},${f(y + th * 4.5)} L${f(x + tw * 0.95)},${f(y + th * 4.5)} L${f(x + tw)},${f(y)} Z" fill="${R.cloth}" opacity="0.93"/>`;
      body += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(tw)}" ry="${f(th)}" fill="${R.cloth}"/>`;
      body += wineGlass(x - tw * 0.4, y - th * 5.5, s * 0.55, "#ffffff", 0.7);
      body += wineGlass(x + tw * 0.35, y - th * 5.2, s * 0.5, "#ffffff", 0.7);
      body += `<circle cx="${f(x)}" cy="${f(y - th)}" r="${f(3 * s)}" fill="#FFD48A"/>`;
    }
  }
  // plant
  const px = seed % 2 ? w * 0.06 : w * 0.94;
  for (let i = 0; i < 40; i++) { const a = -Math.PI / 2 + (r() - 0.5) * 2.4, d = h * (0.05 + r() * 0.2); body += `<ellipse cx="${f(px + Math.cos(a) * d * 0.7)}" cy="${f(h * 0.62 + Math.sin(a) * d)}" rx="${f(14 + r() * 10)}" ry="6" transform="rotate(${f((a * 180) / Math.PI)} ${f(px + Math.cos(a) * d * 0.7)} ${f(h * 0.62 + Math.sin(a) * d)})" fill="${pick(r, ["#2F5D3A", "#3B6E45", "#27492F"])}"/>`; }
  body += `<rect x="${f(px - 30)}" y="${f(h * 0.62)}" width="60" height="${f(h * 0.12)}" rx="8" fill="#C8B49A"/>`;
  const defs = lg("wall", [[0, R.wall[0]], [1, R.wall[1]]]) + lg("floor", [[0, R.floor[0]], [1, R.floor[1]]]) + lg("win", [[0, "#CFE3EC"], [0.6, "#F7E9C8"], [1, "#F3D3A0"]]) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 1300, "#1A1415", 0.06) + vignette(w, h));
}

function lakeHotel(w, h, seed = 3) {
  const r = rng(seed);
  const hz = h * 0.48;
  let body = `<rect width="${w}" height="${hz}" fill="url(#sky)"/>`;
  body += `<path d="M0,${hz} L${w * 0.15},${hz - h * 0.25} L${w * 0.3},${hz - h * 0.12} L${w * 0.48},${hz - h * 0.3} L${w * 0.66},${hz - h * 0.1} L${w * 0.82},${hz - h * 0.22} L${w},${hz - h * 0.08} L${w},${hz} Z" fill="#6E7FA3" opacity="0.8"/>`;
  body += `<path d="M${w * 0.4},${hz - h * 0.26} L${w * 0.48},${hz - h * 0.3} L${w * 0.53},${hz - h * 0.24} Z" fill="#fff" opacity="0.7"/>`;
  body += `<path d="M0,${hz} C${w * 0.2},${hz - h * 0.06} ${w * 0.5},${hz - h * 0.03} ${w},${hz - h * 0.05} L${w},${hz} Z" fill="#3E5A4A"/>`;
  body += `<rect y="${hz}" width="${w}" height="${h - hz}" fill="url(#lake)"/>`;
  for (let i = 0; i < 60; i++) body += `<rect x="${f(r() * w)}" y="${f(hz + r() * h * 0.2)}" width="${f(20 + r() * 60)}" height="1.5" fill="#fff" opacity="${f(r() * 0.35)}"/>`;
  const ty = h * 0.68;
  body += `<rect y="${ty}" width="${w}" height="${h - ty}" fill="#D8C3A5"/>`;
  for (let x = 0; x < w; x += 46) body += `<line x1="${x}" y1="${ty}" x2="${x - 60}" y2="${h}" stroke="#B89F80" stroke-width="2"/>`;
  body += `<rect y="${ty - h * 0.05}" width="${w}" height="${h * 0.012}" fill="#F0E6D6"/>`;
  for (let x = 6; x < w; x += 34) body += `<rect x="${x}" y="${ty - h * 0.04}" width="5" height="${h * 0.04}" fill="#E8DCCB"/>`;
  const cx = w * 0.5, cy = h * 0.84, rx = w * 0.2, ry = h * 0.06;
  body += `<ellipse cx="${cx}" cy="${cy + ry * 2}" rx="${rx}" ry="${ry * 0.6}" fill="#000" opacity="0.2" filter="url(#soft)"/><path d="M${cx - rx},${cy} L${cx - rx},${cy + ry * 1.8} L${cx + rx},${cy + ry * 1.8} L${cx + rx},${cy} Z" fill="#F6F1E8"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#FFFFFF"/>`;
  const gs = w / 700;
  body += wineGlass(cx - rx * 0.5, cy - 60 * gs, gs, "#fff", 0.85, "#E8D9A0") + wineGlass(cx + rx * 0.45, cy - 58 * gs, gs, "#fff", 0.85, "#E8D9A0");
  body += `<ellipse cx="${cx - rx * 0.1}" cy="${cy}" rx="${rx * 0.2}" ry="${ry * 0.4}" fill="#EDE6DA"/><ellipse cx="${cx + rx * 0.2}" cy="${cy + 4}" rx="${rx * 0.12}" ry="${ry * 0.3}" fill="#E7D7B8"/>`;
  for (let i = 0; i < 8; i++) body += `<circle cx="${f(cx - rx * 0.6 + i * rx * 0.17)}" cy="${f(cy - ry * 0.1)}" r="5" fill="${pick(r, ["#C0392B", "#F4D58D", "#6A994E"])}"/>`;
  const defs = lg("sky", [[0, "#7FA2C9"], [0.7, "#E9C9A8"], [1, "#F4DDBE"]]) + lg("lake", [[0, "#7C95B8"], [1, "#34506F"]]) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 1200, "#1A1415", 0.05) + vignette(w, h));
}

function luxuryHotel(w, h) {
  const r = rng(11);
  let body = `<rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  const fy = h * 0.2, fh = h * 0.42;
  body += `<rect x="${w * 0.08}" y="${fy}" width="${w * 0.84}" height="${fh}" fill="#E9DCC6"/><rect x="${w * 0.06}" y="${fy - 14}" width="${w * 0.88}" height="16" fill="#D7C6AA"/>`;
  for (let i = 0; i < 7; i++) for (let j = 0; j < 3; j++) {
    const x = w * 0.12 + i * w * 0.112, y = fy + 24 + j * fh * 0.31, ww = w * 0.06, wh = fh * 0.22;
    body += `<path d="M${f(x)},${f(y + wh)} L${f(x)},${f(y + ww / 2)} A${f(ww / 2)},${f(ww / 2)} 0 0 1 ${f(x + ww)},${f(y + ww / 2)} L${f(x + ww)},${f(y + wh)} Z" fill="${r() < 0.7 ? "#F7C978" : "#3E3346"}" opacity="0.95"/>`;
  }
  const py = fy + fh;
  body += `<rect y="${py}" width="${w}" height="${h - py}" fill="#CDBB9E"/><rect x="${w * 0.15}" y="${py + h * 0.06}" width="${w * 0.7}" height="${h * 0.22}" rx="10" fill="url(#pool)"/>`;
  for (let i = 0; i < 40; i++) body += `<rect x="${f(w * 0.17 + r() * w * 0.64)}" y="${f(py + h * 0.08 + r() * h * 0.18)}" width="${f(12 + r() * 40)}" height="2" fill="#F7C978" opacity="${f(r() * 0.6)}"/>`;
  for (const x of [w * 0.05, w * 0.95]) { body += `<rect x="${x - 4}" y="${py - h * 0.3}" width="8" height="${h * 0.32}" fill="#4A3A2A"/>`; for (let i = 0; i < 9; i++) body += `<path d="M${x},${py - h * 0.3} q${f((r() - 0.5) * 160)},${f(-20 + r() * 50)} ${f((r() - 0.5) * 220)},${f(30 + r() * 60)}" stroke="#2F5D3A" stroke-width="10" fill="none" stroke-linecap="round"/>`; }
  const defs = lg("sky", [[0, "#1B2550"], [0.6, "#7A5C8E"], [1, "#E7A77A"]]) + lg("pool", [[0, "#2D6F8F"], [1, "#12384D"]]) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 1000, "#000", 0.05) + vignette(w, h));
}

function romantic(w, h) {
  const r = rng(21);
  let body = `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  for (let i = 0; i < 26; i++) body += `<circle cx="${f(r() * w)}" cy="${f(r() * h * 0.55)}" r="${f(10 + r() * 34)}" fill="${pick(r, ["#FFC75E", "#F3A6B8", "#FFE3A3"])}" opacity="${f(0.08 + r() * 0.2)}" filter="url(#soft)"/>`;
  const ty = h * 0.62;
  body += `<path d="M${w * 0.08},${ty} L${w * 0.92},${ty} L${w},${h} L0,${h} Z" fill="#F4ECE0"/><path d="M${w * 0.08},${ty} L${w * 0.92},${ty}" stroke="#E4DBD1" stroke-width="3"/>`;
  const gs = w / 520;
  body += wineGlass(w * 0.36, ty - 75 * gs, gs, "#ffffff", 0.9, "#8E0E22") + wineGlass(w * 0.64, ty - 75 * gs, gs, "#ffffff", 0.9, "#8E0E22");
  for (const x of [w * 0.47, w * 0.53]) body += `<rect x="${x - 5 * gs}" y="${ty - 60 * gs}" width="${10 * gs}" height="${60 * gs}" rx="2" fill="#FBF4E6"/><ellipse cx="${x}" cy="${ty - 68 * gs}" rx="${4 * gs}" ry="${10 * gs}" fill="#FFC75E"/><circle cx="${x}" cy="${ty - 64 * gs}" r="${55 * gs}" fill="#FFC75E" opacity="0.2" filter="url(#blur20)"/>`;
  body += `<ellipse cx="${w * 0.3}" cy="${ty + h * 0.16}" rx="${w * 0.12}" ry="${h * 0.05}" fill="#fff"/><ellipse cx="${w * 0.7}" cy="${ty + h * 0.16}" rx="${w * 0.12}" ry="${h * 0.05}" fill="#fff"/>`;
  body += `<path d="M${w * 0.5 - 30},${ty + h * 0.1} q30,-26 60,0 q-30,22 -60,0" fill="#B3122B"/>`;
  const defs = lg("bg", [[0, "#2A0A12"], [1, "#4A0A15"]]) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 900, "#000", 0.08) + vignette(w, h));
}

function vineyard(w, h, seed = 5, withBottle = true) {
  const r = rng(seed);
  const hz = h * 0.38;
  let body = `<rect width="${w}" height="${hz}" fill="url(#sky)"/>`;
  body += `<circle cx="${w * 0.75}" cy="${hz * 0.7}" r="${h * 0.06}" fill="#FFE7B0"/><circle cx="${w * 0.75}" cy="${hz * 0.7}" r="${h * 0.2}" fill="#FFE7B0" opacity="0.25" filter="url(#blur20)"/>`;
  const hills = [["#B98E5C", 0], ["#8FA05A", 0.04], ["#6E8A47", 0.1]];
  hills.forEach(([c, o], i) => { body += `<path d="M0,${hz + h * o} C${w * 0.25},${hz - h * 0.08 + h * o} ${w * 0.55},${hz + h * 0.06 + h * o} ${w},${hz - h * 0.04 + h * o} L${w},${h} L0,${h} Z" fill="${c}"/>`; if (i === 0) for (let k = 0; k < 14; k++) { const x = r() * w, y = hz + h * 0.02; body += `<path d="M${f(x)},${f(y)} q4,-34 8,0 Z" fill="#2F4A2A"/>`; } });
  body += `<rect x="${w * 0.6}" y="${hz + h * 0.015}" width="${w * 0.06}" height="${h * 0.035}" fill="#EAD8BC"/><path d="M${w * 0.595},${hz + h * 0.015} L${w * 0.63},${hz - h * 0.005} L${w * 0.665},${hz + h * 0.015} Z" fill="#A9502F"/>`;
  for (let i = -14; i <= 14; i++) { const x0 = w * 0.5 + i * w * 0.09; body += `<path d="M${f(w * 0.5 + i * w * 0.02)},${f(hz + h * 0.14)} L${f(x0)},${h}" stroke="#3F5F2E" stroke-width="${f(6 + Math.abs(i))}" stroke-dasharray="${f(8 + Math.abs(i) * 2)} ${f(5 + Math.abs(i))}" opacity="0.85"/>`; }
  if (withBottle) {
    const bx = w * 0.18, by = h * 0.98, s = h / 600;
    body += `<path d="M${bx - 26 * s},${by} L${bx - 26 * s},${by - 150 * s} C${bx - 26 * s},${by - 190 * s} ${bx - 10 * s},${by - 200 * s} ${bx - 9 * s},${by - 230 * s} L${bx - 9 * s},${by - 280 * s} L${bx + 9 * s},${by - 280 * s} L${bx + 9 * s},${by - 230 * s} C${bx + 10 * s},${by - 200 * s} ${bx + 26 * s},${by - 190 * s} ${bx + 26 * s},${by - 150 * s} L${bx + 26 * s},${by} Z" fill="#1F2A1E"/><rect x="${bx - 22 * s}" y="${by - 120 * s}" width="${44 * s}" height="${50 * s}" fill="#F1E6D2"/><rect x="${bx - 22 * s}" y="${by - 104 * s}" width="${44 * s}" height="${6 * s}" fill="#B3122B"/>`;
    body += wineGlass(w * 0.3, h * 0.98 - 108 * s, s * 1.55, "#ffffff", 0.9, "#8E0E22");
  }
  const defs = lg("sky", [[0, "#8FB6D6"], [1, "#F4DDB4"]]) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 1000, "#1A1415", 0.05) + vignette(w, h));
}

function chefsTable(w, h) {
  const r = rng(31);
  let body = `<rect width="${w}" height="${h}" fill="url(#bg)"/>`;
  body += `<rect y="${h * 0.12}" width="${w}" height="${h * 0.05}" fill="#2B2226"/>`;
  for (let i = 0; i < 9; i++) { const x = w * 0.08 + i * w * 0.105, rr = 22 + r() * 20; body += `<line x1="${f(x)}" y1="${h * 0.17}" x2="${f(x)}" y2="${f(h * 0.25)}" stroke="#7A6A60" stroke-width="3"/><circle cx="${f(x)}" cy="${f(h * 0.25 + rr)}" r="${f(rr)}" fill="url(#copper)"/><rect x="${f(x - 3)}" y="${f(h * 0.25 + rr * 2 - 2)}" width="6" height="${f(rr)}" fill="#8A4B2A"/>`; }
  body += `<rect y="${h * 0.5}" width="${w}" height="${h * 0.12}" fill="#C9C2BA"/><rect y="${h * 0.5}" width="${w}" height="6" fill="#EDE8E2"/>`;
  for (let i = 0; i < 4; i++) body += `<circle cx="${f(w * 0.3 + i * w * 0.36 / 3)}" cy="${f(h * 0.4)}" r="80" fill="#FFB86B" opacity="0.18" filter="url(#blur20)"/>`;
  body += `<rect y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="url(#counter)"/>`;
  for (let i = 0; i < 5; i++) { const x = w * 0.12 + i * w * 0.19; body += `<ellipse cx="${f(x)}" cy="${f(h * 0.78)}" rx="${f(w * 0.07)}" ry="${f(h * 0.045)}" fill="#F4EFE8"/><ellipse cx="${f(x)}" cy="${f(h * 0.775)}" rx="${f(w * 0.025)}" ry="${f(h * 0.018)}" fill="${pick(r, ["#C7522A", "#5E8C3A", "#8E1B3A", "#E9A23B"])}"/>`; body += wineGlass(x + w * 0.06, h * 0.72 - 40, 0.8, "#ffffff", 0.7); }
  const defs = lg("bg", [[0, "#3A2A26"], [1, "#1E1614"]]) + rg("copper", [[0, "#F0A46B"], [1, "#9C4E26"]], 0.35, 0.35, 0.7) + lg("counter", [[0, "#7A5638"], [1, "#4A321F"]]) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 1100, "#000", 0.07) + vignette(w, h));
}

function chefStation(w, h) {
  const r = rng(41);
  let body = `<rect width="${w}" height="${h}" fill="url(#steel)"/>`;
  body += `<rect x="${w * 0.18}" y="${h * 0.2}" width="${w * 0.5}" height="${h * 0.6}" rx="14" fill="url(#board)"/>`;
  for (let i = 0; i < 18; i++) body += `<line x1="${w * 0.18}" y1="${f(h * 0.2 + i * h * 0.033)}" x2="${w * 0.68}" y2="${f(h * 0.2 + i * h * 0.033 + (r() - 0.5) * 6)}" stroke="#7A5232" stroke-opacity="0.2"/>`;
  body += `<path d="M${w * 0.24},${h * 0.7} L${w * 0.6},${h * 0.62} L${w * 0.62},${h * 0.65} L${w * 0.26},${h * 0.73} Z" fill="#D9DEE2"/><rect x="${w * 0.6}" y="${h * 0.6}" width="${w * 0.1}" height="${h * 0.04}" rx="6" fill="#2B2226" transform="rotate(-12 ${w * 0.6} ${h * 0.6})"/>`;
  for (let i = 0; i < 80; i++) { const x = w * 0.3 + r() * w * 0.25, y = h * 0.3 + r() * h * 0.25; body += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(5 + r() * 9)}" ry="${f(2 + r() * 3)}" transform="rotate(${f(r() * 180)} ${f(x)} ${f(y)})" fill="${pick(r, ["#3B6E45", "#5E8C3A", "#27492F"])}"/>`; }
  const bowls = [[0.8, 0.28, "#C7522A"], [0.82, 0.58, "#F4D58D"], [0.1, 0.5, "#8E1B3A"]];
  for (const [bx, by, c] of bowls) body += `<circle cx="${w * bx}" cy="${h * by}" r="${h * 0.11}" fill="#F7F3EC" stroke="#D8D0C4" stroke-width="3"/><circle cx="${w * bx}" cy="${h * by}" r="${h * 0.075}" fill="${c}"/>`;
  const defs = lg("steel", [[0, "#B9BEC3"], [1, "#8E949A"]], 0, 0, 1, 1) + lg("board", [[0, "#B4855A"], [1, "#8C6440"]], 0, 0, 1, 1) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 900, "#000", 0.05) + vignette(w, h));
}

function compassMark(cx, cy, s, color) {
  // original mark: compass rose whose north needle is a fork
  return `<g transform="translate(${cx} ${cy}) scale(${s})" fill="none" stroke="${color}" stroke-width="3"><circle r="40"/><circle r="31" stroke-width="1.5"/><path d="M0,-28 L5,0 L0,28 L-5,0 Z" fill="${color}" stroke="none"/><path d="M-28,0 L0,-4 L28,0 L0,4 Z" fill="${color}" stroke="none" opacity="0.55"/><path d="M-6,-58 L-6,-46 M0,-58 L0,-46 M6,-58 L6,-46 M-6,-46 Q0,-40 6,-46 M0,-43 L0,-34" stroke-width="2.5"/></g>`;
}

function giftCard(w, h) {
  const r = rng(51);
  let body = `<rect width="${w}" height="${h}" fill="#F0E9DF"/>`;
  body += `<g transform="rotate(-8 ${w / 2} ${h / 2})"><rect x="${w * 0.2 + 16}" y="${h * 0.22 + 20}" width="${w * 0.6}" height="${h * 0.56}" rx="18" fill="#000" opacity="0.2" filter="url(#soft)"/><rect x="${w * 0.2}" y="${h * 0.22}" width="${w * 0.6}" height="${h * 0.56}" rx="18" fill="url(#card)"/>${compassMark(w * 0.32, h * 0.38, 0.9, "#FAF7F2")}<rect x="${w * 0.44}" y="${h * 0.34}" width="${w * 0.28}" height="10" rx="5" fill="#FAF7F2" opacity="0.85"/><rect x="${w * 0.44}" y="${h * 0.38}" width="${w * 0.2}" height="8" rx="4" fill="#FAF7F2" opacity="0.5"/><rect x="${w * 0.24}" y="${h * 0.66}" width="${w * 0.16}" height="8" rx="4" fill="#B8955A"/></g>`;
  body += `<path d="M0,${h * 0.82} C${w * 0.3},${h * 0.7} ${w * 0.6},${h * 0.95} ${w},${h * 0.8}" stroke="#B3122B" stroke-width="22" fill="none"/>`;
  const defs = lg("card", [[0, "#B3122B"], [1, "#4A0A15"]], 0, 0, 1, 1) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 700, "#000", 0.04));
}

function tuscany(w, h) {
  const r = rng(61);
  const hz = h * 0.42;
  let body = `<rect width="${w}" height="${h}" fill="url(#sky)"/>`;
  body += `<circle cx="${w * 0.2}" cy="${hz * 0.8}" r="${h * 0.22}" fill="#FFDFA0" opacity="0.4" filter="url(#blur20)"/>`;
  const layers = ["#C9A27A", "#B9965E", "#9DA35C", "#7F9A4E", "#6A8642"];
  layers.forEach((c, i) => {
    const y = hz + i * h * 0.1;
    body += `<path d="M0,${f(y)} C${f(w * (0.2 + r() * 0.1))},${f(y - h * (0.05 + r() * 0.06))} ${f(w * (0.5 + r() * 0.1))},${f(y + h * 0.05)} ${w},${f(y - h * 0.03)} L${w},${h} L0,${h} Z" fill="${c}"/>`;
    for (let k = 0; k < 3 + i; k++) { const x = r() * w, yy = y + h * 0.02; const ch = h * (0.04 + i * 0.012); body += `<path d="M${f(x - ch * 0.12)},${f(yy)} Q${f(x)},${f(yy - ch * 2.2)} ${f(x + ch * 0.12)},${f(yy)} Z" fill="#2E4A2A"/>`; }
    if (i === 1) body += `<rect x="${w * 0.62}" y="${y - h * 0.045}" width="${w * 0.08}" height="${h * 0.04}" fill="#EAD2AE"/><path d="M${w * 0.615},${y - h * 0.045} L${w * 0.66},${y - h * 0.075} L${w * 0.705},${y - h * 0.045} Z" fill="#B0563A"/><rect x="${w * 0.69}" y="${y - h * 0.075}" width="${w * 0.018}" height="${h * 0.035}" fill="#EAD2AE"/>`;
    if (i === 3) for (let k = -8; k <= 8; k++) body += `<path d="M${f(w * 0.3 + k * 10)},${f(y + h * 0.02)} L${f(w * 0.3 + k * 60)},${h}" stroke="#4F6B36" stroke-width="5" stroke-dasharray="10 7" opacity="0.6"/>`;
  });
  const defs = lg("sky", [[0, "#9EC0DA"], [0.6, "#F2D9B0"], [1, "#F6C990"]]) + vigDef;
  return svg(w, h, defs, body + grain(w, h, r, 1200, "#1A1415", 0.05) + vignette(w, h));
}

// ---------- render ----------
const jobs = [];
const add = (name, w, h, make) => jobs.push({ name, w, h, make });
add("hero-mediterranean", 2100, 900, (w, h) => terrace(w, h, 7));
for (const c of Object.keys(CITY)) add(`destination-${c}`, 900, 1200, (w, h) => skyline(w, h, c));
add("tasting-menu", 1200, 900, (w, h) => dish(w, h, 2));
add("restaurant-interior", 1600, 900, (w, h) => interior(w, h, 1));
add("dine-and-stay", 1200, 900, (w, h) => lakeHotel(w, h, 3));
add("romantic-dining", 1200, 900, romantic);
add("wine-experience", 1200, 900, (w, h) => vineyard(w, h, 5, true));
add("chefs-table", 1200, 900, chefsTable);
add("gift-card", 1200, 900, giftCard);
add("tuscany-travel", 1600, 700, tuscany);
add("luxury-hotel", 1200, 900, luxuryHotel);
add("chef-editorial", 1200, 900, chefStation);
add("terrace-1", 1200, 900, (w, h) => terrace(w, h, 3));
for (let i = 1; i <= 16; i++) add(`dish-${i}`, 1200, 900, (w, h) => dish(w, h, i + 3));
for (let i = 1; i <= 8; i++) add(`interior-${i}`, 1200, 900, (w, h) => interior(w, h, i + 1));

const manifest = {};
for (const j of jobs) {
  const s = j.make(j.w, j.h);
  const buf = Buffer.from(s);
  const img = sharp(buf, { density: 72 });
  await img.clone().webp({ quality: 80, effort: 5 }).toFile(new URL(`${j.name}.webp`, OUT).pathname);
  const tiny = await img.clone().resize(16).webp({ quality: 40 }).toBuffer();
  manifest[j.name] = { src: `/images/generated/${j.name}.webp`, width: j.w, height: j.h, blurDataURL: `data:image/webp;base64,${tiny.toString("base64")}`, illustrative: true, licence: "generated-illustrative (REPLACE BEFORE LAUNCH)" };
  process.stdout.write(".");
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));

// brand assets
const mark = (bg, fg, size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 120 120"><rect width="120" height="120" rx="${size > 100 ? 26 : 0}" fill="${bg}"/>${compassMark(60, 66, 1, fg)}</svg>`;
await sharp(Buffer.from(mark("#B3122B", "#FAF7F2", 180))).resize(180, 180).png().toFile(new URL("../public/apple-touch-icon.png", import.meta.url).pathname);
const BRAND_NAME = process.env.BRAND_NAME ?? "ATLAS TABLE GUIDE";
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#B3122B"/><rect x="40" y="40" width="1120" height="550" rx="12" fill="none" stroke="#FAF7F2" stroke-opacity="0.35"/>${compassMark(600, 250, 1.6, "#FAF7F2")}<text x="600" y="430" text-anchor="middle" font-family="Georgia, serif" font-size="64" letter-spacing="10" fill="#FAF7F2">${BRAND_NAME}</text></svg>`;
await sharp(Buffer.from(og)).png().toFile(new URL("../public/og-default.png", import.meta.url).pathname);
console.log(`\n${jobs.length} images + brand assets written`);
