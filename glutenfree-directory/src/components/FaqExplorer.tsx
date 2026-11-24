"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, ChevronsDownUp, ChevronsUpDown, MessageCircleQuestion } from "lucide-react";
import FaqAccordion from "./FaqAccordion";
import type { FaqGroup } from "@/lib/faq-page-content";
import { matchesQuery, normalize } from "@/lib/map-search";
import { localeHref, type Locale } from "@/lib/i18n/locale";

/**
 * Pagina delle domande frequenti: ricerca istantanea su domande e risposte,
 * navigazione per argomento, "apri tutte". Con una ricerca attiva le risposte
 * trovate si aprono da sole, con le parole evidenziate.
 */
export default function FaqExplorer({ groups, locale }: { groups: FaqGroup[]; locale: Locale }) {
  const en = locale === "en";
  const [query, setQuery] = useState("");
  const [openAll, setOpenAll] = useState<boolean | undefined>(undefined);
  const deferred = useDeferredValue(query);
  const searching = normalize(deferred) !== "";

  const total = useMemo(() => groups.reduce((n, g) => n + g.items.length, 0), [groups]);
  const filtered = useMemo(
    () =>
      groups
        .map((g, gi) => ({
          gi,
          title: g.title,
          items: searching ? g.items.filter((it) => matchesQuery(normalize(`${it.question} ${it.answer}`), deferred)) : g.items,
        }))
        .filter((g) => g.items.length > 0),
    [groups, deferred, searching],
  );
  const found = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div>
      <div className="sticky top-[65px] z-20 -mx-4 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur">
        <div role="search" className="relative">
          <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={en ? "Search the answers (e.g. AIC, cross-contamination, flour)…" : "Cerca nelle risposte (es. AIC, contaminazione, farina)…"}
            aria-label={en ? "Search the FAQ" : "Cerca nelle domande frequenti"}
            autoComplete="off"
            className="h-12 w-full rounded-2xl border border-line-strong bg-surface pl-11 pr-11 text-base text-ink shadow-sm placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={en ? "Clear search" : "Cancella la ricerca"}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </div>
        {!searching && (
          <nav aria-label={en ? "Topics" : "Argomenti"} className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {groups.map((g, i) => (
              <a key={g.title} href={`#faq-${i}`} className="chip chip-neutral shrink-0 hover:bg-brand-soft">
                {g.title}
              </a>
            ))}
          </nav>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 text-sm text-muted">
        <p aria-live="polite">
          {searching
            ? found === 0
              ? en ? "No answers found" : "Nessuna risposta trovata"
              : en ? `${found} ${found === 1 ? "answer" : "answers"} found` : `${found} ${found === 1 ? "risposta trovata" : "risposte trovate"}`
            : en ? `${total} answers in ${groups.length} topics` : `${total} risposte in ${groups.length} argomenti`}
        </p>
        <button
          type="button"
          onClick={() => setOpenAll((v) => !v)}
          className="inline-flex items-center gap-1.5 font-medium text-brand hover:underline"
        >
          {openAll ? <ChevronsDownUp size={15} /> : <ChevronsUpDown size={15} />}
          {openAll ? (en ? "Close all" : "Chiudi tutte") : en ? "Open all" : "Apri tutte"}
        </button>
      </div>

      {found === 0 ? (
        <div className="card card-soft mt-6 p-8 text-center">
          <MessageCircleQuestion size={28} className="mx-auto text-brand" aria-hidden="true" />
          <p className="mt-3 font-semibold text-ink">{en ? "We couldn't find that" : "Non troviamo questa parola"}</p>
          <p className="mt-1 text-sm text-muted">
            {en ? "Try a shorter word, or write to us and we'll answer." : "Prova con una parola più corta, oppure scrivici e ti rispondiamo."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => setQuery("")} className="btn btn-outline">
              {en ? "Show all questions" : "Mostra tutte le domande"}
            </button>
            <Link href={localeHref(locale, "/contatti")} className="btn btn-primary">
              {en ? "Contact us" : "Scrivici"}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-12">
          {filtered.map((g) => (
            <section key={g.title} id={`faq-${g.gi}`} className="scroll-mt-40">
              <div className="mb-4 flex items-end justify-between gap-3 border-b border-line pb-3">
                <h2 className="font-editorial text-xl font-semibold text-ink sm:text-2xl">{g.title}</h2>
                <span className="chip chip-brand shrink-0">{g.items.length}</span>
              </div>
              {/* La chiave cambia con la ricerca: durante la ricerca le risposte trovate sono tutte aperte. */}
              <FaqAccordion
                key={searching ? `s-${deferred}` : "all"}
                items={g.items}
                query={deferred}
                defaultOpen={searching ? undefined : g.gi === 0 ? 0 : null}
                openAll={searching ? true : openAll}
              />
            </section>
          ))}
        </div>
      )}

      {!searching && (
        <aside className="mt-14 overflow-hidden rounded-3xl bg-[var(--gf-panel)] p-8 text-center text-white sm:p-10">
          <MessageCircleQuestion size={30} className="mx-auto text-gold" aria-hidden="true" />
          <h2 className="font-editorial mt-3 text-2xl font-semibold">{en ? "Still have a question?" : "Hai ancora una domanda?"}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/75">
            {en
              ? "Tell us what you couldn't find: we'll answer and add it here for everyone."
              : "Scrivici cosa non hai trovato: ti rispondiamo e la aggiungiamo qui per tutti."}
          </p>
          <Link href={localeHref(locale, "/contatti")} className="btn btn-accent mt-5">
            {en ? "Write to us" : "Scrivici"}
          </Link>
        </aside>
      )}
    </div>
  );
}
