import { PageTitle, SectionCard, StatCard } from "@/components/dash";
import { IconChart, IconTag, IconTruck, IconWallet } from "@/components/icons";
import { lots, lotTotal } from "@/lib/mock-data";
import { formatEuro, formatNumber } from "@/lib/format";

const SELLER = "co-metalfer";

const monthly = [
  ["Feb", 4200],
  ["Mar", 6100],
  ["Apr", 5400],
  ["Mag", 7300],
  ["Giu", 8900],
  ["Lug", 6450],
] as const;

export default function StatistichePage() {
  const myLots = lots.filter((l) => l.sellerId === SELLER);
  const max = Math.max(...monthly.map((m) => m[1]));
  const topLots = [...myLots].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <>
      <PageTitle title="Statistiche" subtitle="Andamento delle vendite e performance dei lotti." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ricavi 6 mesi" value={formatEuro(38350, true)} icon={<IconWallet width={18} height={18} />} />
        <StatCard label="Tasso di conversione offerte" value="42%" icon={<IconTag width={18} height={18} />} accent="steel" />
        <StatCard label="Tempo medio di vendita" value="9 giorni" icon={<IconTruck width={18} height={18} />} accent="signal" />
        <StatCard label="Visualizzazioni totali" value={formatNumber(myLots.reduce((s, l) => s + l.views, 0))} icon={<IconChart width={18} height={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Ricavi mensili (€)">
          <div className="flex h-56 items-end gap-3">
            {monthly.map(([m, v]) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-brand"
                    style={{ height: `${(v / max) * 100}%` }}
                    title={formatEuro(v)}
                  />
                </div>
                <span className="text-xs text-muted">{m}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Lotti più visti">
          <div className="space-y-3">
            {topLots.map((l) => {
              const maxViews = topLots[0].views;
              return (
                <div key={l.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2 text-ink">{l.title}</span>
                    <span className="shrink-0 font-semibold text-ink">{formatNumber(l.views)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface-2">
                    <div
                      className="h-2 rounded-full bg-steel"
                      style={{ width: `${(l.views / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Valore del catalogo per lotto">
          <div className="grid gap-2 sm:grid-cols-2">
            {myLots.map((l) => (
              <div key={l.id} className="flex items-center justify-between rounded-lg bg-surface-2/60 px-3 py-2 text-sm">
                <span className="truncate pr-2 text-ink">{l.title}</span>
                <span className="shrink-0 font-semibold text-brand-dark">{formatEuro(lotTotal(l), true)}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
