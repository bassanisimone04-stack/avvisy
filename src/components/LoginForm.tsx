"use client";

import Link from "next/link";
import { useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signInAction } from "@/lib/supabase/auth-actions";

const roles = [
  { key: "venditore", label: "Venditore", href: "/venditore", desc: "Dashboard, lotti e offerte ricevute" },
  { key: "compratore", label: "Compratore", href: "/compratore", desc: "Offerte inviate, ordini e salvati" },
  { key: "admin", label: "Amministratore", href: "/admin", desc: "Approvazioni e controllo piattaforma" },
];

export default function LoginForm({ error }: { error?: string }) {
  const [role, setRole] = useState("venditore");
  const target = roles.find((r) => r.key === role)!;

  // ---- Modalità reale (Supabase collegato) -------------------------------
  if (isSupabaseConfigured) {
    return (
      <form action={signInAction} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-danger-soft p-3 text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="login-email" className="field-label">Email aziendale</label>
          <input id="login-email" name="email" type="email" required className="field" placeholder="nome@azienda.it" />
        </div>
        <div>
          <label htmlFor="login-password" className="field-label">Password</label>
          <input id="login-password" name="password" type="password" required className="field" placeholder="••••••••" />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Accedi</button>
      </form>
    );
  }

  // ---- Modalità demo (dati finti) ----------------------------------------
  return (
    <div className="space-y-4">
      <div>
        <label className="field-label">Email aziendale</label>
        <input type="email" defaultValue="acquisti@azienda.it" className="field" />
      </div>
      <div>
        <label className="field-label">Password</label>
        <input type="password" defaultValue="••••••••" className="field" />
      </div>

      <div>
        <p className="field-label">Entra come (demo)</p>
        <div className="grid gap-2">
          {roles.map((r) => (
            <label
              key={r.key}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                role === r.key ? "border-brand bg-brand-soft/50" : "border-line hover:bg-surface-2"
              }`}
            >
              <input
                type="radio"
                name="role"
                checked={role === r.key}
                onChange={() => setRole(r.key)}
                className="h-4 w-4 accent-[var(--s-brand)]"
              />
              <span>
                <span className="block text-sm font-semibold text-ink">{r.label}</span>
                <span className="block text-xs text-muted">{r.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <Link href={target.href} className="btn btn-primary btn-block">
        Accedi come {target.label}
      </Link>
    </div>
  );
}
