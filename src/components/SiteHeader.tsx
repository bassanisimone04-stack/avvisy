"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";
import { IconClose, IconMenu } from "./icons";

const nav = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/categorie", label: "Categorie" },
  { href: "/come-funziona", label: "Come funziona" },
  { href: "/vendi", label: "Vendi" },
  { href: "/soluzioni", label: "Soluzioni per aziende" },
  { href: "/assistenza", label: "Assistenza" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-soft text-brand-dark"
                      : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/accedi" className="btn btn-ghost btn-sm">
            Accedi
          </Link>
          <Link href="/registrati" className="btn btn-primary btn-sm">
            Registrati
          </Link>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          aria-expanded={open}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface md:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
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
            <div className="mt-2 flex gap-2 border-t border-line pt-3">
              <Link
                href="/accedi"
                onClick={() => setOpen(false)}
                className="btn btn-outline btn-sm flex-1"
              >
                Accedi
              </Link>
              <Link
                href="/registrati"
                onClick={() => setOpen(false)}
                className="btn btn-primary btn-sm flex-1"
              >
                Registrati
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
