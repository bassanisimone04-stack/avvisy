"use client";

import { useEffect } from "react";
import { Bell } from "lucide-react";
import AccountShell from "@/components/AccountShell";
import { useStore } from "@/lib/store";
import { formatDateIt } from "@/lib/format";

export default function NotificationsPage() {
  const { notifications, markAllNotificationsRead } = useStore();

  useEffect(() => {
    markAllNotificationsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AccountShell>
      <h1 className="text-2xl font-bold text-ink">Notifiche</h1>
      <div className="mt-6 space-y-3">
        {notifications.map((n) => (
          <div key={n.id} className="card flex items-start gap-3 p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-dark"><Bell size={15} /></span>
            <div>
              <p className="text-sm text-ink">{n.text}</p>
              <p className="mt-1 text-xs text-muted">{formatDateIt(n.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </AccountShell>
  );
}
