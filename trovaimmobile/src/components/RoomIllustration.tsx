// Illustrazione d'interno (SVG) usata come immagine dell'hero e come segnaposto
// per gli annunci senza foto. `variant` cambia colori di parete, divano e dettagli.

const WALLS = [
  ["#e6d9c7", "#cdbba4"],
  ["#dfd4c4", "#c4b39c"],
  ["#e9dccb", "#d2bfa6"],
  ["#d9cdbd", "#bfae98"],
  ["#e4d6c2", "#c8b294"],
];
const SOFAS = ["#7b7872", "#9c7457", "#7f8a74", "#a8977f", "#6e6a66"];
const CUSHIONS = [
  ["#d8c8ae", "#c9b393", "#b86d4b"],
  ["#e3d6c2", "#8a9480", "#c9ad8a"],
  ["#cdb89a", "#e2d4bf", "#9b5f45"],
  ["#d6c3a5", "#b9764f", "#e6dac8"],
  ["#c7b596", "#d9cbb4", "#7d8a70"],
];

export function RoomIllustration({ variant = 0, className, title }: { variant?: number; className?: string; title?: string }) {
  const v = Math.abs(variant) % WALLS.length;
  const [wallA, wallB] = WALLS[v];
  const sofa = SOFAS[v];
  const cush = CUSHIONS[v];
  const id = `r${v}`;
  return (
    <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id={`${id}w`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={wallA} />
          <stop offset="1" stopColor={wallB} />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fa37a" />
          <stop offset="1" stopColor="#3f5a34" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a88867" />
          <stop offset="1" stopColor="#8a6a4d" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}b`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={`${id}s`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      {/* parete e luce */}
      <rect width="1600" height="900" fill={`url(#${id}w)`} />
      <polygon points="700,0 1050,0 760,900 360,900" fill={`url(#${id}l)`} />

      {/* finestra a nastro con verde fuori */}
      <rect x="160" y="140" width="1480" height="170" fill="#4a2f1f" />
      <rect x="172" y="152" width="1456" height="146" fill={`url(#${id}g)`} />
      <g filter={`url(#${id}b)`} opacity="0.9">
        <ellipse cx="300" cy="250" rx="140" ry="70" fill="#56733f" />
        <ellipse cx="620" cy="200" rx="180" ry="60" fill="#a3b584" />
        <ellipse cx="980" cy="260" rx="200" ry="70" fill="#4b6a39" />
        <ellipse cx="1360" cy="210" rx="190" ry="70" fill="#98ad78" />
      </g>
      {[500, 840, 1180].map((x) => (
        <rect key={x} x={x} y="152" width="12" height="146" fill="#4a2f1f" />
      ))}
      <rect x="160" y="306" width="1480" height="10" fill="#3a2518" opacity="0.5" />

      {/* pavimento */}
      <rect x="0" y="735" width="1600" height="165" fill={`url(#${id}f)`} />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="0" x2="1600" y1={770 + i * 36} y2={770 + i * 36} stroke="#7a5b40" strokeOpacity="0.35" strokeWidth="2" />
      ))}
      <rect x="330" y="760" width="920" height="110" rx="6" fill="#e8dccb" opacity="0.55" />

      {/* ombra e divano */}
      <ellipse cx="770" cy="735" rx="430" ry="28" fill="#3b2a1e" opacity="0.35" filter={`url(#${id}s)`} />
      <rect x="400" y="455" width="740" height="130" rx="22" fill={sofa} />
      <rect x="370" y="540" width="800" height="150" rx="18" fill={sofa} />
      <rect x="370" y="520" width="80" height="170" rx="20" fill={sofa} />
      <rect x="1090" y="520" width="80" height="170" rx="20" fill={sofa} />
      <rect x="440" y="560" width="660" height="48" rx="14" fill="#000" opacity="0.08" />
      <rect x="400" y="688" width="14" height="36" fill="#3a2a1e" />
      <rect x="1126" y="688" width="14" height="36" fill="#3a2a1e" />
      {/* cuscini */}
      <rect x="470" y="470" width="150" height="120" rx="18" fill={cush[0]} transform="rotate(-6 545 530)" />
      <rect x="640" y="478" width="140" height="112" rx="18" fill={cush[1]} transform="rotate(4 710 534)" />
      <rect x="880" y="474" width="150" height="116" rx="18" fill={cush[0]} transform="rotate(-3 955 532)" />
      <rect x="990" y="500" width="100" height="92" rx="16" fill={cush[2]} transform="rotate(7 1040 546)" />

      {/* tavolino e oggetti */}
      <ellipse cx="775" cy="790" rx="250" ry="16" fill="#3b2a1e" opacity="0.3" filter={`url(#${id}s)`} />
      <rect x="560" y="715" width="430" height="34" rx="4" fill="#8b5a39" />
      <rect x="560" y="715" width="430" height="8" rx="3" fill="#a8744f" />
      <rect x="580" y="749" width="390" height="40" fill="#6f462c" />
      <rect x="640" y="640" width="36" height="75" rx="14" fill="#efe9e0" />
      <rect x="690" y="668" width="30" height="47" rx="12" fill="#e2d8ca" />
      <ellipse cx="850" cy="708" rx="70" ry="9" fill="#efe7da" />
      <circle cx="930" cy="692" r="20" fill="#9b6a45" />

      {/* lampada ad arco */}
      <path d="M1300 870 C1300 520 1210 330 1030 330" fill="none" stroke="#b08a3e" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="1300" cy="872" rx="60" ry="12" fill="#2c231c" />
      <path d="M975 395 A62 62 0 0 1 1090 350 L 1072 392 Z" fill="#c29a46" />
      <path d="M978 396 L1072 392" stroke="#8a6a2c" strokeWidth="6" />
      <ellipse cx="1025" cy="420" rx="40" ry="12" fill="#fff4d6" opacity="0.5" filter={`url(#${id}b)`} />

      {/* pianta a destra */}
      <g>
        <rect x="1405" y="705" width="110" height="120" rx="10" fill="#d7ccbf" />
        {[
          [1460, 705, -40, 230],
          [1460, 705, -15, 300],
          [1460, 705, 10, 320],
          [1460, 705, 35, 250],
          [1460, 705, -60, 180],
          [1460, 705, 60, 190],
        ].map(([x, y, a, h], i) => (
          <g key={i} transform={`rotate(${a} ${x} ${y})`}>
            <line x1={x} y1={y} x2={x} y2={y - h} stroke="#3e5a2f" strokeWidth="4" />
            {Array.from({ length: 6 }).map((_, k) => (
              <ellipse key={k} cx={x + (k % 2 ? 22 : -22)} cy={y - 40 - k * (h / 7)} rx="30" ry="8" fill={k % 2 ? "#5d7d45" : "#4a6b36"} transform={`rotate(${k % 2 ? -30 : 30} ${x + (k % 2 ? 22 : -22)} ${y - 40 - k * (h / 7)})`} />
            ))}
          </g>
        ))}
      </g>

      {/* erba della pampa a sinistra */}
      <g>
        <rect x="120" y="690" width="90" height="130" rx="30" fill="#a8745a" />
        {[-28, -14, 0, 14, 28].map((a, i) => (
          <g key={i} transform={`rotate(${a} 165 690)`}>
            <line x1="165" y1="690" x2="165" y2="470" stroke="#8a7658" strokeWidth="3" />
            <ellipse cx="165" cy="470" rx="16" ry="70" fill="#e3d2b3" opacity="0.9" />
          </g>
        ))}
      </g>
    </svg>
  );
}
