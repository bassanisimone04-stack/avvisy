"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Clock } from "lucide-react";
import { categoryLabelPlural, getCategoryInfo } from "@/lib/categories";
import { localeHref } from "@/lib/i18n/locale";
import { useDictionary } from "@/lib/i18n/useLocale";

const QUICK_CATEGORIES = ["ristorante", "pizzeria"] as const;

export default function QuickFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, t } = useDictionary();
  const dirHref = localeHref(locale, "/directory");

  const categoria = searchParams.get("categoria") ?? "";
  const certificato = searchParams.get("certificato") === "1";
  const apertoOra = searchParams.get("apertoOra") === "1";
  const isAll = !categoria && !certificato && !apertoOra;

  function apply(next: { categoria?: string | null; certificato?: boolean; apertoOra?: boolean }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.categoria !== undefined) {
      if (next.categoria) params.set("categoria", next.categoria);
      else params.delete("categoria");
    }
    if (next.certificato !== undefined) {
      if (next.certificato) params.set("certificato", "1");
      else params.delete("certificato");
    }
    if (next.apertoOra !== undefined) {
      if (next.apertoOra) params.set("apertoOra", "1");
      else params.delete("apertoOra");
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${dirHref}?${qs}` : dirHref, { scroll: false });
  }

  function chipClass(active: boolean) {
    return `chip shrink-0 ${active ? "chip-brand" : "chip-neutral"}`;
  }

  return (
    <div className="mb-5 flex flex-wrap gap-2">
      <button type="button" onClick={() => router.push(dirHref, { scroll: false })} className={chipClass(isAll)}>
        {t.directory.quickAll}
      </button>
      {QUICK_CATEGORIES.map((slug) => {
        const cat = getCategoryInfo(slug);
        if (!cat) return null;
        const active = categoria === slug;
        return (
          <button
            key={slug}
            type="button"
            onClick={() => apply({ categoria: active ? null : slug })}
            className={chipClass(active)}
          >
            {categoryLabelPlural(cat, locale)}
          </button>
        );
      })}
      <button type="button" onClick={() => apply({ certificato: !certificato })} className={chipClass(certificato)}>
        <BadgeCheck size={13} /> {t.directory.quickAicCertified}
      </button>
      <button type="button" onClick={() => apply({ apertoOra: !apertoOra })} className={chipClass(apertoOra)}>
        <Clock size={13} /> {t.common.openNow}
      </button>
    </div>
  );
}
