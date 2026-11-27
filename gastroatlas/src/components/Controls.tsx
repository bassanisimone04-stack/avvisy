"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KEYS, setCompared, toggleSaved, useList } from "@/lib/store";
import { T, type Locale } from "@/lib/i18n";
import { COMPARE_MAX, compareHref } from "@/lib/compare";
import { title } from "@/data/catalog";

/** Heart button. Favourites live in localStorage ("atlas-saves"), so they work without an account. */
export function SaveButton({ slug, name, locale, labelled = false }: { slug: string; name: string; locale: Locale; labelled?: boolean }) {
  const t = T(locale);
  const saved = useList(KEYS.saves).includes(slug);
  return (
    <button type="button" className={labelled ? undefined : "save"} data-save={slug} aria-pressed={saved} aria-label={labelled ? undefined : `${t("Save", "Salva")} ${name}`} onClick={() => toggleSaved(slug)}>
      {labelled ? t("Save", "Salva") : saved ? "♥" : "♡"}
    </button>
  );
}

/** "Compare" checkbox, at most four venues; the fifth is refused with a spoken and visible message. */
export function CompareCheck({ slug, name, locale }: { slug: string; name: string; locale: Locale }) {
  const t = T(locale);
  const checked = useList(KEYS.compare).includes(slug);
  const [msg, setMsg] = useState("");
  useEffect(() => { if (!msg) return; const id = setTimeout(() => setMsg(""), 3500); return () => clearTimeout(id); }, [msg]);
  return (
    <>
      <label>
        <input className="check" type="checkbox" data-compare={slug} checked={checked} aria-label={`${title("compare", locale)}: ${name}`}
          onChange={(e) => { if (!setCompared(slug, e.target.checked, COMPARE_MAX)) setMsg(t(`Choose up to ${COMPARE_MAX} restaurants.`, `Puoi scegliere fino a ${COMPARE_MAX} ristoranti.`)); }} />
        <span aria-hidden="true">{title("compare", locale)}</span>
      </label>
      <span role="status" className="muted">{msg}</span>
    </>
  );
}

/** "Compare (n)" link carrying the shareable ?r=… list. */
export function CompareLink({ locale }: { locale: Locale }) {
  const list = useList(KEYS.compare);
  return <Link className="btn" data-compare-link href={compareHref(locale, list)}>{title("compare", locale)} ({list.length})</Link>;
}
