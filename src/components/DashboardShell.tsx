"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/login/actions";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Panoramica", icon: "◫" },
  { href: "/dashboard/appointments", label: "Appuntamenti", icon: "▤" },
  { href: "/dashboard/queue", label: "Coda live", icon: "№" },
  { href: "/dashboard/services", label: "Servizi", icon: "✚" },
  { href: "/dashboard/settings", label: "Impostazioni", icon: "⚙" },
];

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[220px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="hidden border-r border-line bg-card md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-line px-5">
          <Link href="/" className="font-display text-lg font-bold">
            Avvisy<span className="text-brand">.</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-brand-soft text-brand-dark"
                  : "text-muted hover:bg-canvas hover:text-ink"
              )}
            >
              <span aria-hidden className="w-4 text-center">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <p className="text-xs text-muted">CAF Navigli · Milano</p>
          <form action={signOut} className="mt-2">
            <button
              type="submit"
              className="text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              Esci
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Barra superiore (mobile) */}
        <header className="sticky top-0 z-40 border-b border-line bg-card md:hidden">
          <div className="flex h-12 items-center justify-between px-4">
            <Link href="/" className="font-display text-base font-bold">
              Avvisy<span className="text-brand">.</span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                Esci
              </button>
            </form>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-2 pb-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-brand-soft text-brand-dark"
                    : "text-muted hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
