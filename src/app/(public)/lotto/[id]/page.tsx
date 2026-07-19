"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import LotGallery from "@/components/LotGallery";
import LotActions from "@/components/LotActions";
import LotCard from "@/components/LotCard";
import { ConditionChip, LotStatusPill, RatingStars, VerifiedBadge } from "@/components/badges";
import {
  IconCheck,
  IconDoc,
  IconMapPin,
  IconShield,
  IconStore,
  IconTag,
  IconTruck,
} from "@/components/icons";
import { categoryName, companyById, reviewsForCompany } from "@/lib/mock-data";
import { commission, commissionRateLabel, daysUntil, formatDate, formatEuro, formatNumber } from "@/lib/format";
import { lotTotal } from "@/lib/types";
import { useStore } from "@/lib/store";
import { similarLots } from "@/lib/services";

export default function LotPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useStore();
  const lot = state.lots.find((l) => l.id === id);
  const [qty, setQty] = useState<number | null>(null);

  const related = useMemo(
    () => (lot ? similarLots(state.lots, lot) : []),
    [state.lots, lot],
  );
  const lotOffers = useMemo(
    () => (lot ? state.offers.filter((o) => o.lotId === lot.id) : []),
    [state.offers, lot],
  );

  if (!lot) return notFound();

  const seller = companyById(lot.sellerId)!;
  const reviews = reviewsForCompany(seller.id);
  const selectedQty = qty ?? lot.minQuantity;
  const dynamicTotal = selectedQty * lot.unitPrice;
  const expiryDays = daysUntil(lot.expiresAt);

  return (
    <div className="container-page py-8 pb-24 lg:pb-8">
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/marketplace" className="hover:text-brand-dark">Marketplace</Link>
        <span>/</span>
        <Link href={`/marketplace?categoria=${lot.category}`} className="hover:text-brand-dark">
          {categoryName(lot.category)}
        </Link>
        <span>/</span>
        <span className="text-ink">{lot.code}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <LotGallery category={lot.category} seed={lot.images[0] ?? 1} />

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="chip bg-surface-2 text-ink-soft">{categoryName(lot.category)}</span>
            <span className="chip bg-surface-2 text-ink-soft">{lot.subcategory}</span>
            <ConditionChip condition={lot.condition} />
            {lot.negotiable && <span className="chip bg-steel-soft text-steel">Prezzo negoziabile</span>}
            {lot.status !== "Pubblicato" && <LotStatusPill status={lot.status} />}
          </div>

          <div className="mt-3 flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-ink md:text-3xl">{lot.title}</h1>
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
            <span className="font-mono text-sm">{lot.code}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><IconMapPin width={16} height={16} /> {lot.province}, {lot.region}</span>
            <span>·</span>
            <span>Pubblicato il {formatDate(lot.publishedAt)}</span>
            <span>·</span>
            <span>{formatNumber(lot.views)} visualizzazioni</span>
          </p>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-ink">Descrizione tecnica</h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{lot.description}</p>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-ink">Specifiche del lotto</h2>
            <dl className="mt-3 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {[
                ["Quantità disponibile", `${formatNumber(lot.quantity)} ${lot.unit}`],
                ["Quantità minima", `${formatNumber(lot.minQuantity)} ${lot.unit}`],
                ["Prezzo unitario", formatEuro(lot.unitPrice)],
                ["Prezzo totale del lotto", formatEuro(lotTotal(lot))],
                ["Stato della merce", lot.condition],
                ["Modalità di consegna", lot.delivery],
                ["Località", `${lot.province}, ${lot.region}`],
                ["Scadenza annuncio", `${formatDate(lot.expiresAt)}${expiryDays >= 0 ? ` (${expiryDays} gg)` : ""}`],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface px-4 py-3">
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="card p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <IconDoc width={16} height={16} /> Documenti disponibili
              </h3>
              {lot.documents.length === 0 ? (
                <p className="mt-3 text-sm text-muted">Nessun documento allegato.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {lot.documents.map((d) => (
                    <li key={d} className="flex items-center justify-between text-sm text-ink-soft">
                      <span className="flex items-center gap-2">
                        <IconDoc width={15} height={15} className="text-muted" /> {d}
                      </span>
                      <button
                        onClick={(e) => { e.preventDefault(); }}
                        className="text-xs font-semibold text-brand-dark hover:underline"
                      >
                        Scarica
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <IconShield width={16} height={16} /> Certificazioni
              </h3>
              {lot.certifications.length === 0 ? (
                <p className="mt-3 text-sm text-muted">Nessuna certificazione indicata.</p>
              ) : (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {lot.certifications.map((c) => (
                    <li key={c} className="chip bg-brand-soft text-brand-dark">
                      <IconCheck width={13} height={13} /> {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="card flex items-start gap-3 p-4">
              <IconTruck className="mt-0.5 shrink-0 text-steel" />
              <div>
                <p className="text-sm font-semibold text-ink">Spedizione</p>
                <p className="text-sm text-muted">
                  {lot.delivery !== "Ritiro in sede" ? "Consegna su bancale tramite corriere convenzionato." : "Non prevista per questo lotto."}
                </p>
              </div>
            </div>
            <div className="card flex items-start gap-3 p-4">
              <IconStore className="mt-0.5 shrink-0 text-steel" />
              <div>
                <p className="text-sm font-semibold text-ink">Ritiro in sede</p>
                <p className="text-sm text-muted">
                  {lot.delivery !== "Spedizione" ? `Ritiro su appuntamento a ${lot.province}.` : "Non disponibile per questo lotto."}
                </p>
              </div>
            </div>
          </section>

          {/* Cronologia offerte */}
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
              <IconTag width={18} height={18} /> Cronologia offerte
            </h2>
            {lotOffers.length === 0 ? (
              <p className="mt-2 text-sm text-muted">Nessuna offerta ricevuta finora su questo lotto.</p>
            ) : (
              <div className="mt-3 overflow-hidden rounded-xl border border-line">
                {lotOffers.map((o, i) => (
                  <div key={o.id} className={`flex items-center justify-between gap-3 px-4 py-2.5 text-sm ${i > 0 ? "border-t border-line" : ""}`}>
                    <span className="text-muted">{formatDate(o.date)}</span>
                    <span className="text-ink">
                      {formatEuro(o.unitPrice)}/{lot.unit} × {formatNumber(o.quantity)}
                    </span>
                    <span className="font-semibold text-ink">{formatEuro(o.totalValue, true)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recensioni */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Recensioni del venditore</h2>
              {reviews.length > 0 && <RatingStars value={seller.rating} count={seller.reviewsCount} />}
            </div>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted">Nessuna recensione ancora disponibile per questo venditore.</p>
            ) : (
              <div className="mt-4 space-y-3">
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
          </section>
        </div>

        {/* Colonna destra */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="card card-soft p-5">
            <div>
              <p className="text-sm text-muted">Prezzo unitario</p>
              <p className="text-3xl font-bold text-ink">
                {formatEuro(lot.unitPrice)}
                <span className="text-base font-normal text-muted">/{lot.unit}</span>
              </p>
            </div>

            {/* Calcolo dinamico */}
            <div className="mt-4 rounded-lg border border-line p-3">
              <label className="field-label">Calcola il totale</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={lot.minQuantity}
                  max={lot.quantity}
                  value={selectedQty}
                  onChange={(e) => setQty(Math.max(lot.minQuantity, Math.min(lot.quantity, Number(e.target.value) || 0)))}
                  className="field !py-2"
                  aria-label="Quantità per il calcolo"
                />
                <span className="text-sm text-muted">{lot.unit}</span>
              </div>
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotale</span>
                  <span className="font-semibold text-ink">{formatEuro(dynamicTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Commissione ({commissionRateLabel()})</span>
                  <span className="font-semibold text-ink">{formatEuro(commission(dynamicTotal))}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-1.5">
                  <span className="font-semibold text-ink">Totale stimato</span>
                  <span className="font-bold text-brand-dark">{formatEuro(dynamicTotal + commission(dynamicTotal))}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted">
              {formatNumber(lot.quantity)} {lot.unit} disponibili · minimo {formatNumber(lot.minQuantity)} {lot.unit}
            </p>

            <div className="mt-4">
              <LotActions lot={lot} />
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <IconShield width={14} height={14} className="text-brand" />
              Pagamento simulato protetto tramite partner fino alla consegna.
            </p>
          </div>

          <div className="card mt-4 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Venditore</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-steel-soft font-bold text-steel">
                {seller.logo}
              </span>
              <div className="min-w-0">
                <Link href={`/azienda/${seller.id}`} className="block truncate font-semibold text-ink hover:text-brand-dark">
                  {seller.displayName}
                </Link>
                <p className="truncate text-xs text-muted">{seller.sector}</p>
              </div>
            </div>
            <div className="mt-3">
              {seller.verification === "Verificata" ? (
                <VerifiedBadge />
              ) : (
                <span className="chip bg-signal-soft text-signal">{seller.verification}</span>
              )}
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Valutazione</dt>
                <dd>{seller.reviewsCount > 0 ? <RatingStars value={seller.rating} count={seller.reviewsCount} /> : <span className="text-muted">—</span>}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Vendite concluse</dt>
                <dd className="font-semibold text-ink">{seller.salesCount}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Sede</dt>
                <dd className="font-semibold text-ink">{seller.province}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Su Scortvia dal</dt>
                <dd className="font-semibold text-ink">{new Date(seller.registeredAt).getFullYear()}</dd>
              </div>
            </dl>
            <Link href={`/azienda/${seller.id}`} className="btn btn-outline btn-sm mt-4 w-full">
              Vedi profilo azienda
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink">Prodotti simili</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => <LotCard key={l.id} lot={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
