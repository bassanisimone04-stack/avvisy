import { BarChart3 } from "lucide-react";
import AdminShell from "@/components/AdminShell";

export default function AdminAnalytics() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-ink">Analytics</h1>
      <p className="mt-1 text-ink-soft">Traffico reale del sito</p>

      <div className="card card-soft mt-6 flex flex-col items-center gap-3 p-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand-dark">
          <BarChart3 size={22} />
        </span>
        <p className="font-semibold text-ink">Vercel Web Analytics è collegato al sito</p>
        <p className="max-w-md text-sm text-ink-soft">
          I dati di traffico reali (visite, pagine più viste, provenienza) si vedono nella dashboard di Vercel del progetto, sezione "Analytics" — non qui, per evitare di mostrare numeri non aggiornati o sbagliati in questo pannello.
        </p>
        <a
          href="https://vercel.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm mt-2"
        >
          Apri Vercel Analytics
        </a>
      </div>
    </AdminShell>
  );
}
