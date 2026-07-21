"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { IconBell, IconClose, IconMenu } from "./icons";
import { useStore } from "@/lib/store";
import { countUnreadMessages } from "@/lib/supabase/messages";
import { signOutAction } from "@/lib/supabase/auth-actions";

export type NavItem = { href: string; label: string; icon: React.ReactNode };

export default function DashboardShell({
  navItems,
  areaLabel,
  accountName,
  accountMeta,
  audience,
  notificationsHref,
  children,
}: {
  navItems: NavItem[];
  areaLabel: string;
  accountName: string;
  accountMeta: string;
  audience?: "seller" | "buyer";
  notificationsHref?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { state, online, currentCompanyId, currentSeller, currentBuyer } = useStore();

  // Sul sito live (Supabase) mostriamo l'azienda realmente loggata; in demo
  // restano i nomi passati come prop. Il passaggio avviene dopo l'idratazione
  // (online diventa true solo a store pronto), quindi niente mismatch SSR.
  const account = audience === "buyer" ? currentBuyer : currentSeller;
  const name = online && account ? account.displayName : accountName;
  const meta = online && account ? `${account.province} · ${account.verification}` : accountMeta;

  const unread = audience
    ? state.notifications.filter(
        (n) => !n.read && (n.audience === audience || n.audience === "both"),
      ).length
    : 0;

  // Messaggi non letti (badge sulla voce "Messaggi"), aggiornati periodicamente.
  const [unreadMsgs, setUnreadMsgs] = useState(0);
  useEffect(() => {
    if (!online || !currentCompanyId) return;
    let alive = true;
    const load = async () => {
      const n = await countUnreadMessages(currentCompanyId);
      if (alive) setUnreadMsgs(n);
    };
    load();
    const iv = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [online, currentCompanyId, pathname]);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <Logo />
        <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Chiudi">
          <IconClose />
        </button>
      </div>
      <div className="px-4">
        <span className="chip bg-brand-soft text-brand-dark">{areaLabel}</span>
      </div>
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/venditore" &&
              item.href !== "/compratore" &&
              item.href !== "/admin" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand text-white"
                  : "text-ink-soft hover:bg-surface-2 hover:text-ink"
              }`}
            >
              <span className={active ? "text-white" : "text-muted"}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.href.endsWith("/messaggi") && unreadMsgs > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold ${
                    active ? "bg-white text-brand" : "bg-signal text-white"
                  }`}
                >
                  {unreadMsgs}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-steel-soft text-sm font-bold text-steel">
            {name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <p className="truncate text-xs text-muted">{meta}</p>
          </div>
        </div>
        <Link href="/" className="btn btn-ghost btn-sm mt-1 w-full justify-start text-muted">
          ← Torna al sito
        </Link>
        {online && (
          <form action={signOutAction}>
            <button type="submit" className="btn btn-ghost btn-sm w-full justify-start text-danger">
              Esci
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[264px_1fr]">
      {/* Sidebar desktop */}
      <aside className="hidden border-r border-line bg-surface lg:block">
        <div className="sticky top-0 h-dvh overflow-y-auto">{sidebar}</div>
      </aside>

      {/* Sidebar mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-surface shadow-xl">
            {sidebar}
          </div>
        </div>
      )}

      <div className="flex min-h-dvh flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface/90 px-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Apri menu"
            >
              <IconMenu />
            </button>
            <span className="text-sm font-semibold text-ink">{areaLabel}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              href={notificationsHref ?? "#"}
              className="relative rounded-lg p-2 text-muted hover:bg-surface-2"
              aria-label={`Notifiche${unread ? `: ${unread} non lette` : ""}`}
            >
              <IconBell width={20} height={20} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[0.65rem] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
