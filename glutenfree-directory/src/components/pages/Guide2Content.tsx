import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Download, FileText, Printer, Smartphone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/FaqAccordion";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { GUIDE2, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import meta from "@/lib/guide-meta.json";

/**
 * Pagina di vendita del PDF "Vivere Senza Glutine".
 * Numeri (pagine, capitoli, indice con pagine) letti da src/lib/guide-meta.json,
 * generato da guida/build.py insieme al PDF: non vanno scritti a mano.
 * Niente recensioni, valutazioni, scarsità o garanzie di rimborso inventate.
 */
export default function Guide2Content({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const h = (path: string) => localeHref(locale, path);
  const g = en ? meta.en : meta.it;
  const checkoutUrl = en ? GUIDE2.checkoutUrlEn : GUIDE2.checkoutUrl;
  const title = en ? "Live Gluten-Free" : "Vivere Senza Glutine";
  const img = (name: string) => `/images/guida/${en ? "en" : "it"}-${name}.jpg`;

  const forWho = en
    ? [
        "You or someone close to you was just diagnosed with celiac disease and you want one place that explains the basics, in order.",
        "You already follow the diet but still hesitate on labels, restaurants or cross-contamination at home.",
        "You live with a celiac partner, child or flatmate and want to cook and eat out without getting it wrong.",
        "You are coming to Italy and want an Italian phrase card to show, a restaurant checklist and the rules in one offline file.",
      ]
    : [
        "Hai appena avuto la diagnosi di celiachia (tua o di una persona vicina) e vuoi un unico posto che spiega le basi, in ordine.",
        "Segui già la dieta ma hai ancora dubbi su etichette, ristoranti o contaminazione in casa.",
        "Convivi con un celiaco (partner, figlio, coinquilino) e vuoi cucinare e mangiare fuori senza sbagliare.",
        "Sei una persona celiaca che viaggia e vuoi la checklist e la tessera di traduzione da stampare, in un file anche offline.",
      ];

  const inside = en
    ? [
        `${g.chapters} chapters in ${g.parts} parts, from diagnosis to travel, each ending with a “what to remember” box`,
        "A one-page quick sheet: naturally gluten-free, with care, contains gluten",
        "A restaurant checklist to print: what to ask before going, at the table, warning signs",
        "An Italian phrasebook for restaurants, with English-style pronunciation, and a ready-made Italian card to show the staff",
        "A glossary (AIC, AFC, cross-contamination, 20 ppm, HACCP…) and a list of where to check",
        "Clickable table of contents and PDF bookmarks, so you can jump straight to a chapter",
      ]
    : [
        `${g.chapters} capitoli in ${g.parts} parti, dalla diagnosi ai viaggi, ognuno con un riquadro «Da ricordare»`,
        "Una scheda rapida di una pagina: naturalmente senza glutine, con attenzione, contiene glutine",
        "La checklist per il ristorante da stampare: cosa chiedere prima di andare, al tavolo, segnali di allarme",
        "Una tessera di traduzione in cinque lingue (italiano, inglese, tedesco, francese, spagnolo) da mostrare al personale",
        "Un glossario (AIC, AFC, contaminazione crociata, 20 ppm, HACCP…) e l'elenco di dove verificare",
        "Indice cliccabile e segnalibri del PDF, per saltare subito al capitolo che ti serve",
      ];

  const previews = [
    { name: "indice", alt: en ? "Table of contents with page numbers" : "Indice con numeri di pagina", cap: en ? "Contents" : "Indice" },
    { name: "capitolo", alt: en ? "A chapter page" : "Una pagina di capitolo", cap: en ? "A chapter" : "Un capitolo" },
    { name: "scheda", alt: en ? "Quick sheet: yes, with care, no" : "Scheda rapida: sì, con attenzione, no", cap: en ? "Quick sheet" : "Scheda rapida" },
    { name: "checklist", alt: en ? "Restaurant checklist" : "Checklist per il ristorante", cap: en ? "Restaurant checklist" : "Checklist ristorante" },
  ];

  const faqs = en
    ? [
        {
          question: "Why pay for a PDF if the blog is free?",
          answer:
            "Every chapter comes from articles that are already free on the blog, and the blog stays free. The PDF is for convenience: the same material put in a logical order (from diagnosis to everyday life), with a table of contents, summary boxes, printable sheets and a file you can keep offline. If you prefer to read online, you lose nothing.",
        },
        {
          question: "Is it updated?",
          answer:
            "This edition is dated October 2026. Rules, products and venues change, and the PDF does not update itself: each chapter points to the blog for the current version. We do not promise future editions or free updates.",
        },
        {
          question: "How do I get the file after paying?",
          answer:
            "Payments and delivery are handled by Payhip. After checkout you get the download link on screen and in the receipt email, so you can download it again later.",
        },
        {
          question: "What format is it, and can I print it?",
          answer: `A standard PDF (A5 pages, ${g.pages} pages, about 1.4 MB). It opens on phone, tablet and computer with no app. The appendices are laid out one per page so you can print them; at A5 size two fit on an A4 sheet.`,
        },
        {
          question: "Is the content medical advice?",
          answer:
            "No. It is general information and does not replace your doctor, gastroenterologist or dietitian. In particular, do not remove gluten from your diet before the diagnostic tests: this is stated in the guide too.",
        },
        {
          question: "Which language is it in?",
          answer:
            "The guide exists in Italian and English. Note that restaurant, brand and AIC references are about Italy; the English edition is written for people living with or travelling to Italy.",
        },
      ]
    : [
        {
          question: "Perché pagare un PDF se il blog è gratuito?",
          answer:
            "Ogni capitolo nasce da articoli già gratuiti sul blog, e il blog resta gratuito. Il PDF serve per comodità: lo stesso materiale messo in un ordine logico (dalla diagnosi alla vita di ogni giorno), con indice, riquadri di sintesi, schede da stampare e un file da tenere anche offline. Se preferisci leggere online, non perdi niente.",
        },
        {
          question: "È aggiornato?",
          answer:
            "Questa edizione è datata ottobre 2026. Normative, prodotti e locali cambiano e il PDF non si aggiorna da solo: ogni capitolo rimanda al blog per la versione attuale. Non promettiamo edizioni future né aggiornamenti gratuiti.",
        },
        {
          question: "Come ricevo il file dopo il pagamento?",
          answer:
            "Pagamento e consegna sono gestiti da Payhip. Dopo il checkout ricevi il link per scaricare il file sia a schermo sia nell'email di conferma, così puoi riscaricarlo in seguito.",
        },
        {
          question: "Che formato è, posso stamparlo?",
          answer: `È un PDF standard (pagine A5, ${g.pages} pagine, circa 1,4 MB). Si apre su telefono, tablet e computer senza app. Le appendici sono impaginate una per pagina per essere stampate; in formato A5 ne entrano due su un foglio A4.`,
        },
        {
          question: "I contenuti sono consigli medici?",
          answer:
            "No. Sono informazioni generali e non sostituiscono il medico, il gastroenterologo o il dietista. In particolare, non eliminare il glutine prima degli esami diagnostici: lo ricorda anche la guida.",
        },
        {
          question: "In che lingua è?",
          answer:
            "La guida esiste in italiano e in inglese. Questa è l'edizione italiana; i riferimenti a locali, marchi e AIC riguardano l'Italia.",
        },
      ];

  const productJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: en ? "Live Gluten-Free: reference guide (PDF)" : "Vivere Senza Glutine: guida di riferimento (PDF)",
    description: en
      ? `PDF guide on celiac disease and the gluten-free life: ${g.chapters} chapters, quick sheet, restaurant checklist and Italian phrase card. ${g.pages} A5 pages.`
      : `Guida PDF su celiachia e vita senza glutine: ${g.chapters} capitoli, scheda rapida, checklist per il ristorante e tessera di traduzione. ${g.pages} pagine A5.`,
    image: `${SITE_URL}${img("cover")}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    inLanguage: en ? "en" : "it",
    ...(checkoutUrl
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}${h("/vivere-senza-glutine")}`,
            price: GUIDE2.priceAmount,
            priceCurrency: GUIDE2.priceCurrency,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  const cta = checkoutUrl ? (
    <a
      href={checkoutUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="btn btn-primary inline-flex items-center gap-2"
    >
      <Download size={16} /> {en ? "Buy and download" : "Acquista e scarica"} · {GUIDE2.price}
    </a>
  ) : (
    <p className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-muted">
      {en ? "English edition: available soon" : "Disponibile a breve"}
    </p>
  );

  return (
    <div className="container-page py-10">
      <JsonLd data={productJson} />
      <JsonLd data={faqJsonLd(faqs)} />
      <Breadcrumbs locale={locale} items={[{ name: title, path: "/vivere-senza-glutine" }]} />

      {/* Hero */}
      <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <span className="chip chip-brand">{en ? "PDF guide" : "Guida in PDF"}</span>
          <h1 className="font-editorial mt-3 text-3xl font-semibold text-ink sm:text-4xl">
            {en ? "Live Gluten-Free: the celiac guide in one PDF" : "Vivere Senza Glutine: la guida per chi è celiaco, in un PDF"}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {en
              ? `From diagnosis to everyday life: what to eat, how to read labels, how to eat out safely, how to cook at home without cross-contamination, and how to travel. ${g.chapters} chapters, ${g.pages} pages, plus sheets you can print.`
              : `Dalla diagnosi alla vita di ogni giorno: cosa mangiare, come leggere le etichette, come mangiare fuori in sicurezza, come cucinare a casa senza contaminazione e come viaggiare. ${g.chapters} capitoli, ${g.pages} pagine, più schede da stampare.`}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {en
              ? "Built from the articles on this site, checked against AIC (Associazione Italiana Celiachia) and Italian and European rules. Nothing invented."
              : "Costruita dagli articoli di questo sito, controllati su fonti AIC (Associazione Italiana Celiachia) e sulla normativa italiana ed europea. Niente di inventato."}
          </p>
          <p className="font-editorial mt-5 text-3xl font-bold text-brand-dark">{GUIDE2.price}</p>
          <div className="mt-3">{cta}</div>
          <p className="mt-3 text-xs text-muted">
            {en
              ? "Payment and download are handled by Payhip. One-off payment, no subscription."
              : "Pagamento e download gestiti da Payhip. Pagamento una tantum, nessun abbonamento."}
          </p>
        </div>
        <div className="mx-auto w-full max-w-xs">
          <Image
            src={img("cover")}
            alt={en ? "Cover of the PDF guide Live Gluten-Free" : "Copertina della guida PDF Vivere Senza Glutine"}
            width={1628}
            height={2310}
            priority
            sizes="(min-width: 1024px) 320px, 80vw"
            className="h-auto w-full rounded-lg shadow-2xl ring-1 ring-black/10"
          />
        </div>
      </div>

      {/* Per chi è */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "Who it is for" : "Per chi è"}</h2>
        <ul className="mt-4 space-y-3">
          {forWho.map((x) => (
            <li key={x} className="flex items-start gap-3 text-ink-soft">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Cosa trovi */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "What is inside" : "Cosa trovi dentro"}</h2>
        <ul className="mt-4 space-y-3">
          {inside.map((x) => (
            <li key={x} className="flex items-start gap-3 text-ink-soft">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5"><FileText size={15} /> {g.pages} {en ? "pages, A5 PDF" : "pagine, PDF A5"}</span>
          <span className="inline-flex items-center gap-1.5"><Smartphone size={15} /> {en ? "Phone, tablet, computer, offline" : "Telefono, tablet, computer, offline"}</span>
          <span className="inline-flex items-center gap-1.5"><Printer size={15} /> {en ? "Printable sheets" : "Schede stampabili"}</span>
        </div>
      </section>

      {/* Anteprime */}
      <section className="mt-16">
        <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "A look inside" : "Uno sguardo dentro"}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          {en ? "These are real pages of the PDF, not mock-ups." : "Sono pagine vere del PDF, non montaggi."}
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {previews.map((p) => (
            <figure key={p.name}>
              <Image
                src={img(p.name)}
                alt={p.alt}
                width={1628}
                height={2310}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="h-auto w-full rounded-md border border-line shadow-md"
              />
              <figcaption className="mt-2 text-center text-xs text-muted">{p.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Indice per parti */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "Table of contents" : "L'indice"}</h2>
        <div className="mt-5 space-y-7">
          {g.toc.map((part, i) => (
            <div key={part.title}>
              <h3 className="font-editorial text-lg font-semibold text-brand-dark">
                {en ? "Part" : "Parte"} {i + 1} · {part.title}
              </h3>
              <p className="mt-1 text-sm text-muted">{part.intro}</p>
              <ol className="mt-3 space-y-1.5">
                {part.chapters.map((c) => (
                  <li key={c.n} className="flex items-baseline gap-3 text-sm text-ink-soft">
                    <span className="w-6 shrink-0 text-right font-editorial font-semibold text-brand-dark">{c.n}</span>
                    <span className="flex-1">{c.title}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted">p. {c.page}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Blog gratis vs PDF */}
      <section className="mt-16 max-w-3xl rounded-2xl border border-line bg-surface-2 p-6">
        <h2 className="font-editorial text-xl font-semibold text-ink">
          {en ? "Prefer to read for free? You can." : "Preferisci leggere gratis? Puoi."}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {en
            ? "All the information in this guide is also in the blog articles, which are free and kept current. The PDF is for people who want it in order, offline and with the printable sheets. The restaurant checklist, for example, is free online: "
            : "Tutte le informazioni di questa guida sono anche negli articoli del blog, gratuiti e aggiornati. Il PDF è per chi lo vuole in ordine, offline e con le schede da stampare. La checklist per il ristorante, per esempio, è gratuita anche online: "}
          <Link href={h("/checklist-ristorante")} className="font-semibold text-brand-dark underline">
            {en ? "the restaurant checklist" : "la checklist per il ristorante"}
          </Link>
          {en ? ", and every chapter is on " : ", e ogni capitolo è sul "}
          <Link href={h("/blog")} className="font-semibold text-brand-dark underline">
            {en ? "the blog" : "blog"}
          </Link>
          .
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "Frequently asked questions" : "Domande frequenti"}</h2>
        <div className="mt-4">
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* CTA finale */}
      <section className="mt-16 max-w-3xl text-center sm:text-left">
        <h2 className="font-editorial text-2xl font-semibold text-ink">
          {en ? "Get the guide" : "Prendi la guida"}
        </h2>
        <p className="mt-2 text-ink-soft">
          {en
            ? `${g.pages} pages, one payment of ${GUIDE2.price}, yours to keep on your phone or print.`
            : `${g.pages} pagine, un solo pagamento di ${GUIDE2.price}, da tenere sul telefono o da stampare.`}
        </p>
        <div className="mt-4">{cta}</div>
      </section>

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-muted">
        {en
          ? "This guide is for general information only and does not replace the advice of a doctor, dietitian or other qualified professional. Edition: "
          : "Questa guida ha scopo informativo e non sostituisce il parere di un medico, dietista o altro professionista qualificato. Edizione: "}
        {g.edition}.
      </p>
    </div>
  );
}
