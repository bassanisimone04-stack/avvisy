import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import LotCard from "@/components/LotCard";
import CategoryCard from "@/components/CategoryCard";
import {
  IconArrowRight,
  IconRecycle,
  IconShield,
  IconTag,
  IconVerified,
  IconWallet,
} from "@/components/icons";
import { categories, companies, lots } from "@/lib/mock-data";
import { commissionRateLabel, formatNumber } from "@/lib/format";

const advantages = [
  {
    icon: IconVerified,
    title: "Aziende verificate",
    text: "Ogni venditore supera una verifica KYB simulata su partita IVA e sede legale.",
  },
  {
    icon: IconTag,
    title: "Offerte trasparenti",
    text: "Prezzi, quantità e trattative sempre visibili, senza costi nascosti.",
  },
  {
    icon: IconShield,
    title: "Pagamenti protetti tramite partner",
    text: "Fondi gestiti da un partner di pagamento fino alla conferma dell'ordine.",
  },
  {
    icon: IconWallet,
    title: "Commissione solo sulla vendita",
    text: `Scortvia trattiene il ${commissionRateLabel()} indicativo solo a transazione conclusa.`,
  },
];

export default function HomePage() {
  const featured = lots.filter((l) => l.featured).slice(0, 6);
  const verifiedCount = companies.filter((c) => c.status === "verificata").length;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="absolute inset-0 grid-texture opacity-60" aria-hidden />
        <div
          className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-brand-soft/60 to-transparent"
          aria-hidden
        />
        <div className="container-page relative py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mx-auto bg-brand-soft text-brand-dark">
              <IconRecycle width={14} height={14} />
              Marketplace B2B verificato · Economia circolare
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] text-ink md:text-5xl">
              Trasforma le scorte ferme in nuove opportunità.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">
              Compra e vendi stock, componenti e materiali aziendali in un
              mercato B2B verificato.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/marketplace" className="btn btn-primary">
                Esplora il marketplace
                <IconArrowRight width={18} height={18} />
              </Link>
              <Link href="/vendi" className="btn btn-outline">
                Vendi le tue scorte
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-4xl">
            <HeroSearch />
            <p className="mt-3 text-center text-xs text-muted">
              Ricerche popolari:{" "}
              {["cuscinetti", "bancali EPAL", "quadri elettrici", "gres porcellanato"].map(
                (t, i) => (
                  <span key={t}>
                    {i > 0 && " · "}
                    <Link
                      href={`/marketplace?q=${encodeURIComponent(t)}`}
                      className="hover:text-brand-dark"
                    >
                      {t}
                    </Link>
                  </span>
                ),
              )}
            </p>
          </div>
        </div>
      </section>

      {/* VANTAGGI */}
      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => (
            <div key={a.title} className="card p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-dark">
                <a.icon width={20} height={20} />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-ink">{a.title}</h3>
              <p className="mt-1 text-sm text-muted">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIE */}
      <section className="container-page pb-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Categorie principali</h2>
            <p className="mt-1 text-muted">
              Trova subito la merce che ti serve, per settore.
            </p>
          </div>
          <Link
            href="/categorie"
            className="hidden items-center gap-1 text-sm font-semibold text-brand-dark hover:underline sm:inline-flex"
          >
            Tutte le categorie
            <IconArrowRight width={16} height={16} />
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* LOTTI IN EVIDENZA */}
      <section className="border-y border-line bg-surface-2/50">
        <div className="container-page py-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Lotti in evidenza</h2>
              <p className="mt-1 text-muted">
                Stock e componenti selezionati da aziende verificate.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="hidden items-center gap-1 text-sm font-semibold text-brand-dark hover:underline sm:inline-flex"
            >
              Vai al marketplace
              <IconArrowRight width={16} height={16} />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        </div>
      </section>

      {/* COME FUNZIONA + FIDUCIA */}
      <section className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-ink">
              Un mercato B2B costruito sulla fiducia
            </h2>
            <p className="mt-3 text-ink-soft">
              Scortvia mette in contatto responsabili acquisti, magazzinieri e
              imprenditori. Pubblichi i tuoi stock, ricevi offerte, concludi la
              trattativa e gestisci tutto da un&apos;unica dashboard.
            </p>
            <ol className="mt-6 space-y-4">
              {[
                ["Pubblica o cerca", "Carichi un lotto o filtri le merci per categoria, regione e condizione."],
                ["Tratta e concludi", "Acquisto immediato oppure offerta su prezzo e quantità con trattativa tracciata."],
                ["Gestisci in sicurezza", "Ordini, documenti e pagamenti simulati gestiti tramite partner dedicati."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
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
            <div className="mt-7 flex gap-3">
              <Link href="/come-funziona" className="btn btn-outline btn-sm">
                Come funziona
              </Link>
              <Link href="/registrati" className="btn btn-primary btn-sm">
                Registra la tua azienda
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              [formatNumber(lots.length * 106), "Lotti pubblicati"],
              [`${verifiedCount * 68}+`, "Aziende verificate"],
              [commissionRateLabel(), "Commissione sulla vendita"],
              ["24/7", "Marketplace sempre attivo"],
            ].map(([v, l]) => (
              <div key={l} className="card p-6 text-center">
                <p className="text-3xl font-bold text-brand-dark">{v}</p>
                <p className="mt-1 text-sm text-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="border-t border-line bg-ink">
        <div className="container-page flex flex-col items-center gap-6 py-14 text-center">
          <h2 className="max-w-2xl text-2xl font-bold text-white md:text-3xl">
            Hai scorte ferme in magazzino? Rimettile in circolo.
          </h2>
          <p className="max-w-xl text-white/70">
            Registra la tua azienda, supera la verifica e pubblica il primo
            lotto in pochi minuti. La commissione la paghi solo quando vendi.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/vendi" className="btn btn-primary">
              Inizia a vendere
            </Link>
            <Link href="/marketplace" className="btn btn-outline border-white/20 bg-transparent text-white hover:bg-white/10">
              Esplora il marketplace
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
