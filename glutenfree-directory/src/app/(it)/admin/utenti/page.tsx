"use client";

import { useState } from "react";
import { Ban, ShieldCheck } from "lucide-react";
import AdminShell from "@/components/AdminShell";

const SEED_USERS = [
  { id: "u1", name: "Chiara Marini", email: "chiara.marini@email.it", role: "Utente", joined: "2025-11-02", status: "Attivo" as const },
  { id: "u2", name: "Davide Ricci", email: "davide.ricci@email.it", role: "Utente", joined: "2025-10-14", status: "Attivo" as const },
  { id: "u3", name: "Osteria Senza Confini", email: "info@osteriasenzaconfini.it", role: "Azienda", joined: "2025-09-20", status: "Attivo" as const },
  { id: "u4", name: "Federica Sanna", email: "federica.sanna@email.it", role: "Utente", joined: "2026-01-08", status: "Sospeso" as const },
  { id: "u5", name: "Pizzeria La Spiga d'Oro", email: "info@laspigadoro.it", role: "Azienda", joined: "2025-12-01", status: "Attivo" as const },
  { id: "u6", name: "Luca Pellegrini", email: "luca.pellegrini@email.it", role: "Utente", joined: "2026-02-19", status: "Attivo" as const },
];

export default function AdminUsers() {
  const [rows, setRows] = useState(SEED_USERS);

  function toggleStatus(id: string) {
    setRows((r) => r.map((u) => (u.id === id ? { ...u, status: u.status === "Attivo" ? "Sospeso" : "Attivo" } : u)));
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink">Gestione utenti</h1>
      <p className="mt-1 text-ink-soft">{rows.length} account registrati (campione dimostrativo)</p>

      <div className="card card-soft mt-5 overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Ruolo</th>
              <th className="px-4 py-3">Iscritto il</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                <td className="px-4 py-3 text-ink-soft">{u.email}</td>
                <td className="px-4 py-3"><span className="chip chip-neutral">{u.role}</span></td>
                <td className="px-4 py-3 text-ink-soft">{u.joined}</td>
                <td className="px-4 py-3">
                  <span className={`chip ${u.status === "Attivo" ? "chip-brand" : "chip-gold"}`}>{u.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button type="button" onClick={() => toggleStatus(u.id)} className="btn btn-ghost btn-sm !px-2" aria-label={u.status === "Attivo" ? "Sospendi" : "Riattiva"}>
                    {u.status === "Attivo" ? <Ban size={14} className="text-danger" /> : <ShieldCheck size={14} className="text-brand" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
