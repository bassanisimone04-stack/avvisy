"use client";

import { useState } from "react";
import { Send, Users } from "lucide-react";
import AdminShell from "@/components/AdminShell";

const CAMPAIGNS = [
  { id: "c1", subject: "5 nuove attività certificate AIC questo mese", sentAt: "2026-07-01", openRate: "38%" },
  { id: "c2", subject: "Guida estate: dove mangiare senza glutine in vacanza", sentAt: "2026-06-01", openRate: "42%" },
  { id: "c3", subject: "Nuovi prodotti in arrivo nella sezione Prodotti", sentAt: "2026-05-01", openRate: "35%" },
];

export default function AdminNewsletter() {
  const [subject, setSubject] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink">Newsletter</h1>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="card card-soft p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-ink-soft"><Users size={16} className="text-brand" /> Iscritti attivi</p>
          <p className="mt-1 text-3xl font-bold text-ink">12.480</p>
          <p className="mt-1 text-sm text-brand-dark">+142 questa settimana</p>

          <h2 className="mb-3 mt-6 font-semibold text-ink">Nuova campagna</h2>
          {sent && <p className="mb-3 rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-dark">Campagna programmata con successo.</p>}
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3">
            <input className="field" placeholder="Oggetto della email" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            <textarea className="field" rows={4} placeholder="Contenuto della newsletter…" />
            <button type="submit" className="btn btn-primary"><Send size={14} /> Invia campagna</button>
          </form>
        </div>

        <div className="card card-soft overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Oggetto</th>
                <th className="px-4 py-3">Inviata il</th>
                <th className="px-4 py-3">Tasso apertura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {CAMPAIGNS.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-ink">{c.subject}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.sentAt}</td>
                  <td className="px-4 py-3 text-brand-dark">{c.openRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
