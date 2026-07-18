import Link from "next/link";
import { PageTitle } from "@/components/dash";
import { IconBell, IconSearch } from "@/components/icons";
import { savedSearches } from "@/lib/buyer-data";

export default function SavedSearchesPage() {
  return (
    <>
      <PageTitle title="Ricerche salvate" subtitle="Ricevi una notifica quando compaiono nuovi lotti in linea con i tuoi criteri." />
      <div className="space-y-3">
        {savedSearches.map((s) => (
          <div key={s.id} className="card flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-steel-soft text-steel">
                <IconSearch width={20} height={20} />
              </span>
              <div>
                <p className="font-semibold text-ink">{s.label}</p>
                <p className="text-xs text-muted">{s.results} lotti corrispondenti</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`chip ${s.alerts ? "bg-brand-soft text-brand-dark" : "bg-surface-2 text-muted"}`}>
                <IconBell width={13} height={13} /> {s.alerts ? "Avvisi attivi" : "Avvisi off"}
              </span>
              <Link href="/marketplace" className="btn btn-outline btn-sm">Apri</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
