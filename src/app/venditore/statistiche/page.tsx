"use client";

import { PageTitle, SectionCard, StatCard } from "@/components/dash";
import { IconChart, IconTag, IconTruck, IconWallet } from "@/components/icons";
import { DEMO_TODAY, formatEuro, formatNumber } from "@/lib/format";
import { lotTotal } from "@/lib/types";
import { useStore } from "@/lib/store";

const MONTHS = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];

export default function StatistichePage() {
  const { state, currentSellerId } = useStore();
  const myLots = state.lots.filter((l) => l.sellerId === currentSellerId);
  const myOrders = state.orders.filter((o) => o.sellerId === currentSellerId);
  const myOffers = state.offers.filter((o) => o.sellerId === currentSellerId);

  // KPI reali ------------------------------------------------------------
  const revenue = myOrders.reduce((s, o) => s + o.subtotal, 0);

  const acceptedOffers = myOffers.filter((o) => o.status === "Accettata").length;
  const conversion = myOffers.length ? Math.round((acceptedOffers / myOffers.length) * 100) : 0;

  const saleTimes: number[] = [];
  for (const o of myOrders) {
    const lot = state.lots.find((l) => l.id === o.lotId);
    if (!lot) continue;
    const d1 = Date.parse(lot.publishedAt);
    const d2 = Date.parse(o.date);
    if (!Number.isNaN(d1) && !Number.isNaN(d2) && d2 >= d1) {
      saleTimes.push(Math.round((d2 - d1) / 86_400_000));
    }
  }
  const avgDays = saleTimes.length
    ? Math.round(saleTimes.reduce((a, b) => a + b, 0) / saleTimes.length)
    : null;

  const totalViews = myLots.reduce((s, l) => s + l.views, 0);

  // Ricavi mensili (ultimi 6 mesi, calcolo deterministico) ---------------
  const [baseYear, baseMonth] = DEMO_TODAY.split("-").map(Number);
  const buckets: { key: string; label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    let mm = baseMonth - 1 - i;
    let yy = baseYear;
    while (mm < 0) {
      mm += 12;
      yy -= 1;
    }
    buckets.push({ key: `${yy}-${String(mm + 1).padStart(2, "0")}`, label: MONTHS[mm], value: 0 });
  }
  for (const o of myOrders) {
    const b = buckets.find((x) => x.key === o.date.slice(0, 7));
    if (b) b.value += o.subtotal;
  }
  const maxBar = Math.max(1, ...buckets.map((b) => b.value));

  const topLots = [...myLots].sort((a, b) => b.views - a.views).slice(0, 5);

  return (
    <>
      <PageTitle title="Statistiche" subtitle="Andamento delle vendite e performance dei lotti." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ricavi totali" value={formatEuro(revenue, true)} sub={`${myOrders.length} ordini`} icon={<IconWallet width={18} height={18} />} />
        <StatCard label="Conversione offerte" value={`${conversion}%`} sub={`${acceptedOffers}/${myOffers.length} accettate`} icon={<IconTag width={18} height={18} />} accent="steel" />
        <StatCard label="Tempo medio di vendita" value={avgDays !== null ? `${avgDays} giorni` : "—"} icon={<IconTruck width={18} height={18} />} accent="signal" />
        <StatCard label="Visualizzazioni totali" value={formatNumber(totalViews)} icon={<IconChart width={18} height={18} />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Ricavi mensili (€)">
          {revenue === 0 ? (
            <p className="text-sm text-muted">Nessun ordine ancora registrato: i ricavi appariranno qui dopo le prime vendite.</p>
          ) : (
            <div className="flex h-56 items-end gap-3">
              {buckets.map((b) => (
                <div key={b.key} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t-md bg-brand"
                      style={{ height: `${(b.value / maxBar) * 100}%` }}
                      title={formatEuro(b.value)}
                    />
                  </div>
                  <span className="text-xs text-muted">{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Lotti più visti">
          {topLots.length === 0 ? (
            <p className="text-sm text-muted">Nessun lotto pubblicato.</p>
          ) : (
            <div className="space-y-3">
              {topLots.map((l) => {
                const maxViews = Math.max(1, topLots[0].views);
                return (
                  <div key={l.id}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="truncate pr-2 text-ink">{l.title}</span>
                      <span className="shrink-0 font-semibold text-ink">{formatNumber(l.views)}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-surface-2">
                      <div className="h-2 rounded-full bg-steel" style={{ width: `${(l.views / maxViews) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard title="Valore del catalogo per lotto">
          {myLots.length === 0 ? (
            <p className="text-sm text-muted">Nessun lotto a catalogo.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {myLots.map((l) => (
                <div key={l.id} className="flex items-center justify-between rounded-lg bg-surface-2/60 px-3 py-2 text-sm">
                  <span className="truncate pr-2 text-ink">{l.title}</span>
                  <span className="shrink-0 font-semibold text-brand-dark">{formatEuro(lotTotal(l), true)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
