import Link from "next/link";
import { CheckCircle2, Download, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/FaqAccordion";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { BUSINESSES } from "@/lib/mock-businesses";
import { GUIDE, SITE_NAME } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function GuideContent({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const en = locale === "en";
  const h = (path: string) => localeHref(locale, path);

  const totalCities = new Set(BUSINESSES.map((b) => b.city)).size;
  const totalRegions = new Set(BUSINESSES.map((b) => b.region)).size;
  const aicCount = BUSINESSES.filter((b) => b.aicCertified).length;

  const included = en
    ? [
        `${BUSINESSES.length} real venues verified one by one, no invented addresses`,
        "Organized by region and city, with category, price range and AIC status",
        "Clear distinction between AIC-certified and community-verified venues",
        "A practical checklist for eating out safely, before you order",
        "PDF readable on phone, tablet or printable",
      ]
    : [
        `${BUSINESSES.length} locali reali verificati uno per uno, nessun indirizzo inventato`,
        "Organizzati per regione e città, con categoria, fascia di prezzo e stato AIC",
        "Distinzione chiara tra locali certificati AIC e verificati dalla community",
        "Una checklist pratica per mangiare fuori in sicurezza, prima di ordinare",
        "PDF leggibile su telefono, tablet o stampabile",
      ];

  const faqs = en
    ? [
        { question: "How do I get the guide after purchase?", answer: "Download starts right after payment, directly from the checkout page, and you also get an email with the link to re-download it whenever you want." },
        { question: "What devices can I read it on?", answer: "It's a standard PDF: it opens on phone, tablet, computer, or can be printed. No app required." },
        { question: "Are the addresses up to date?", answer: "They're the same verified venues you find in the site's directory, checked one by one against official sources. Hours and availability can still change: always double-check before you go." },
        { question: "Is this the same information as the free directory?", answer: "Yes — the guide packages the same verified data from mappasenzaglutine.it into an offline, printable format for when you don't have signal or prefer not to search on your phone." },
      ]
    : [
        { question: "Come ricevo la guida dopo l'acquisto?", answer: "Il download parte subito dopo il pagamento, direttamente dalla pagina di checkout, e ricevi anche un'email con il link per riscaricarla quando vuoi." },
        { question: "Su quali dispositivi posso leggerla?", answer: "È un PDF standard: si apre su telefono, tablet, computer o si può stampare. Nessuna app richiesta." },
        { question: "Gli indirizzi sono aggiornati?", answer: "Sono gli stessi locali verificati che trovi nella directory del sito, controllati uno per uno su fonti ufficiali. Orari e disponibilità possono comunque cambiare: verifica sempre prima di partire." },
        { question: "È la stessa informazione della directory gratuita?", answer: "Sì — la guida raccoglie gli stessi dati verificati di mappasenzaglutine.it in un formato offline e stampabile, utile quando non hai connessione o preferisci non cercare dal telefono." },
      ];

  return (
    <div className="container-page py-10">
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs locale={locale} items={[{ name: t.nav.guide, path: "/guida" }]} />

      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="chip chip-brand">{en ? "Downloadable PDF" : "PDF scaricabile"}</span>
          <h1 className="font-editorial mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            {en ? `The ${SITE_NAME} Guide` : `La Guida ${SITE_NAME}`}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {en
              ? `${BUSINESSES.length} real, verified gluten-free venues across ${totalCities} Italian cities, organized by region — ready to check offline before you go out or travel. No invented data, only checked addresses.`
              : `${BUSINESSES.length} locali reali senza glutine verificati in ${totalCities} città italiane, organizzati per regione — pronti da consultare offline prima di uscire o partire. Nessun dato inventato, solo indirizzi controllati.`}
          </p>
          <p className="font-editorial mt-5 text-3xl font-bold text-brand-dark">{GUIDE.price}</p>
          {GUIDE.checkoutUrl ? (
            <a href={GUIDE.checkoutUrl} target="_blank" rel="sponsored noopener noreferrer" className="btn btn-primary mt-4 inline-flex items-center gap-2">
              <Download size={16} /> {en ? "Buy and download now" : "Acquista e scarica ora"}
            </a>
          ) : (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-muted">
              🔜 {en ? "Available soon" : "Disponibile a breve"}
            </p>
          )}
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><ShieldCheck size={13} /> {en ? "Secure payment, instant download." : "Pagamento sicuro, download immediato."}</p>
        </div>
        <div className="mx-auto w-full max-w-xs rounded-2xl border border-line bg-surface p-8 shadow-lg">
          <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-xl bg-brand-soft p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-solid text-lg font-black text-white">MSG</span>
            <p className="font-editorial text-lg font-semibold text-ink">{en ? "The Guide" : "La Guida"}</p>
            <p className="text-sm text-ink-soft">{SITE_NAME}</p>
            <p className="mt-2 text-xs text-muted">{BUSINESSES.length} {en ? "verified venues" : "locali verificati"}</p>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-4">
        {[
          { value: BUSINESSES.length, label: en ? "Verified venues" : "Locali verificati" },
          { value: totalCities, label: en ? "Cities" : "Città" },
          { value: totalRegions, label: en ? "Regions" : "Regioni" },
          { value: aicCount, label: en ? "AIC certified" : "Certificati AIC" },
        ].map((s) => (
          <div key={s.label} className="card card-soft p-5 text-center">
            <p className="font-editorial text-3xl font-bold text-brand-dark">{s.value}</p>
            <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 max-w-2xl">
        <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "What's inside" : "Cosa trovi dentro"}</h2>
        <ul className="mt-4 space-y-3">
          {included.map((item) => (
            <li key={item} className="flex items-start gap-3 text-ink-soft">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-14 max-w-2xl">
        <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "Frequently asked questions" : "Domande frequenti"}</h2>
        <div className="mt-4">
          <FaqAccordion items={faqs} />
        </div>
      </div>

      <div className="mt-14 max-w-2xl rounded-2xl border border-line bg-surface-2 p-6">
        <p className="text-sm text-ink-soft">
          {en
            ? "Looking for diagnosis, safety rules and daily life instead? "
            : "Cerchi invece diagnosi, regole di sicurezza e vita quotidiana? "}
          <Link href={h("/vivere-senza-glutine")} className="font-semibold text-brand-dark underline">
            {en ? "\"Live Gluten-Free\"" : "\"Vivere Senza Glutine\""}
          </Link>{" "}
          {en
            ? "is our reference guide compiled from the blog's verified articles."
            : "è la nostra guida di riferimento compilata dagli articoli verificati del blog."}
        </p>
      </div>

      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">
        {en
          ? "The guide is for informational purposes only and isn't sponsored by the venues listed. Hours and availability may change: always check directly with the venue before you go. For the always up-to-date version, with map, filters and reviews, visit "
          : "La guida ha scopo puramente informativo e non è sponsorizzata dai locali citati. Orari e disponibilità possono cambiare: verifica sempre direttamente con il locale prima di partire. Per la versione sempre aggiornata, con mappa, filtri e recensioni, visita "}
        <Link href={h("/directory")} className="text-brand-dark underline">{en ? "the directory" : "la directory"}</Link>.
      </p>
    </div>
  );
}
