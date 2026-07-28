"use client";

import Link from "next/link";
import { HeartOff } from "lucide-react";
import AccountShell from "@/components/AccountShell";
import BusinessCard from "@/components/BusinessCard";
import { useStore } from "@/lib/store";
import { BUSINESSES } from "@/lib/mock-businesses";

export default function FavoritesPage() {
  const { favorites } = useStore();
  const businesses = BUSINESSES.filter((b) => favorites.includes(b.id));

  return (
    <AccountShell>
      <h1 className="text-2xl font-bold text-ink">I tuoi preferiti</h1>
      <p className="mt-1 text-ink-soft">{businesses.length} attività salvate</p>

      {businesses.length === 0 ? (
        <div className="card card-soft mt-6 flex flex-col items-center gap-3 p-12 text-center">
          <HeartOff size={28} className="text-muted" />
          <p className="font-medium text-ink">Non hai ancora salvato nessuna attività</p>
          <Link href="/directory" className="btn btn-primary mt-2">Esplora la directory</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {businesses.map((b) => <BusinessCard key={b.id} business={b} />)}
        </div>
      )}
    </AccountShell>
  );
}
