"use client";

import Link from "next/link";
import { useState } from "react";
import { PageTitle, EmptyState } from "./dash";
import { IconBell, IconCheck, IconDoc, IconMessage, IconTag, IconTruck, IconVerified } from "./icons";
import { formatDate, timeAgo } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { NotificationType } from "@/lib/types";

const iconMap: Record<NotificationType, typeof IconBell> = {
  offerta_ricevuta: IconTag,
  offerta_accettata: IconCheck,
  controproposta: IconTag,
  lotto_scadenza: IconBell,
  ordine_aggiornato: IconTruck,
  verifica_completata: IconVerified,
  messaggio: IconMessage,
  sistema: IconDoc,
};

export default function NotificationCenter({ audience }: { audience: "seller" | "buyer" }) {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState<"tutte" | "non-lette">("tutte");

  const list = state.notifications
    .filter((n) => n.audience === audience || n.audience === "both")
    .filter((n) => (filter === "non-lette" ? !n.read : true));

  const unread = state.notifications.filter(
    (n) => (n.audience === audience || n.audience === "both") && !n.read,
  ).length;

  return (
    <>
      <PageTitle
        title="Centro notifiche"
        subtitle={unread > 0 ? `${unread} notifiche non lette` : "Sei aggiornato: nessuna notifica non letta."}
        action={
          <button onClick={() => dispatch({ type: "MARK_ALL_READ" })} className="btn btn-outline btn-sm" disabled={unread === 0}>
            Segna tutte come lette
          </button>
        }
      />

      <div className="mb-4 flex gap-2">
        {(["tutte", "non-lette"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? "btn-steel" : "btn-outline"}`}>
            {f === "tutte" ? "Tutte" : "Non lette"}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card">
          <EmptyState icon={<IconBell />} title="Nessuna notifica" text="Le notifiche su offerte, ordini e messaggi compariranno qui." />
        </div>
      ) : (
        <div className="card divide-y divide-[var(--s-line)] overflow-hidden">
          {list.map((n) => {
            const Icon = iconMap[n.type] ?? IconBell;
            const inner = (
              <div className={`flex gap-3 p-4 ${!n.read ? "bg-brand-soft/25" : ""}`}>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-soft">
                  <Icon width={18} height={18} />
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-signal" />}
                  </div>
                  <p className="text-sm text-muted">{n.detail}</p>
                  <p className="mt-0.5 text-xs text-muted">{formatDate(n.date)} · {timeAgo(n.date)}</p>
                </div>
              </div>
            );
            return n.href ? (
              <Link key={n.id} href={n.href} onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", id: n.id })} className="block hover:bg-surface-2/40">
                {inner}
              </Link>
            ) : (
              <button key={n.id} onClick={() => dispatch({ type: "MARK_NOTIFICATION_READ", id: n.id })} className="block w-full text-left hover:bg-surface-2/40">
                {inner}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
