/**
 * Genera public/mappa/base.json: confini semplificati dell'Italia (regioni) e dei Paesi vicini,
 * usati come sfondo "satellite stilizzato" della mappa dei locali (nessuna richiesta di tile ai
 * livelli di zoom bassi, quindi la mappa parte subito).
 *
 *   node scripts/build-map-data.mjs
 *
 * Fonti (scaricate qui, non committate):
 *  - Regioni italiane: openpolis/geojson-italy, derivato da ISTAT (licenza CC-BY).
 *  - Paesi: datasets/geo-countries, da Natural Earth (pubblico dominio).
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../public/mappa/base.json");
const IT = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson";
const WORLD = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";
// Paesi visibili intorno all'Italia (basta per le viste dal Nord alla Sicilia)
const NEAR = new Set(["FR","CH","AT","SI","HR","BA","ME","AL","RS","HU","DE","MT","TN","DZ","LY","GR","ES","CZ","SK","MK","XK","MC","SM","VA","AD","LI","RO","BG","MA"]);
const get = async (u) => (await fetch(u)).json();

// Douglas-Peucker iterativo su un anello/linea [[x,y],...]
function dp(pts, tol) {
  const n = pts.length;
  if (n < 5) return pts;
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  const t2 = tol * tol;
  while (stack.length) {
    const [a, b] = stack.pop();
    let max = 0, idx = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let d2;
      if (len2 === 0) d2 = (px - ax) ** 2 + (py - ay) ** 2;
      else {
        let u = ((px - ax) * dx + (py - ay) * dy) / len2;
        u = Math.max(0, Math.min(1, u));
        d2 = (px - (ax + u * dx)) ** 2 + (py - (ay + u * dy)) ** 2;
      }
      if (d2 > max) { max = d2; idx = i; }
    }
    if (max > t2 && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const area = (r) => {
  let s = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) s += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]);
  return Math.abs(s / 2);
};
const round = (r, d) => r.map(([x, y]) => [+x.toFixed(d), +y.toFixed(d)]);
function simplifyGeom(g, tol, minArea, dec) {
  const polys = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
  const out = [];
  for (const poly of polys) {
    const outer = round(dp(poly[0], tol), dec);
    if (outer.length < 4 || area(outer) < minArea) continue;
    out.push([outer]); // i buchi non servono per uno sfondo
  }
  return out.length ? { type: "MultiPolygon", coordinates: out } : null;
}

const it = await get(IT);
const world = await get(WORLD);
const regions = it.features
  .map((f) => ({ type: "Feature", properties: { n: f.properties.reg_name }, geometry: simplifyGeom(f.geometry, 0.003, 4e-5, 3) }))
  .filter((f) => f.geometry);

const bbox = (g) => {
  let a = 1e9, b = 1e9, c = -1e9, d = -1e9;
  for (const p of g.type === "Polygon" ? g.coordinates : g.coordinates.flat()) for (const [x, y] of p) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); }
  return [a, b, c, d];
};
const countries = world.features
  .filter((f) => f.properties["ISO3166-1-Alpha-2"] !== "IT")
  .filter((f) => NEAR.has(f.properties["ISO3166-1-Alpha-2"]))
  .map((f) => ({ type: "Feature", properties: { n: f.properties.name }, geometry: simplifyGeom(f.geometry, 0.02, 0.02, 2) }))
  .filter((f) => f.geometry);

fs.writeFileSync(OUT, JSON.stringify({ it: { type: "FeatureCollection", features: regions }, world: { type: "FeatureCollection", features: countries } }));
console.log("regioni", regions.length, "paesi", countries.length, (fs.statSync(OUT).size / 1024).toFixed(0) + " KB");
