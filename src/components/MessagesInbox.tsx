"use client";

import { useEffect, useMemo, useState } from "react";
import { notify } from "./Toaster";
import { EmptyState } from "./dash";
import { IconMessage } from "./icons";
import { hasContactInfo, maskContacts } from "@/lib/moderation";
import { useStore } from "@/lib/store";
import {
  fetchMessages,
  markThreadRead,
  sendMessage,
  type ChatMessage,
} from "@/lib/supabase/messages";

type Msg = { from: "me" | "them"; text: string; time: string };
type Thread = {
  id: string;
  company: string;
  lot: string;
  preview: string;
  unread: boolean;
  messages: Msg[];
};

// Conversazioni dimostrative (modalità demo, senza backend).
const seed: Thread[] = [
  {
    id: "t1",
    company: "Officine Meccaniche Ferraris Srl",
    lot: "Cuscinetti a sfera SKF 6205-2RS",
    preview: "Possiamo chiudere su 300 pezzi?",
    unread: true,
    messages: [
      { from: "them", text: "Buongiorno, i cuscinetti sono ancora disponibili?", time: "09:12" },
      { from: "me", text: "Sì, ne abbiamo 1.200 pronti alla spedizione.", time: "09:20" },
      { from: "them", text: "Possiamo chiudere su 300 pezzi con ordine ricorrente?", time: "09:24" },
    ],
  },
  {
    id: "t2",
    company: "Impianti Verdi Srl",
    lot: "Motori asincroni trifase 4 kW",
    preview: "Confermate il ritiro per venerdì?",
    unread: false,
    messages: [
      { from: "them", text: "Vorremmo ritirare i 6 motori venerdì mattina.", time: "ieri" },
      { from: "me", text: "Perfetto, vi aspettiamo entro le 12.", time: "ieri" },
    ],
  },
  {
    id: "t3",
    company: "Ferramenta Industriale Bevilacqua",
    lot: "Avvitatori a batteria professionali",
    preview: "Grazie, valutiamo l'offerta.",
    unread: false,
    messages: [
      { from: "them", text: "Avete disponibilità per 20 kit?", time: "2 giorni fa" },
      { from: "me", text: "Sì, confermo. Vi invio il riepilogo.", time: "2 giorni fa" },
    ],
  },
];

function clock(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function MessagesInbox() {
  const { state, online, currentCompanyId } = useStore();
  const [realMsgs, setRealMsgs] = useState<ChatMessage[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const useReal = online && !!currentCompanyId;

  // Caricamento + aggiornamento periodico dei messaggi reali.
  useEffect(() => {
    if (!useReal || !currentCompanyId) return;
    let alive = true;
    const load = async () => {
      const m = await fetchMessages(currentCompanyId);
      if (alive) setRealMsgs(m);
    };
    load();
    const iv = setInterval(load, 6000);
    return () => {
      alive = false;
      clearInterval(iv);
    };
  }, [useReal, currentCompanyId]);

  // Costruisce le conversazioni (reali o demo).
  const threads = useMemo<Thread[]>(() => {
    if (!useReal || !currentCompanyId) return seed;
    const byOther = new Map<string, ChatMessage[]>();
    for (const m of realMsgs) {
      const other = m.senderCompany === currentCompanyId ? m.recipientCompany : m.senderCompany;
      const arr = byOther.get(other) ?? [];
      arr.push(m);
      byOther.set(other, arr);
    }
    const list: Thread[] = [...byOther.entries()].map(([otherId, msgs]) => {
      const company = state.companies.find((c) => c.id === otherId);
      const last = msgs[msgs.length - 1];
      const lot = last.lotId ? state.lots.find((l) => l.id === last.lotId) : undefined;
      return {
        id: otherId,
        company: company?.displayName ?? "Azienda",
        lot: lot?.title ?? "",
        preview: maskContacts(last.body),
        unread: msgs.some((m) => !m.read && m.recipientCompany === currentCompanyId),
        messages: msgs.map((m) => ({
          from: m.senderCompany === currentCompanyId ? ("me" as const) : ("them" as const),
          text: m.body,
          time: clock(m.createdAt),
        })),
      };
    });
    // Ordina per attività più recente.
    return list.reverse();
  }, [useReal, currentCompanyId, realMsgs, state.companies, state.lots]);

  // Seleziona la prima conversazione se quella attiva non esiste più.
  useEffect(() => {
    if (threads.length === 0) {
      if (active !== null) setActive(null);
      return;
    }
    if (!active || !threads.some((t) => t.id === active)) {
      setActive(threads[0].id);
    }
  }, [threads, active]);

  // Segna letti i messaggi ricevuti quando apro la conversazione.
  useEffect(() => {
    if (useReal && currentCompanyId && active) {
      markThreadRead(currentCompanyId, active).catch(() => {});
    }
  }, [useReal, currentCompanyId, active]);

  const current = threads.find((t) => t.id === active) ?? null;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    const clean = maskContacts(body);

    if (useReal && currentCompanyId && active) {
      setSending(true);
      const sent = await sendMessage({ from: currentCompanyId, to: active, body: clean });
      setSending(false);
      if (sent) {
        setRealMsgs((prev) => [...prev, sent]);
      } else {
        notify("Impossibile inviare il messaggio. Riprova.", "info");
        return;
      }
    } else {
      notify(clean !== body ? "Messaggio inviato: i contatti diretti sono stati oscurati." : "Messaggio inviato (simulato).");
    }
    setDraft("");
  }

  return (
    <div className="card grid h-[70vh] grid-cols-1 overflow-hidden md:grid-cols-[300px_1fr]">
      {/* Elenco conversazioni */}
      <div className="border-b border-line md:border-b-0 md:border-r">
        <div className="border-b border-line px-4 py-3">
          <h2 className="text-sm font-bold text-ink">Conversazioni</h2>
        </div>
        {threads.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-muted">
              Nessuna conversazione. Le chat nascono quando contatti un venditore da un annuncio o ricevi una richiesta.
            </p>
          </div>
        ) : (
          <ul className="max-h-40 overflow-y-auto md:max-h-full">
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setActive(t.id)}
                  className={`flex w-full flex-col items-start gap-0.5 border-b border-line px-4 py-3 text-left transition-colors ${
                    active === t.id ? "bg-brand-soft/50" : "hover:bg-surface-2"
                  }`}
                >
                  <span className="flex w-full items-center justify-between">
                    <span className="truncate text-sm font-semibold text-ink">{t.company}</span>
                    {t.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-signal" />}
                  </span>
                  {t.lot && <span className="truncate text-xs text-muted">{t.lot}</span>}
                  <span className="truncate text-xs text-muted">{t.preview}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Conversazione attiva */}
      <div className="flex min-h-0 flex-col">
        {current ? (
          <>
            <div className="border-b border-line px-4 py-3">
              <p className="text-sm font-semibold text-ink">{current.company}</p>
              {current.lot && <p className="text-xs text-muted">{current.lot}</p>}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-surface-2/30 p-4">
              {current.messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                      m.from === "me"
                        ? "rounded-br-sm bg-brand text-white"
                        : "rounded-bl-sm bg-surface text-ink shadow-sm"
                    }`}
                  >
                    {maskContacts(m.text)}
                    <span
                      className={`mt-1 block text-[0.65rem] ${m.from === "me" ? "text-white/70" : "text-muted"}`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line">
              {hasContactInfo(draft) && (
                <p className="px-3 pt-2 text-xs text-signal">
                  Per la tua sicurezza, telefono, email e link vengono oscurati: concludi la trattativa in piattaforma con pagamento protetto.
                </p>
              )}
              <form onSubmit={handleSend} className="flex items-center gap-2 p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Scrivi un messaggio…"
                  className="field flex-1"
                />
                <button type="submit" className="btn btn-primary btn-sm" disabled={sending}>
                  <IconMessage width={16} height={16} /> {sending ? "Invio…" : "Invia"}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              icon={<IconMessage />}
              title="Nessuna conversazione selezionata"
              text="Contatta un venditore da un annuncio per iniziare a chattare in piattaforma."
            />
          </div>
        )}
      </div>
    </div>
  );
}
