"use client";

import { PageTitle, SectionCard } from "@/components/dash";
import { RatingStars, VerificationChip } from "@/components/badges";
import { IconShield } from "@/components/icons";
import { reviewsForCompany } from "@/lib/mock-data";
import { formatDate, formatEuro } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ProfiloVenditorePage() {
  const { currentSeller: c } = useStore();
  const revs = reviewsForCompany(c.id);

  return (
    <>
      <PageTitle title="Profilo aziendale" subtitle="I dati visibili ai compratori sul marketplace." />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <SectionCard title="Dati azienda">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Ragione sociale" value={c.ragioneSociale} />
              <Field label="Nome visualizzato" value={c.displayName} />
              <Field label="Partita IVA" value={c.vatNumber} />
              <Field label="Settore" value={c.sector} />
              <Field label="Sede" value={`${c.address}`} />
              <Field label="Anno di fondazione" value={String(c.foundedYear)} />
            </div>
            <div>
              <label className="field-label">Descrizione pubblica</label>
              <textarea rows={3} defaultValue={c.description} className="field resize-none" />
            </div>
            <button className="btn btn-primary btn-sm">Salva modifiche</button>
          </SectionCard>

          <SectionCard title={`Recensioni ricevute (${revs.length})`}>
            {revs.length === 0 ? (
              <p className="text-sm text-muted">Nessuna recensione ricevuta finora.</p>
            ) : (
              <div className="space-y-3">
                {revs.map((r) => (
                  <div key={r.id} className="rounded-lg bg-surface-2/60 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">{r.title}</p>
                      <RatingStars value={r.rating} />
                    </div>
                    <p className="mt-1 text-sm text-muted">{r.body}</p>
                    <p className="mt-1 text-xs text-muted">{r.authorCompany} · {formatDate(r.date)}</p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-4">
          <div className="card p-5 text-center">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-xl bg-steel-soft text-xl font-bold text-steel">{c.logo}</span>
            <h2 className="mt-3 font-bold text-ink">{c.displayName}</h2>
            <div className="mt-2 flex justify-center"><VerificationChip status={c.verification} /></div>
            {c.reviewsCount > 0 && (
              <div className="mt-3 flex justify-center"><RatingStars value={c.rating} count={c.reviewsCount} /></div>
            )}
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <IconShield className="text-brand" width={18} height={18} />
              <p className="text-sm font-semibold text-ink">Stato verifica KYB</p>
            </div>
            <p className="mt-2 text-sm text-muted">Verifica simulata. Documenti confermati:</p>
            <ul className="mt-2 space-y-1 text-sm text-ink-soft">
              {c.verifiedDocuments.length ? c.verifiedDocuments.map((d) => <li key={d}>• {d}</li>) : <li className="text-muted">Nessun documento verificato.</li>}
            </ul>
            <dl className="mt-4 space-y-2 text-sm">
              <Row k="Dipendenti" v={c.employees} />
              <Row k="Vendite concluse" v={String(c.salesCount)} />
              <Row k="Su Scortvia dal" v={formatDate(c.registeredAt)} />
              <Row k="Saldo simulato" v={formatEuro(c.walletBalance)} />
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input defaultValue={value} className="field" />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className="font-semibold text-ink">{v}</dd>
    </div>
  );
}
