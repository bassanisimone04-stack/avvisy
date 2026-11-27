import type { PricePoint } from "@/db/types";

/** Tiny server-rendered price-history sparkline with an accessible text summary. */
export function Sparkline({ points, label }: { points: PricePoint[]; label: string }) {
  if (points.length < 2) return null;
  const w = 120, h = 32, pad = 3;
  const vals = points.map((p) => p.amount);
  const min = Math.min(...vals), max = Math.max(...vals);
  const x = (i: number) => pad + (i * (w - 2 * pad)) / (points.length - 1);
  const y = (v: number) => (max === min ? h / 2 : h - pad - ((v - min) * (h - 2 * pad)) / (max - min));
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.amount).toFixed(1)}`).join(" ");
  const summary = `${label}: ${points.map((p) => `${p.recordedAt} ${p.amount} ${p.currency}`).join("; ")}`;
  return (
    <figure className="mt-3">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={summary} className="text-carmine">
        <path d={d} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(points.length - 1)} cy={y(points.at(-1)!.amount)} r={2.8} fill="currentColor" />
      </svg>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
