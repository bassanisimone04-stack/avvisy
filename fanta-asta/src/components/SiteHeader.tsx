"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const VOCI = [
  { href: "/", label: "Asta live", icona: "🔨" },
  { href: "/listone", label: "Listone", icona: "📋" },
  { href: "/squadre", label: "Serie A", icona: "⚽" },
  { href: "/news", label: "News", icona: "📰" },
  { href: "/guida", label: "Guida", icona: "🎯" },
  { href: "/impostazioni", label: "Lega", icona: "⚙️" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[#060d0bd9] backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-black"
            style={{ background: "linear-gradient(160deg,#22c55e,#0f5132)", color: "#04140c" }}
            aria-hidden
          >
            FA
          </span>
          <span className="text-[0.95rem] font-black tracking-tight">
            Fanta<span className="text-[color:var(--accent)]">Asta</span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-wrap items-center gap-1">
          {VOCI.map((voce) => {
            const attivo =
              voce.href === "/" ? pathname === "/" : pathname.startsWith(voce.href);
            return (
              <Link
                key={voce.href}
                href={voce.href}
                aria-current={attivo ? "page" : undefined}
                className="rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors"
                style={{
                  background: attivo ? "rgba(34,197,94,0.14)" : "transparent",
                  color: attivo ? "#4ade80" : "#9dbab1",
                }}
              >
                <span aria-hidden className="mr-1">
                  {voce.icona}
                </span>
                {voce.label}
              </Link>
            );
          })}
        </nav>

        <span className="hidden text-[0.7rem] text-[color:var(--muted)] sm:block">
          Serie A Enilive 2026/27
        </span>
      </div>
    </header>
  );
}
