"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { IconClose, IconMenu, IconSearch } from "./icons";

const nav = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/categorie", label: "Categorie" },
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/vendi", label: "Vendi" },
  { href: "/soluzioni", label: "Soluzioni" },
  { href: "/assistenza", label: "Assistenza" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  function search(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/marketplace?q=${encodeURIComponent(q.trim())}` : "/marketplace");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur">
      {/* Barra superiore */}
      <div className="bg-ink text-white">
        <div className="container-page flex h-8 items-center justify-between text-[0.72rem]">
          <p className="mono tracking-wide text-white/70">
            Prototipo dimostrativo · dati fittizi, nessun pagamento reale
          </p>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/venditore" className="text-white/70 transition-colors hover:text-white">Area venditore</Link>
            <span className="text-white/30">·</span>
            <Link href="/compratore" className="text-white/70 transition-colors hover:text-white">Area compratore</Link>
          </div>
        </div>
      </div>

      <div className="border-b border-line">
        <div className="container-page flex h-[4.25rem] items-center justify-between gap-5">
          <div className="flex items-center gap-7">
            <Logo />
            <nav className="hidden items-center gap-0.5 lg:flex">
              {nav.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-3 py-2 text-[0.9rem] font-medium transition-colors ${
                      active ? "text-brand-dark" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={search} className="hidden items-center md:flex">
              <div className="flex items-center gap-2 rounded-lg border border-line-strong bg-surface px-3 focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--s-brand-soft)]">
                <IconSearch className="text-muted" width={16} height={16} />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cerca lotti…"
                  aria-label="Cerca nel marketplace"
                  className="w-36 bg-transparent py-2 text-sm outline-none placeholder:text-muted xl:w-48"
                />
              </div>
            </form>
            <Link href="/accedi" className="btn btn-ghost btn-sm hidden sm:inline-flex">Accedi</Link>
            <Link href="/registrati" className="btn btn-primary btn-sm hidden sm:inline-flex">Registrati</Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              aria-expanded={open}
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-b border-line bg-surface lg:hidden">
          <div className="container-page py-4">
            <form onSubmit={search} className="mb-3 flex items-center gap-2 rounded-lg border border-line-strong px-3">
              <IconSearch className="text-muted" width={16} height={16} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cerca lotti…"
                aria-label="Cerca nel marketplace"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted"
              />
            </form>
            <nav className="flex flex-col gap-0.5">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex gap-2 border-t border-line pt-3">
              <Link href="/accedi" onClick={() => setOpen(false)} className="btn btn-outline btn-sm flex-1">Accedi</Link>
              <Link href="/registrati" onClick={() => setOpen(false)} className="btn btn-primary btn-sm flex-1">Registrati</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
