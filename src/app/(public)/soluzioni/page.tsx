import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { WarehouseCalculator, TransportEstimator } from "@/components/tools";
import {
  IconArrowRight,
  IconBox,
  IconChart,
  IconDoc,
  IconRecycle,
  IconShield,
  IconStore,
  IconTag,
  IconTruck,
  IconWallet,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Soluzioni per aziende",
  description:
    "Le soluzioni Scortvia ai problemi delle scorte ferme: magazzino immobilizzato, trasporto, obsolescenza, liquidità. Con calcolatori interattivi.",
};

const problems = [
  { icon: IconBox, problem: "Magazzino immobilizzato", detail: "Le scorte ferme occupano spazio e capacità che potrebbero servire alla produzione.", solution: "Liberi spazio vendendo i lotti in eccedenza a chi ne ha bisogno." },
  { icon: IconWallet, problem: "Liquidità bloccata", detail: "Il capitale resta congelato nelle rimanenze e non genera valore.", solution: "Converti le scorte ferme in cassa reinvestibile subito." },
  { icon: IconTag, problem: "Obsolescenza tecnica", detail: "Fine serie e componenti superati perdono valore ogni mese che passa.", solution: "Vendi prima che si svalutino, con trattativa trasparente." },
  { icon: IconTruck, problem: "Costi e logistica di trasporto", detail: "Organizzare spedizione o ritiro di bancali e lotti grandi è complesso e costoso.", solution: "Ritiro assistito e corrieri convenzionati, con stima dei costi." },
  { icon: IconStore, problem: "Trovare acquirenti B2B", detail: "Il mercato di nicchia delle eccedenze è difficile da raggiungere da soli.", solution: "Una rete di aziende verificate che cercano esattamente ciò che offri." },
  { icon: IconRecycle, problem: "Sostenibilità e smaltimento", detail: "Smaltire scorte inutilizzate genera rifiuti e costi ambientali.", solution: "Rimetti le merci in circolo: economia circolare invece di smaltimento." },
  { icon: IconShield, problem: "Affidabilità delle controparti", detail: "Trattare con aziende sconosciute espone a rischi e insoluti.", solution: "Verifica KYB simulata e pagamenti protetti tramite partner." },
  { icon: IconDoc, problem: "Gestione documentale e fiscale", detail: "Rimanenze a bilancio, DDT, certificati e fatture da tenere in ordine.", solution: "Documenti, note di commissione e fatturazione integrati (simulati)." },
];

const integrations = [
  ["Provider di pagamento marketplace", "Deposito fondi e split payment con commissione automatica."],
  ["Verifica KYC/KYB", "Onboarding aziende con controllo identità e partita IVA."],
  ["Logistica e trasporti", "Preventivi, ritiri e tracciamento con partner di trasporto."],
  ["Fatturazione elettronica", "Emissione documenti e note di commissione."],
  ["Messaggistica", "Comunicazione tra compratori e venditori integrata."],
  ["Gestione documentale", "Archiviazione di schede tecniche, certificati e DDT."],
];

export default function SoluzioniPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="absolute inset-0 blueprint opacity-60" aria-hidden />
        <div className="container-page relative py-14">
          <span className="eyebrow">Soluzioni per aziende</span>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold text-ink md:text-5xl">
            Le scorte ferme sono un costo. Scortvia le trasforma in valore.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Ogni magazzino ha eccedenze che occupano spazio, bloccano liquidità e
            si svalutano. Ecco i problemi più comuni e come li affrontiamo.
          </p>
        </div>
      </section>

      {/* PROBLEMI → SOLUZIONI */}
      <section className="container-page py-14">
        <span className="mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-brand-dark">
          01 — I problemi delle scorte ferme
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">Dal problema alla soluzione</h2>
        <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => (
            <div key={p.problem} className="card card-accent flex flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand-dark">
                <p.icon width={22} height={22} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{p.problem}</h3>
              <p className="mt-1 flex-1 text-sm text-muted">{p.detail}</p>
              <p className="mt-3 border-t border-line pt-3 text-sm text-ink-soft">
                <span className="font-semibold text-verified">Soluzione — </span>{p.solution}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* CALCOLATORI */}
      <section className="border-y border-line bg-surface-2/40">
        <div className="container-page py-14">
          <span className="mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-brand-dark">
            02 — Strumenti
          </span>
          <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">Calcola quanto puoi recuperare</h2>
          <p className="mt-1.5 max-w-2xl text-muted">
            Stime interattive per capire il costo delle scorte ferme e la logistica.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <WarehouseCalculator />
            <TransportEstimator />
          </div>
        </div>
      </section>

      {/* INTEGRAZIONI */}
      <section className="container-page py-14">
        <div className="flex items-center gap-3">
          <IconChart className="text-brand" />
          <h2 className="text-2xl font-extrabold text-ink">Architettura pronta per l&apos;integrazione</h2>
        </div>
        <p className="mt-2 max-w-2xl text-muted">
          Il prototipo è predisposto per collegare i servizi esterni di un
          marketplace B2B in produzione. Qui sono simulati.
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
      </section>

      {/* CTA */}
      <section className="section-dark border-t border-line">
        <div className="container-page flex flex-col items-start gap-5 py-14 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-xl text-2xl font-extrabold text-white md:text-3xl">
            Fai i conti con il tuo magazzino. Poi rimettilo in circolo.
          </h2>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/registrati" className="btn btn-primary">Registra la tua azienda <IconArrowRight width={18} height={18} /></Link>
            <Link href="/aziende" className="btn btn-outline border-white/25 bg-transparent text-white hover:bg-white/10">Esplora le aziende</Link>
          </div>
        </div>
      </section>
    </>
  );
}
