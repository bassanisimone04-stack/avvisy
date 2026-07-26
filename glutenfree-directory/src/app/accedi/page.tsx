"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Leaf } from "lucide-react";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [name] = useState("Chiara Marini");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(name, email || "chiara.marini@email.it");
    router.push("/account");
  }

  return (
    <div className="container-page flex justify-center py-16">
      <div className="card card-soft w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white"><Leaf size={22} /></span>
          <h1 className="mt-4 text-2xl font-bold text-ink">Bentornato</h1>
          <p className="mt-1 text-sm text-ink-soft">Accedi per salvare i preferiti e scrivere recensioni.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
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
          <button type="submit" className="btn btn-primary btn-block">Accedi</button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-soft">
          Non hai un account? <Link href="/registrati" className="font-semibold text-brand-dark link-underline">Registrati gratis</Link>
        </p>
      </div>
    </div>
  );
}
