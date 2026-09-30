"use client";

import { useState } from "react";
import { Check, X, Star } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { BUSINESSES } from "@/lib/mock-businesses";
import { formatDateIt } from "@/lib/format";

const SEED = BUSINESSES.flatMap((b) => b.reviews.map((r) => ({ ...r, businessName: b.name })));

export default function AdminReviews() {
  const [rows, setRows] = useState(SEED);

  function decide(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
  }

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink">Moderazione recensioni</h1>
      <p className="mt-1 text-ink-soft">{rows.length} recensioni in coda di verifica</p>

      <div className="mt-5 space-y-3">
        {rows.length === 0 && <p className="card card-soft p-8 text-center text-ink-soft">Nessuna recensione da moderare.</p>}
        {rows.map((r) => (
          <div key={r.id} className="card card-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{r.title}</p>
                <p className="text-xs text-muted">{r.author} · su <span className="font-medium text-ink-soft">{r.businessName}</span> · {formatDateIt(r.date)}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < r.rating ? "fill-[var(--gf-gold)] text-[var(--gf-gold)]" : "text-line-strong"} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{r.body}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => decide(r.id)} className="btn btn-primary btn-sm"><Check size={14} /> Approva</button>
              <button type="button" onClick={() => decide(r.id)} className="btn btn-outline btn-sm text-danger"><X size={14} /> Rifiuta</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
