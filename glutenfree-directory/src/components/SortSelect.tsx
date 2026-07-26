"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) params.set("ordina", e.target.value);
    else params.delete("ordina");
    router.push(`/directory?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="ordina" className="text-sm text-ink-soft">Ordina per</label>
      <select id="ordina" className="field w-auto" defaultValue={searchParams.get("ordina") ?? ""} onChange={onChange}>
        <option value="">Più rilevanti</option>
        <option value="rating">Valutazione</option>
        <option value="recenti">Più recenti</option>
        <option value="nome">Nome A-Z</option>
      </select>
    </div>
  );
}
