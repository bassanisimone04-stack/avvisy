"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FILTERS = [
  { id: "small", label: "Small Dog" },
  { id: "large", label: "Large Breed" },
  { id: "cat", label: "Cat Friendly" },
  { id: "generator", label: "Generator-Powered Van" },
];

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string[]>([]);

  function toggleFilter(id: string) {
    setActive((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (active.length) params.set("filters", active.join(","));
    router.push(`/cities?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-line bg-surface p-3 shadow-lift sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="mg-search">Search by zip code or city</label>
        <input
          id="mg-search"
          type="text"
          inputMode="search"
          placeholder="Enter your zip code or city (e.g. 90210 or Miami, FL)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="field flex-1 border-0 bg-surface-2 text-base"
        />
        <button type="submit" className="btn btn-primary sm:px-8">
          Find Groomers
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = active.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => toggleFilter(f.id)}
              aria-pressed={isActive}
              className={`chip border transition-colors ${
                isActive
                  ? "border-teal bg-teal-soft text-teal-dark"
                  : "border-line-strong bg-surface text-ink-soft hover:border-teal"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
    </form>
  );
}
