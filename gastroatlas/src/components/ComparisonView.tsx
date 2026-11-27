"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { KEYS, useList } from "@/lib/store";
import { Notice } from "./Section";
import { findRestaurant, title, type Restaurant } from "@/data/catalog";
import { T, money, url, type Locale } from "@/lib/i18n";
import { COMPARE_MAX, compareHref, parseCompare } from "@/lib/compare";
import { demoCopy } from "@/lib/demo";

/** Comparison table. `?r=a,b,c` (shareable) wins; otherwise the venues ticked in the directory are used. */
export function ComparisonView({ locale }: { locale: Locale }) {
  const t = T(locale);
  const demo = demoCopy(locale);
  const sp = useSearchParams();
  const chosen = useList(KEYS.compare);
  const [status, setStatus] = useState("");
  const slugs = sp.has("r") ? parseCompare(sp.get("r")) : chosen.slice(0, COMPARE_MAX);
  const records = slugs.map(findRestaurant).filter((r): r is Restaurant => !!r);
  if (!records.length) return <><Notice>{t("Select up to four restaurants from the directory.", "Seleziona fino a quattro ristoranti dalla directory.")}</Notice><Link className="more" href={url(locale, "restaurants")}>{title("restaurants", locale)} →</Link></>;
  const rows: [string, (r: Restaurant) => string][] = [
    [t("City", "Città"), (r) => r.city.name[locale]], [t("Cuisine", "Cucina"), (r) => r.cuisine.name[locale]], [t("Distinction", "Distinzione"), (r) => demo.level(r.level)],
    [t("Tasting menu", "Menù degustazione"), (r) => money(r.price, locale)], [t("Rooms", "Camere"), (r) => (r.rooms ? t("Yes", "Sì") : t("No", "No"))],
  ];
  const share = async () => {
    const href = new URL(compareHref(locale, records.map((r) => r.slug)), window.location.origin).href;
    try { await navigator.clipboard.writeText(href); setStatus(t("Link copied", "Link copiato")); } catch { setStatus(href); }
  };
  return (
    <>
      <Notice>{demo.notice}</Notice>
      <div className="compare">
        <table>
          <caption className="muted" style={{ textAlign: "left", paddingBottom: 8 }}>{title("compare", locale)} · {records.length}/{COMPARE_MAX}</caption>
          <thead><tr><th scope="col">{t("Details", "Dettagli")}</th>{records.map((r) => <th key={r.slug} scope="col"><Link href={url(locale, `restaurant/${r.slug}`)}>{r.name}</Link></th>)}</tr></thead>
          <tbody>{rows.map(([label, get]) => <tr key={label}><th scope="row">{label}</th>{records.map((r) => <td key={r.slug}>{get(r)}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="row"><button id="share" type="button" onClick={share}>{t("Copy comparison link", "Copia il link del confronto")}</button><Link className="more" href={url(locale, "restaurants")}>{title("restaurants", locale)} →</Link></div>
      <output id="share-status" aria-live="polite">{status}</output>
    </>
  );
}
