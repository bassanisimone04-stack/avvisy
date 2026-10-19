import { useId } from "react";

function frameFill(name: string) {
  const n = name.toLowerCase();
  if (/tortoise|havana/.test(n)) return { kind: "tortoise" as const };
  if (/gold/.test(n)) return { kind: "solid" as const, a: "#e0c07a", b: "#a98334" };
  if (/silver|metal|chrome/.test(n)) return { kind: "solid" as const, a: "#d3d6db", b: "#8b9098" };
  if (/clear|crystal/.test(n)) return { kind: "solid" as const, a: "#e9eef2", b: "#aeb8c2" };
  if (/black|ebony/.test(n)) return { kind: "solid" as const, a: "#2a2b2f", b: "#0d0d0f" };
  return { kind: "solid" as const, a: "#55575d", b: "#2c2d31" };
}
function lensFill(name: string) {
  const n = name.toLowerCase();
  if (/green/.test(n)) return ["#4d7a63", "#1d3a2b"];
  if (/brown|gradient|tortoise/.test(n)) return ["#8a6246", "#3d281a"];
  if (/amber|orange|yellow/.test(n)) return ["#e0a955", "#8a5a1c"];
  if (/blue/.test(n)) return ["#6b95c4", "#233f63"];
  return ["#4a4d55", "#17181b"]; // grey / dark / smoke / unknown
}

const LENS: Record<string, string> = {
  aviator: "M44 42 Q120 24 178 46 Q192 104 142 134 Q84 152 48 104 Q30 68 44 42 Z",
  wayfarer: "M36 44 L180 40 Q192 42 190 72 L177 114 Q171 130 148 130 L72 130 Q52 130 48 112 Z",
  "cat-eye": "M28 36 Q50 40 74 44 L178 58 Q194 66 186 92 Q172 132 120 132 Q60 130 40 92 Q30 70 28 36 Z",
  rectangular: "M40 48 H182 Q192 48 192 58 V112 Q192 126 178 126 H54 Q40 126 40 112 Z",
  oval: "M110 34 C160 34 190 58 190 86 C190 116 160 138 110 138 C60 138 30 116 30 86 C30 58 60 34 110 34 Z",
  round: "M112 30 A56 56 0 1 1 111.9 30 Z",
  other: "M42 48 H180 Q194 48 194 64 V108 Q194 128 172 128 H62 Q40 128 40 108 Z",
};

export function GlassesArt({ shape, frame, lens, className = "", title }: { shape: string; frame: string; lens: string; className?: string; title?: string }) {
  const id = useId().replace(/:/g, "");
  const f = frameFill(frame);
  const [l1, l2] = lensFill(lens);
  const frameStroke = shape === "wayfarer" ? 11 : shape === "aviator" || shape === "wrap" ? 4 : 7;
  const wrap = shape === "wrap";
  const lensPath = LENS[shape] ?? LENS.other;
  const bridge = shape === "aviator"
    ? "M178 52 Q200 40 222 52 M180 66 Q200 56 220 66"
    : shape === "wayfarer" ? "M188 52 Q200 46 212 52" : "M186 66 Q200 56 214 66";
  return (
    <svg viewBox="0 0 400 170" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} focusable="false">
      <defs>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="1" y2="1">
          {f.kind === "tortoise" ? (<><stop offset="0" stopColor="#b9792f" /><stop offset=".45" stopColor="#5a3416" /><stop offset=".7" stopColor="#8d5a22" /><stop offset="1" stopColor="#2e1a0b" /></>) : (<><stop offset="0" stopColor={f.a} /><stop offset="1" stopColor={f.b} /></>)}
        </linearGradient>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={l1} /><stop offset="1" stopColor={l2} /></linearGradient>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset=".35" stopColor="#fff" stopOpacity="0" /></linearGradient>
      </defs>
      {wrap ? (
        <g>
          <path d="M26 56 Q200 28 374 56 Q386 104 332 128 Q290 140 254 100 Q232 74 200 74 Q168 74 146 100 Q110 140 68 128 Q14 104 26 56 Z" fill={`url(#l${id})`} stroke={`url(#f${id})`} strokeWidth={frameStroke} strokeLinejoin="round" />
          <path d="M40 62 Q200 40 360 62 L330 78 Q200 58 70 78 Z" fill={`url(#g${id})`} />
        </g>
      ) : (
        <>
          {[false, true].map((mirror) => (
            <g key={String(mirror)} transform={mirror ? "translate(400 0) scale(-1 1)" : undefined}>
              <path d={lensPath} fill={`url(#l${id})`} stroke={`url(#f${id})`} strokeWidth={frameStroke} strokeLinejoin="round" />
              <path d={lensPath} fill={`url(#g${id})`} />
              {shape === "wayfarer" && <path d="M34 42 L182 38" stroke={`url(#f${id})`} strokeWidth="15" strokeLinecap="round" />}
              <path d="M44 46 L12 38" stroke={`url(#f${id})`} strokeWidth="5" strokeLinecap="round" />
            </g>
          ))}
          <path d={bridge} fill="none" stroke={`url(#f${id})`} strokeWidth={shape === "aviator" ? 3.5 : 7} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
