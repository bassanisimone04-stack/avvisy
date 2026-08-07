"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Store, Newspaper, Users, Star, Tags, Image as ImageIcon,
  Mail, BarChart3, Search, ArrowLeftCircle,
} from "lucide-react";
import Logo from "./Logo";

const NAV = [
  { href: "/admin", label: "Panoramica", icon: LayoutDashboard },
  { href: "/admin/attivita", label: "Attività", icon: Store },
  { href: "/admin/articoli", label: "Articoli", icon: Newspaper },
  { href: "/admin/utenti", label: "Utenti", icon: Users },
  { href: "/admin/recensioni", label: "Recensioni", icon: Star },
  { href: "/admin/categorie", label: "Categorie", icon: Tags },
  { href: "/admin/banner", label: "Banner", icon: ImageIcon },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/seo", label: "SEO Dashboard", icon: Search },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-surface-2">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface lg:flex">
        <div className="border-b border-line p-4"><Logo /></div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? "bg-brand-soft text-brand-dark" : "text-ink-soft hover:bg-surface-2"}`}>
                <item.icon size={16} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-3">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-2">
            <ArrowLeftCircle size={16} /> Torna al sito
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-line bg-surface px-6 py-4 lg:hidden">
          <Logo />
        </header>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
