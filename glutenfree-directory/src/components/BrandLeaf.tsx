// Simbolo della "spiga barrata": la spiga di grano attraversata da una barra,
// il marchio internazionale del senza glutine — coerente col contenuto del blog.
export default function BrandLeaf({ size = 24, className = "" }: { size?: number; className?: string }) {
  const kernel = { fill: "#15844e", stroke: "#0a0a0a", strokeWidth: 3 };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M47 90 L47 22 Q50 16 53 22 L53 90 Z" fill="#15844e" stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="35" cy="72" rx="11" ry="5.5" transform="rotate(-38 35 72)" {...kernel} />
      <ellipse cx="65" cy="72" rx="11" ry="5.5" transform="rotate(38 65 72)" {...kernel} />
      <ellipse cx="32" cy="54" rx="11" ry="5.5" transform="rotate(-38 32 54)" {...kernel} />
      <ellipse cx="68" cy="54" rx="11" ry="5.5" transform="rotate(38 68 54)" {...kernel} />
      <ellipse cx="30" cy="36" rx="10" ry="5" transform="rotate(-38 30 36)" {...kernel} />
      <ellipse cx="70" cy="36" rx="10" ry="5" transform="rotate(38 70 36)" {...kernel} />
      <circle cx="50" cy="18" r="6" {...kernel} />
      <path d="M10 84 L90 16" fill="none" stroke="#0a0a0a" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}
