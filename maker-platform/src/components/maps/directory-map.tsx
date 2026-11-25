"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import * as maplibregl from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";
import { useEffect, useRef } from "react";
import Supercluster from "supercluster";
import type { Bounds } from "@/features/directory/geo";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  index?: number;
}

/**
 * Offline demo basemap: US state polygons (U.S. Census Bureau via us-atlas)
 * served from /public. No third-party tiles, keys or requests. If
 * NEXT_PUBLIC_MAP_STYLE_URL is set (Phase 3, licensed provider), it is used
 * instead. See docs/DATA_SOURCES.md → Maps.
 */
const localStyle: StyleSpecification = {
  version: 8,
  sources: {
    states: {
      type: "geojson",
      data: "/geo/us-states.geojson",
      attribution: "Boundaries: U.S. Census Bureau (us-atlas) · Demo basemap",
    },
  },
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#E3E8E0" } },
    { id: "land", type: "fill", source: "states", paint: { "fill-color": "#FBFAF6" } },
    { id: "state-lines", type: "line", source: "states", paint: { "line-color": "#CFC8B8", "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.6, 9, 1.6] } },
  ],
};

// The worker is copied to /public by scripts/copy-vendor.mjs.
maplibregl.setWorkerUrl("/vendor/maplibre/maplibre-gl-worker.mjs");

/** The demo basemap has no streets: keep zoom where state outlines give context. */
const usingDemoBasemap = !process.env.NEXT_PUBLIC_MAP_STYLE_URL;
const FIT_MAX_ZOOM = usingDemoBasemap ? 5.5 : 12;
const FOCUS_ZOOM = usingDemoBasemap ? 7 : 11;

const US_BOUNDS: [[number, number], [number, number]] = [
  [-125, 24.5],
  [-66.5, 49.5],
];

export default function DirectoryMap({
  points,
  activeId,
  hoverId,
  onSelect,
  onBoundsChange,
  fitKey,
}: {
  points: MapPoint[];
  activeId: string | null;
  hoverId: string | null;
  onSelect: (id: string) => void;
  onBoundsChange?: (b: Bounds) => void;
  /** Changing this value re-fits the map to the current points. */
  fitKey: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Map<string, maplibregl.Marker>>(new Map());
  const index = useRef<Supercluster | null>(null);
  const cb = useRef({ onSelect, onBoundsChange });
  const pointsRef = useRef(points);
  const fromUser = useRef(false);

  useEffect(() => {
    cb.current = { onSelect, onBoundsChange };
  }, [onSelect, onBoundsChange]);

  // init
  useEffect(() => {
    if (!container.current) return;
    const styleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL;
    const map = new maplibregl.Map({
      container: container.current,
      style: styleUrl || localStyle,
      bounds: US_BOUNDS,
      fitBoundsOptions: { padding: 24 },
      attributionControl: { compact: true },
      dragRotate: false,
      pitchWithRotate: false,
      maxZoom: 15,
      minZoom: 2,
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    const render = () => renderMarkers();
    map.on("moveend", () => {
      render();
      if (fromUser.current) {
        const b = map.getBounds();
        cb.current.onBoundsChange?.({ west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() });
      }
      fromUser.current = false;
    });
    map.on("dragstart", () => (fromUser.current = true));
    map.on("zoomstart", (e) => {
      if ((e as unknown as { originalEvent?: Event }).originalEvent) fromUser.current = true;
    });
    map.on("load", render);

    const currentMarkers = markers.current;
    return () => {
      currentMarkers.forEach((m) => m.remove());
      currentMarkers.clear();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderMarkers() {
    const map = mapRef.current;
    if (!map || !index.current) return;
    const b = map.getBounds();
    const clusters = index.current.getClusters([b.getWest() - 1, b.getSouth() - 1, b.getEast() + 1, b.getNorth() + 1], Math.round(map.getZoom()));
    const seen = new Set<string>();

    for (const c of clusters) {
      const [lng, lat] = c.geometry.coordinates as [number, number];
      const props = c.properties as { cluster?: boolean; cluster_id?: number; point_count?: number; id?: string; label?: string; index?: number };
      const key = props.cluster ? `c-${props.cluster_id}` : `p-${props.id}`;
      seen.add(key);
      let marker = markers.current.get(key);
      if (!marker) {
        const el = document.createElement("button");
        el.type = "button";
        if (props.cluster) {
          el.className = "dm-cluster";
          el.textContent = String(props.point_count);
          el.setAttribute("aria-label", `${props.point_count} places — zoom in`);
          const id = props.cluster_id!;
          el.addEventListener("click", () => {
            const zoom = index.current!.getClusterExpansionZoom(id);
            map.easeTo({ center: [lng, lat], zoom: Math.min(zoom, 14) });
          });
        } else {
          el.className = "dm-pin";
          el.dataset.id = props.id;
          el.innerHTML = `<span>${props.index ?? ""}</span>`;
          el.setAttribute("aria-label", props.label ?? "Place");
          el.addEventListener("click", () => cb.current.onSelect(props.id!));
        }
        marker = new maplibregl.Marker({ element: el, anchor: props.cluster ? "center" : "bottom" }).setLngLat([lng, lat]).addTo(map);
        markers.current.set(key, marker);
      }
    }
    for (const [key, m] of markers.current) {
      if (!seen.has(key)) {
        m.remove();
        markers.current.delete(key);
      }
    }
    applyHighlight();
  }

  function applyHighlight() {
    for (const m of markers.current.values()) {
      const el = m.getElement();
      if (!el.dataset.id) continue;
      el.dataset.active = String(el.dataset.id === activeRef.current || el.dataset.id === hoverRef.current);
      el.style.zIndex = el.dataset.active === "true" ? "5" : "";
    }
  }

  const activeRef = useRef(activeId);
  const hoverRef = useRef(hoverId);
  useEffect(() => {
    activeRef.current = activeId;
    hoverRef.current = hoverId;
    applyHighlight();
  });

  // (re)build index when points change
  useEffect(() => {
    pointsRef.current = points;
    const sc = new Supercluster({ radius: 48, maxZoom: 13 });
    sc.load(
      points.map((p) => ({
        type: "Feature" as const,
        properties: { id: p.id, label: p.label, index: p.index },
        geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
      })),
    );
    index.current = sc;
    markers.current.forEach((m) => m.remove());
    markers.current.clear();
    const map = mapRef.current;
    if (map?.loaded()) renderMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points]);

  // fit to results when the query changes (not when the user pans)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const pts = pointsRef.current;
    const fit = () => {
      if (!pts.length) return;
      const lngs = pts.map((p) => p.lng);
      const lats = pts.map((p) => p.lat);
      const bounds: [[number, number], [number, number]] = [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ];
      map.fitBounds(bounds, { padding: 64, maxZoom: FIT_MAX_ZOOM, duration: 600 });
    };
    if (map.loaded()) fit();
    else map.once("load", fit);
  }, [fitKey]);

  // fly to a selected place
  useEffect(() => {
    const map = mapRef.current;
    const p = pointsRef.current.find((x) => x.id === activeId);
    if (map && p) map.easeTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), FOCUS_ZOOM), duration: 500 });
  }, [activeId]);

  return <div ref={container} className="h-full w-full" role="region" aria-label="Map of results" />;
}
