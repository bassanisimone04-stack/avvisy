import { formatEuro, formatShortDate } from "@/lib/format";
import type { PricePoint } from "@/lib/listings";

/** Andamento del canone nel tempo (grafico a gradini, SVG puro). */
export function PriceChart({ points }: { points: PricePoint[] }) {
  if (points.length === 0) return <p className="muted small">Nessun dato di prezzo.</p>;
  const W = 640;
  const H = 180;
  const P = { l: 56, r: 12, t: 12, b: 28 };
  const t0 = Date.parse(points[0].recorded_at);
  const t1 = Math.max(Date.now(), t0 + 86400000);
  const values = points.map((p) => p.canone);
  const lo = Math.min(...values) * 0.9;
  const hi = Math.max(...values) * 1.05;
  const x = (t: number) => P.l + ((t - t0) / (t1 - t0)) * (W - P.l - P.r);
  const y = (v: number) => P.t + (1 - (v - lo) / (hi - lo || 1)) * (H - P.t - P.b);

  let d = "";
  points.forEach((p, i) => {
    const px = x(Date.parse(p.recorded_at));
    const py = y(p.canone);
    d += i === 0 ? `M${px},${py}` : ` H${px} V${py}`;
  });
  d += ` H${x(t1)}`;

  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Andamento del canone mensile">
        {[lo, (lo + hi) / 2, hi].map((v) => (
          <g key={v}>
            <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="var(--border)" />
            <text x={P.l - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">
              {formatEuro(Math.round(v / 10) * 10)}
            </text>
          </g>
        ))}
        <path d={d} fill="none" stroke="var(--brand)" strokeWidth="2.5" />
        {points.map((p, i) => (
          <circle key={i} cx={x(Date.parse(p.recorded_at))} cy={y(p.canone)} r="4" fill="var(--surface)" stroke="var(--brand)" strokeWidth="2">
            <title>{`${formatShortDate(p.recorded_at)}: ${formatEuro(p.canone)} + ${formatEuro(p.spese)} spese`}</title>
          </circle>
        ))}
        <text x={P.l} y={H - 6} fontSize="11" fill="var(--muted)">
          {formatShortDate(points[0].recorded_at)}
        </text>
        <text x={W - P.r} y={H - 6} fontSize="11" fill="var(--muted)" textAnchor="end">
          oggi
        </text>
      </svg>
    </figure>
  );
}
