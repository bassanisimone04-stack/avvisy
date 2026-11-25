import type { DrawingPart } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

/**
 * Renders a project as an isometric line drawing from its parts list.
 * Original artwork generated from product data — no third-party imagery.
 */
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);

const tones = {
  light: { top: "#FFFDF8", left: "#EFE7D8", right: "#E2D6C1" },
  dark: { top: "#E9DCC8", left: "#D3BE9F", right: "#BFA683" },
  accent: { top: "#F1D9C9", left: "#E2B89E", right: "#D29E7F" },
} as const;

/**
 * Depth order for non-intersecting axis-aligned boxes: A must be drawn before
 * B when A lies entirely on the far side of B along any axis. Topological sort
 * (Kahn) with the centre-sum heuristic as tie-breaker.
 */
function depthSort(parts: DrawingPart[]): DrawingPart[] {
  const n = parts.length;
  const before = (a: DrawingPart, b: DrawingPart) => {
    const [ax, ay, az, aw, ad, ah] = a.box;
    const [bx, by, bz] = b.box;
    return ax + aw <= bx + 1e-6 || ay + ad <= by + 1e-6 || az + ah <= bz + 1e-6;
  };
  const centre = (p: DrawingPart) => p.box[0] + p.box[3] / 2 + p.box[1] + p.box[4] / 2 + p.box[2] + p.box[5] / 2;
  const indeg = new Array(n).fill(0);
  const edges: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (i !== j && before(parts[i], parts[j]) && !before(parts[j], parts[i])) {
        edges[i].push(j);
        indeg[j]++;
      }
  const out: DrawingPart[] = [];
  const ready = parts.map((_, i) => i).filter((i) => indeg[i] === 0);
  const done = new Set<number>();
  while (out.length < n) {
    if (!ready.length) {
      // cycle (should not happen for valid drawings): fall back to heuristic
      const rest = parts.map((_, i) => i).filter((i) => !done.has(i));
      rest.sort((a, b) => centre(parts[a]) - centre(parts[b]));
      ready.push(rest[0]);
    }
    ready.sort((a, b) => centre(parts[a]) - centre(parts[b]));
    const i = ready.shift()!;
    if (done.has(i)) continue;
    done.add(i);
    out.push(parts[i]);
    for (const j of edges[i]) if (--indeg[j] === 0 && !done.has(j)) ready.push(j);
  }
  return out;
}

function project(x: number, y: number, z: number): [number, number] {
  return [(x - y) * COS, (x + y) * SIN - z];
}

export function IsoDrawing({
  parts,
  className,
  stroke = "#263B32",
  title,
}: {
  parts: DrawingPart[];
  className?: string;
  stroke?: string;
  title: string;
}) {
  const sorted = depthSort(parts);

  const pts: [number, number][] = [];
  const polys = sorted.map((p, i) => {
    const [x, y, z, w, d, h] = p.box;
    const c = tones[p.tone ?? "light"];
    const P = (a: number, b: number, c2: number) => {
      const v = project(a, b, c2);
      pts.push(v);
      return v.map((n) => n.toFixed(2)).join(",");
    };
    const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)].join(" ");
    const right = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)].join(" ");
    const left = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)].join(" ");
    return (
      <g key={i}>
        <polygon points={right} fill={c.right} vectorEffect="non-scaling-stroke" />
        <polygon points={left} fill={c.left} vectorEffect="non-scaling-stroke" />
        <polygon points={top} fill={c.top} vectorEffect="non-scaling-stroke" />
      </g>
    );
  });

  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY);
  const pad = span * 0.12;
  const vb = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2].map((n) => n.toFixed(2)).join(" ");

  return (
    <svg
      viewBox={vb}
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Isometric drawing: ${title}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke={stroke} strokeWidth={1.1} strokeLinejoin="round">
        {polys}
      </g>
    </svg>
  );
}
