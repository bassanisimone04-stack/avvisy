"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import OrganizationCard from "@/components/OrganizationCard";
import type { Organization } from "@/lib/types";
import { cn } from "@/lib/utils";

const StructuresMap = dynamic(() => import("@/components/StructuresMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[380px] items-center justify-center rounded-xl border border-line bg-card text-sm text-muted">
      Caricamento mappa…
    </div>
  ),
});

type View = "lista" | "mappa";

export default function StructuresDirectory({
  organizations,
}: {
  organizations: Organization[];
}) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("lista");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return organizations;
    return organizations.filter((o) =>
      `${o.name} ${o.city} ${o.category}`.toLowerCase().includes(q)
    );
  }, [organizations, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full max-w-md">
          <span className="sr-only">Cerca una struttura</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome, città o tipo (es. CAF)…"
            className="w-full rounded-full border border-line bg-card px-5 py-3 text-base outline-none transition-colors focus:border-brand"
          />
        </label>

        <div className="inline-flex shrink-0 rounded-full border border-line bg-card p-1">
          {(["lista", "mappa"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
                view === v
                  ? "bg-brand text-white"
                  : "text-muted hover:text-ink"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "mappa" ? (
        <div className="mt-5">
          <StructuresMap organizations={visible} />
        </div>
      ) : visible.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-line bg-card p-8 text-center text-sm text-muted">
          Nessuna struttura trovata per “{query}”.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((org) => (
            <OrganizationCard key={org.id} org={org} />
          ))}
        </div>
      )}
    </div>
  );
}
