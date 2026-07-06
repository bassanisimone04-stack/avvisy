"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Organization, Service } from "@/lib/types";
import { cn } from "@/lib/utils";

const suggestions = [
  "730",
  "ISEE",
  "Patronato",
  "Visita",
  "Igiene dentale",
  "Taglio",
  "Colore",
];

export default function ServiceAssistant({
  services,
  organizations,
}: {
  services: Service[];
  organizations: Organization[];
}) {
  const [query, setQuery] = useState("");

  const orgById = useMemo(
    () => Object.fromEntries(organizations.map((o) => [o.id, o])),
    [organizations]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return services.filter((s) =>
      `${s.name} ${s.description}`.toLowerCase().includes(q)
    );
  }, [services, query]);

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Di cosa hai bisogno?</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Es. devo fare il 730, una visita, l'ISEE…"
          className="w-full rounded-full border border-line bg-card px-5 py-3.5 text-base outline-none transition-colors focus:border-brand"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setQuery(s)}
            className="rounded-full border border-line bg-card px-4 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {query.trim() === "" ? (
          <p className="text-base text-muted">
            Scrivi di cosa hai bisogno o tocca un suggerimento: ti indichiamo il
            servizio e la struttura giusti.
          </p>
        ) : results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-card p-8 text-center text-sm text-muted">
            Nessun servizio trovato per “{query}”. Prova con un&apos;altra
            parola.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((s) => {
              const org = orgById[s.orgId];
              return (
                <div
                  key={s.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-xl border border-line bg-card p-5",
                    "sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  )}
                >
                  <div>
                    <h3 className="font-display text-lg font-bold">{s.name}</h3>
                    <p className="mt-1 text-sm text-muted">{s.description}</p>
                    {org && (
                      <p className="mt-2 text-sm font-medium text-brand-dark">
                        {org.name} · {org.city}
                      </p>
                    )}
                  </div>
                  {org && (
                    <Link
                      href={`/s/${org.slug}/book?service=${s.id}`}
                      className="shrink-0 rounded-full bg-brand px-6 py-2.5 text-center text-base font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                      Prenota
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
