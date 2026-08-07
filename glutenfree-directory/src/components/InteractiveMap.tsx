"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Business } from "@/lib/types";

const ITALY_CENTER: [number, number] = [42.5, 12.6];

function pinIcon(active: boolean) {
  const fill = active ? "var(--gf-btn-accent)" : "var(--gf-btn-primary)";
  const size = active ? 36 : 28;
  return L.divIcon({
    className: "gf-map-pin",
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="${fill}" stroke="white" stroke-width="1.4"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

function FitToBusinesses({ businesses }: { businesses: Business[] }) {
  const map = useMap();
  const didFit = useRef(false);
  useEffect(() => {
    if (didFit.current || businesses.length === 0) return;
    didFit.current = true;
    const bounds = L.latLngBounds(businesses.map((b) => [b.lat, b.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 12 });
  }, [businesses, map]);
  return null;
}

export default function InteractiveMap({
  businesses,
  activeId,
  onSelect,
}: {
  businesses: Business[];
  activeId: string | null;
  onSelect: (id: string) => void;
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
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitToBusinesses businesses={businesses} />
      {businesses.map((b) => (
        <Marker
          key={b.id}
          position={[b.lat, b.lng]}
          icon={pinIcon(b.id === activeId)}
          eventHandlers={{
            click: () => onSelect(b.id),
            mouseover: () => onSelect(b.id),
          }}
        />
      ))}
    </MapContainer>
  );
}
