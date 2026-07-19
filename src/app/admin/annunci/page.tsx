"use client";

import { PageTitle } from "@/components/dash";
import ModerationList, { type ModItem } from "@/components/ModerationList";
import { companyById } from "@/lib/mock-data";
import { formatEuro } from "@/lib/format";
import { lotTotal } from "@/lib/types";
import { useStore } from "@/lib/store";

export default function AdminListingsPage() {
  const { state } = useStore();
  const pending = state.lots
    .filter((l) => l.status === "In revisione")
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const items: ModItem[] = pending.map((l) => ({
    id: l.id,
    title: l.title,
    subtitle: `${companyById(l.sellerId)?.displayName ?? "Venditore"} · ${l.province}`,
    meta: `${l.code} · Valore ${formatEuro(lotTotal(l), true)} · ${l.condition}`,
    badge: { text: "In revisione", tone: "signal" },
  }));

  return (
    <>
      <PageTitle title="Annunci" subtitle="Modera i nuovi lotti prima della pubblicazione definitiva." />
      {items.length === 0 ? (
        <div className="card p-8 text-center text-sm text-muted">
          Nessun annuncio in attesa di moderazione. Pubblica un lotto dall&apos;area venditore per vederlo comparire qui.
        </div>
      ) : (
        <ModerationList items={items} approveLabel="Pubblica" rejectLabel="Blocca" approvedLabel="Pubblicato" rejectedLabel="Bloccato" />
      )}
    </>
  );
}
