"use client";

import { useState } from "react";
import { notify } from "./Toaster";

type User = {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  blocked: boolean;
};

const seed: User[] = [
  { id: "u1", name: "Luca Moretti", email: "l.moretti@metalfer.it", company: "Metalfer Componenti Srl", role: "Venditore", blocked: false },
  { id: "u2", name: "Giulia Ferraris", email: "acquisti@ferraris.it", company: "Officine Meccaniche Ferraris Srl", role: "Compratore", blocked: false },
  { id: "u3", name: "Marco Bevilacqua", email: "m.bevilacqua@ferind.it", company: "Ferramenta Industriale Bevilacqua", role: "Compratore", blocked: false },
  { id: "u4", name: "Sara Conti", email: "s.conti@packitalia.it", company: "PackItalia Imballaggi Srl", role: "Venditore", blocked: false },
  { id: "u5", name: "Utente segnalato", email: "info@accountsospetto.it", company: "Account sospetto", role: "Compratore", blocked: true },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(seed);

  function toggle(id: string) {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        notify(`${u.name} ${u.blocked ? "sbloccato" : "bloccato"}.`, u.blocked ? "success" : "info");
        return { ...u, blocked: !u.blocked };
      }),
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-semibold">Utente</th>
              <th className="px-4 py-3 font-semibold">Azienda</th>
              <th className="px-4 py-3 font-semibold">Ruolo</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
              <th className="px-4 py-3 text-right font-semibold">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line last:border-0 hover:bg-surface-2/40">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{u.name}</p>
                  <p className="text-xs text-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-muted">{u.company}</td>
                <td className="px-4 py-3 text-muted">{u.role}</td>
                <td className="px-4 py-3">
                  <span className={`chip ${u.blocked ? "bg-danger-soft text-danger" : "bg-brand-soft text-brand-dark"}`}>
                    {u.blocked ? "Bloccato" : "Attivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggle(u.id)}
                    className={`btn btn-sm ${u.blocked ? "btn-outline" : "btn-outline text-danger"}`}
                  >
                    {u.blocked ? "Sblocca" : "Blocca"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
