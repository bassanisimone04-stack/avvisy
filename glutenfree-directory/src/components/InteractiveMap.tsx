"use client";

import { memo, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Business } from "@/lib/types";

const ITALY_CENTER: [number, number] = [42.5, 12.6];

function buildIcon(active: boolean) {
  const fill = active ? "var(--gf-btn-accent)" : "var(--gf-btn-primary)";
  const size = active ? 36 : 28;
  return L.divIcon({
    className: "gf-map-pin",
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="${fill}" stroke="white" stroke-width="1.4"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

// Le due icone (normale e attiva) sono create una sola volta: prima se ne
// creava una nuova per ogni pin a ogni passaggio del mouse, e Leaflet
// ridisegnava tutti i marcatori.
const ICONS = { normal: buildIcon(false), active: buildIcon(true) };

const Pin = memo(function Pin({
  business,
  active,
  onSelect,
}: {
  business: Business;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <Marker
      position={[business.lat, business.lng]}
      icon={active ? ICONS.active : ICONS.normal}
      title={business.name}
      alt={business.name}
      zIndexOffset={active ? 1000 : 0}
      eventHandlers={{
        click: () => onSelect(business.id),
        mouseover: () => onSelect(business.id),
      }}
    />
  );
});

function FitToBusinesses({ businesses }: { businesses: Business[] }) {
  const map = useMap();
  const latest = useRef(businesses);
  latest.current = businesses;
  // Si riadatta quando cambia l'insieme dei locali (per esempio con i filtri),
  // non a ogni render: la chiave e l'elenco degli id.
  const key = businesses.map((b) => b.id).join(",");
  useEffect(() => {
    const list = latest.current;
    if (list.length === 0) return;
    const bounds = L.latLngBounds(list.map((b) => [b.lat, b.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: list.length === 1 ? 14 : 12 });
  }, [key, map]);
  return null;
}

function FocusOn({ businesses, focusId }: { businesses: Business[]; focusId?: string | null }) {
  const map = useMap();
  useEffect(() => {
    const b = focusId ? businesses.find((x) => x.id === focusId) : undefined;
    if (b) map.flyTo([b.lat, b.lng], Math.max(map.getZoom(), 13), { duration: 0.6 });
  }, [focusId, businesses, map]);
  return null;
}

export default function InteractiveMap({
  businesses,
  activeId,
  onSelect,
  focusId,
}: {
  businesses: Business[];
  activeId: string | null;
  onSelect: (id: string) => void;
  focusId?: string | null;
}) {
  return (
    <MapContainer
      center={ITALY_CENTER}
      zoom={5}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl={true}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        updateWhenIdle
        keepBuffer={1}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitToBusinesses businesses={businesses} />
      <FocusOn businesses={businesses} focusId={focusId} />
      {businesses.map((b) => (
        <Pin key={b.id} business={b} active={b.id === activeId} onSelect={onSelect} />
      ))}
    </MapContainer>
  );
}
