"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconSearch } from "./icons";
import { categories } from "@/lib/mock-data";

const regions = [
  "Tutte le località",
  "Lombardia",
  "Veneto",
  "Emilia-Romagna",
  "Piemonte",
  "Toscana",
  "Abruzzo",
  "Campania",
];

export default function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [region, setRegion] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (cat) params.set("categoria", cat);
    if (region) params.set("regione", region);
    router.push(`/marketplace?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="card card-soft grid gap-2 p-2 md:grid-cols-[1.6fr_1fr_1fr_auto]"
    >
      <div className="flex items-center gap-2 rounded-lg px-3 md:border-r md:border-line">
        <IconSearch className="shrink-0 text-muted" width={18} height={18} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Parola chiave, es. cuscinetti, bancali…"
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted"
          aria-label="Parola chiave"
        />
      </div>
      <select
        value={cat}
        onChange={(e) => setCat(e.target.value)}
        className="rounded-lg bg-transparent px-3 py-2.5 text-sm outline-none md:border-r md:border-line"
        aria-label="Categoria"
      >
        <option value="">Tutte le categorie</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={region}
        onChange={(e) => setRegion(e.target.value === "Tutte le località" ? "" : e.target.value)}
        className="rounded-lg bg-transparent px-3 py-2.5 text-sm outline-none"
        aria-label="Località"
      >
        {regions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">
        <IconSearch width={18} height={18} />
        Cerca
      </button>
    </form>
  );
}
