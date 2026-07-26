// Illustrazioni generate via SVG: nessuna dipendenza da immagini esterne,
// caricamento istantaneo e coerenza visiva con il brand verde/arancio.

const palettes: [string, string, string][] = [
  ["#e2f5ea", "#bfe6cf", "#0f7a47"],
  ["#fef0e0", "#fcd9ad", "#dd5c0a"],
  ["#eef6f1", "#cadcd1", "#189659"],
  ["#fdf2d6", "#f6dfa0", "#8a6400"],
];

function Motif({ variant, accent }: { variant: string; accent: string }) {
  const common = { fill: "none", stroke: accent, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (variant) {
    case "ristorante":
      return (
        <g {...common}>
          <path d="M58 42v22M64 42v22M58 42a6 6 0 0 0 6 6M70 42v36M70 42c6 0 6 8 0 8" />
          <path d="M96 42c-8 0-8 40 0 40" />
        </g>
      );
    case "pizzeria":
      return (
        <g {...common}>
          <path d="M50 52 80 40l30 12-30 40z" />
          <circle cx="76" cy="58" r="2.4" fill={accent} />
          <circle cx="88" cy="64" r="2.4" fill={accent} />
          <circle cx="80" cy="72" r="2.4" fill={accent} />
        </g>
      );
    case "hotel":
      return (
        <g {...common}>
          <path d="M46 82V52a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v30" />
          <path d="M46 70h60v12" />
          <circle cx="58" cy="58" r="4" />
          <path d="M110 82V60a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v22" />
        </g>
      );
    case "farmacia":
      return (
        <g {...common}>
          <rect x="66" y="42" width="12" height="40" rx="3" />
          <rect x="52" y="56" width="40" height="12" rx="3" />
        </g>
      );
    case "supermercato":
      return (
        <g {...common}>
          <path d="M48 50h56l-8 30H58z" />
          <circle cx="64" cy="88" r="3.5" />
          <circle cx="92" cy="88" r="3.5" />
          <path d="M44 44h8l4 6" />
        </g>
      );
    case "negozio":
      return (
        <g {...common}>
          <path d="M48 54h48v30a4 4 0 0 1-4 4H52a4 4 0 0 1-4-4z" />
          <path d="M48 54l6-12h36l6 12" />
          <path d="M64 54a8 8 0 0 0 16 0" />
        </g>
      );
    case "bar-pasticceria":
      return (
        <g {...common}>
          <path d="M52 50h36l-4 26a10 10 0 0 1-10 8h-8a10 10 0 0 1-10-8z" />
          <path d="M88 54h6a8 8 0 0 1 0 16h-4" />
          <path d="M60 42c2 3 2 5 0 8M70 42c2 3 2 5 0 8" />
        </g>
      );
    case "gelateria":
      return (
        <g {...common}>
          <path d="M64 58a16 16 0 0 1 32 0z" />
          <path d="M70 58l10 32 10-32" />
        </g>
      );
    case "prodotto":
      return (
        <g {...common}>
          <rect x="58" y="46" width="24" height="34" rx="4" />
          <path d="M58 58h24M66 46v-6h8v6" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <path d="M80 42c14 0 24 10 24 24-14 0-24-10-24-24Z" />
          <path d="M80 90c-14 0-24-10-24-24 14 0 24 10 24 24Z" />
          <path d="M80 42v48" />
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
  const [bg1, bg2, accent] = palettes[seed % palettes.length];
  return (
    <div className={`relative overflow-hidden ${ratio} ${className}`}>
      <svg viewBox="0 0 160 120" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label ?? "Illustrazione"}>
        <defs>
          <linearGradient id={`gfd-g${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={bg1} />
            <stop offset="1" stopColor={bg2} />
          </linearGradient>
        </defs>
        <rect width="160" height="120" fill={`url(#gfd-g${seed})`} />
        <g stroke={accent} strokeOpacity="0.1" strokeWidth="1">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="120" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 20} x2="160" y2={i * 20} />
          ))}
        </g>
        <Motif variant={variant} accent={accent} />
      </svg>
    </div>
  );
}
