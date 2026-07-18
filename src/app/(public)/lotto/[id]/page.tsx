import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LotGallery from "@/components/LotGallery";
import LotActions from "@/components/LotActions";
import LotCard from "@/components/LotCard";
import { ConditionChip, RatingStars, VerifiedBadge } from "@/components/badges";
import {
  IconCheck,
  IconDoc,
  IconMapPin,
  IconShield,
  IconStore,
  IconTruck,
} from "@/components/icons";
import {
  categoryName,
  companyById,
  lots,
  lotById,
  lotTotal,
  reviewsForCompany,
} from "@/lib/mock-data";
import { formatDate, formatEuro, formatNumber } from "@/lib/format";

export function generateStaticParams() {
  return lots.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lot = lotById(id);
  return { title: lot?.title ?? "Lotto" };
}

export default async function LotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lot = lotById(id);
  if (!lot) notFound();

  const seller = companyById(lot.sellerId)!;
  const reviews = reviewsForCompany(seller.id);
  const related = lots
    .filter((l) => l.category === lot.category && l.id !== lot.id)
    .slice(0, 3);

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted">
        <Link href="/marketplace" className="hover:text-brand-dark">Marketplace</Link>
        <span>/</span>
        <Link
          href={`/marketplace?categoria=${lot.category}`}
          className="hover:text-brand-dark"
        >
          {categoryName(lot.category)}
        </Link>
        <span>/</span>
        <span className="text-ink">{lot.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Colonna sinistra */}
        <div>
          <LotGallery category={lot.category} seed={lot.imageSeed} />

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="chip bg-surface-2 text-ink-soft">
              {categoryName(lot.category)}
            </span>
            <ConditionChip condition={lot.condition} />
            <span className="chip bg-steel-soft text-steel">
              {lot.saleMode === "immediato"
                ? "Acquisto immediato"
                : lot.saleMode === "negoziabile"
                  ? "Offerta negoziabile"
                  : "Acquisto o offerta"}
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-bold text-ink md:text-3xl">
            {lot.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted">
            <IconMapPin width={16} height={16} /> {lot.city}, {lot.region}
            <span className="mx-1">·</span>
            Pubblicato il {formatDate(lot.publishedAt)}
            <span className="mx-1">·</span>
            {formatNumber(lot.views)} visualizzazioni
          </p>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-ink">Descrizione tecnica</h2>
            <p className="mt-2 leading-relaxed text-ink-soft">{lot.description}</p>
          </section>

          {/* Specifiche */}
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-ink">Specifiche del lotto</h2>
            <dl className="mt-3 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {[
                ["Quantità disponibile", `${formatNumber(lot.quantity)} ${lot.unit}`],
                ["Quantità minima acquistabile", `${formatNumber(lot.minQuantity)} ${lot.unit}`],
                ["Prezzo unitario", formatEuro(lot.unitPrice)],
                ["Prezzo totale del lotto", formatEuro(lotTotal(lot))],
                ["Stato della merce", lot.condition],
                ["Località", `${lot.city}, ${lot.region}`],
                ["Spedizione", lot.shipping ? "Disponibile" : "Non disponibile"],
                ["Ritiro in sede", lot.pickup ? "Disponibile" : "Non disponibile"],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface px-4 py-3">
                  <dt className="text-xs text-muted">{k}</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Documenti e certificazioni */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="card p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <IconDoc width={16} height={16} /> Documenti disponibili
              </h3>
              <ul className="mt-3 space-y-2">
                {lot.documents.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-ink-soft">
                    <IconDoc width={15} height={15} className="text-muted" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <IconShield width={16} height={16} /> Certificazioni
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {lot.certifications.map((c) => (
                  <li key={c} className="chip bg-brand-soft text-brand-dark">
                    <IconCheck width={13} height={13} /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Logistica */}
          <section className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="card flex items-start gap-3 p-4">
              <IconTruck className="mt-0.5 shrink-0 text-steel" />
              <div>
                <p className="text-sm font-semibold text-ink">Spedizione</p>
                <p className="text-sm text-muted">
                  {lot.shipping
                    ? "Consegna su bancale tramite corriere convenzionato."
                    : "Non prevista per questo lotto."}
                </p>
              </div>
            </div>
            <div className="card flex items-start gap-3 p-4">
              <IconStore className="mt-0.5 shrink-0 text-steel" />
              <div>
                <p className="text-sm font-semibold text-ink">Ritiro in sede</p>
                <p className="text-sm text-muted">
                  {lot.pickup
                    ? `Ritiro su appuntamento a ${lot.city}.`
                    : "Non disponibile per questo lotto."}
                </p>
              </div>
            </div>
          </section>

          {/* Recensioni */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">
                Recensioni del venditore
              </h2>
              {reviews.length > 0 && (
                <RatingStars value={seller.rating} count={seller.reviewsCount} />
              )}
            </div>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                Nessuna recensione ancora disponibile per questo venditore.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-ink">{r.title}</p>
                      <RatingStars value={r.rating} />
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">{r.body}</p>
                    <p className="mt-2 text-xs text-muted">
                      {r.authorCompany} · {formatDate(r.date)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Colonna destra: prezzo + azioni + venditore */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="card card-soft p-5">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-muted">Prezzo unitario</p>
                <p className="text-3xl font-bold text-ink">
                  {formatEuro(lot.unitPrice)}
                  <span className="text-base font-normal text-muted">/{lot.unit}</span>
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2.5 text-sm">
              <span className="text-muted">Valore totale lotto</span>
              <span className="font-bold text-brand-dark">
                {formatEuro(lotTotal(lot))}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              {formatNumber(lot.quantity)} {lot.unit} disponibili · minimo{" "}
              {formatNumber(lot.minQuantity)} {lot.unit}
            </p>

            <div className="mt-4">
              <LotActions lot={lot} />
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <IconShield width={14} height={14} className="text-brand" />
              Pagamento simulato protetto tramite partner fino alla consegna.
            </p>
          </div>

          {/* Venditore */}
          <div className="card mt-4 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Venditore
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-steel-soft font-bold text-steel">
                {seller.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <Link
                  href={`/venditore`}
                  className="block truncate font-semibold text-ink hover:text-brand-dark"
                >
                  {seller.name}
                </Link>
                <p className="truncate text-xs text-muted">{seller.sector}</p>
              </div>
            </div>
            <div className="mt-3">
              <VerifiedBadge />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Valutazione</dt>
                <dd>
                  <RatingStars value={seller.rating} count={seller.reviewsCount} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Vendite concluse</dt>
                <dd className="font-semibold text-ink">{seller.salesCount}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Sede</dt>
                <dd className="font-semibold text-ink">{seller.city}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Su Scortvia dal</dt>
                <dd className="font-semibold text-ink">
                  {new Date(seller.memberSince).getFullYear()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Lotti correlati */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-ink">Lotti simili</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((l) => (
              <LotCard key={l.id} lot={l} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
