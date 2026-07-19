"use client";

import { VerificationChip } from "./badges";
import { notify } from "./Toaster";
import { formatDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { VerificationStatus } from "@/lib/types";

export default function AdminCompanies() {
  const { state, dispatch } = useStore();

  function setStatus(id: string, name: string, status: VerificationStatus, msg: string) {
    dispatch({ type: "SET_VERIFICATION", companyId: id, status });
    notify(msg, status === "Sospesa" ? "info" : "success");
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-sm">
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
            {state.companies.map((c) => (
              <tr key={c.id} className="border-b border-line last:border-0 hover:bg-surface-2/40">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{c.displayName}</p>
                  <p className="text-xs text-muted">{c.sector}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">{c.vatNumber}</td>
                <td className="px-4 py-3 text-muted">{c.province}, {c.region}</td>
                <td className="px-4 py-3 text-muted">{formatDate(c.registeredAt)}</td>
                <td className="px-4 py-3"><VerificationChip status={c.verification} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {(c.verification === "In verifica" || c.verification === "Non verificata") && (
                      <>
                        <button onClick={() => setStatus(c.id, c.displayName, "Sospesa", `${c.displayName} respinta.`)} className="btn btn-outline btn-sm text-danger">Respingi</button>
                        <button onClick={() => setStatus(c.id, c.displayName, "Verificata", `${c.displayName} approvata e verificata.`)} className="btn btn-primary btn-sm">Approva</button>
                      </>
                    )}
                    {c.verification === "Verificata" && (
                      <button onClick={() => setStatus(c.id, c.displayName, "Sospesa", `${c.displayName} sospesa.`)} className="btn btn-outline btn-sm text-danger">Sospendi</button>
                    )}
                    {c.verification === "Sospesa" && (
                      <button onClick={() => setStatus(c.id, c.displayName, "Verificata", `${c.displayName} riattivata.`)} className="btn btn-outline btn-sm">Riattiva</button>
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
