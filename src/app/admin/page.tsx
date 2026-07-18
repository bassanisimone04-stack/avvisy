import Link from "next/link";
import { PageTitle, SectionCard, StatCard } from "@/components/dash";
import { VerificationChip } from "@/components/badges";
import {
  IconBox,
  IconShield,
  IconVerified,
  IconWallet,
} from "@/components/icons";
import { companies, lots, lotTotal, orders } from "@/lib/mock-data";
import { commission, formatEuro } from "@/lib/format";

export default function AdminOverview() {
  const pendingCompanies = companies.filter((c) => c.status === "in_verifica");
  const verified = companies.filter((c) => c.status === "verificata");
  const gmv = orders.reduce((s, o) => s + o.quantity * o.unitPrice, 0);
  const fees = orders.reduce((s, o) => s + commission(o.quantity * o.unitPrice), 0);
  const catalogue = lots.reduce((s, l) => s + lotTotal(l), 0);

  return (
    <>
      <PageTitle
        title="Panoramica piattaforma"
        subtitle="Controllo delle aziende, degli annunci e delle transazioni simulate."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Aziende verificate" value={String(verified.length)} sub={`${pendingCompanies.length} in verifica`} icon={<IconVerified width={18} height={18} />} />
        <StatCard label="Annunci pubblicati" value={String(lots.length)} sub={`${formatEuro(catalogue, true)} a catalogo`} icon={<IconBox width={18} height={18} />} accent="steel" />
        <StatCard label="Volume transato (GMV)" value={formatEuro(gmv, true)} sub={`${orders.length} ordini`} icon={<IconWallet width={18} height={18} />} accent="signal" />
        <StatCard label="Commissioni maturate" value={formatEuro(fees)} sub="2,5% sul concluso" icon={<IconWallet width={18} height={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Aziende in verifica"
          action={<Link href="/admin/aziende" className="text-sm font-semibold text-brand-dark hover:underline">Gestisci</Link>}
        >
          {pendingCompanies.length === 0 ? (
            <p className="text-sm text-muted">Nessuna azienda in attesa.</p>
          ) : (
            <div className="space-y-3">
              {pendingCompanies.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{c.name}</p>
                    <p className="truncate text-xs text-muted">{c.vatNumber} · {c.city}</p>
                  </div>
                  <VerificationChip status={c.status} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Stato piattaforma">
          <ul className="space-y-3 text-sm">
            {[
              [IconShield, "Verifica KYB", "Operativa (simulata)"],
              [IconWallet, "Partner di pagamento", "Connesso (sandbox)"],
              [IconBox, "Coda moderazione annunci", "2 in attesa"],
            ].map(([Icon, k, v]) => {
              const I = Icon as typeof IconShield;
              return (
                <li key={k as string} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-ink-soft">
                    <I width={16} height={16} className="text-muted" /> {k as string}
                  </span>
                  <span className="chip bg-brand-soft text-brand-dark">{v as string}</span>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
