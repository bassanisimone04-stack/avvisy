import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2, Download, FileText, Printer } from "lucide-react";
import Reveal from "@/components/Reveal";
import { GUIDE2 } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import meta from "@/lib/guide-meta.json";

/**
 * Blocco della guida PDF per la home: chiaro, in movimento, con due pulsanti
 * (scopri la guida / acquista). Numeri letti da guide-meta.json, mai scritti a mano.
 */
export default function GuidePromo({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const g = en ? meta.en : meta.it;
  const checkoutUrl = en ? GUIDE2.checkoutUrlEn : GUIDE2.checkoutUrl;
  const img = (name: string) => `/images/guida/${en ? "en" : "it"}-${name}.jpg`;
  const points = en
    ? [`${g.chapters} chapters, from diagnosis to travel`, "Quick sheet and restaurant checklist", "Readable offline, sheets to print"]
    : [`${g.chapters} capitoli, dalla diagnosi ai viaggi`, "Scheda rapida e checklist per il ristorante", "Si legge offline, schede da stampare"];

  return (
    <section className="gf-guide relative isolate overflow-hidden bg-[linear-gradient(135deg,#fff8e6_0%,#fdf2d6_45%,#eaf5ee_100%)]">
      <div aria-hidden="true" className="gf-blob absolute -left-24 -top-20 -z-10 h-80 w-80 rounded-full bg-[#f2b100]/30 blur-3xl" />
      <div aria-hidden="true" className="gf-blob gf-blob-2 absolute -bottom-28 right-[-5rem] -z-10 h-96 w-96 rounded-full bg-[#2d6a4f]/20 blur-3xl" />
      <div className="container-page grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative mx-auto h-[360px] w-full max-w-[380px] sm:h-[420px]">
          <div className="gf-fan gf-fan-l absolute left-[6%] top-[12%] w-[46%]">
            <Image src={img("scheda")} alt="" width={1628} height={2310} sizes="180px" className="h-auto w-full rounded-lg shadow-xl ring-1 ring-black/10" />
          </div>
          <div className="gf-fan gf-fan-r absolute right-[4%] top-[10%] w-[46%]">
            <Image src={img("checklist")} alt="" width={1628} height={2310} sizes="180px" className="h-auto w-full rounded-lg shadow-xl ring-1 ring-black/10" />
          </div>
          <div className="animate-float absolute left-1/2 top-0 w-[60%] -translate-x-1/2">
            <Image
              src={img("cover")}
              alt={en ? "Cover of the PDF guide Live Gluten-Free" : "Copertina della guida PDF Vivere Senza Glutine"}
              width={1628}
              height={2310}
              sizes="240px"
              className="h-auto w-full rounded-xl shadow-[0_30px_60px_-20px_rgba(20,35,28,0.55)] ring-1 ring-black/10"
            />
          </div>
          <span className="gf-badge absolute -left-1 bottom-12 rounded-2xl bg-white px-3.5 py-2 text-sm font-bold text-[#14231c] shadow-lg ring-1 ring-black/5">
            <FileText size={15} className="mr-1.5 inline text-[#c2431f]" />
            {g.pages} {en ? "pages" : "pagine"}
          </span>
          <span className="gf-badge gf-badge-2 absolute -right-1 bottom-24 rounded-2xl bg-white px-3.5 py-2 text-sm font-bold text-[#14231c] shadow-lg ring-1 ring-black/5">
            <Printer size={15} className="mr-1.5 inline text-[#2d6a4f]" />
            {en ? "Printable" : "Da stampare"}
          </span>
        </div>

        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#963316] shadow-sm ring-1 ring-[#f0d9a0]">
              <BookOpenCheck size={14} /> {en ? "The PDF guide" : "La guida in PDF"}
            </span>
            <h2 className="font-editorial mt-4 text-3xl font-semibold leading-tight text-[#14231c] sm:text-4xl">
              {en ? "Everything about living gluten-free, " : "Tutto sul vivere senza glutine, "}
              <span className="gf-gradient-text">{en ? "in one guide." : "in un'unica guida."}</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-[#4a5a51]">
              {en
                ? "What to eat, how to read labels, what to ask at the restaurant and how to travel: in order, on your phone, with the sheets to print."
                : "Cosa mangiare, come leggere le etichette, cosa chiedere al ristorante e come viaggiare: in ordine, sul telefono, con le schede da stampare."}
            </p>
            <ul className="mt-5 space-y-2 text-[#14231c]">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="shrink-0 text-[#2d6a4f]" /> {p}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {checkoutUrl && (
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="gf-shine inline-flex items-center gap-2 rounded-full bg-[#c2431f] px-6 py-3.5 font-semibold text-white shadow-[0_14px_30px_-12px_rgba(194,67,31,0.7)] transition hover:-translate-y-0.5 hover:bg-[#963316]"
                >
                  <Download size={18} /> {en ? "Get it" : "Scaricala"} · {GUIDE2.price}
                </a>
              )}
              <Link
                href={localeHref(locale, "/vivere-senza-glutine")}
                className="group inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-3.5 font-semibold text-[#14231c] shadow-sm ring-1 ring-[#e8d6a8] transition hover:-translate-y-0.5"
              >
                {en ? "See what's inside" : "Guarda cosa c'è dentro"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
