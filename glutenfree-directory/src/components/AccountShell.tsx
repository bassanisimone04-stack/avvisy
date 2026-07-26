"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Heart, Star, Bell, Flag, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/account", label: "Profilo", icon: User },
  { href: "/account/preferiti", label: "Preferiti", icon: Heart },
  { href: "/account/recensioni", label: "Le mie recensioni", icon: Star },
  { href: "/account/notifiche", label: "Notifiche", icon: Bell },
  { href: "/account/segnala", label: "Segnala un errore", icon: Flag },
];

export default function AccountShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-ink">Accedi per continuare</h1>
        <p className="max-w-sm text-ink-soft">Devi effettuare l&apos;accesso per gestire il tuo profilo, i preferiti e le recensioni.</p>
        <Link href="/accedi" className="btn btn-primary">Accedi</Link>
      </div>
    );
  }

  return (
    <div className="container-page grid gap-8 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="card card-soft h-fit p-4 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center gap-3 border-b border-line px-2 pb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">{user.name.slice(0, 1)}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium ${pathname === item.href ? "bg-brand-soft text-brand-dark" : "text-ink-soft hover:bg-surface-2"}`}
            >
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => { logout(); router.push("/"); }}
            className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger hover:bg-surface-2"
          >
            <LogOut size={16} /> Esci
          </button>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
