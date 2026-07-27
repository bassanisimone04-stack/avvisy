"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import AccountShell from "@/components/AccountShell";
import { useStore } from "@/lib/store";
import { formatDateIt } from "@/lib/format";

export default function AccountPage() {
  const { user } = useStore();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);

  if (!user) return <AccountShell><div /></AccountShell>;

  return (
    <AccountShell>
      <h1 className="text-2xl font-bold text-ink">Il tuo profilo</h1>
      <p className="mt-1 text-ink-soft">Iscritto dal {formatDateIt(user.joinedAt)}</p>

      <div className="card card-soft mt-6 max-w-xl p-6">
        <div className="mb-6 flex items-center gap-4">
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-xl font-semibold text-brand-dark">
            {user.name.slice(0, 1)}
            <button type="button" aria-label="Carica una nuova foto profilo" className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-solid text-white shadow">
              <Camera size={13} />
            </button>
          </span>
          <div>
            <p className="font-semibold text-ink">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setSaved(true); }} className="space-y-4">
          {saved && <p className="rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand-dark">Profilo aggiornato con successo.</p>}
          <div>
            <label htmlFor="name" className="field-label">Nome visualizzato</label>
            <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="bio" className="field-label">Bio breve</label>
            <textarea id="bio" className="field" rows={3} placeholder="Racconta qualcosa di te alla community…" />
          </div>
          <button type="submit" className="btn btn-primary">Salva modifiche</button>
        </form>
      </div>
    </AccountShell>
  );
}
