"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { SearchBox } from "./search-box";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${scrolled ? "border-line bg-paper/90 backdrop-blur-md" : "border-transparent bg-paper"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight" aria-label={`${SITE.name} home`}>
          Screen<span className="text-champagne-text">shade</span>
        </Link>
        <nav aria-label="Primary" className="ml-4 hidden items-center gap-6 text-sm lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}
              className={`relative py-1 transition-colors hover:text-champagne-text ${path.startsWith(n.href) ? "text-champagne-text" : "text-slate"}`}>{n.label}</Link>
          ))}
        </nav>
        <div className="ml-auto hidden w-64 xl:block"><SearchBox /></div>
        <Link href="/search" className="ml-auto rounded-full p-2 hover:bg-line/60 xl:hidden" aria-label="Search">
          <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" /></svg>
        </Link>
        <button type="button" className="rounded-full p-2 hover:bg-line/60 lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
          <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
      </div>
      <nav id="mobile-nav" aria-label="Mobile" hidden={!open} className="border-t border-line bg-paper px-5 pb-6 pt-3 lg:hidden">
        <ul className="grid grid-cols-2 gap-x-6">
          {NAV.map((n) => <li key={n.href}><Link href={n.href} className="block border-b border-line py-3 font-display text-2xl">{n.label}</Link></li>)}
        </ul>
      </nav>
    </header>
  );
}
