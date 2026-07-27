"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Leaf } from "lucide-react";
import { useStore } from "@/lib/store";

export default function RegisterPage() {
  const { login } = useStore();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [celiac, setCeliac] = useState(true);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(name || "Nuovo utente", email);
    router.push("/account");
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="card card-soft w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-solid text-white"><Leaf size={22} /></span>
          <h1 className="mt-4 text-2xl font-bold text-ink">Crea il tuo account</h1>
          <p className="mt-1 text-sm text-ink-soft">Gratuito, per sempre: salva preferiti, scrivi recensioni, ricevi notifiche.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="field-label">Nome e cognome</label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="field pl-10" placeholder="Mario Rossi" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field pl-10" placeholder="nome@email.it" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="field-label">Password</label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field pl-10" placeholder="••••••••" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={celiac} onChange={(e) => setCeliac(e.target.checked)} className="h-4 w-4 accent-[var(--gf-brand)]" />
            Sono celiaco/a o ho un familiare celiaco
          </label>
          <button type="submit" className="btn btn-primary btn-block">Crea account</button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-soft">
          Hai già un account? <Link href="/accedi" className="font-semibold text-brand-dark link-underline">Accedi</Link>
        </p>
      </div>
    </div>
  );
}
