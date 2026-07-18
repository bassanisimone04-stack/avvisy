"use client";

import { useState } from "react";
import { notify } from "./Toaster";
import { IconMessage } from "./icons";

type Msg = { from: "me" | "them"; text: string; time: string };
type Thread = {
  id: string;
  company: string;
  lot: string;
  preview: string;
  unread: boolean;
  messages: Msg[];
};

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

export default function MessagesInbox() {
  const [threads] = useState(seed);
  const [active, setActive] = useState(seed[0].id);
  const [draft, setDraft] = useState("");
  const current = threads.find((t) => t.id === active)!;

  return (
    <div className="card grid h-[70vh] grid-cols-1 overflow-hidden md:grid-cols-[300px_1fr]">
      {/* Elenco conversazioni */}
      <div className="border-b border-line md:border-b-0 md:border-r">
        <div className="border-b border-line px-4 py-3">
          <h2 className="text-sm font-bold text-ink">Conversazioni</h2>
        </div>
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
                <span className="truncate text-xs text-muted">{t.lot}</span>
                <span className="truncate text-xs text-muted">{t.preview}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Conversazione attiva */}
      <div className="flex min-h-0 flex-col">
        <div className="border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-ink">{current.company}</p>
          <p className="text-xs text-muted">{current.lot}</p>
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
                {m.text}
                <span
                  className={`mt-1 block text-[0.65rem] ${m.from === "me" ? "text-white/70" : "text-muted"}`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            notify("Messaggio inviato (simulato).");
            setDraft("");
          }}
          className="flex items-center gap-2 border-t border-line p-3"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Scrivi un messaggio…"
            className="field flex-1"
          />
          <button type="submit" className="btn btn-primary btn-sm">
            <IconMessage width={16} height={16} /> Invia
          </button>
        </form>
      </div>
    </div>
  );
}
