"use client";

import Link from "next/link";
import { useState } from "react";
import Modal from "./Modal";
import { notify } from "./Toaster";
import { ConditionChip, LotStatusPill } from "./badges";
import LotImage from "./LotImage";
import { EmptyState } from "./dash";
import { IconBox, IconPlus } from "./icons";
import { formatEuro, formatNumber } from "@/lib/format";
import { lotTotal, type Lot, type LotStatus } from "@/lib/types";
import { useStore } from "@/lib/store";

const filters: { key: string; label: string; match: (s: LotStatus) => boolean }[] = [
  { key: "tutti", label: "Tutti", match: () => true },
  { key: "pubblicati", label: "Pubblicati", match: (s) => s === "Pubblicato" },
  { key: "revisione", label: "In revisione", match: (s) => s === "In revisione" || s === "Bozza" },
  { key: "riservati", label: "Riservati/Venduti", match: (s) => s === "Riservato" || s === "Venduto" },
];

export default function SellerLots() {
  const { state, dispatch, currentSellerId } = useStore();
  const [filter, setFilter] = useState("tutti");
  const [editing, setEditing] = useState<Lot | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const myLots = state.lots.filter((l) => l.sellerId === currentSellerId);
  const active = filters.find((f) => f.key === filter)!;
  const shown = myLots.filter((l) => active.match(l.status));

  function setStatus(lot: Lot, status: LotStatus, msg: string) {
    dispatch({ type: "UPDATE_LOT_STATUS", lotId: lot.id, status });
    notify(msg);
    setMenuFor(null);
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => {
          const n = myLots.filter((l) => f.match(l.status)).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`btn btn-sm ${filter === f.key ? "btn-steel" : "btn-outline"}`}
            >
              {f.label} ({n})
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<IconBox />}
            title="Nessun lotto in questa vista"
            text="Pubblica un nuovo lotto per iniziare a vendere."
            action={<Link href="/venditore/pubblica" className="btn btn-primary btn-sm"><IconPlus width={16} height={16} /> Pubblica lotto</Link>}
          />
        </div>
      ) : (
        <div className="card overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-line bg-surface-2/60 text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">Lotto</th>
                  <th className="px-4 py-3 font-semibold">Stato</th>
                  <th className="px-4 py-3 text-right font-semibold">Quantità</th>
                  <th className="px-4 py-3 text-right font-semibold">Totale</th>
                  <th className="px-4 py-3 text-right font-semibold">Offerte</th>
                  <th className="px-4 py-3 text-right font-semibold">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((l) => (
                  <tr key={l.id} className="border-b border-line last:border-0 hover:bg-surface-2/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="hidden w-14 shrink-0 sm:block">
                          <LotImage category={l.category} seed={l.images[0] ?? 1} className="rounded-md" />
                        </div>
                        <div>
                          <Link href={`/lotto/${l.id}`} className="font-medium text-ink hover:text-brand-dark">{l.title}</Link>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-mono text-xs text-muted">{l.code}</span>
                            <ConditionChip condition={l.condition} />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><LotStatusPill status={l.status} /></td>
                    <td className="px-4 py-3 text-right text-ink">{formatNumber(l.quantity)} {l.unit}</td>
                    <td className="px-4 py-3 text-right font-semibold text-brand-dark">{formatEuro(lotTotal(l), true)}</td>
                    <td className="px-4 py-3 text-right text-ink">{l.offersCount}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setMenuFor(menuFor === l.id ? null : l.id)}
                          className="btn btn-outline btn-sm"
                          aria-haspopup="menu"
                          aria-expanded={menuFor === l.id}
                        >
                          Azioni ▾
                        </button>
                        {menuFor === l.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setMenuFor(null)} />
                            <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-lg border border-line bg-surface py-1 text-left shadow-[var(--shadow-lift)]" role="menu">
                              <MenuItem onClick={() => { setEditing(l); setMenuFor(null); }}>Modifica lotto</MenuItem>
                              {(l.status === "Bozza" || l.status === "In revisione") && (
                                <MenuItem onClick={() => setStatus(l, "Pubblicato", "Lotto pubblicato.")}>Pubblica ora</MenuItem>
                              )}
                              {l.status === "Pubblicato" && (
                                <MenuItem onClick={() => setStatus(l, "Sospeso", "Lotto sospeso.")}>Sospendi</MenuItem>
                              )}
                              {l.status === "Sospeso" && (
                                <MenuItem onClick={() => setStatus(l, "Pubblicato", "Lotto riattivato.")}>Riattiva</MenuItem>
                              )}
                              <MenuItem onClick={() => { dispatch({ type: "DUPLICATE_LOT", lotId: l.id }); notify("Lotto duplicato come bozza."); setMenuFor(null); }}>Duplica annuncio</MenuItem>
                              {l.status !== "Venduto" && (
                                <MenuItem danger onClick={() => setStatus(l, "Venduto", "Lotto segnato come venduto.")}>Segna come venduto</MenuItem>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EditLotModal lot={editing} onClose={() => setEditing(null)} />
    </>
  );
}

function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      role="menuitem"
      className={`block w-full px-3 py-2 text-left text-sm hover:bg-surface-2 ${danger ? "text-danger" : "text-ink"}`}
    >
      {children}
    </button>
  );
}

function EditLotModal({ lot, onClose }: { lot: Lot | null; onClose: () => void }) {
  const { dispatch } = useStore();
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(0);

  // Sincronizza quando cambia il lotto in modifica.
  const key = lot?.id ?? "none";

  return (
    <Modal
      open={!!lot}
      onClose={onClose}
      title="Modifica lotto"
      footer={
        <div className="flex gap-2">
          <button onClick={onClose} className="btn btn-outline flex-1">Annulla</button>
          <button
            onClick={() => {
              if (lot) {
                dispatch({
                  type: "EDIT_LOT",
                  lotId: lot.id,
                  patch: { unitPrice: price || lot.unitPrice, quantity: qty || lot.quantity },
                });
                notify("Lotto aggiornato.");
              }
              onClose();
            }}
            className="btn btn-primary flex-1"
          >
            Salva modifiche
          </button>
        </div>
      }
    >
      {lot && (
        <div className="space-y-4" key={key}>
          <p className="text-sm text-muted">{lot.title}</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label">Prezzo unitario (€)</label>
              <input type="number" step="0.01" defaultValue={lot.unitPrice} onChange={(e) => setPrice(Number(e.target.value) || 0)} className="field" />
            </div>
            <div>
              <label className="field-label">Quantità ({lot.unit})</label>
              <input type="number" defaultValue={lot.quantity} onChange={(e) => setQty(Number(e.target.value) || 0)} className="field" />
            </div>
          </div>
          <p className="text-xs text-muted">Le altre proprietà del lotto restano invariate.</p>
        </div>
      )}
    </Modal>
  );
}
