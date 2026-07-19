"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { IconArrowRight, IconRecycle, IconTruck, IconWallet } from "./icons";
import { commission, formatEuro, formatNumber } from "@/lib/format";

// ---------------------------------------------------------------------------
// Calcolatore magazzino: quanto costa tenere ferme le scorte e quanto se ne
// può recuperare rimettendole in circolo su Scortvia.
// ---------------------------------------------------------------------------

export function WarehouseCalculator() {
  const uid = useId();
  const [valore, setValore] = useState(80000);
  const [mq, setMq] = useState(120);
  const [costoMq, setCostoMq] = useState(9);

  const costoMese = mq * costoMq;
  const costoAnno = costoMese * 12;
  const recupero = Math.round(valore * 0.6); // fino al ~60%
  const netto = recupero - commission(recupero);

  return (
    <div className="card card-soft overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-5 py-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand-dark">
          <IconWallet width={18} height={18} />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-ink">Calcolatore magazzino immobilizzato</h3>
          <p className="text-xs text-muted">Stima il costo delle scorte ferme e la liquidità recuperabile.</p>
        </div>
      </div>
      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div className="space-y-4">
          <Range id={`${uid}-v`} label="Valore delle scorte ferme" value={valore} min={5000} max={500000} step={5000} onChange={setValore} format={(v) => formatEuro(v, true)} />
          <Range id={`${uid}-m`} label="Spazio occupato" value={mq} min={10} max={1000} step={10} onChange={setMq} format={(v) => `${formatNumber(v)} m²`} />
          <Range id={`${uid}-c`} label="Costo stoccaggio (€/m² · mese)" value={costoMq} min={3} max={25} step={1} onChange={setCostoMq} format={(v) => `${v} €`} />
        </div>
        <div className="grid grid-cols-2 gap-3 self-start">
          <Result label="Costo al mese" value={formatEuro(costoMese, true)} tone="signal" />
          <Result label="Costo all'anno" value={formatEuro(costoAnno, true)} tone="signal" />
          <Result label="Liquidità recuperabile" value={formatEuro(recupero, true)} tone="brand" />
          <Result label="Netto dopo commissione" value={formatEuro(netto, true)} tone="verified" />
          <div className="col-span-2 rounded-lg bg-surface-2 p-3 text-xs text-muted">
            Stima indicativa. Rimettendo in circolo le scorte liberi spazio, tagli i
            costi di stoccaggio e trasformi l&apos;immobilizzo in liquidità.
          </div>
        </div>
      </div>
      <div className="border-t border-line px-5 py-4">
        <Link href="/venditore/pubblica" className="btn btn-primary btn-sm">
          Pubblica un lotto <IconArrowRight width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stima trasporto: costo indicativo per spedire o far ritirare un lotto.
// ---------------------------------------------------------------------------

const cargo = [
  { key: "bancali", label: "Bancali", per: 14 },
  { key: "colli", label: "Colli", per: 4 },
  { key: "sfuso", label: "Sfuso/voluminoso", per: 22 },
];

export function TransportEstimator() {
  const uid = useId();
  const [tipo, setTipo] = useState("bancali");
  const [qta, setQta] = useState(8);
  const [km, setKm] = useState(250);

  const per = cargo.find((c) => c.key === tipo)!.per;
  const corriere = Math.round(48 + qta * per + km * 0.32);
  const ritiro = Math.round(corriere * 0.82); // ritiro assistito ~ -18%

  return (
    <div className="card card-soft overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-5 py-4">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-steel-soft text-steel">
          <IconTruck width={18} height={18} />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-ink">Stima trasporto e ritiro</h3>
          <p className="text-xs text-muted">Confronta corriere convenzionato e ritiro assistito Scortvia.</p>
        </div>
      </div>
      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="field-label">Tipo di merce</label>
            <div className="grid grid-cols-3 gap-2">
              {cargo.map((c) => (
                <button key={c.key} onClick={() => setTipo(c.key)} className={`rounded-lg border p-2 text-xs font-semibold transition-colors ${tipo === c.key ? "border-brand bg-brand-soft/40 text-brand-dark" : "border-line text-ink-soft hover:bg-surface-2"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <Range id={`${uid}-q`} label="Quantità" value={qta} min={1} max={33} step={1} onChange={setQta} format={(v) => formatNumber(v)} />
          <Range id={`${uid}-k`} label="Distanza" value={km} min={20} max={1200} step={10} onChange={setKm} format={(v) => `${formatNumber(v)} km`} />
        </div>
        <div className="space-y-3 self-start">
          <div className="flex items-center justify-between rounded-lg border border-line p-4">
            <div>
              <p className="text-sm font-semibold text-ink">Corriere convenzionato</p>
              <p className="text-xs text-muted">Consegna su bancale</p>
            </div>
            <p className="font-display text-xl font-extrabold text-ink">{formatEuro(corriere, true)}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-brand bg-brand-soft/30 p-4">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-dark">
                <IconRecycle width={15} height={15} /> Ritiro assistito Scortvia
              </p>
              <p className="text-xs text-muted">Ritiro programmato, meno emissioni</p>
            </div>
            <p className="font-display text-xl font-extrabold text-brand">{formatEuro(ritiro, true)}</p>
          </div>
          <p className="text-xs text-muted">Stime indicative simulate. IVA esclusa.</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sotto-componenti
// ---------------------------------------------------------------------------

function Range({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="field-label !mb-0">{label}</label>
        <span className="mono text-sm font-semibold text-ink">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--s-brand)]"
      />
    </div>
  );
}

function Result({ label, value, tone }: { label: string; value: string; tone: "brand" | "signal" | "verified" }) {
  const cls =
    tone === "brand"
      ? "bg-brand-soft text-brand-dark"
      : tone === "verified"
        ? "bg-verified-soft text-verified"
        : "bg-signal-soft text-signal";
  return (
    <div className={`rounded-lg p-3 ${cls}`}>
      <p className="text-[0.7rem] font-medium uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-0.5 font-display text-lg font-extrabold">{value}</p>
    </div>
  );
}
