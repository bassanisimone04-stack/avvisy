"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import LotCard from "@/components/LotCard";
import { RatingStars, VerificationChip } from "@/components/badges";
import { EmptyState } from "@/components/dash";
import { notify } from "@/components/Toaster";
import {
  IconBox,
  IconMapPin,
  IconMessage,
  IconShield,
  IconVerified,
} from "@/components/icons";
import { reviewsForCompany } from "@/lib/mock-data";
import { formatDate } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function CompanyPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const company = state.companies.find((c) => c.id === id);
  if (!company) return notFound();

  const published = state.lots.filter((l) => l.sellerId === company.id && l.status === "Pubblicato");
  const reviews = reviewsForCompany(company.id);

  return (
    <>
      {/* Intestazione */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="absolute inset-0 blueprint opacity-60" aria-hidden />
        <div className="container-page relative py-10">
          <nav className="mb-5 flex items-center gap-1.5 text-sm text-muted">
            <Link href="/marketplace" className="hover:text-brand-dark">Marketplace</Link>
            <span>/</span>
            <span className="text-ink">Azienda</span>
          </nav>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-steel text-2xl font-extrabold text-white">
              {company.logo}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">{company.displayName}</h1>
                <VerificationChip status={company.verification} />
              </div>
              <p className="mt-1 mono text-sm text-muted">{company.ragioneSociale} · P.IVA {company.vatNumber}</p>
              <p className="mt-3 max-w-2xl text-ink-soft">{company.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-1"><IconMapPin width={15} height={15} /> {company.province}, {company.region}</span>
                <span>{company.sector}</span>
                <span>Fondata nel {company.foundedYear}</span>
                <span>{company.employees} dipendenti</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => notify("Richiesta di contatto inviata (simulata).")} className="btn btn-primary btn-sm">
                <IconMessage width={16} height={16} /> Contatta
              </button>
              <button onClick={() => notify("Azienda seguita (simulato).", "info")} className="btn btn-outline btn-sm">Segui</button>
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {[
              ["Lotti pubblicati", String(published.length)],
              ["Vendite concluse", String(company.salesCount)],
              ["Valutazione", company.reviewsCount > 0 ? `${company.rating.toFixed(1)} / 5` : "—"],
              ["Su Scortvia dal", String(new Date(company.registeredAt).getFullYear())],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface px-4 py-4">
                <dt className="mono text-[0.68rem] uppercase tracking-wide text-muted">{k}</dt>
                <dd className="mt-1 font-display text-xl font-extrabold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-xl font-extrabold text-ink">Lotti pubblicati</h2>
          {published.length === 0 ? (
            <div className="card mt-4">
              <EmptyState icon={<IconBox />} title="Nessun lotto pubblicato" text="Questa azienda non ha lotti attivi al momento." />
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {published.map((l) => <LotCard key={l.id} lot={l} />)}
            </div>
          )}

          <h2 className="mt-12 text-xl font-extrabold text-ink">Recensioni ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Nessuna recensione disponibile.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {reviews.map((r) => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-ink">{r.title}</p>
                    <RatingStars value={r.rating} />
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{r.body}</p>
                  <p className="mt-2 text-xs text-muted">{r.authorCompany} · {formatDate(r.date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <IconShield className="text-verified" width={18} height={18} />
              <p className="font-display text-sm font-bold text-ink">Verifica KYB</p>
            </div>
            <div className="mt-3"><VerificationChip status={company.verification} /></div>
            <p className="mt-3 text-sm text-muted">Documenti confermati (simulati):</p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
              {company.verifiedDocuments.length ? company.verifiedDocuments.map((d) => (
                <li key={d} className="flex items-center gap-2"><IconVerified width={15} height={15} className="text-verified" /> {d}</li>
              )) : <li className="text-muted">Nessun documento verificato.</li>}
            </ul>
          </div>
          <div className="card p-5">
            <p className="mono text-[0.68rem] uppercase tracking-wide text-muted">Sede</p>
            <p className="mt-1 text-sm text-ink">{company.address}</p>
            {company.reviewsCount > 0 && (
              <div className="mt-4 border-t border-line pt-3">
                <RatingStars value={company.rating} count={company.reviewsCount} />
              </div>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
