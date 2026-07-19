import Link from "next/link";

/** Marchio minimale: quadrato arancione con la "S". */
export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[0.5rem] bg-brand text-white"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span className="font-display font-black leading-none" style={{ fontSize: size * 0.6 }}>
        S
      </span>
    </span>
  );
}

export default function Logo({
  className = "",
  showTagline = true,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Scortvia — home"
    >
      <LogoMark size={34} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.24rem] font-extrabold tracking-tight text-brand">
          Scortvia
        </span>
        {showTagline && (
          <span className="mono text-[0.56rem] font-medium uppercase tracking-[0.22em] text-muted">
            Marketplace B2B
          </span>
        )}
      </span>
    </Link>
  );
}
