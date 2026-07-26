"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Instagram, Facebook, Twitter } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { BLOG_CATEGORIES } from "@/lib/mock-articles";
import { slugify } from "@/lib/format";
import { SITE_NAME } from "@/lib/site-config";
import NewsletterForm from "./NewsletterForm";

export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="section-dark mt-16">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
                <Leaf size={19} />
              </span>
              <span className="font-display text-lg font-bold text-white">{SITE_NAME}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              La directory italiana di riferimento per chi cerca ristoranti, negozi, hotel e prodotti senza glutine certificati.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="https://instagram.com" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><Instagram size={16} /></a>
              <a href="https://facebook.com" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><Facebook size={16} /></a>
              <a href="https://twitter.com" aria-label="Twitter/X" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><Twitter size={16} /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Categorie</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {CATEGORIES.slice(0, 6).map((c) => (
                <li key={c.slug}><Link href={`/directory?categoria=${c.slug}`} className="hover:text-white">{c.labelPlural}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Blog</h3>
            <ul className="space-y-2 text-sm text-white/60">
              {BLOG_CATEGORIES.slice(0, 6).map((c) => (
                <li key={c}><Link href={`/blog?categoria=${slugify(c)}`} className="hover:text-white">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Azienda</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/chi-siamo" className="hover:text-white">Chi siamo</Link></li>
              <li><Link href="/contatti" className="hover:text-white">Contatti</Link></li>
              <li><Link href="/per-le-aziende" className="hover:text-white">Inserisci la tua attività</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
              <li><Link href="/cookie" className="hover:text-white">Cookie policy</Link></li>
              <li><Link href="/termini" className="hover:text-white">Termini di servizio</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Newsletter</h3>
            <p className="mb-3 text-sm text-white/60">Novità, guide e nuove attività certificate, una volta al mese.</p>
            <NewsletterForm dark />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_NAME}. Tutti i diritti riservati.</p>
          <p>Prototipo dimostrativo — dati ed attività mostrati a scopo illustrativo.</p>
        </div>
      </div>
    </footer>
  );
}
