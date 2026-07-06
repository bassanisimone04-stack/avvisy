"use client";

import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { Organization } from "@/lib/types";

export default function StructuresMap({
  organizations,
}: {
  organizations: Organization[];
}) {
  const located = organizations.filter(
    (o) => o.lat != null && o.lng != null
  ) as (Organization & { lat: number; lng: number })[];

  const center: LatLngExpression = located.length
    ? [
        located.reduce((s, o) => s + o.lat, 0) / located.length,
        located.reduce((s, o) => s + o.lng, 0) / located.length,
      ]
    : [45.4642, 9.19]; // Milano

  return (
    <div className="h-[380px] overflow-hidden rounded-xl border border-line">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {located.map((o) => (
          <CircleMarker
            key={o.id}
            center={[o.lat, o.lng]}
            radius={11}
            pathOptions={{
              color: "#0b5c4f",
              fillColor: "#0e7a68",
              fillOpacity: 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <p style={{ fontWeight: 700, margin: 0 }}>{o.name}</p>
              <p style={{ margin: "2px 0 6px", color: "#495459" }}>
                {o.address}, {o.city}
              </p>
              <Link
                href={`/s/${o.slug}`}
                style={{ color: "#0b5c4f", fontWeight: 600 }}
              >
                Apri pagina →
              </Link>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
