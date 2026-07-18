import { PageTitle } from "@/components/dash";
import ModerationList, { type ModItem } from "@/components/ModerationList";

const items: ModItem[] = [
  {
    id: "d1",
    title: "Controversia ORD-2026-0151",
    subtitle: "Il compratore contesta la quantità ricevuta di bancali EPAL.",
    meta: "LogiNord Distribuzione Srl vs PackItalia Imballaggi Srl · aperta 2 giorni fa",
    badge: { text: "In istruttoria", tone: "signal" },
  },
  {
    id: "d2",
    title: "Controversia ORD-2026-0139",
    subtitle: "Ritardo nella spedizione dei cuscinetti SKF.",
    meta: "Officine Meccaniche Ferraris Srl vs Metalfer Componenti Srl · aperta 5 giorni fa",
    badge: { text: "In attesa venditore", tone: "steel" },
  },
];

export default function AdminDisputesPage() {
  return (
    <>
      <PageTitle
        title="Controversie"
        subtitle="Media le controversie tra compratori e venditori sulle transazioni simulate."
      />
      <ModerationList
        items={items}
        approveLabel="Risolvi a favore compratore"
        rejectLabel="Risolvi a favore venditore"
        approvedLabel="Chiusa (compratore)"
        rejectedLabel="Chiusa (venditore)"
      />
    </>
  );
}
