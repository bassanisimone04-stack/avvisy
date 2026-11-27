"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { Map as MLMap, GeoJSONSource } from "maplibre-gl";
import { serializeFilters, type Filters } from "@/lib/filters";
import { SmartImageClient } from "./SmartImageClient";

export type MapItem = { slug: string; name: string; href: string; lat: number; lng: number; subtitle: string; meta: string; imageKey: string; alt: string };

export function MapSplit({ items, styleUrl, basePath, filters, labels }: { items: MapItem[]; styleUrl: string; basePath: string; filters: Filters; labels: { searchArea: string; mapUnavailable: string; mapListAlt: string; illustrative: string; mapLabel: string } }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [moved, setMoved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let m: MLMap | null = null;
    (async () => {
      try {
        const [ml] = await Promise.all([import("maplibre-gl"), import("maplibre-gl/dist/maplibre-gl.css")]);
        if (cancelled || !el.current) return;
        m = new ml.Map({ container: el.current, style: styleUrl, attributionControl: { compact: true }, cooperativeGestures: true, bounds: bounds(items), fitBoundsOptions: { padding: 48, maxZoom: 13 } });
        map.current = m;
        m.addControl(new ml.NavigationControl({ showCompass: false }), "top-right");
        m.on("error", (e) => { if (!m?.isStyleLoaded()) { console.warn("map error", e.error); setFailed(true); } });
        m.on("load", () => {
          if (!m) return;
          m.addSource("r", { type: "geojson", cluster: true, clusterRadius: 40, data: { type: "FeatureCollection", features: items.map((i) => ({ type: "Feature", id: hashId(i.slug), properties: { slug: i.slug, name: i.name, href: i.href }, geometry: { type: "Point", coordinates: [i.lng, i.lat] } })) } });
          m.addLayer({ id: "clusters", type: "circle", source: "r", filter: ["has", "point_count"], paint: { "circle-color": "#B3122B", "circle-radius": ["step", ["get", "point_count"], 16, 5, 20, 10, 26], "circle-stroke-width": 2, "circle-stroke-color": "#FAF7F2" } });
          m.addLayer({ id: "count", type: "symbol", source: "r", filter: ["has", "point_count"], layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 }, paint: { "text-color": "#ffffff" } });
          m.addLayer({ id: "pts", type: "circle", source: "r", filter: ["!", ["has", "point_count"]], paint: { "circle-color": ["case", ["boolean", ["feature-state", "hover"], false], "#4A0A15", "#B3122B"], "circle-radius": ["case", ["boolean", ["feature-state", "hover"], false], 11, 8], "circle-stroke-width": 2, "circle-stroke-color": "#ffffff" } });
          m.on("click", "clusters", async (e) => {
            const f = m!.queryRenderedFeatures(e.point, { layers: ["clusters"] })[0];
            const src = m!.getSource("r") as GeoJSONSource;
            const zoom = await src.getClusterExpansionZoom(f!.properties!.cluster_id as number);
            m!.easeTo({ center: (f!.geometry as unknown as { coordinates: [number, number] }).coordinates, zoom });
          });
          m.on("click", "pts", (e) => {
            const f = e.features?.[0];
            if (!f) return;
            const p = f.properties as { name: string; href: string };
            const div = document.createElement("div");
            const a = document.createElement("a");
            a.href = p.href; a.textContent = p.name; a.className = "font-semibold underline";
            div.appendChild(a);
            new ml.Popup({ offset: 12 }).setLngLat((f.geometry as unknown as { coordinates: [number, number] }).coordinates).setDOMContent(div).addTo(m!);
          });
          m.on("mouseenter", "pts", (e) => { m!.getCanvas().style.cursor = "pointer"; setHover(String(e.features?.[0]?.properties?.slug ?? "")); });
          m.on("mouseleave", "pts", () => { m!.getCanvas().style.cursor = ""; setHover(null); });
          m.on("moveend", (ev) => { if ((ev as { originalEvent?: unknown }).originalEvent) setMoved(true); });
        });
      } catch (e) {
        console.warn(e);
        setFailed(true);
      }
    })();
    return () => { cancelled = true; m?.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styleUrl]);

  useEffect(() => {
    const m = map.current;
    if (!m || !m.getSource("r")) return;
    for (const i of items) m.setFeatureState({ source: "r", id: hashId(i.slug) }, { hover: i.slug === hover });
  }, [hover, items]);

  const searchArea = () => {
    const b = map.current?.getBounds();
    if (!b) return;
    const qs = serializeFilters({ ...filters, bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()], page: 1 });
    router.push(`${basePath}?${qs}`, { scroll: false });
    setMoved(false);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[45fr_55fr]">
      <ul className="order-2 space-y-3 lg:order-1 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2" aria-label={labels.mapListAlt}>
        {items.map((i) => (
          <li key={i.slug} onMouseEnter={() => setHover(i.slug)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i.slug)}
            className={clsx("relative flex gap-3 rounded-[12px] border bg-white p-2 transition-colors", hover === i.slug ? "border-carmine" : "border-line")}>
            <SmartImageClient imageKey={i.imageKey} alt={i.alt} className="h-20 w-28 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-sans text-sm font-bold"><Link href={i.href} className="after:absolute after:inset-0 after:content-[''] hover:underline">{i.name}</Link></h3>
              <p className="text-xs text-stone">{i.subtitle}</p>
              <p className="mt-1 text-xs">{i.meta}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="relative order-1 h-[55vh] overflow-hidden rounded-[12px] border border-line bg-sand lg:order-2 lg:h-[70vh]">
        {failed ? (
          <div className="grid h-full place-items-center p-6 text-center text-sm text-stone" role="status">{labels.mapUnavailable}</div>
        ) : (
          <div ref={el} className="h-full w-full" role="region" aria-label={labels.mapLabel} />
        )}
        {moved && !failed && (
          <button type="button" onClick={searchArea} className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-carmine shadow-card">{labels.searchArea}</button>
        )}
      </div>
    </div>
  );
}

function bounds(items: MapItem[]): [[number, number], [number, number]] {
  if (!items.length) return [[-20, 20], [40, 60]];
  const lngs = items.map((i) => i.lng), lats = items.map((i) => i.lat);
  const pad = items.length === 1 ? 0.02 : 0;
  return [[Math.min(...lngs) - pad, Math.min(...lats) - pad], [Math.max(...lngs) + pad, Math.max(...lats) + pad]];
}
function hashId(s: string) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
