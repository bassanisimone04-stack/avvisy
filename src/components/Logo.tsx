import Link from "next/link";

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center rounded-[0.6rem] bg-brand text-white shadow-[0_2px_0_rgba(0,0,0,0.08)]"
      style={{ width: size, height: size }}
    >
      {/* Arco circolare (circolarità delle merci) */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
      >
        <path
          d="M31 13a13 13 0 0 0-22 2"
          stroke="#fff"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M9 15 7 11l4-.4" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9 27a13 13 0 0 0 22-2"
          stroke="#fff"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M31 25l2 4-4 .4" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        className="font-display font-black leading-none"
        style={{ fontSize: size * 0.52, marginTop: -1 }}
      >
        S
      </span>
    </span>
  );
}

export default function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const text = variant === "light" ? "#ffffff" : "var(--s-ink)";
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="Scortvia — home"
    >
      <LogoMark size={40} />
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.24rem] font-extrabold tracking-tight"
          style={{ color: text }}
        >
          Scortvia
        </span>
        <span
          className="mono text-[0.57rem] font-medium uppercase tracking-[0.2em]"
          style={{ color: variant === "light" ? "rgba(255,255,255,.6)" : "var(--s-muted)" }}
        >
          Marketplace B2B
        </span>
      </span>
    </Link>
  );
}
