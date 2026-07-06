"use client";

import { useMemo, useState } from "react";
import OrganizationCard from "@/components/OrganizationCard";
import type { Organization } from "@/lib/types";

export default function StructuresDirectory({
  organizations,
}: {
  organizations: Organization[];
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return organizations;
    return organizations.filter((o) =>
      `${o.name} ${o.city} ${o.category}`.toLowerCase().includes(q)
    );
  }, [organizations, query]);

  return (
    <div>
      <label className="relative block max-w-md">
        <span className="sr-only">Cerca una struttura</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca per nome, città o tipo (es. CAF)…"
          className="w-full rounded-full border border-line bg-card px-5 py-3 text-base outline-none transition-colors focus:border-brand"
        />
      </label>

      {visible.length === 0 ? (
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
