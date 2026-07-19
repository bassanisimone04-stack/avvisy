import type { Metadata } from "next";
import Link from "next/link";
import {
  IconArrowRight,
  IconDoc,
  IconShield,
  IconTag,
  IconVerified,
  IconWallet,
} from "@/components/icons";
import { commissionRateLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Come funziona",
  description:
    "Come funziona Scortvia: verifica delle aziende, pubblicazione dei lotti, offerte, ordini e commissione solo sulla vendita.",
};

const buyerSteps = [
  ["Cerca e filtra", "Trova stock e componenti per categoria, regione, prezzo e condizione."],
  ["Acquista o offri", "Compra al volo oppure invia un'offerta su prezzo e quantità."],
  ["Concludi in sicurezza", "Pagamento simulato in deposito presso il partner fino alla consegna."],
  ["Valuta il venditore", "Lascia una recensione e costruisci la reputazione del marketplace."],
];

const sellerSteps = [
  ["Verifica l'azienda", "Carichi i documenti: la verifica KYB simulata conferma partita IVA e sede."],
  ["Pubblica il lotto", "Descrizione tecnica, quantità, prezzo, documenti e modalità di consegna."],
  ["Gestisci le offerte", "Accetti, rifiuti o rilanci le proposte ricevute dai compratori."],
  ["Incassa la vendita", `Ricevi il pagamento simulato. Scortvia trattiene il ${commissionRateLabel()} solo a vendita conclusa.`],
];

export default function ComeFunzionaPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-12 text-center">
          <h1 className="text-3xl font-bold text-ink md:text-4xl">
            Come funziona Scortvia
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-ink-soft">
            Un mercato B2B trasparente dove le aziende verificate rimettono in
            circolo scorte e componenti, senza costi fissi.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <span className="chip bg-steel-soft text-steel">Per chi compra</span>
            <h2 className="mt-3 text-2xl font-bold text-ink">Acquistare su Scortvia</h2>
            <ol className="mt-5 space-y-4">
              {buyerSteps.map(([t, d], i) => (
                <li key={t} className="card flex gap-4 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-steel-btn text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{t}</p>
                    <p className="text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/marketplace" className="btn btn-outline btn-sm mt-5">
              Vai al marketplace <IconArrowRight width={16} height={16} />
            </Link>
          </div>

          <div>
            <span className="chip bg-brand-soft text-brand-dark">Per chi vende</span>
            <h2 className="mt-3 text-2xl font-bold text-ink">Vendere su Scortvia</h2>
            <ol className="mt-5 space-y-4">
              {sellerSteps.map(([t, d], i) => (
                <li key={t} className="card flex gap-4 p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{t}</p>
                    <p className="text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/vendi" className="btn btn-primary btn-sm mt-5">
              Inizia a vendere <IconArrowRight width={16} height={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface-2/50">
        <div className="container-page py-12">
          <h2 className="text-center text-2xl font-bold text-ink">
            Perché fidarsi di Scortvia
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [IconVerified, "Aziende verificate", "Verifica KYB simulata su ogni azienda prima della pubblicazione."],
              [IconTag, "Trattative trasparenti", "Prezzi, quantità e stati delle offerte sempre visibili."],
              [IconShield, "Pagamenti protetti", "Fondi gestiti da un partner fino alla conferma dell'ordine."],
              [IconWallet, "Commissione sul risultato", `Solo il ${commissionRateLabel()} sulla vendita, nessun costo fisso.`],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof IconVerified;
              return (
                <div key={t as string} className="card p-5">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-dark">
                    <I width={20} height={20} />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-ink">{t as string}</h3>
                  <p className="mt-1 text-sm text-muted">{d as string}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex justify-center">
            <div className="card flex items-center gap-3 p-4">
              <IconDoc className="text-steel" />
              <p className="text-sm text-muted">
                Prototipo dimostrativo: dati fittizi, verifica e pagamenti
                simulati. Nessuna transazione reale viene eseguita.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
