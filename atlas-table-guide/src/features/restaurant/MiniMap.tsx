"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

export function MiniMap({ lat, lng, name, styleUrl, unavailable }: { lat: number; lng: number; name: string; styleUrl: string; unavailable: string }) {
  const el = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let m: import("maplibre-gl").Map | null = null;
    let cancelled = false;
    import("maplibre-gl").then((ml) => {
      if (cancelled || !el.current) return;
      m = new ml.Map({ container: el.current, style: styleUrl, center: [lng, lat], zoom: 14, cooperativeGestures: true, attributionControl: { compact: true } });
      m.on("error", () => { if (!m?.isStyleLoaded()) setFailed(true); });
      new ml.Marker({ color: "#B3122B" }).setLngLat([lng, lat]).addTo(m);
    }).catch(() => setFailed(true));
    return () => { cancelled = true; m?.remove(); };
  }, [lat, lng, styleUrl]);
  return failed
    ? <div className="grid h-64 place-items-center rounded-[12px] border border-line bg-sand p-4 text-center text-sm text-stone">{unavailable}</div>
    : <div ref={el} className="h-64 rounded-[12px] border border-line bg-sand" role="region" aria-label={`Map: ${name}`} />;
}
