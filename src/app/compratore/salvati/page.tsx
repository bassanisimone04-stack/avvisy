import Link from "next/link";
import { PageTitle, EmptyState } from "@/components/dash";
import LotCard from "@/components/LotCard";
import { IconBox } from "@/components/icons";
import { savedLotIds } from "@/lib/buyer-data";
import { lotById } from "@/lib/mock-data";

export default function SavedLotsPage() {
  const saved = savedLotIds.map((id) => lotById(id)).filter(Boolean);
  return (
    <>
      <PageTitle title="Lotti salvati" subtitle="I lotti che hai messo da parte per una decisione successiva." />
      {saved.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<IconBox />}
            title="Nessun lotto salvato"
            text="Salva i lotti interessanti dal marketplace per ritrovarli qui."
            action={<Link href="/marketplace" className="btn btn-primary btn-sm">Esplora il marketplace</Link>}
          />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((l) => (
            <LotCard key={l!.id} lot={l!} />
          ))}
        </div>
      )}
    </>
  );
}
