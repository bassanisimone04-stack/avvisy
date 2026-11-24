"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { Layers, Maximize2 } from "lucide-react";
import type { Business } from "@/lib/types";
import { PIN_COLORS } from "@/lib/map-colors";

const ITALY_CENTER: [number, number] = [42.5, 12.6];
const DEFAULT_PIN = "#1b4332";
const LAYER_KEY = "gf-map-layer";

/* ───────────── Pin e cluster ───────────── */

function buildIcon(color: string, active: boolean) {
  const size = active ? 42 : 30;
  const ring = active ? `<circle cx="12" cy="10" r="10.5" fill="none" stroke="${color}" stroke-opacity=".3" stroke-width="3"/>` : "";
  return L.divIcon({
    className: "gf-map-pin",
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      ${ring}
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

// Un'icona per colore e stato, creata una volta sola e poi riusata.
const ICON_CACHE = new Map<string, L.DivIcon>();
function iconFor(category: string, active: boolean) {
  const color = PIN_COLORS[category] ?? DEFAULT_PIN;
  const key = `${color}-${active ? 1 : 0}`;
  let icon = ICON_CACHE.get(key);
  if (!icon) {
    icon = buildIcon(color, active);
    ICON_CACHE.set(key, icon);
  }
  return icon;
}

const USER_ICON = L.divIcon({
  className: "gf-map-user",
  html: '<span class="gf-map-user-dot"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/** Bolla del cluster: dimensione secondo il numero di locali, colore del tipo prevalente. */
function clusterIcon(cluster: L.MarkerCluster) {
  const markers = cluster.getAllChildMarkers() as (L.Marker & { gfCategory?: string })[];
  const counts = new Map<string, number>();
  for (const m of markers) counts.set(m.gfCategory ?? "", (counts.get(m.gfCategory ?? "") ?? 0) + 1);
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
  const color = PIN_COLORS[top] ?? DEFAULT_PIN;
  const n = markers.length;
  const size = n < 5 ? 38 : n < 15 ? 46 : 54;
  return L.divIcon({
    className: "gf-cluster",
    html: `<span style="width:${size}px;height:${size}px;background:${color}"><b>${n}</b></span>`,
    iconSize: [size, size],
  });
}

/* ───────────── Livelli: satellite / mappa ───────────── */

const SATELLITE = {
  url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  labels: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
};
const STREETS = {
  url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

function readLayer(): "satellite" | "streets" {
  try {
    return localStorage.getItem(LAYER_KEY) === "streets" ? "streets" : "satellite";
  } catch {
    return "satellite";
  }
}

/* ───────────── Gruppo di marcatori con cluster ───────────── */

function ClusterLayer({
  businesses,
  activeId,
  onSelect,
}: {
  businesses: Business[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const map = useMap();
  const markers = useRef(new Map<string, L.Marker>());
  const group = useRef<L.MarkerClusterGroup | null>(null);
  const prevActive = useRef<string | null>(null);
  const select = useRef(onSelect);
  select.current = onSelect;
  const activeRef = useRef(activeId);
  activeRef.current = activeId;

  const key = businesses.map((b) => b.id).join(",");

  useEffect(() => {
    const g = L.markerClusterGroup({
      chunkedLoading: true,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 48,
      disableClusteringAtZoom: 15,
      iconCreateFunction: clusterIcon,
    });
    const index = new Map<string, L.Marker>();
    for (const b of businesses) {
      const m = L.marker([b.lat, b.lng], {
        icon: iconFor(b.category, b.id === activeRef.current),
        title: b.name,
        alt: b.name,
        zIndexOffset: b.id === activeRef.current ? 1000 : 0,
      }) as L.Marker & { gfCategory?: string };
      m.gfCategory = b.category;
      m.on("click", () => select.current(b.id));
      m.on("mouseover", () => select.current(b.id));
      index.set(b.id, m);
      g.addLayer(m);
    }
    markers.current = index;
    group.current = g;
    map.addLayer(g);
    return () => {
      map.removeLayer(g);
      group.current = null;
      markers.current = new Map();
    };
    // Si ricostruisce solo quando cambia l'insieme dei locali.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, map]);

  // Selezione: cambiano solo le due icone coinvolte, il resto non viene toccato.
  const catById = useMemo(() => new Map(businesses.map((b) => [b.id, b.category])), [businesses]);
  useEffect(() => {
    const prev = prevActive.current;
    if (prev && prev !== activeId) {
      const m = markers.current.get(prev);
      if (m) {
        m.setIcon(iconFor(catById.get(prev) ?? "", false));
        m.setZIndexOffset(0);
      }
    }
    if (activeId) {
      const m = markers.current.get(activeId);
      if (m) {
        m.setIcon(iconFor(catById.get(activeId) ?? "", true));
        m.setZIndexOffset(1000);
      }
    }
    prevActive.current = activeId;
  }, [activeId, catById, key]);

  return null;
}

/* ───────────── Movimenti della vista ───────────── */

function FitToBusinesses({ businesses }: { businesses: Business[] }) {
  const map = useMap();
  const latest = useRef(businesses);
  latest.current = businesses;
  const key = businesses.map((b) => b.id).join(",");
  useEffect(() => {
    const list = latest.current;
    if (list.length === 0) return;
    const bounds = L.latLngBounds(list.map((b) => [b.lat, b.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: list.length === 1 ? 14 : 12 });
  }, [key, map]);
  return null;
}

function FocusOn({ businesses, focusId }: { businesses: Business[]; focusId?: string | null }) {
  const map = useMap();
  useEffect(() => {
    const b = focusId ? businesses.find((x) => x.id === focusId) : undefined;
    if (b) map.flyTo([b.lat, b.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
  }, [focusId, businesses, map]);
  return null;
}

function FlyToUser({ pos }: { pos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, Math.max(map.getZoom(), 11), { duration: 0.6 });
  }, [pos, map]);
  return null;
}

/**
 * La rotella del mouse zooma la mappa solo dopo un clic su di essa: così
 * scorrendo la pagina non si resta "intrappolati" dentro la mappa.
 */
function WheelOnFocus() {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    const on = () => map.scrollWheelZoom.enable();
    const off = () => map.scrollWheelZoom.disable();
    map.on("focus", on);
    map.on("blur", off);
    el.addEventListener("mouseleave", off);
    return () => {
      map.off("focus", on);
      map.off("blur", off);
      el.removeEventListener("mouseleave", off);
    };
  }, [map]);
  return null;
}

/** Pulsanti sulla mappa: cambia livello (satellite/mappa) e "vedi tutti". */
function Controls({
  layer,
  onLayer,
  businesses,
  labels,
}: {
  layer: "satellite" | "streets";
  onLayer: (l: "satellite" | "streets") => void;
  businesses: Business[];
  labels: { toStreets: string; toSatellite: string; fit: string };
}) {
  const map = useMap();
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  return (
    <div className="gf-map-controls" onMouseDown={stop} onDoubleClick={stop} onWheel={stop}>
      <button
        type="button"
        onClick={() => onLayer(layer === "satellite" ? "streets" : "satellite")}
        aria-label={layer === "satellite" ? labels.toStreets : labels.toSatellite}
        title={layer === "satellite" ? labels.toStreets : labels.toSatellite}
      >
        <Layers size={16} />
        <span>{layer === "satellite" ? labels.toStreets : labels.toSatellite}</span>
      </button>
      <button
        type="button"
        onClick={() => {
          if (businesses.length === 0) return;
          map.fitBounds(L.latLngBounds(businesses.map((b) => [b.lat, b.lng] as [number, number])), { padding: [40, 40], maxZoom: 12 });
        }}
        aria-label={labels.fit}
        title={labels.fit}
      >
        <Maximize2 size={16} />
      </button>
    </div>
  );
}

export default function InteractiveMap({
  businesses,
  activeId,
  onSelect,
  focusId,
  userPos,
  locale = "it",
}: {
  businesses: Business[];
  activeId: string | null;
  onSelect: (id: string) => void;
  focusId?: string | null;
  userPos?: [number, number] | null;
  locale?: "it" | "en";
}) {
  const [layer, setLayer] = useState<"satellite" | "streets">("satellite");
  useEffect(() => setLayer(readLayer()), []);
  const changeLayer = (l: "satellite" | "streets") => {
    setLayer(l);
    try {
      localStorage.setItem(LAYER_KEY, l);
    } catch {
      /* la scelta vale solo per questa visita */
    }
  };
  const en = locale === "en";

  return (
    <MapContainer center={ITALY_CENTER} zoom={5} scrollWheelZoom={false} className="h-full w-full" attributionControl={true} zoomSnap={0.5}>
      {layer === "satellite" ? (
        <>
          <TileLayer key="sat" url={SATELLITE.url} attribution={SATELLITE.attribution} maxZoom={18} updateWhenIdle keepBuffer={1} />
          <TileLayer key="lab" url={SATELLITE.labels} maxZoom={18} updateWhenIdle keepBuffer={1} />
        </>
      ) : (
        <TileLayer key="osm" url={STREETS.url} attribution={STREETS.attribution} maxZoom={19} updateWhenIdle keepBuffer={1} />
      )}
      <FitToBusinesses businesses={businesses} />
      <FocusOn businesses={businesses} focusId={focusId} />
      <FlyToUser pos={userPos ?? null} />
      <WheelOnFocus />
      <ClusterLayer businesses={businesses} activeId={activeId} onSelect={onSelect} />
      {userPos && <Marker position={userPos} icon={USER_ICON} interactive={false} keyboard={false} />}
      <Controls
        layer={layer}
        onLayer={changeLayer}
        businesses={businesses}
        labels={{
          toStreets: en ? "Street map" : "Vista mappa",
          toSatellite: en ? "Satellite view" : "Vista satellite",
          fit: en ? "Show all venues" : "Mostra tutti i locali",
        }}
      />
    </MapContainer>
  );
}
