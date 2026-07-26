import Link from "next/link";
import { CompassIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand-dark"><CompassIcon size={28} /></span>
      <h1 className="text-3xl font-bold text-ink">Pagina non trovata</h1>
      <p className="max-w-sm text-ink-soft">La pagina che cerchi non esiste o è stata spostata. Torna alla home o esplora la directory.</p>
      <div className="flex gap-3">
        <Link href="/" className="btn btn-outline">Torna alla home</Link>
        <Link href="/directory" className="btn btn-primary">Vai alla directory</Link>
      </div>
    </div>
  );
}
