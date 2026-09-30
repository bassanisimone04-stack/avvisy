export function MapEmbed({ lat, lon, label }: { lat: number; lon: number; label: string }) {
  const d = 0.006;
  const bbox = [lon - d, lat - d * 0.6, lon + d, lat + d * 0.6].map((n) => n.toFixed(5)).join(",");
  return (
    <div className="stack" style={{ gap: 4 }}>
      <iframe
        className="map"
        title={`Mappa: ${label}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat.toFixed(5)},${lon.toFixed(5)}`}
      />
      <a className="xs muted" href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`} target="_blank" rel="noreferrer">
        Apri su OpenStreetMap
      </a>
    </div>
  );
}
