import type { Metadata } from "next";
import Link from "next/link";
import {
  IconArrowRight,
  IconChart,
  IconDoc,
  IconRecycle,
  IconShield,
  IconStore,
  IconTruck,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Soluzioni per aziende",
  description:
    "Soluzioni Scortvia per responsabili acquisti, magazzini e produzione: dismissione scorte, approvvigionamento e integrazioni.",
};

const solutions = [
  {
    icon: IconRecycle,
    title: "Dismissione scorte",
    text: "Liquida eccedenze, fine serie e resi di produzione senza svalutare il magazzino.",
  },
  {
    icon: IconStore,
    title: "Approvvigionamento smart",
    text: "Trova componenti e materiali a prezzi di stock da fornitori verificati.",
  },
  {
    icon: IconChart,
    title: "Controllo e reportistica",
    text: "Dashboard con valore degli stock, offerte, ordini e ricavi.",
  },
  {
    icon: IconShield,
    title: "Compliance e verifica",
    text: "Verifica KYB simulata delle controparti e tracciabilità delle transazioni.",
  },
];

const integrations = [
  ["Provider di pagamento marketplace", "Deposito fondi e split payment con commissione automatica."],
  ["Verifica KYC/KYB", "Onboarding aziende con controllo identità e partita IVA."],
  ["Messaggistica", "Comunicazione tra compratori e venditori integrata."],
  ["Logistica", "Preventivi e ritiri con corrieri e partner di trasporto."],
  ["Fatturazione elettronica", "Emissione documenti e note di commissione."],
  ["Notifiche email", "Avvisi su offerte, ordini e stati di verifica."],
  ["Gestione documentale", "Archiviazione di schede tecniche, certificati e DDT."],
];

export default function SoluzioniPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-12">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">
            Soluzioni per aziende
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            Che tu debba liberare magazzino o rifornirti a costi competitivi,
            Scortvia offre gli strumenti per gestire scorte e componenti in modo
            professionale e tracciato.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {solutions.map((s) => (
            <div key={s.title} className="card flex gap-4 p-5">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-dark">
                <s.icon width={22} height={22} />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface-2/50">
        <div className="container-page py-12">
          <div className="flex items-center gap-3">
            <IconTruck className="text-steel" />
            <h2 className="text-2xl font-bold text-ink">
              Architettura pronta per l&apos;integrazione
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-muted">
            Il prototipo è predisposto per collegare i servizi esterni necessari
            a un marketplace B2B in produzione. Nel prototipo sono simulati.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {integrations.map(([t, d]) => (
              <div key={t} className="card flex items-start gap-3 p-4">
                <IconDoc className="mt-0.5 shrink-0 text-muted" width={18} height={18} />
                <div>
                  <p className="text-sm font-semibold text-ink">{t}</p>
                  <p className="text-xs text-muted">{d}</p>
                  <span className="chip mt-2 bg-signal-soft text-signal">Simulato</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="card flex flex-col items-center gap-4 p-8 text-center">
          <h2 className="text-2xl font-bold text-ink">
            Parliamo delle esigenze della tua azienda
          </h2>
          <p className="max-w-xl text-muted">
            Registra l&apos;azienda per accedere alle aree dedicate a venditori e
            compratori e provare l&apos;intero flusso.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/registrati" className="btn btn-primary">
              Registra la tua azienda <IconArrowRight width={18} height={18} />
            </Link>
            <Link href="/assistenza" className="btn btn-outline">
              Contatta l&apos;assistenza
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
