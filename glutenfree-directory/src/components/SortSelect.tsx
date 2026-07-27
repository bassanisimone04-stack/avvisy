"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDictionary } from "@/lib/i18n/useLocale";
import { localeHref } from "@/lib/i18n/locale";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, t } = useDictionary();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) params.set("ordina", e.target.value);
    else params.delete("ordina");
    router.push(`${localeHref(locale, "/directory")}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="ordina" className="text-sm text-ink-soft">{t.directory.sortBy}</label>
      <select id="ordina" className="field w-auto" defaultValue={searchParams.get("ordina") ?? ""} onChange={onChange}>
        <option value="">{t.directory.sortRelevance}</option>
        <option value="rating">{t.directory.sortRating}</option>
        <option value="recenti">{t.directory.sortRecent}</option>
        <option value="nome">{t.directory.sortName}</option>
      </select>
    </div>
  );
}
