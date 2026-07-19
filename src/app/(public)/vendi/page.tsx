import type { Metadata } from "next";
import Link from "next/link";
import {
  IconArrowRight,
  IconBox,
  IconChart,
  IconTag,
  IconVerified,
  IconWallet,
} from "@/components/icons";
import { commissionRateLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Vendi le tue scorte",
  description:
    "Pubblica stock, componenti e rimanenze di produzione su Scortvia. Commissione solo sulla vendita conclusa.",
};

export default function VendiPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="absolute inset-0 grid-texture opacity-50" aria-hidden />
        <div className="container-page relative grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="chip bg-brand-soft text-brand-dark">
              <IconWallet width={14} height={14} /> Commissione {commissionRateLabel()} solo sulla vendita
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-ink">
              Vendi le tue scorte a tutta Italia
            </h1>
            <p className="mt-4 text-lg text-ink-soft">
              Trasforma eccedenze di magazzino, fine serie e rimanenze di
              produzione in liquidità. Pubblichi in pochi minuti e paghi solo
              quando concludi la vendita.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/venditore/pubblica" className="btn btn-primary">
                Pubblica un lotto <IconArrowRight width={18} height={18} />
              </Link>
              <Link href="/venditore" className="btn btn-outline">
                Vai all&apos;area venditore
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              [IconBox, "Pubblica in minuti", "Titolo, quantità, prezzo, foto e documenti."],
              [IconTag, "Ricevi offerte", "Trattativa su prezzo e quantità tracciata."],
              [IconVerified, "Vendi verificato", "Il badge azienda verificata aumenta la fiducia."],
              [IconChart, "Monitora tutto", "Dashboard con ricavi, offerte e statistiche."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof IconBox;
              return (
                <div key={t as string} className="card p-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-steel-soft text-steel">
                    <I width={20} height={20} />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-ink">{t as string}</p>
                  <p className="mt-1 text-xs text-muted">{d as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["1", "Registra e verifica", "Crea l'account aziendale e supera la verifica KYB simulata."],
            ["2", "Pubblica i lotti", "Carica scorte e componenti con documentazione tecnica."],
            ["3", "Concludi e incassa", `Gestisci offerte e ordini. Commissione ${commissionRateLabel()} solo sul venduto.`],
          ].map(([n, t, d]) => (
            <div key={n} className="card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                {n}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{t}</h3>
              <p className="mt-1 text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-dark border-t border-line">
        <div className="container-page flex flex-col items-center gap-5 py-12 text-center">
          <h2 className="text-2xl font-bold text-white">
            Pronto a rimettere in circolo le tue scorte?
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/registrati" className="btn btn-primary">
              Registra la tua azienda
            </Link>
            <Link
              href="/venditore/pubblica"
              className="btn btn-outline border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Pubblica un lotto di prova
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
