// Illustrazioni generate via SVG: nessuna dipendenza da immagini esterne,
// caricamento istantaneo, nitide a qualsiasi risoluzione e coerenti con il
// brand verde/arancio. Stile "flat illustration" a due toni con profondità.

const palettes: [string, string, string, string][] = [
  ["#eafaf1", "#cdeedb", "#8fd6ae", "#0f7a47"],
  ["#fff4e6", "#fde0bb", "#f7b878", "#c9560a"],
  ["#eef6f1", "#d7ebe1", "#9dcdb6", "#12734f"],
  ["#fdf6e0", "#f8e6ae", "#e8bf5e", "#8a6400"],
];

function Motif({ variant, accent, soft }: { variant: string; accent: string; soft: string }) {
  const stroke = { fill: "none", stroke: accent, strokeWidth: 3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const fillSoft = { fill: soft, stroke: "none" };
  switch (variant) {
    case "ristorante":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <g {...stroke}>
            <path d="M58 42v22M64 42v22M58 42a6 6 0 0 0 6 6M70 42v36M70 42c6 0 6 8 0 8" />
            <path d="M96 42c-8 0-8 40 0 40" />
          </g>
        </g>
      );
    case "pizzeria":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <path d="M50 52 80 40l30 12-30 40z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <circle cx="76" cy="58" r="3" fill={accent} />
          <circle cx="88" cy="64" r="3" fill={accent} />
          <circle cx="80" cy="72" r="3" fill={accent} />
        </g>
      );
    case "hotel":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <g {...stroke}>
            <path d="M46 82V52a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v30" />
            <path d="M46 70h60v12" />
            <circle cx="58" cy="58" r="4" fill={accent} stroke="none" />
            <path d="M110 82V60a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v22" />
          </g>
        </g>
      );
    case "farmacia":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <path d="M64 42h32v14h14v18h-14v14H64V74H50V56h14z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
        </g>
      );
    case "supermercato":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <path d="M48 50h56l-8 30H58z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <circle cx="64" cy="88" r="4" fill={accent} />
          <circle cx="92" cy="88" r="4" fill={accent} />
          <path d="M44 44h8l4 6" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case "negozio":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <path d="M48 54h48v30a4 4 0 0 1-4 4H52a4 4 0 0 1-4-4z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M48 54l6-12h36l6 12" fill="none" stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M64 54a8 8 0 0 0 16 0" fill="none" stroke={accent} strokeWidth={3} />
        </g>
      );
    case "bar-pasticceria":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <path d="M52 50h36l-4 26a10 10 0 0 1-10 8h-8a10 10 0 0 1-10-8z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M88 54h6a8 8 0 0 1 0 16h-4" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
          <path d="M60 42c2 3 2 5 0 8M70 42c2 3 2 5 0 8" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    case "gelateria":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <path d="M64 58a16 16 0 0 1 32 0z" fill={soft} stroke={accent} strokeWidth={3} strokeLinejoin="round" />
          <path d="M70 58l10 32 10-32" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "prodotto":
      return (
        <g>
          <circle cx="80" cy="60" r="34" {...fillSoft} />
          <rect x="58" y="46" width="24" height="34" rx="4" fill={soft} stroke={accent} strokeWidth={3} />
          <path d="M58 58h24M66 46v-6h8v6" fill="none" stroke={accent} strokeWidth={3} strokeLinecap="round" />
        </g>
      );
    default:
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

export default function PlaceholderImage({
  seed,
  variant = "default",
  className = "",
  ratio = "aspect-[4/3]",
  label,
}: {
  seed: number;
  variant?: string;
  className?: string;
  ratio?: string;
  label?: string;
}) {
  const [bg1, bg2, soft, accent] = palettes[seed % palettes.length];
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
        <g stroke={accent} strokeOpacity="0.09" strokeWidth="1">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="120" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 20} x2="160" y2={i * 20} />
          ))}
        </g>
        <circle cx="24" cy="98" r="26" fill={accent} opacity="0.08" />
        <circle cx="142" cy="14" r="20" fill={accent} opacity="0.08" />
        <Motif variant={variant} accent={accent} soft={soft} />
        <rect width="160" height="120" fill="#0f2418" opacity="0.03" />
      </svg>
    </div>
  );
}
