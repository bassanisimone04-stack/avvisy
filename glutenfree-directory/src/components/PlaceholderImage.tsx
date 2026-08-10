// Illustrazioni generate via SVG: nessuna dipendenza da immagini esterne,
// caricamento istantaneo, nitide a qualsiasi risoluzione e coerenti con il
// brand verde/arancio. Stile "flat illustration" a due toni con profondità.
// Ogni scena varia in base al seed (props, layout, texture di sfondo) così
// che due attività della stessa categoria non mostrino la stessa illustrazione.

const palettes: [string, string, string, string][] = [
  ["#eafaf1", "#cdeedb", "#8fd6ae", "#0f7a47"],
  ["#fff4e6", "#fde0bb", "#f7b878", "#c9560a"],
  ["#eef6f1", "#d7ebe1", "#9dcdb6", "#12734f"],
  ["#fdf6e0", "#f8e6ae", "#e8bf5e", "#8a6400"],
];

function Shadow({ accent }: { accent: string }) {
  return <ellipse cx="80" cy="97" rx="30" ry="6" fill={accent} opacity="0.1" />;
}

function Sparkle({ x, y, accent, s = 1 }: { x: number; y: number; accent: string; s?: number }) {
  return (
    <path
      d={`M${x} ${y - 6 * s}v${12 * s}M${x - 6 * s} ${y}h${12 * s}`}
      stroke={accent}
      strokeWidth={2 * s}
      strokeLinecap="round"
      opacity="0.7"
    />
  );
}

function Steam({ x, accent }: { x: number; accent: string }) {
  return (
    <path
      d={`M${x} 34c-4 4-4 6 0 10s4 6 0 10`}
      fill="none"
      stroke={accent}
      strokeWidth="2.5"
      strokeLinecap="round"
      opacity="0.55"
    />
  );
}

function Motif({ variant, accent, soft, seed }: { variant: string; accent: string; soft: string; seed: number }) {
  const stroke = { fill: "none", stroke: accent, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const fillSoft = { fill: soft, stroke: "none" };
  const k = seed % 3;

  switch (variant) {
    case "ristorante":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <ellipse cx="80" cy="78" rx="22" ry="7" fill="#fff" stroke={accent} strokeWidth="2.5" opacity="0.9" />
          <g {...stroke}>
            <path d="M58 42v22M64 42v22M58 42a6 6 0 0 0 6 6M70 42v36M70 42c6 0 6 8 0 8" />
            <path d="M96 42c-8 0-8 40 0 40" />
          </g>
          {k === 1 && <Steam x={80} accent={accent} />}
          {k === 2 && <Sparkle x={108} y={38} accent={accent} s={0.8} />}
        </g>
      );
    case "pizzeria": {
      const drops = [
        [[76, 58], [88, 64], [80, 72]],
        [[72, 54], [90, 56], [82, 68], [70, 70]],
        [[78, 50], [92, 62], [74, 66], [86, 74]],
      ][k];
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M50 52 80 40l30 12-30 40z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          {drops.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={3} fill={accent} />
          ))}
        </g>
      );
    }
    case "hotel": {
      const windows = k === 0 ? [[58, 58]] : k === 1 ? [[56, 56], [66, 62]] : [[56, 56], [64, 56], [60, 66]];
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <g {...stroke}>
            <path d="M46 82V52a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v30" />
            <path d="M46 70h60v12" />
            {windows.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={3.5} fill={accent} stroke="none" />
            ))}
            <path d="M110 82V60a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v22" />
          </g>
          {k === 2 && <Sparkle x={124} y={40} accent={accent} s={0.8} />}
        </g>
      );
    }
    case "farmacia":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path
            d="M64 42h32v14h14v18h-14v14H64V74H50V56h14z"
            fill={soft}
            stroke={accent}
            strokeWidth={3}
            strokeLinejoin="round"
            transform={k === 1 ? "rotate(4 80 60)" : k === 2 ? "rotate(-4 80 60)" : undefined}
          />
          {k > 0 && <Sparkle x={112} y={40} accent={accent} s={0.7} />}
        </g>
      );
    case "supermercato":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M48 50h56l-8 30H58z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <circle cx="64" cy="88" r="4" fill={accent} />
          <circle cx="92" cy="88" r="4" fill={accent} />
          <path d="M44 44h8l4 6" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
          {k === 1 && <circle cx="70" cy="60" r="3" fill={accent} opacity="0.7" />}
          {k === 2 && (
            <>
              <circle cx="70" cy="60" r="3" fill={accent} opacity="0.7" />
              <circle cx="82" cy="58" r="3" fill={accent} opacity="0.7" />
            </>
          )}
        </g>
      );
    case "negozio":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M48 54h48v30a4 4 0 0 1-4 4H52a4 4 0 0 1-4-4z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M48 54l6-12h36l6 12" fill="none" stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M64 54a8 8 0 0 0 16 0" fill="none" stroke={accent} strokeWidth={3} />
          {k > 0 && <path d={k === 1 ? "M52 66h8M100 66h8" : "M52 66h8M100 66h8M52 76h6M102 76h6"} stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.6" />}
        </g>
      );
    case "bar-pasticceria":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M52 50h36l-4 26a10 10 0 0 1-10 8h-8a10 10 0 0 1-10-8z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M88 54h6a8 8 0 0 1 0 16h-4" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
          <path d="M60 42c2 3 2 5 0 8M70 42c2 3 2 5 0 8" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
          {k === 2 && <path d="M80 42c2 3 2 5 0 8" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />}
        </g>
      );
    case "gelateria": {
      const scoops = k === 2 ? 3 : 2;
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          {scoops === 3 ? (
            <>
              <circle cx="70" cy="52" r="11" fill={soft} stroke={accent} strokeWidth={2.5} />
              <circle cx="90" cy="52" r="11" fill={soft} stroke={accent} strokeWidth={2.5} />
              <circle cx="80" cy="42" r="11" fill={soft} stroke={accent} strokeWidth={2.5} />
            </>
          ) : (
            <path d="M64 58a16 16 0 0 1 32 0z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          )}
          <path d="M70 58l10 32 10-32" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    }
    case "prodotto": {
      if (k === 1) {
        return (
          <g>
            <circle cx="80" cy="60" r="34" {...fillSoft} />
            <Shadow accent={accent} />
            <path d="M64 84V52c0-6 16-6 16 0v32" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
            <path d="M64 84h16a4 4 0 0 0 4-4V64H60v16a4 4 0 0 0 4 4z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
            <path d="M68 52h8" stroke={accent} strokeWidth={3} strokeLinecap="round" />
          </g>
        );
      }
      if (k === 2) {
        return (
          <g>
            <circle cx="80" cy="60" r="34" {...fillSoft} />
            <Shadow accent={accent} />
            <path d="M60 50h30l6 10-6 24a4 4 0 0 1-4 4H64a4 4 0 0 1-4-4l-6-24z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
            <path d="M68 50v-4a8 8 0 0 1 16 0v4" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
          </g>
        );
      }
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <rect x="58" y="46" width="24" height="34" rx="4" fill={soft} stroke={accent} strokeWidth={3} />
          <path d="M58 58h24M66 46v-6h8v6" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    }
    case "ricetta-pesto":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M50 66a30 14 0 0 0 60 0" fill="#fff" stroke={accent} strokeWidth={2.5} opacity="0.9" />
          <path d="M56 66a24 10 0 0 0 48 0" fill="none" stroke={accent} strokeWidth={2.5} />
          <path d="M62 56c4-6 4-10 0-16M74 58c4-6 4-10 0-16M86 58c-4-6-4-10 0-16M98 56c-4-6-4-10 0-16" fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx="64" cy="40" r="2.5" fill={accent} /><circle cx="90" cy="38" r="2.5" fill={accent} />
        </g>
      );
    case "ricetta-pane":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M52 76V56c0-10 12-16 28-16s28 6 28 16v20z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M52 76h56M68 44v32M80 42v34M92 44v32" fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      );
    case "ricetta-torta":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M58 84 74 42h12l16 42z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M62 74h36M65 66h30" fill="none" stroke={accent} strokeWidth={2.5} />
          <circle cx="80" cy="36" r="4" fill={accent} />
        </g>
      );
    case "ricetta-pasta-fredda":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M50 66a30 14 0 0 0 60 0" fill="#fff" stroke={accent} strokeWidth={2.5} opacity="0.9" />
          <path d="M56 66a24 10 0 0 0 48 0" fill="none" stroke={accent} strokeWidth={2.5} />
          <path d="M62 56c4-6 4-10 0-16M86 58c-4-6-4-10 0-16" fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx="72" cy="42" r="3.5" fill={accent} /><circle cx="94" cy="46" r="3.5" fill={accent} />
        </g>
      );
    case "ricetta-aperitivo":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <rect x="48" y="52" width="64" height="30" rx="4" fill={soft} stroke={accent} strokeWidth={3} />
          <rect x="56" y="60" width="10" height="10" fill="none" stroke={accent} strokeWidth={2.5} />
          <rect x="70" y="60" width="10" height="10" fill="none" stroke={accent} strokeWidth={2.5} />
          <circle cx="96" cy="65" r="7" fill="#fff" stroke={accent} strokeWidth={2.5} />
        </g>
      );
    case "ricetta-pizza":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <circle cx="80" cy="60" r="26" fill={soft} stroke={accent} strokeWidth={3} />
          <path d="M80 60 54 46M80 60 106 46M80 60 80 90" fill="none" stroke={accent} strokeWidth={2} opacity="0.7" />
          <circle cx="70" cy="52" r="2.6" fill={accent} /><circle cx="90" cy="54" r="2.6" fill={accent} /><circle cx="78" cy="70" r="2.6" fill={accent} />
        </g>
      );
    case "ricetta-focaccia":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <rect x="50" y="48" width="60" height="26" rx="10" fill={soft} stroke={accent} strokeWidth={3} />
          {[62, 74, 86, 98].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 === 0 ? 58 : 65} r="2.2" fill={accent} />
          ))}
          <path d="M56 44c2-4 2-6 0-8M100 44c2-4 2-6 0-8" fill="none" stroke={accent} strokeWidth={2.2} strokeLinecap="round" />
        </g>
      );
    case "ricetta-merenda":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <rect x="52" y="54" width="44" height="30" rx="5" fill={soft} stroke={accent} strokeWidth={3} />
          <path d="M64 54v-6a10 10 0 0 1 20 0v6" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
          <circle cx="106" cy="70" r="8" fill="#fff" stroke={accent} strokeWidth={2.5} />
        </g>
      );
    case "ricetta-panzanella":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M50 66a30 14 0 0 0 60 0" fill="#fff" stroke={accent} strokeWidth={2.5} opacity="0.9" />
          <path d="M56 66a24 10 0 0 0 48 0" fill="none" stroke={accent} strokeWidth={2.5} />
          <rect x="62" y="52" width="8" height="8" fill="none" stroke={accent} strokeWidth={2.2} />
          <rect x="76" y="48" width="8" height="8" fill="none" stroke={accent} strokeWidth={2.2} />
          <path d="M92 46 100 46 96 56Z" fill={accent} opacity="0.85" />
        </g>
      );
    case "ricetta-crostini":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          {[54, 76, 98].map((x) => (
            <g key={x}>
              <rect x={x} y="58" width="18" height="10" rx="2" fill={soft} stroke={accent} strokeWidth={2.5} />
              <circle cx={x + 9} cy="54" r="2.4" fill={accent} />
            </g>
          ))}
        </g>
      );
    case "ricetta-muffin":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <path d="M60 58 64 82h32l4-24z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M60 58c4-3 4-3 0-6s-4-3 0-6M100 58c-4-3-4-3 0-6s4-3 0-6M70 58c4-3 4-3 0-6M90 58c-4-3-4-3 0-6" fill="none" stroke={accent} strokeWidth={2} opacity="0.7" />
          <path d="M58 58h44" fill="none" stroke={accent} strokeWidth={3} />
          <path d="M70 46a10 8 0 0 1 20 0" fill={soft} stroke={accent} strokeWidth={3} />
        </g>
      );
    case "ricetta-grissini":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          {[58, 68, 78, 88, 98].map((x, i) => (
            <line key={x} x1={x} y1={82} x2={x} y2={40 + (i % 2) * 6} stroke={accent} strokeWidth={2.6} strokeLinecap="round" />
          ))}
          <path d="M54 46h50" fill="none" stroke={accent} strokeWidth={2.2} opacity="0.6" />
        </g>
      );
    case "ricetta-pasta-forno":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <Shadow accent={accent} />
          <rect x="50" y="56" width="60" height="24" rx="3" fill={soft} stroke={accent} strokeWidth={3} />
          <path d="M50 56c6-4 10 4 16 0s10-4 16 0 10-4 16 0 10-4 12 0" fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx="64" cy="50" r="1.8" fill={accent} /><circle cx="88" cy="48" r="1.8" fill={accent} />
        </g>
      );
    default: {
      if (k === 1) {
        return (
          <g>
            <circle cx="80" cy="60" r="34" {...fillSoft} />
            <path d="M50 66c10-16 24-16 30-30 6 14 20 14 30 30-16 6-24 20-30 30-6-16-14-24-30-30Z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          </g>
        );
      }
      if (k === 2) {
        return (
          <g>
            <circle cx="80" cy="60" r="34" {...fillSoft} />
            <circle cx="66" cy="52" r="10" fill={soft} stroke={accent} strokeWidth={3} />
            <circle cx="94" cy="52" r="10" fill={soft} stroke={accent} strokeWidth={3} />
            <circle cx="80" cy="72" r="10" fill={soft} stroke={accent} strokeWidth={3} />
          </g>
        );
      }
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <path d="M80 42c14 0 24 10 24 24-14 0-24-10-24-24Z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M80 90c-14 0-24-10-24-24 14 0 24 10 24 24Z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M80 42v48" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    }
  }
}

function Backdrop({ seed, accent }: { seed: number; accent: string }) {
  const kind = seed % 3;
  if (kind === 0) {
    return (
      <g stroke={accent} strokeOpacity="0.09" strokeWidth="1">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="120" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 20} x2="160" y2={i * 20} />
        ))}
      </g>
    );
  }
  if (kind === 1) {
    return (
      <g fill={accent} opacity="0.1">
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 9 }).map((_, col) => (
            <circle key={`${row}-${col}`} cx={8 + col * 18} cy={8 + row * 18} r="1.6" />
          ))
        )}
      </g>
    );
  }
  return (
    <g stroke={accent} strokeOpacity="0.08" strokeWidth="1">
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={i * 18 - 40} y1="0" x2={i * 18 + 40} y2="120" />
      ))}
    </g>
  );
}

export default function PlaceholderImage({
  seed,
  variant = "default",
  className = "",
  ratio = "aspect-[4/3]",
  label,
  tint,
}: {
  seed: number;
  variant?: string;
  className?: string;
  ratio?: string;
  label?: string;
  /** Sostituisce la palette basata sul seed con i colori di una categoria (es. blog). */
  tint?: { soft: string; accent: string; bg1: string; bg2: string };
}) {
  const [pbg1, pbg2, psoft, paccent] = palettes[seed % palettes.length];
  const bg1 = tint?.bg1 ?? pbg1;
  const bg2 = tint?.bg2 ?? pbg2;
  const soft = tint?.soft ?? psoft;
  const accent = tint?.accent ?? paccent;
  const gid = `gfd-g${seed}`;
  const vid = `gfd-v${seed}`;
  return (
    <div className={`relative overflow-hidden ${ratio} ${className}`}>
      <svg viewBox="0 0 160 120" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label ?? "Illustrazione"}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={bg1} />
            <stop offset="0.55" stopColor={bg2} />
            <stop offset="1" stopColor={bg2} />
          </linearGradient>
          <radialGradient id={vid} cx="0.5" cy="0.42" r="0.75">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="160" height="120" fill={`url(#${gid})`} />
        <rect width="160" height="120" fill={`url(#${vid})`} />
        <Backdrop seed={seed} accent={accent} />
        <circle cx="24" cy="98" r="26" fill={accent} opacity="0.08" />
        <circle cx="142" cy="14" r="20" fill={accent} opacity="0.08" />
        <Motif variant={variant} accent={accent} soft={soft} seed={seed} />
        <rect width="160" height="120" fill="#0f2418" opacity="0.03" />
      </svg>
    </div>
  );
}
