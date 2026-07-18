import { PageTitle } from "@/components/dash";
import ModerationList, { type ModItem } from "@/components/ModerationList";
import { companyById, lots } from "@/lib/mock-data";
import { formatEuro } from "@/lib/format";
import { lotTotal } from "@/lib/mock-data";

export default function AdminListingsPage() {
  // I due annunci più recenti sono trattati come "in moderazione".
  const pending = [...lots]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 3);

  const items: ModItem[] = pending.map((l) => ({
    id: l.id,
    title: l.title,
    subtitle: `${companyById(l.sellerId)?.name} · ${l.city}`,
    meta: `Valore ${formatEuro(lotTotal(l), true)} · ${l.condition}`,
    badge: { text: "In moderazione", tone: "signal" },
  }));

  return (
    <>
      <PageTitle
        title="Annunci"
        subtitle="Modera i nuovi lotti prima della pubblicazione definitiva."
      />
      <ModerationList items={items} approveLabel="Pubblica" rejectLabel="Blocca" approvedLabel="Pubblicato" rejectedLabel="Bloccato" />
    </>
  );
}
