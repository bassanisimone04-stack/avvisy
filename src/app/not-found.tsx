import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-canvas p-6 text-center">
      <Logo />
      <p className="text-6xl font-bold text-brand-dark">404</p>
      <h1 className="text-2xl font-bold text-ink">Pagina non trovata</h1>
      <p className="max-w-md text-muted">
        Il lotto o la pagina che cerchi non è disponibile. Torna al marketplace
        per continuare a esplorare le scorte aziendali.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn btn-outline">Home</Link>
        <Link href="/marketplace" className="btn btn-primary">Vai al marketplace</Link>
      </div>
    </div>
  );
}
