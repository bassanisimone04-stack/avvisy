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
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Scortvia — home"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          {/* Freccia circolare stilizzata: circolarità delle merci */}
          <path
            d="M6 8.5 4 12l2 1.2M18 15.5l2-3.5-2-1.2"
            stroke="#fff"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.6 13a7.5 7.5 0 0 0 12.2 4M19.4 11A7.5 7.5 0 0 0 7.2 7"
            stroke="#fff"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className="text-lg font-bold tracking-tight"
        style={{ color: text }}
      >
        Scortvia
      </span>
    </Link>
  );
}
