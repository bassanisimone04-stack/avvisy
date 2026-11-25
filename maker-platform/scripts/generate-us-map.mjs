/**
 * Builds local, offline map assets from us-atlas (US Census Bureau
 * cartographic boundaries, public domain):
 *   public/images/maps/us-states.svg  — static Albers USA map (homepage, cards)
 *   public/geo/us-states.geojson      — state polygons for the MapLibre demo basemap
 * Usage: node scripts/generate-us-map.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";

const require = createRequire(import.meta.url);
const albers = JSON.parse(readFileSync(require.resolve("us-atlas/states-albers-10m.json"), "utf8"));
const geo = JSON.parse(readFileSync(require.resolve("us-atlas/states-10m.json"), "utf8"));

const path = geoPath().digits(1);
const nation = path(mesh(albers, albers.objects.states, (a, b) => a === b));
const borders = path(mesh(albers, albers.objects.states, (a, b) => a !== b));
const land = path(feature(albers, albers.objects.nation));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 975 610">
<path d="${land}" fill="#FFFFFF"/>
<path d="${borders}" fill="none" stroke="#D9D3C4" stroke-width="0.8" stroke-linejoin="round"/>
<path d="${nation}" fill="none" stroke="#9AA58E" stroke-width="1" stroke-linejoin="round"/>
</svg>`;
mkdirSync("public/images/maps", { recursive: true });
writeFileSync("public/images/maps/us-states.svg", svg);

const round = (c) => (Array.isArray(c[0]) ? c.map(round) : [Math.round(c[0] * 1000) / 1000, Math.round(c[1] * 1000) / 1000]);
const states = feature(geo, geo.objects.states);
states.features = states.features.map((f) => ({
  type: "Feature",
  properties: { name: f.properties.name },
  geometry: { type: f.geometry.type, coordinates: round(f.geometry.coordinates) },
}));
mkdirSync("public/geo", { recursive: true });
writeFileSync("public/geo/us-states.geojson", JSON.stringify(states));
console.log("svg bytes", svg.length, "geojson bytes", JSON.stringify(states).length);
