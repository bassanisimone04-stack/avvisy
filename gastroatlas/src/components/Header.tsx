"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { KEYS, useList } from "@/lib/store";
import { T, normalize, other, url, type Locale } from "@/lib/i18n";
import { BRAND, cities, restaurants, title, type SectionKey } from "@/data/catalog";

const NAV: SectionKey[] = ["restaurants", "destinations", "hotels", "experiences", "travel", "magazine", "gifts"];

function LangSwitch({ locale }: { locale: Locale }) {
  const t = T(locale);
  const path = usePathname() ?? `/${locale}/`;
  const qs = useSearchParams().toString();
  const rest = path.split("/").slice(2).join("/");
  return <Link href={`/${other(locale)}/${rest}${qs ? `?${qs}` : ""}`} hrefLang={other(locale)} aria-label={`${locale === "it" ? "IT" : "EN"} · EUR — ${t("switch to Italian", "passa all’inglese")}`}>{locale === "it" ? "IT" : "EN"} · EUR</Link>;
}

/** Search dialog: suggests destinations and restaurants; "/" opens it from anywhere outside a text field. */
function Finder({ locale, open, onClose }: { locale: Locale; open: boolean; onClose: () => void }) {
  const t = T(locale);
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    if (!open) setQ(""); // start fresh the next time it opens
  }, [open]);
  const nq = normalize(q.trim(), locale);
  const cityHits = cities.filter((c) => [c.name.en, c.name.it, c.country.it, c.country.en].some((v) => normalize(v, locale).includes(nq))).slice(0, 5);
  const restHits = nq ? restaurants.filter((r) => normalize(r.name, locale).includes(nq)).slice(0, 4) : [];
  return (
    <dialog ref={ref} aria-labelledby="finder-title" onClose={onClose}>
      <div className="heading">
        <h2 id="finder-title">{t("Search", "Cerca")}</h2>
        <form method="dialog"><button aria-label={t("Close", "Chiudi")}>×</button></form>
      </div>
      <form action={url(locale, "restaurants")} role="search">
        <input name="q" value={q} onChange={(e) => setQ(e.target.value)} aria-label={t("Search restaurants and destinations", "Cerca ristoranti e destinazioni")} placeholder={t("Restaurant or city", "Ristorante o città")} autoComplete="off" autoFocus />
        <button className="primary">{t("Search", "Cerca")}</button>
      </form>
      <div aria-live="polite">
        {cityHits.map((c) => <p className="topline" key={c.slug}><Link className="more" href={url(locale, `restaurants/${c.slug}`)} onClick={onClose}>{c.name[locale]}</Link></p>)}
        {restHits.map((r) => <p className="topline" key={r.slug}><Link className="more" href={url(locale, `restaurant/${r.slug}`)} onClick={onClose}>{r.name}</Link> <span className="tag demo">Demo</span></p>)}
      </div>
    </dialog>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const t = T(locale);
  const saved = useList(KEYS.saves);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !el.matches("input,textarea,select,[contenteditable]")) { e.preventDefault(); setOpen(true); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header id="top">
      <div className="bar">
        <Link className="brand" href={url(locale)}>{BRAND.name}</Link>
        <nav aria-label={t("Main navigation", "Navigazione principale")}>
          {NAV.map((k) => <Link key={k} href={url(locale, k)}>{title(k, locale)}</Link>)}
        </nav>
        <div className="tools">
          <button type="button" data-finder aria-label={t("Search (press /)", "Cerca (premi /)")} aria-keyshortcuts="/" onClick={() => setOpen(true)}>⌕</button>
          <Suspense fallback={<a href={url(locale)}>{locale === "it" ? "IT" : "EN"} · EUR</a>}><LangSwitch locale={locale} /></Suspense>
          <Link href={url(locale, "favorites")} aria-label={`${title("favorites", locale)}${saved.length ? ` (${saved.length})` : ""}`}>♡ <span data-saved>{saved.length || ""}</span></Link>
          <Link className="btn outline club" href={url(locale, "club")}>{t("Join the Club", "Entra nel Club")}</Link>
        </div>
      </div>
      <Finder locale={locale} open={open} onClose={close} />
    </header>
  );
}
