// Illustrazioni industriali generate come SVG: nessuna dipendenza da immagini
// esterne, coerenti con lo stile istituzionale del marketplace.

const palettes: [string, string, string][] = [
  ["#efe6db", "#ddccb6", "#a63a13"], // ember su cemento
  ["#e6ebee", "#ccd6db", "#21323d"], // carbone
  ["#e1efe8", "#c4ddd0", "#1f7a56"], // verde bosco
  ["#f0e9da", "#ddceb0", "#9a6a0f"], // oro/ocra
];

function CategoryMotif({ category, accent }: { category: string; accent: string }) {
  const common = {
    fill: "none",
    stroke: accent,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (category) {
    case "componenti-industriali":
      return (
        <g {...common}>
          <circle cx="70" cy="60" r="16" />
          <circle cx="70" cy="60" r="5" />
          <path d="M70 40v-6M70 86v-6M50 60h-6M96 60h-6M56 46l-4-4M88 78l-4-4M84 46l4-4M52 78l4-4" />
          <rect x="98" y="66" width="34" height="20" rx="2" />
          <path d="M104 66v-8h22v8" />
        </g>
      );
    case "ricambi":
      return (
        <g {...common}>
          <path d="M64 44h20l6 10-6 10H64l-6-10z" />
          <circle cx="74" cy="54" r="5" />
          <path d="M96 70l14 6-6 14-14-6z" />
          <path d="M52 72l-8 4 4 10 8-4z" />
        </g>
      );
    case "materiali-edili":
      return (
        <g {...common}>
          <rect x="54" y="52" width="26" height="14" rx="1" />
          <rect x="84" y="52" width="26" height="14" rx="1" />
          <rect x="68" y="70" width="26" height="14" rx="1" />
          <rect x="40" y="70" width="24" height="14" rx="1" />
          <rect x="98" y="70" width="24" height="14" rx="1" />
        </g>
      );
    case "imballaggi":
      return (
        <g {...common}>
          <path d="M56 46l24-8 24 8v22l-24 8-24-8z" />
          <path d="M56 46l24 8 24-8M80 54v22" />
          <path d="M46 84h68" strokeWidth="3" />
        </g>
      );
    case "elettronica-professionale":
      return (
        <g {...common}>
          <rect x="58" y="44" width="44" height="36" rx="2" />
          <path d="M66 44v-6M80 44v-6M94 44v-6M66 86v-6M80 86v-6M94 86v-6M58 54h-6M58 66h-6M102 54h6M102 66h6" />
          <rect x="72" y="56" width="16" height="12" rx="1" />
        </g>
      );
    case "attrezzature":
      return (
        <g {...common}>
          <path d="M58 78l18-18M54 74l8 8" />
          <path d="M76 60l-6-6a10 10 0 0 1 13-13l-7 7 6 6 7-7a10 10 0 0 1-13 13z" />
          <circle cx="106" cy="74" r="10" />
          <path d="M106 68v-4M106 84v-4M100 74h-4M116 74h-4" />
        </g>
      );
    case "arredi-aziendali":
      return (
        <g {...common}>
          <rect x="52" y="46" width="56" height="14" rx="1" />
          <rect x="52" y="64" width="56" height="14" rx="1" />
          <path d="M58 46v-6h44v6M56 78v6M104 78v6M80 46v32" />
        </g>
      );
    case "materie-prime":
      return (
        <g {...common}>
          <circle cx="70" cy="62" r="18" />
          <path d="M70 44v36M52 62h36M57 50l26 24M83 50 57 74" />
          <path d="M100 54h18v20h-18z" />
        </g>
      );
    default:
      // Motivo generico (casse/merci) per le altre categorie.
      return (
        <g {...common}>
          <rect x="56" y="48" width="30" height="28" rx="2" />
          <rect x="90" y="56" width="22" height="20" rx="2" />
          <path d="M56 62h30M71 48v28" />
          <path d="M46 84h72" strokeWidth="3" />
        </g>
      );
  }
}

export default function LotImage({
  category,
  seed,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  category: string;
  seed: number;
  className?: string;
  ratio?: string;
}) {
  const [bg1, bg2, accent] = palettes[seed % palettes.length];
  return (
    <div className={`relative overflow-hidden ${ratio} ${className}`}>
      <svg
        viewBox="0 0 160 120"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Illustrazione lotto"
      >
        <defs>
          <linearGradient id={`g${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={bg1} />
            <stop offset="1" stopColor={bg2} />
          </linearGradient>
        </defs>
        <rect width="160" height="120" fill={`url(#g${seed})`} />
        {/* Griglia industriale sottile */}
        <g stroke={accent} strokeOpacity="0.08" strokeWidth="1">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="120" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 20} x2="160" y2={i * 20} />
          ))}
        </g>
        <CategoryMotif category={category} accent={accent} />
      </svg>
    </div>
  );
}
