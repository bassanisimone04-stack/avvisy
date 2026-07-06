"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/", label: "Strutture" },
  { href: "/prezzi", label: "Prezzi" },
  { href: "/dashboard", label: "Per le strutture" },
];

export default function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/s/demo-caf/book"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Prenota ora
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-line sm:hidden"
        >
          <span aria-hidden className="text-lg leading-none">
            {open ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-card px-4 py-3 sm:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-base font-medium text-ink hover:bg-canvas"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/s/demo-caf/book"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-md bg-brand px-2 py-3 text-center text-base font-semibold text-white"
              >
                Prenota ora
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
