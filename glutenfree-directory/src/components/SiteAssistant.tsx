"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, BadgeCheck, BookOpen, MapPin, MessageCircle, Send, Sparkles, X } from "lucide-react";
import type { AssistantIndex } from "@/lib/assistant-index";
import { answer, welcome, type Reply } from "@/lib/assistant-engine";
import type { Locale } from "@/lib/i18n/locale";

type Msg = { from: "bot"; reply: Reply } | { from: "user"; text: string };

/**
 * Assistente del sito: un pulsante in basso a destra apre una chat che aiuta a
 * trovare locali, ricette e risposte. I dati (solo contenuti già pubblicati)
 * si scaricano alla prima apertura; tutto gira nel browser, senza servizi esterni.
 */
export default function SiteAssistant({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState<AssistantIndex | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [hint, setHint] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef<AssistantIndex | null>(null);
  idxRef.current = idx;
  const inputRef = useRef<HTMLInputElement>(null);

  // Fumetto «Serve aiuto?» una sola volta per visita, dopo qualche secondo.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("gf-assistant-hint") === "1";
    } catch {
      /* niente memoria: il fumetto compare comunque */
    }
    if (seen) return;
    const id = setTimeout(() => setHint(true), 4000);
    return () => clearTimeout(id);
  }, []);

  const openChat = useCallback(() => {
    setOpen(true);
    setHint(false);
    try {
      sessionStorage.setItem("gf-assistant-hint", "1");
    } catch {
      /* ignorato */
    }
  }, []);

  useEffect(() => {
    if (!open || idx) return;
    fetch(`/api/assistente/${locale}`)
      .then((r) => r.json())
      .then((d: AssistantIndex) => setIdx(d))
      .catch(() => setIdx({ venues: [], articles: [], faqs: [], categories: [], cities: [] }));
  }, [open, idx, locale]);

  useEffect(() => {
    if (open && msgs.length === 0) setMsgs([{ from: "bot", reply: welcome(locale) }]);
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open, msgs.length, locale]);

  // Alla risposta, la chat scorre fino all'inizio del messaggio (non in fondo),
  // così si legge il testo prima delle schede.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const last = list.querySelector<HTMLElement>(".gf-msg:last-of-type");
    const lastMsg = msgs[msgs.length - 1];
    if (!typing && lastMsg?.from === "bot" && last && msgs.length > 1) {
      list.scrollTo({ top: last.offsetTop - 12, behavior: "smooth" });
    } else {
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    }
  }, [msgs, typing]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setInput("");
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setTyping(true);
    // Se i dati non sono ancora arrivati, si riprova finché ci sono.
    const reply = () => {
      const data = idxRef.current;
      if (!data) {
        setTimeout(reply, 150);
        return;
      }
      setMsgs((m) => [...m, { from: "bot", reply: answer(q, data, locale) }]);
      setTyping(false);
    };
    setTimeout(reply, 550);
  };

  if (pathname?.startsWith("/admin")) return null;
  // Nella pagina della guida in basso compare la barra d'acquisto: il pulsante sale.
  const raised = pathname?.includes("/vivere-senza-glutine");

  return (
    <>
      {/* Pulsante */}
      <div className={`fixed right-5 z-[60] flex items-end gap-3 ${raised ? "bottom-28" : "bottom-5"}`}>
        {hint && !open && (
          <button
            type="button"
            onClick={openChat}
            className="gf-assistant-hint mb-2 rounded-2xl rounded-br-sm bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-lg ring-1 ring-line"
          >
            {en ? "Need help finding something? 👋" : "Serve aiuto a trovare qualcosa? 👋"}
          </button>
        )}
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openChat())}
          aria-label={open ? (en ? "Close the assistant" : "Chiudi l'assistente") : en ? "Open the assistant" : "Apri l'assistente"}
          aria-expanded={open}
          className="gf-assistant-fab relative flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1b4332,#2d6a4f)] text-white shadow-[0_12px_30px_-10px_rgba(27,67,50,0.8)] transition hover:scale-105"
        >
          {open ? <X size={24} /> : <MessageCircle size={24} />}
          {!open && <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-[#f2b100] ring-2 ring-white" />}
        </button>
      </div>

      {/* Finestra della chat */}
      {open && (
        <div
          role="dialog"
          aria-label={en ? "Site assistant" : "Assistente del sito"}
          className={`gf-assistant-panel fixed inset-x-3 z-[60] flex flex-col overflow-hidden rounded-3xl bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-line sm:inset-x-auto sm:right-5 sm:w-[390px] ${
            raised ? "bottom-[200px]" : "bottom-24"
          } h-[min(620px,calc(100dvh-8rem))]`}
        >
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#1b4332,#2d6a4f)] px-5 py-4 text-white">
            <div aria-hidden="true" className="gf-blob absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#f2b100]/30 blur-2xl" />
            <div className="relative flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
                <Sparkles size={20} className="text-[#f2b100]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{en ? "Mappa Senza Glutine assistant" : "Assistente Mappa Senza Glutine"}</p>
                <p className="flex items-center gap-1.5 text-xs text-white/75">
                  <span className="h-2 w-2 rounded-full bg-[#7ee2a8]" /> {en ? "Venues, recipes and answers" : "Locali, ricette e risposte"}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={en ? "Close" : "Chiudi"} className="rounded-full p-1.5 hover:bg-white/15">
                <X size={18} />
              </button>
            </div>
          </div>

          <div ref={listRef} className="relative flex-1 space-y-3 overflow-y-auto bg-canvas px-4 py-4" aria-live="polite">
            {msgs.map((m, i) =>
              m.from === "user" ? (
                <div key={i} className="gf-msg flex justify-end">
                  <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#1b4332] px-4 py-2.5 text-sm text-white">{m.text}</p>
                </div>
              ) : (
                <div key={i} className="gf-msg flex gap-2">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                    <Sparkles size={14} />
                  </span>
                  <div className="min-w-0 max-w-[85%] space-y-2">
                    <p className="rounded-2xl rounded-tl-sm bg-surface px-4 py-2.5 text-sm leading-relaxed text-ink shadow-sm ring-1 ring-line">{m.reply.text}</p>
                    {m.reply.cards?.map((c, j) =>
                      c.type === "link" ? (
                        <Link
                          key={j}
                          href={c.href}
                          className="group flex items-center justify-between gap-2 rounded-xl bg-brand-soft px-3.5 py-2.5 text-sm font-semibold text-brand-dark transition hover:translate-x-0.5"
                        >
                          {c.title} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                      ) : (
                        <Link
                          key={j}
                          href={c.href}
                          className="block rounded-xl bg-surface p-3 shadow-sm ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-brand/40"
                        >
                          <span className="flex items-start gap-2">
                            {c.type === "venue" ? (
                              <MapPin size={15} className="mt-0.5 shrink-0 text-[#c2431f]" />
                            ) : (
                              <BookOpen size={15} className="mt-0.5 shrink-0 text-brand" />
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                                {c.title}
                                {c.type === "venue" && c.aic && (
                                  <span className="chip chip-brand !px-1.5 !py-0 text-[10px]">
                                    <BadgeCheck size={10} /> AIC
                                  </span>
                                )}
                              </span>
                              <span className="mt-0.5 line-clamp-2 block text-xs text-muted">{c.sub}</span>
                            </span>
                          </span>
                        </Link>
                      ),
                    )}
                    {m.reply.note && <p className="px-1 text-[11px] text-muted">{m.reply.note}</p>}
                    {m.reply.chips && i === msgs.length - 1 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.reply.chips.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => send(c)}
                            className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-brand-dark ring-1 ring-brand/30 transition hover:-translate-y-0.5 hover:bg-brand-soft"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="gf-msg flex gap-2">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark">
                  <Sparkles size={14} />
                </span>
                <span className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface px-4 py-3 shadow-sm ring-1 ring-line" aria-label={en ? "Typing" : "Sta scrivendo"}>
                  <span className="gf-dot" />
                  <span className="gf-dot [animation-delay:0.15s]" />
                  <span className="gf-dot [animation-delay:0.3s]" />
                </span>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-line bg-surface p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={en ? "Ask: pizzerias in Milan, recipes…" : "Chiedi: pizzerie a Milano, ricette…"}
              aria-label={en ? "Your question" : "La tua domanda"}
              className="h-11 min-w-0 flex-1 rounded-full border border-line-strong bg-canvas px-4 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label={en ? "Send" : "Invia"}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c2431f] text-white transition hover:bg-[#963316] disabled:opacity-40"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
