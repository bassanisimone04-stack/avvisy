"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/ui/icons";

type L = { placeholder: string; explore: string; destination: string; experienceType: string; date: string; guests: string; any: string };

export function HeroSearch({ locale, labels, cities, cuisines }: { locale: string; labels: L; cities: { value: string; label: string }[]; cuisines: { value: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = String(fd.get("q") ?? "").trim();
    const city = String(fd.get("city") ?? "");
    const cuisine = String(fd.get("cuisine") ?? "");
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (cuisine) p.set("cuisine", cuisine);
    for (const k of ["date", "guests"]) { const v = String(fd.get(k) ?? ""); if (v) p.set(k, v); }
    const base = city ? `/${locale}/restaurants/${city}/` : `/${locale}/restaurants/`;
    router.push(`${base}${p.size ? `?${p}` : ""}`);
  };
  const field = "min-h-11 w-full rounded-[8px] border border-line bg-white px-3 text-sm text-ink";
  return (
    <form ref={formRef} role="search" onSubmit={submit} onFocus={() => setOpen(true)} className="mx-auto w-full max-w-[860px]">
      <div className="flex items-center gap-2 rounded-[8px] bg-white p-1 pl-3 shadow-card">
        <SearchIcon className="shrink-0 text-stone" />
        <label htmlFor="hero-q" className="sr-only">{labels.placeholder}</label>
        <input id="hero-q" name="q" type="search" placeholder={labels.placeholder} autoComplete="off" className="min-h-10 min-w-0 flex-1 bg-transparent text-sm text-ink md:text-base placeholder:text-stone outline-none" aria-controls="hero-adv" />
        <button type="submit" className="min-h-10 shrink-0 rounded-[6px] bg-garnet px-4 text-sm font-semibold text-white hover:bg-red-700">{labels.explore}</button>
      </div>
      <div id="hero-adv" hidden={!open} className="mt-2 grid gap-2 rounded-[10px] bg-white p-3 text-left shadow-card sm:grid-cols-4">
        <div>
          <label htmlFor="hero-city" className="mb-1 block text-xs font-semibold text-stone">{labels.destination}</label>
          <select id="hero-city" name="city" className={field} defaultValue=""><option value="">{labels.any}</option>{cities.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
        </div>
        <div>
          <label htmlFor="hero-cuisine" className="mb-1 block text-xs font-semibold text-stone">{labels.experienceType}</label>
          <select id="hero-cuisine" name="cuisine" className={field} defaultValue=""><option value="">{labels.any}</option>{cuisines.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
        </div>
        <div>
          <label htmlFor="hero-date" className="mb-1 block text-xs font-semibold text-stone">{labels.date}</label>
          <input id="hero-date" name="date" type="date" className={field} />
        </div>
        <div>
          <label htmlFor="hero-guests" className="mb-1 block text-xs font-semibold text-stone">{labels.guests}</label>
          <select id="hero-guests" name="guests" className={field} defaultValue="2">{[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n} value={n}>{n}</option>)}</select>
        </div>
      </div>
    </form>
  );
}
