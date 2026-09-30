"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import AccountShell from "@/components/AccountShell";

export default function MyReviewsPage() {
  return (
    <AccountShell>
      <h1 className="text-2xl font-bold text-ink">Le tue recensioni</h1>
      <p className="mt-1 text-ink-soft">Le recensioni che scrivi sulle schede attività appariranno qui.</p>
      <div className="card card-soft mt-6 flex flex-col items-center gap-3 p-12 text-center">
        <Star size={28} className="text-muted" />
        <p className="font-medium text-ink">Non hai ancora scritto recensioni</p>
        <p className="max-w-sm text-sm text-ink-soft">Visita la scheda di un&apos;attività e condividi la tua esperienza con la community celiaca.</p>
        <Link href="/directory" className="btn btn-primary mt-2">Trova un&apos;attività</Link>
      </div>
    </AccountShell>
  );
}
