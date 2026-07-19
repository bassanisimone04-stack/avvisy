import Link from "next/link";
import HeroSearch from "@/components/HeroSearch";
import LotCard from "@/components/LotCard";
import LotImage from "@/components/LotImage";
import CategoryCard from "@/components/CategoryCard";
import { ConditionChip, VerifiedBadge } from "@/components/badges";
import {
  IconArrowRight,
  IconMapPin,
  IconRecycle,
  IconShield,
  IconTag,
  IconVerified,
  IconWallet,
} from "@/components/icons";
import { categories, companies, lots } from "@/lib/mock-data";
import { commissionRateLabel, formatEuro, formatNumber } from "@/lib/format";
import { lotTotal } from "@/lib/types";

const advantages = [
  { icon: IconVerified, title: "Aziende verificate", text: "Ogni venditore supera una verifica KYB simulata su partita IVA e sede legale." },
  { icon: IconTag, title: "Offerte trasparenti", text: "Prezzi, quantità e trattative sempre visibili, senza costi nascosti." },
  { icon: IconShield, title: "Pagamenti protetti", text: "Fondi gestiti da un partner di pagamento fino alla conferma dell'ordine." },
  { icon: IconWallet, title: "Commissione sul venduto", text: `Scortvia trattiene il ${commissionRateLabel()} indicativo solo a transazione conclusa.` },
];

const testimonials = [
  { quote: "Abbiamo liberato un intero magazzino di fine serie in tre settimane, senza svalutare a bilancio.", author: "Responsabile acquisti", company: "Metalfer Componenti" },
  { quote: "Troviamo ricambi e componenti a prezzi di stock da fornitori già verificati. Trattativa tutta tracciata.", author: "Ufficio produzione", company: "Officine Meccaniche Ferraris" },
  { quote: "La commissione solo sul venduto ci ha convinto a provare. Ora pubblichiamo ogni eccedenza.", author: "Direzione", company: "PackItalia Imballaggi" },
];

export default function HomePage() {
  const published = lots.filter((l) => l.status === "Pubblicato");
  const featured = published.filter((l) => l.featured).slice(0, 6);
  const heroLot = featured[0];
  const recent = [...published]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 4);
  const verifiedCount = companies.filter((c) => c.verification === "Verificata").length;

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="absolute inset-0 blueprint opacity-70" aria-hidden />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-soft/50 blur-3xl" aria-hidden />
        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <span className="eyebrow inline-flex items-center gap-2">
              <IconRecycle width={15} height={15} /> Marketplace B2B · Economia circolare
            </span>
            <h1 className="mt-5 text-[2.6rem] leading-[1.02] text-ink sm:text-6xl">
              Le scorte ferme
              <br />
              diventano{" "}
              <span className="relative whitespace-nowrap text-brand">
                liquidità
                <svg className="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 7 Q100 1 198 6" stroke="var(--s-brand)" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-soft">
              Compra e vendi stock, componenti industriali, ricambi e rimanenze
              di produzione in un mercato B2B verificato, trasparente e tracciato.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/marketplace" className="btn btn-primary">
                Esplora il marketplace <IconArrowRight width={18} height={18} />
              </Link>
              <Link href="/vendi" className="btn btn-outline">Vendi le tue scorte</Link>
            </div>
            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
              {[["150+", "Lotti"], ["80", "Aziende"], [commissionRateLabel(), "Commissione"]].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-extrabold text-ink">{v}</dt>
                  <dd className="mono text-[0.7rem] uppercase tracking-wider text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Vetrina lotto in evidenza */}
          {heroLot && (
            <div className="relative">
              <div className="absolute -left-4 -top-4 hidden h-full w-full rounded-xl border border-line-strong lg:block" aria-hidden />
              <Link href={`/lotto/${heroLot.id}`} className="card card-soft relative block overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
                <div className="relative">
                  <LotImage category={heroLot.category} seed={heroLot.images[0] ?? 1} ratio="aspect-[16/10]" />
                  <span className="absolute left-3 top-3 chip bg-ink/85 text-white">In evidenza</span>
                  <span className="absolute right-3 top-3 mono rounded bg-surface/95 px-2 py-1 text-[0.7rem] text-ink-soft shadow-sm">{heroLot.code}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <ConditionChip condition={heroLot.condition} />
                    <VerifiedBadge size="xs" />
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-ink">{heroLot.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                    <IconMapPin width={14} height={14} /> {heroLot.province}, {heroLot.region}
                  </p>
                  <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
                    <div>
                      <p className="mono text-[0.7rem] uppercase tracking-wide text-muted">Prezzo unitario</p>
                      <p className="font-display text-xl font-extrabold text-ink">{formatEuro(heroLot.unitPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="mono text-[0.7rem] uppercase tracking-wide text-muted">Valore lotto</p>
                      <p className="font-display text-xl font-extrabold text-brand">{formatEuro(lotTotal(heroLot), true)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Barra ricerca */}
        <div className="container-page relative pb-14">
          <div className="mx-auto max-w-4xl">
            <HeroSearch />
            <p className="mt-3 text-center text-sm text-muted">
              <span className="mono text-xs uppercase tracking-wider">Ricerche popolari:</span>{" "}
              {["cuscinetti", "bancali EPAL", "quadri elettrici", "gres porcellanato"].map((t, i) => (
                <span key={t}>
                  {i > 0 && " · "}
                  <Link href={`/marketplace?q=${encodeURIComponent(t)}`} className="link-underline hover:text-brand-dark">{t}</Link>
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* SETTORI / WORDMARK STRIP */}
      <section className="border-b border-line bg-ink">
        <div className="container-page flex flex-wrap items-center gap-x-8 gap-y-2 py-4 text-white/60">
          <span className="mono text-[0.7rem] uppercase tracking-widest text-white/40">Settori attivi</span>
          {["Meccanica", "Edilizia", "Logistica", "Elettrotecnica", "Utensileria", "Materie prime"].map((s) => (
            <span key={s} className="font-display text-sm font-semibold tracking-tight">{s}</span>
          ))}
        </div>
      </section>

      {/* VANTAGGI */}
      <section className="container-page py-14">
        <SectionHead index="01" title="Perché Scortvia" subtitle="Un mercato costruito per responsabili acquisti, magazzini e produzione." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => (
            <div key={a.title} className="card p-5 transition-colors hover:border-line-strong">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand-dark">
                <a.icon width={22} height={22} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{a.title}</h3>
              <p className="mt-1 text-sm text-muted">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIE */}
      <section className="container-page pb-14">
        <SectionHead index="02" title="Categorie principali" subtitle="Trova subito la merce che ti serve, per settore." link={{ href: "/categorie", label: "Tutte le categorie" }} />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </section>

      {/* LOTTI IN EVIDENZA */}
      <section className="border-y border-line bg-surface-2/40">
        <div className="container-page py-14">
          <SectionHead index="03" title="Lotti in evidenza" subtitle="Stock e componenti selezionati da aziende verificate." link={{ href: "/marketplace", label: "Vai al marketplace" }} />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((lot) => <LotCard key={lot.id} lot={lot} />)}
          </div>
        </div>
      </section>

      {/* LOTTI RECENTI */}
      <section className="container-page py-14">
        <SectionHead index="04" title="Pubblicati di recente" subtitle="Gli ultimi lotti arrivati sul marketplace." link={{ href: "/marketplace", label: "Vedi tutti" }} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((lot) => <LotCard key={lot.id} lot={lot} />)}
        </div>
      </section>

      {/* COME FUNZIONA + STAT */}
      <section className="border-t border-line bg-surface">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHead index="05" title="Come funziona" />
            <ol className="mt-8 space-y-6">
              {[
                ["Pubblica o cerca", "Carichi un lotto in 5 passaggi o filtri le merci per categoria, regione e condizione."],
                ["Tratta e concludi", "Acquisto immediato oppure offerta su prezzo e quantità, con controproposte tracciate."],
                ["Gestisci in sicurezza", "Ordini, documenti e pagamenti simulati gestiti tramite partner dedicati."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5">
                  <span className="mono flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line-strong text-sm font-semibold text-brand-dark">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="font-display font-bold text-ink">{t}</p>
                    <p className="mt-0.5 text-sm text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex gap-3">
              <Link href="/come-funziona" className="btn btn-outline btn-sm">Scopri di più</Link>
              <Link href="/registrati" className="btn btn-primary btn-sm">Registra la tua azienda</Link>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-2 gap-4">
              {[["150+", "Lotti disponibili"], ["80", "Aziende registrate"], ["12", "Categorie"], [commissionRateLabel(), "Commissione standard"]].map(([v, l]) => (
                <div key={l} className="card p-6">
                  <p className="font-display text-4xl font-extrabold text-brand">{v}</p>
                  <p className="mt-1 text-sm text-muted">{l}</p>
                </div>
              ))}
            </div>
            <p className="mono mt-3 text-center text-[0.7rem] uppercase tracking-wider text-muted">
              Dati dimostrativi del prototipo · {verifiedCount} aziende verificate nel dataset
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIANZE */}
      <section className="border-t border-line bg-surface-2/40">
        <div className="container-page py-14">
          <SectionHead index="06" title="Cosa dicono le aziende" subtitle="Testimonianze fittizie a scopo dimostrativo." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.company} className="card flex flex-col p-6">
                <span className="font-display text-4xl leading-none text-brand/30">“</span>
                <blockquote className="-mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">{t.quote}</blockquote>
                <figcaption className="mt-4 border-t border-line pt-3">
                  <p className="font-display text-sm font-bold text-ink">{t.company}</p>
                  <p className="mono text-[0.7rem] uppercase tracking-wide text-muted">{t.author}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="relative overflow-hidden border-t border-line bg-ink">
        <div className="absolute inset-0 grid-texture opacity-20" aria-hidden />
        <div className="container-page relative flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="max-w-xl text-3xl font-extrabold text-white md:text-4xl">
              Hai scorte ferme in magazzino? Rimettile in circolo.
            </h2>
            <p className="mt-3 max-w-lg text-white/60">
              Registra la tua azienda, supera la verifica e pubblica il primo
              lotto in pochi minuti. La commissione la paghi solo quando vendi.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/vendi" className="btn btn-primary">Inizia a vendere</Link>
            <Link href="/marketplace" className="btn btn-outline border-white/20 bg-transparent text-white hover:bg-white/10">Esplora</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  index,
  title,
  subtitle,
  link,
}: {
  index: string;
  title: string;
  subtitle?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <span className="mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-brand-dark">
          {index} — {title}
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 text-muted">{subtitle}</p>}
      </div>
      {link && (
        <Link href={link.href} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-dark hover:underline sm:inline-flex">
          {link.label} <IconArrowRight width={16} height={16} />
        </Link>
      )}
    </div>
  );
}
