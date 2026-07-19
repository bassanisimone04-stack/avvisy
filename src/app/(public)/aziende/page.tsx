"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { RatingStars, VerificationChip } from "@/components/badges";
import { IconArrowRight, IconMapPin, IconSearch } from "@/components/icons";
import { useStore } from "@/lib/store";

export default function AziendePage() {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const [region, setRegion] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const sectors = useMemo(
    () => Array.from(new Set(state.companies.map((c) => c.sector))).sort(),
    [state.companies],
  );
  const regions = useMemo(
    () => Array.from(new Set(state.companies.map((c) => c.region))).sort(),
    [state.companies],
  );

  const countLots = (id: string) =>
    state.lots.filter((l) => l.sellerId === id && l.status === "Pubblicato").length;

  const results = state.companies.filter((c) => {
    if (q.trim()) {
      const hay = `${c.displayName} ${c.ragioneSociale} ${c.sector}`.toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    if (sector && c.sector !== sector) return false;
    if (region && c.region !== region) return false;
    if (verifiedOnly && c.verification !== "Verificata") return false;
    return true;
  });

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="absolute inset-0 blueprint opacity-60" aria-hidden />
        <div className="container-page relative py-10">
          <span className="eyebrow">Directory aziende</span>
          <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Le aziende su Scortvia</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Esplora i venditori del marketplace: settore, sede, reputazione e
            stato di verifica. {state.companies.filter((c) => c.verification === "Verificata").length} aziende verificate su {state.companies.length}.
          </p>
        </div>
      </section>

      <section className="container-page py-8">
        {/* Filtri */}
        <div className="card card-soft mb-6 grid gap-3 p-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div className="flex items-center gap-2 rounded-lg bg-surface-2 px-3">
            <IconSearch className="text-muted" width={18} height={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca azienda o settore…"
              aria-label="Cerca azienda"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted"
            />
          </div>
          <select value={sector} onChange={(e) => setSector(e.target.value)} className="field !py-2 text-sm" aria-label="Settore">
            <option value="">Tutti i settori</option>
            {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="field !py-2 text-sm" aria-label="Regione">
            <option value="">Tutte le regioni</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <label className="flex items-center gap-2 rounded-lg px-3 text-sm text-ink-soft">
            <input type="checkbox" checked={verifiedOnly} onChange={() => setVerifiedOnly((v) => !v)} className="h-4 w-4 accent-[var(--s-brand)]" />
            Solo verificate
          </label>
        </div>

        <p className="mb-4 text-sm text-muted">
          <span className="font-semibold text-ink">{results.length}</span>{" "}
          {results.length === 1 ? "azienda trovata" : "aziende trovate"}
        </p>

        {results.length === 0 ? (
          <div className="card p-12 text-center text-sm text-muted">Nessuna azienda corrisponde ai filtri.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((c) => (
              <Link
                key={c.id}
                href={`/azienda/${c.id}`}
                className="card card-accent group p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-steel-btn text-lg font-extrabold text-white">
                      {c.logo}
                    </span>
                    <div>
                      <p className="font-display font-bold text-ink group-hover:text-brand-dark">{c.displayName}</p>
                      <p className="text-xs text-muted">{c.sector}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3"><VerificationChip status={c.verification} /></div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm">
                  <span className="flex items-center gap-1 text-muted">
                    <IconMapPin width={14} height={14} /> {c.province}
                  </span>
                  {c.reviewsCount > 0 ? (
                    <RatingStars value={c.rating} count={c.reviewsCount} />
                  ) : (
                    <span className="text-xs text-muted">Nuova azienda</span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="mono text-xs text-muted">{countLots(c.id)} lotti pubblicati</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-dark">
                    Profilo <IconArrowRight width={15} height={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
