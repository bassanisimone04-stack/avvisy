"use client";

import { useState } from "react";
import { VerificationChip } from "./badges";
import { notify } from "./Toaster";
import { formatDate } from "@/lib/format";
import type { Company, VerificationStatus } from "@/lib/types";

export default function AdminCompanies({ initial }: { initial: Company[] }) {
  const [rows, setRows] = useState(initial);

  function setStatus(id: string, status: VerificationStatus, msg: string) {
    setRows((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    notify(msg, status === "sospesa" ? "info" : "success");
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-semibold">Azienda</th>
              <th className="px-4 py-3 font-semibold">Partita IVA</th>
              <th className="px-4 py-3 font-semibold">Sede</th>
              <th className="px-4 py-3 font-semibold">Iscrizione</th>
              <th className="px-4 py-3 font-semibold">Stato</th>
              <th className="px-4 py-3 text-right font-semibold">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0 hover:bg-surface-2/40">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="text-xs text-muted">{c.sector}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">{c.vatNumber}</td>
                <td className="px-4 py-3 text-muted">{c.city}, {c.region}</td>
                <td className="px-4 py-3 text-muted">{formatDate(c.memberSince)}</td>
                <td className="px-4 py-3"><VerificationChip status={c.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {c.status === "in_verifica" && (
                      <>
                        <button
                          onClick={() => setStatus(c.id, "sospesa", `${c.name} respinta.`)}
                          className="btn btn-outline btn-sm text-danger"
                        >
                          Respingi
                        </button>
                        <button
                          onClick={() => setStatus(c.id, "verificata", `${c.name} approvata e verificata.`)}
                          className="btn btn-primary btn-sm"
                        >
                          Approva
                        </button>
                      </>
                    )}
                    {c.status === "verificata" && (
                      <button
                        onClick={() => setStatus(c.id, "sospesa", `${c.name} sospesa.`)}
                        className="btn btn-outline btn-sm text-danger"
                      >
                        Sospendi
                      </button>
                    )}
                    {c.status === "sospesa" && (
                      <button
                        onClick={() => setStatus(c.id, "verificata", `${c.name} riattivata.`)}
                        className="btn btn-outline btn-sm"
                      >
                        Riattiva
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
