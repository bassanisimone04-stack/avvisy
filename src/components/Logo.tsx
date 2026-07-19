import Link from "next/link";

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
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-[0.55rem] bg-brand text-white">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          {/* Freccia circolare: circolarità delle merci */}
          <path
            d="M6 8.2 4 12l2 1.4M18 15.8l2-3.8-2-1.4"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 13.2A7.6 7.6 0 0 0 17 17.4M19.5 10.8A7.6 7.6 0 0 0 7 6.6"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-verified" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className="font-display text-[1.2rem] font-extrabold tracking-tight"
          style={{ color: text }}
        >
          Scortvia
        </span>
        <span
          className="mono text-[0.58rem] font-medium uppercase tracking-[0.18em]"
          style={{ color: variant === "light" ? "rgba(255,255,255,.6)" : "var(--s-muted)" }}
        >
          Marketplace B2B
        </span>
      </span>
    </Link>
  );
}
