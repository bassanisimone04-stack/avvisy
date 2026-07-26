"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell, Heart, UserCircle2 } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/directory", label: "Directory" },
  { href: "/blog", label: "Blog" },
  { href: "/prodotti", label: "Prodotti" },
  { href: "/chi-siamo", label: "Chi siamo" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, notifications } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />
        <nav className="ml-2 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-2 ${pathname?.startsWith(item.href) ? "text-brand-dark" : "text-ink-soft"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden flex-1 justify-center px-4 md:flex">
          <div className="w-full max-w-md">
            <SearchBar size="sm" placeholder="Cerca città, locali, prodotti…" />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <>
              <Link href="/account/notifiche" className="btn btn-ghost btn-sm relative !px-2.5" aria-label="Notifiche">
                <Bell size={18} />
                {unread > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-accent" />}
              </Link>
              <Link href="/account/preferiti" className="btn btn-ghost btn-sm !px-2.5" aria-label="Preferiti"><Heart size={18} /></Link>
              <Link href="/account" className="btn btn-ghost btn-sm hidden items-center gap-2 sm:flex">
                <UserCircle2 size={18} /> {user.name.split(" ")[0]}
              </Link>
            </>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link href="/accedi" className="btn btn-ghost btn-sm">Accedi</Link>
              <Link href="/registrati" className="btn btn-primary btn-sm">Registrati</Link>
            </div>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-sm !px-2.5 lg:hidden"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-surface px-4 pb-4 pt-3 lg:hidden">
          <div className="mb-3 md:hidden"><SearchBar size="sm" /></div>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-2">
                {item.label}
              </Link>
            ))}
          </nav>
          {!user && (
            <div className="mt-3 flex gap-2 border-t border-line pt-3">
              <Link href="/accedi" onClick={() => setOpen(false)} className="btn btn-outline btn-sm flex-1">Accedi</Link>
              <Link href="/registrati" onClick={() => setOpen(false)} className="btn btn-primary btn-sm flex-1">Registrati</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
