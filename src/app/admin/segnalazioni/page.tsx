import { PageTitle } from "@/components/dash";
import ModerationList, { type ModItem } from "@/components/ModerationList";

const items: ModItem[] = [
  {
    id: "r1",
    title: "Annuncio: descrizione fuorviante",
    subtitle: "Segnalato su “Pompe idrauliche a ingranaggi — ricondizionate”.",
    meta: "Segnalato da Manutenzioni Tecniche Alfa Srl · 2 giorni fa",
    badge: { text: "Media priorità", tone: "signal" },
  },
  {
    id: "r2",
    title: "Utente: comportamento sospetto",
    subtitle: "Richieste di pagamento fuori piattaforma.",
    meta: "Segnalato da PackItalia Imballaggi Srl · 3 giorni fa",
    badge: { text: "Alta priorità", tone: "danger" },
  },
  {
    id: "r3",
    title: "Annuncio: possibile duplicato",
    subtitle: "Due lotti identici pubblicati dallo stesso venditore.",
    meta: "Rilevato dal sistema · 4 giorni fa",
    badge: { text: "Bassa priorità", tone: "steel" },
  },
];

export default function AdminReportsPage() {
  return (
    <>
      <PageTitle title="Segnalazioni" subtitle="Gestisci le segnalazioni di utenti e annunci." />
      <ModerationList
        items={items}
        approveLabel="Chiudi come risolta"
        rejectLabel="Archivia"
        approvedLabel="Risolta"
        rejectedLabel="Archiviata"
      />
    </>
  );
}
