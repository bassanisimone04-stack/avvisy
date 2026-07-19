"use client";

import Link from "next/link";
import { PageTitle, EmptyState } from "@/components/dash";
import { notify } from "@/components/Toaster";
import { IconBell, IconClose, IconSearch } from "@/components/icons";
import { useStore } from "@/lib/store";

export default function SavedSearchesPage() {
  const { state, dispatch } = useStore();
  const searches = state.savedSearches;

  return (
    <>
      <PageTitle title="Ricerche salvate" subtitle="Ricevi una notifica quando compaiono nuovi lotti in linea con i tuoi criteri." />
      {searches.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<IconSearch />}
            title="Nessuna ricerca salvata"
            text="Salva una ricerca dal marketplace per essere avvisato sui nuovi lotti."
            action={<Link href="/marketplace" className="btn btn-primary btn-sm">Vai al marketplace</Link>}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {searches.map((s) => (
            <div key={s.id} className="card flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-steel-soft text-steel">
                  <IconSearch width={20} height={20} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{s.label}</p>
                  <Link href={`/marketplace?q=${encodeURIComponent(s.query)}`} className="text-xs text-brand-dark hover:underline">
                    Apri nel marketplace
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { dispatch({ type: "TOGGLE_SEARCH_ALERT", id: s.id }); notify(s.alerts ? "Avvisi disattivati." : "Avvisi attivati.", "info"); }}
                  className={`chip ${s.alerts ? "bg-brand-soft text-brand-dark" : "bg-surface-2 text-muted"}`}
                >
                  <IconBell width={13} height={13} /> {s.alerts ? "Avvisi attivi" : "Avvisi off"}
                </button>
                <button
                  onClick={() => { dispatch({ type: "REMOVE_SAVED_SEARCH", id: s.id }); notify("Ricerca eliminata.", "info"); }}
                  className="rounded-lg p-1.5 text-muted hover:bg-danger-soft hover:text-danger"
                  aria-label="Elimina ricerca"
                >
                  <IconClose width={16} height={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
