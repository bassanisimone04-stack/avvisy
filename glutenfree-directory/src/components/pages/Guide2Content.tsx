import Link from "next/link";
import { CheckCircle2, Download, ShieldCheck } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/FaqAccordion";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { GUIDE2, SITE_NAME } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

const CHAPTERS_IT = [
  "Celiachia: cos'è, sintomi e diagnosi",
  "Cosa può mangiare un celiaco: alimenti sì e no",
  "Come leggere le etichette alimentari",
  "Sensibilità al glutine o celiachia: le differenze",
  "Come evitare la contaminazione crociata al ristorante",
  "Contaminazione crociata in cucina: le regole per casa",
  "Quanto costa la dieta senza glutine: costi e buoni ASL",
  "Dove fare colazione senza glutine",
  "Gelaterie senza glutine e senza contaminazione",
  "Hotel e villaggi turistici certificati AIC",
  "McDonald's senza glutine: cosa si può mangiare davvero",
];

const CHAPTERS_EN = [
  "Celiac disease: what it is, symptoms and diagnosis",
  "What a celiac can eat: foods to have and avoid",
  "How to read food labels",
  "Gluten sensitivity or celiac disease: the differences",
  "How to avoid cross-contamination at a restaurant",
  "Cross-contamination in the kitchen: rules for home",
  "How much the gluten-free diet costs, and health vouchers",
  "Where to get gluten-free breakfast",
  "Gluten-free gelaterias without cross-contamination",
  "AIC-certified hotels and resorts",
  "Gluten-free McDonald's: what you can really eat",
];

export default function Guide2Content({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const en = locale === "en";
  const h = (path: string) => localeHref(locale, path);
  const chapters = en ? CHAPTERS_EN : CHAPTERS_IT;

  const included = en
    ? [
        "11 chapters compiled from the site's verified blog articles, no invented content",
        "Diagnosis, daily life, eating out and travel in one reference PDF",
        "A quick summary box (\"what to remember\") at the end of every chapter",
        "Useful for the newly diagnosed and for anyone who wants an offline reference",
        "PDF readable on phone, tablet or printable",
      ]
    : [
        "11 capitoli compilati dagli articoli verificati del blog, nessun contenuto inventato",
        "Diagnosi, vita quotidiana, mangiare fuori e viaggi in un unico PDF di riferimento",
        "Un box di sintesi (\"da ricordare\") alla fine di ogni capitolo",
        "Utile per i neo-diagnosticati e per chi vuole un riferimento sempre a portata di mano, anche offline",
        "PDF leggibile su telefono, tablet o stampabile",
      ];

  const faqs = en
    ? [
        { question: "Is this the same content as the blog?", answer: "Yes — this guide compiles 11 already-published, verified blog articles into a single offline PDF, organized as chapters with a summary box at the end of each one. It's a convenience format, not exclusive new content." },
        { question: "How do I get the guide after purchase?", answer: "Download starts right after payment, directly from the checkout page, and you also get an email with the link to re-download it whenever you want." },
        { question: "What's the difference with the other guide (venues directory)?", answer: "The other guide (\"La Guida Mappa Senza Glutine\") lists real verified venues by city. This one is a reference guide: diagnosis, safety rules, costs, eating out — the \"what to know\", not the \"where to go\"." },
        { question: "Does this replace medical advice?", answer: "No. The guide is for informational purposes and doesn't replace the advice of a doctor, nutritionist or other qualified professional." },
      ]
    : [
        { question: "È lo stesso contenuto del blog?", answer: "Sì — questa guida compila 11 articoli del blog già pubblicati e verificati in un unico PDF offline, organizzati come capitoli con un box di sintesi alla fine di ciascuno. È un formato comodo, non contenuto esclusivo nuovo." },
        { question: "Come ricevo la guida dopo l'acquisto?", answer: "Il download parte subito dopo il pagamento, direttamente dalla pagina di checkout, e ricevi anche un'email con il link per riscaricarla quando vuoi." },
        { question: "Che differenza c'è con l'altra guida (locali)?", answer: "L'altra guida (\"La Guida Mappa Senza Glutine\") elenca locali reali verificati per città. Questa è una guida di riferimento: diagnosi, regole di sicurezza, costi, mangiare fuori — il \"cosa sapere\", non il \"dove andare\"." },
        { question: "Sostituisce il parere medico?", answer: "No. La guida ha scopo divulgativo e non sostituisce il parere di un medico, nutrizionista o altro professionista qualificato." },
      ];

  return (
    <div className="container-page py-10">
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs locale={locale} items={[{ name: en ? "Live Gluten-Free" : "Vivere Senza Glutine", path: "/vivere-senza-glutine" }]} />

      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="chip chip-brand">{en ? "Downloadable PDF" : "PDF scaricabile"}</span>
          <h1 className="font-editorial mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            {en ? "Live Gluten-Free: the reference guide" : "Vivere Senza Glutine: la guida di riferimento"}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {en
              ? "Diagnosis, food safety and everyday life with celiac disease, in one PDF: 11 chapters from checked, verified content — nothing invented — ready to read offline whenever you need it."
              : "Diagnosi, sicurezza alimentare e vita quotidiana da celiaco, in un unico PDF: 11 capitoli tratti da contenuti controllati e verificati — nulla di inventato — pronti da leggere offline quando ti servono."}
          </p>
          <p className="font-editorial mt-5 text-3xl font-bold text-brand-dark">{GUIDE2.price}</p>
          {GUIDE2.checkoutUrl ? (
            <a href={GUIDE2.checkoutUrl} target="_blank" rel="sponsored noopener noreferrer" className="btn btn-primary mt-4 inline-flex items-center gap-2">
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
          <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-xl p-6 text-center" style={{ background: "linear-gradient(160deg, #1b4332, #122b20)" }}>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black" style={{ background: "#f2b100", color: "#122b20" }}>MSG</span>
            <p className="font-editorial text-lg font-semibold text-white">{en ? "Live Gluten-Free" : "Vivere Senza Glutine"}</p>
            <p className="text-sm text-white/70">{SITE_NAME}</p>
            <p className="mt-2 text-xs text-white/60">11 {en ? "chapters" : "capitoli"}</p>
          </div>
        </div>
      </div>

      <div className="mt-14 max-w-2xl">
        <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "The 11 chapters" : "I capitoli"}</h2>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {chapters.map((c, i) => (
            <li key={c} className="flex items-start gap-2.5 text-sm text-ink-soft">
              <span className="mt-0.5 shrink-0 font-editorial font-semibold text-brand-dark">{i + 1}.</span>
              <span>{c}</span>
            </li>
          ))}
        </ol>
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
            ? "Looking for real venues instead? "
            : "Cerchi invece locali reali? "}
          <Link href={h("/guida")} className="font-semibold text-brand-dark underline">
            {en ? `"The ${SITE_NAME} Guide"` : `"La Guida ${SITE_NAME}"`}
          </Link>{" "}
          {en
            ? "lists 40+ verified venues by city and region."
            : "elenca oltre 40 locali verificati per città e regione."}
        </p>
      </div>

      <p className="mt-8 max-w-2xl text-xs leading-relaxed text-muted">
        {en
          ? "This guide is for informational purposes only and doesn't replace the advice of a doctor, nutritionist or other qualified professional. For the always up-to-date version of these topics, visit "
          : "Questa guida ha scopo puramente informativo e non sostituisce il parere di un medico, nutrizionista o altro professionista qualificato. Per la versione sempre aggiornata di questi argomenti, visita "}
        <Link href={h("/blog")} className="text-brand-dark underline">{en ? "the blog" : "il blog"}</Link>.
      </p>
    </div>
  );
}
