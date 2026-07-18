import { PageTitle } from "@/components/dash";
import { IconBell, IconMessage, IconTag, IconTruck, IconVerified } from "@/components/icons";
import type { DemoNotification } from "@/lib/types";

const buyerNotifications: DemoNotification[] = [
  { id: "b1", icon: "offer", title: "Controproposta ricevuta", detail: "TecnoElettra ha rilanciato a 615 €/pz sui quadri elettrici BT.", time: "1 ora fa", unread: true },
  { id: "b2", icon: "order", title: "Ordine in spedizione", detail: "L'ordine ORD-2026-0158 (bancali EPAL) è stato affidato al corriere.", time: "3 ore fa", unread: true },
  { id: "b3", icon: "offer", title: "Offerta accettata", detail: "PackItalia ha accettato la tua offerta sui bancali EPAL.", time: "ieri", unread: false },
  { id: "b4", icon: "message", title: "Nuovo messaggio", detail: "Metalfer ha risposto alla tua richiesta sui cuscinetti SKF.", time: "ieri", unread: false },
  { id: "b5", icon: "system", title: "Nuovi lotti per una ricerca salvata", detail: "3 nuovi lotti corrispondono a “Cuscinetti · Lombardia · nuovo”.", time: "2 giorni fa", unread: false },
];

const iconMap = {
  offer: IconTag,
  order: IconTruck,
  message: IconMessage,
  verify: IconVerified,
  system: IconBell,
};

export default function BuyerNotificationsPage() {
  return (
    <>
      <PageTitle title="Notifiche" subtitle="Avvisi su offerte, ordini, messaggi e ricerche salvate." />
      <div className="card divide-y divide-[var(--s-line)] overflow-hidden">
        {buyerNotifications.map((n) => {
          const Icon = iconMap[n.icon];
          return (
            <div key={n.id} className={`flex gap-3 p-4 ${n.unread ? "bg-brand-soft/25" : ""}`}>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-soft">
                <Icon width={18} height={18} />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{n.title}</p>
                  {n.unread && <span className="h-2 w-2 rounded-full bg-signal" />}
                </div>
                <p className="text-sm text-muted">{n.detail}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">{n.time}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
