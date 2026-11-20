/**
 * Tema condiviso delle mappe (esploratore /mappa e mappe piccole delle schede locale):
 * sfondo stilizzato "satellitare" (mare blu, terre oliva, confini gialli), icone dei pin,
 * tile stradali OSM solo dallo zoom 9. Il CSS è in src/styles/mappa-tema.css.
 * Nota: le funzioni che usano Leaflet vanno chiamate solo lato client.
 */
import type * as Leaflet from "leaflet";

type L = typeof Leaflet;

/** Ciak (location reale) e forchetta+coltello (legato al film): glifi 24×24 a tratto. */
export const ICONA_CIAK =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>';
export const ICONA_POSATE =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>';

export type CategoriaPin = "set" | "legato" | "chiuso";
export const categoriaPin = (categoria: string, chiuso: boolean): CategoriaPin =>
  chiuso ? "chiuso" : categoria === "legato-al-film" ? "legato" : "set";

/** Pin a goccia: ciak per le location reali, forchetta e coltello per i locali legati al film. */
export function pinIcon(Lf: L, categoria: string, chiuso: boolean, extra = "") {
  const cls = categoriaPin(categoria, chiuso);
  const glifo = categoria === "legato-al-film" ? ICONA_POSATE : ICONA_CIAK;
  return Lf.divIcon({
    className: "cf-pin " + extra,
    html: `<div class="pin pin-${cls}"><span class="glifo">${glifo}</span></div>`,
    iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -32], tooltipAnchor: [0, -32],
  });
}

const ATTR_BASE =
  'Confini: <a href="https://www.istat.it/">ISTAT</a>/<a href="https://github.com/openpolis/geojson-italy">openpolis</a> (CC-BY), <a href="https://www.naturalearthdata.com/">Natural Earth</a>';
const ATTR_OSM = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const OSM = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const caricaBase = () =>
  fetch("/mappa/base.json").then((r) => {
    if (!r.ok) throw new Error("base");
    return r.json();
  });

export interface RegioneLayer { name: string; base: string; layer: any }

const ESTERNI = ["#4b5d35", "#55673b", "#485a32", "#5c6b3e"];
const REGIONI = ["#6f8546", "#7d8b4e", "#657c40", "#86905a", "#74874a"];

/** Disegna mare/terre. Restituisce i layer delle regioni (per l'interattività). */
export function disegnaBase(Lf: L, map: Leaflet.Map, base: any, interattive: boolean): RegioneLayer[] {
  if (!map.getPane("basePane")) map.createPane("basePane").style.zIndex = "150";
  const renderer = Lf.canvas({ pane: "basePane", padding: 0.5 });
  const out: RegioneLayer[] = [];
  Lf.geoJSON(base.world, {
    renderer, interactive: false,
    style: (f: any) => ({ fillColor: ESTERNI[f.properties.n.length % ESTERNI.length], fillOpacity: 1, color: "#e9dc5a", weight: 1, opacity: 0.65 }),
  } as any).addTo(map);
  Lf.geoJSON(base.it, { renderer, interactive: false, style: { fill: false, color: "#5aa9df", weight: 8, opacity: 0.22 } } as any).addTo(map);
  let i = 0;
  Lf.geoJSON(base.it, {
    renderer, interactive: interattive, bubblingMouseEvents: false,
    style: () => ({ fillColor: REGIONI[i++ % REGIONI.length], fillOpacity: 1, color: "#d9cf6c", weight: 0.7, opacity: 0.5 }),
    onEachFeature: (f: any, layer: any) => out.push({ name: f.properties.n, base: layer.options.fillColor, layer }),
  } as any).addTo(map);
  map.attributionControl.addAttribution(ATTR_BASE);
  return out;
}

/** Tile stradali OSM: dallo zoom 9 (dettaglio), oppure a tutti i livelli se `tutte` (fallback). */
export function aggiungiTile(Lf: L, map: Leaflet.Map, tutte = false) {
  Lf.tileLayer(OSM, {
    minZoom: tutte ? 0 : 9, maxZoom: 19, className: "cf-tiles", keepBuffer: 2, updateWhenIdle: true, updateWhenZooming: false,
    attribution: ATTR_OSM,
  }).addTo(map);
}
