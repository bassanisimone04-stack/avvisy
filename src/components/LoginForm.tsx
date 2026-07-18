"use client";

import Link from "next/link";
import { useState } from "react";

const roles = [
  { key: "venditore", label: "Venditore", href: "/venditore", desc: "Dashboard, lotti e offerte ricevute" },
  { key: "compratore", label: "Compratore", href: "/compratore", desc: "Offerte inviate, ordini e salvati" },
  { key: "admin", label: "Amministratore", href: "/admin", desc: "Approvazioni e controllo piattaforma" },
];

export default function LoginForm() {
  const [role, setRole] = useState("venditore");
  const target = roles.find((r) => r.key === role)!;

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
                role === r.key
                  ? "border-brand bg-brand-soft/50"
                  : "border-line hover:bg-surface-2"
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
