import Link from "next/link";
import Logo from "./Logo";
import { commissionRateLabel } from "@/lib/format";

const cols: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Marketplace",
    links: [
      { href: "/marketplace", label: "Esplora i lotti" },
      { href: "/categorie", label: "Categorie" },
      { href: "/come-funziona", label: "Come funziona" },
      { href: "/vendi", label: "Vendi le tue scorte" },
    ],
  },
  {
    title: "Aziende",
    links: [
      { href: "/aziende", label: "Directory aziende" },
      { href: "/soluzioni", label: "Soluzioni per aziende" },
      { href: "/venditore", label: "Area venditore" },
      { href: "/compratore", label: "Area compratore" },
      { href: "/admin", label: "Pannello amministratore" },
    ],
  },
  {
    title: "Supporto",
    links: [
      { href: "/assistenza", label: "Centro assistenza" },
      { href: "/registrati", label: "Registra la tua azienda" },
      { href: "/accedi", label: "Accedi" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm text-muted">
            La nuova via delle scorte aziendali. Marketplace B2B italiano per
            comprare e vendere stock, componenti e materiali tra aziende
            verificate.
          </p>
          <p className="mt-4 text-xs text-muted">
            Commissione {commissionRateLabel()} solo sulle vendite concluse.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-brand-dark"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Scortvia — Prototipo dimostrativo. Dati fittizi, nessun pagamento reale.</p>
          <div className="flex flex-wrap gap-4">
            <span>Privacy</span>
            <span>Termini</span>
            <span>Verifica KYB simulata</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
