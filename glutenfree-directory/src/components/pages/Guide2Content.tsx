import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChefHat,
  Download,
  FileText,
  Globe2,
  HelpCircle,
  Home,
  ListChecks,
  Plane,
  Printer,
  ScanSearch,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Utensils,
} from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/FaqAccordion";
import GuideBuyBar from "@/components/GuideBuyBar";
import Reveal from "@/components/Reveal";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { GUIDE2, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import meta from "@/lib/guide-meta.json";

/**
 * Pagina di vendita del PDF "Vivere Senza Glutine".
 * Numeri (pagine, capitoli, indice con pagine) letti da src/lib/guide-meta.json,
 * generato da guida/build.py insieme al PDF: non vanno scritti a mano.
 * Niente recensioni, valutazioni, scarsità o garanzie di rimborso inventate.
 * Estetica volutamente chiara e calda (colori fissi, non del tema), con elementi
 * in movimento che si fermano se l'utente chiede meno animazioni.
 */
export default function Guide2Content({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const h = (path: string) => localeHref(locale, path);
  const g = en ? meta.en : meta.it;
  const checkoutUrl = en ? GUIDE2.checkoutUrlEn : GUIDE2.checkoutUrl;
  const title = en ? "Live Gluten-Free" : "Vivere Senza Glutine";
  const img = (name: string) => `/images/guida/${en ? "en" : "it"}-${name}.jpg`;
  const chapterTitles = g.toc.flatMap((p) => p.chapters.map((c) => c.title));

  const pains = en
    ? [
        { icon: ShoppingBasket, text: "At the supermarket you turn packets over and still aren't sure you can trust the label." },
        { icon: Utensils, text: "At the restaurant you don't know what to ask without feeling like a nuisance." },
        { icon: Home, text: "At home you cook for everyone and worry about crumbs, toasters and shared pans." },
        { icon: Plane, text: "You're about to travel and wonder how to explain yourself at the table." },
      ]
    : [
        { icon: ShoppingBasket, text: "Al supermercato giri le confezioni e non sai se fidarti dell'etichetta." },
        { icon: Utensils, text: "Al ristorante non sai cosa chiedere senza sentirti di troppo." },
        { icon: Home, text: "In casa cucini per tutti e temi briciole, tostapane e pentole in comune." },
        { icon: Plane, text: "Stai per partire e non sai come spiegarti a tavola." },
      ];

  const gains = en
    ? [
        { icon: BookOpenCheck, title: `${g.chapters} chapters, in order`, text: `From diagnosis to travel in ${g.parts} parts, each chapter closes with a “what to remember” box.` },
        { icon: ScanSearch, title: "Labels without doubts", text: "A one-page quick sheet: naturally gluten-free, with care, contains gluten." },
        { icon: ListChecks, title: "Restaurant checklist", text: "What to ask before going, at the table, and the warning signs. Ready to print." },
        { icon: Globe2, title: "Phrase card", text: "An Italian phrasebook for restaurants and a ready-made card to show the staff." },
        { icon: ChefHat, title: "A safe kitchen at home", text: "How to organise shelves, tools and cooking when not everyone is celiac." },
        { icon: Smartphone, title: "Always with you", text: "Clickable contents and bookmarks: it opens on your phone, even offline." },
      ]
    : [
        { icon: BookOpenCheck, title: `${g.chapters} capitoli, in ordine`, text: `Dalla diagnosi ai viaggi in ${g.parts} parti, e ogni capitolo si chiude con un riquadro «Da ricordare».` },
        { icon: ScanSearch, title: "Etichette senza dubbi", text: "Una scheda rapida di una pagina: naturalmente senza glutine, con attenzione, contiene glutine." },
        { icon: ListChecks, title: "Checklist per il ristorante", text: "Cosa chiedere prima di andare, al tavolo e i segnali di allarme. Pronta da stampare." },
        { icon: Globe2, title: "Tessera in cinque lingue", text: "Italiano, inglese, tedesco, francese e spagnolo, da mostrare al personale quando viaggi." },
        { icon: ChefHat, title: "Una cucina sicura in casa", text: "Come organizzare dispensa, utensili e cotture quando non tutti sono celiaci." },
        { icon: Smartphone, title: "Sempre con te", text: "Indice cliccabile e segnalibri: si apre sul telefono, anche offline." },
      ];

  const steps = en
    ? [
        { n: "1", title: "Tap “Get the guide”", text: "You go to Payhip, which handles the payment." },
        { n: "2", title: "Pay once", text: `${GUIDE2.price}, no subscription and nothing to renew.` },
        { n: "3", title: "Download it straight away", text: "The link appears on screen and in the receipt email." },
        { n: "4", title: "Read it or print it", text: "On phone, tablet or computer, and the sheets on paper." },
      ]
    : [
        { n: "1", title: "Premi «Scarica la guida»", text: "Vai su Payhip, che gestisce il pagamento." },
        { n: "2", title: "Paghi una volta sola", text: `${GUIDE2.price}, nessun abbonamento e niente da rinnovare.` },
        { n: "3", title: "La scarichi subito", text: "Il link compare a schermo e nell'email di conferma." },
        { n: "4", title: "La leggi o la stampi", text: "Su telefono, tablet o computer, e le schede su carta." },
      ];

  const previews = [
    { name: "indice", alt: en ? "Table of contents with page numbers" : "Indice con numeri di pagina", cap: en ? "Contents" : "Indice", tilt: "-rotate-3" },
    { name: "capitolo", alt: en ? "A chapter page" : "Una pagina di capitolo", cap: en ? "A chapter" : "Un capitolo", tilt: "rotate-2" },
    { name: "scheda", alt: en ? "Quick sheet: yes, with care, no" : "Scheda rapida: sì, con attenzione, no", cap: en ? "Quick sheet" : "Scheda rapida", tilt: "-rotate-2" },
    { name: "checklist", alt: en ? "Restaurant checklist" : "Checklist per il ristorante", cap: en ? "Restaurant checklist" : "Checklist ristorante", tilt: "rotate-3" },
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

  const ctaLabel = en ? "Get the guide" : "Scarica la guida";
  const cta = (big = false) =>
    checkoutUrl ? (
      <a
        href={checkoutUrl}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className={`gf-shine group inline-flex items-center gap-2.5 rounded-full bg-[#c2431f] font-semibold text-white shadow-[0_14px_30px_-12px_rgba(194,67,31,0.7)] transition hover:-translate-y-0.5 hover:bg-[#963316] ${
          big ? "px-8 py-4 text-lg" : "px-6 py-3.5 text-base"
        }`}
      >
        <Download size={big ? 20 : 18} /> {ctaLabel} · {GUIDE2.price}
        <ArrowRight size={big ? 20 : 18} className="transition-transform group-hover:translate-x-1" />
      </a>
    ) : (
      <p className="inline-flex items-center gap-2 rounded-full border border-[#e8d6a8] bg-white px-6 py-3 text-sm font-semibold text-[#5b6b62]">
        {en ? "English edition: available soon" : "Disponibile a breve"}
      </p>
    );

  const warm = "text-[#14231c]";
  const warmSoft = "text-[#4a5a51]";

  return (
    <div className="gf-guide overflow-x-clip">
      <JsonLd data={productJson} />
      <JsonLd data={faqJsonLd(faqs)} />

      {/* HERO: chiaro e caldo, con macchie di colore che si muovono e la copertina che fluttua */}
      <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#fff8e6_0%,#fdf2d6_38%,#eaf5ee_100%)]">
        <div aria-hidden="true" className="gf-blob absolute -left-24 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#f2b100]/30 blur-3xl" />
        <div aria-hidden="true" className="gf-blob gf-blob-2 absolute -bottom-32 right-[-6rem] -z-10 h-[30rem] w-[30rem] rounded-full bg-[#2d6a4f]/20 blur-3xl" />
        <div aria-hidden="true" className="gf-blob gf-blob-3 absolute left-1/2 top-1/3 -z-10 h-72 w-72 rounded-full bg-[#ff8a5c]/20 blur-3xl" />

        <div className="container-page pb-16 pt-8 sm:pb-24">
          <Breadcrumbs locale={locale} items={[{ name: title, path: "/vivere-senza-glutine" }]} />

          <div className="mt-6 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#963316] shadow-sm ring-1 ring-[#f0d9a0]">
                  <Sparkles size={14} className="gf-twinkle" /> {en ? "PDF guide" : "Guida in PDF"} · {g.edition}
                </span>
              </Reveal>
              <Reveal delay={60}>
                <h1 className={`font-editorial mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-6xl ${warm}`}>
                  {en ? "Celiac disease, explained well." : "La celiachia, spiegata bene."}{" "}
                  <span className="gf-gradient-text">{en ? "In one guide in your pocket." : "In una guida da tenere in tasca."}</span>
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className={`mt-5 max-w-xl text-lg leading-relaxed ${warmSoft}`}>
                  {en
                    ? `From diagnosis to dinner out: what to eat, how to read labels, how to avoid cross-contamination at home and how to travel. ${g.chapters} chapters in order, ${g.pages} pages and sheets to print.`
                    : `Dalla diagnosi alla cena fuori: cosa mangiare, come leggere le etichette, come evitare la contaminazione in casa e come viaggiare. ${g.chapters} capitoli in ordine, ${g.pages} pagine e schede da stampare.`}
                </p>
              </Reveal>
              <Reveal delay={180}>
                <ul className={`mt-6 grid gap-2 text-sm sm:grid-cols-2 ${warm}`}>
                  {(en
                    ? ["Checked against AIC sources and Italian/EU rules", "Readable offline on your phone", "One payment, no subscription", "Printable sheets included"]
                    : ["Verificata su fonti AIC e normativa", "Si legge offline sul telefono", "Pagamento unico, nessun abbonamento", "Schede da stampare incluse"]
                  ).map((x) => (
                    <li key={x} className="flex items-center gap-2">
                      <CheckCircle2 size={17} className="shrink-0 text-[#2d6a4f]" /> {x}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {cta(true)}
                  <a href="#indice" className={`inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline ${warm}`}>
                    {en ? "Browse the contents" : "Sfoglia l'indice"} <ArrowRight size={15} />
                  </a>
                </div>
                <p className={`mt-3 text-xs ${warmSoft}`}>
                  {en ? "Payment and download handled by Payhip." : "Pagamento e download gestiti da Payhip."}
                </p>
              </Reveal>
            </div>

            {/* Copertina che fluttua, con le pagine che si aprono a ventaglio dietro */}
            <div className="relative mx-auto h-[420px] w-full max-w-[420px] sm:h-[480px]">
              <div className="gf-fan gf-fan-l absolute left-[6%] top-[12%] w-[46%]">
                <Image src={img("scheda")} alt="" width={1628} height={2310} sizes="200px" className="h-auto w-full rounded-lg shadow-xl ring-1 ring-black/10" />
              </div>
              <div className="gf-fan gf-fan-r absolute right-[4%] top-[10%] w-[46%]">
                <Image src={img("checklist")} alt="" width={1628} height={2310} sizes="200px" className="h-auto w-full rounded-lg shadow-xl ring-1 ring-black/10" />
              </div>
              <div className="animate-float absolute left-1/2 top-0 w-[62%] -translate-x-1/2">
                <Image
                  src={img("cover")}
                  alt={en ? "Cover of the PDF guide Live Gluten-Free" : "Copertina della guida PDF Vivere Senza Glutine"}
                  width={1628}
                  height={2310}
                  priority
                  sizes="(min-width: 1024px) 280px, 60vw"
                  className="h-auto w-full rounded-xl shadow-[0_30px_60px_-20px_rgba(20,35,28,0.55)] ring-1 ring-black/10"
                />
              </div>
              <span className="gf-badge absolute -left-1 bottom-16 rounded-2xl bg-white px-3.5 py-2 text-sm font-bold text-[#14231c] shadow-lg ring-1 ring-black/5">
                <FileText size={15} className="mr-1.5 inline text-[#c2431f]" />
                {g.pages} {en ? "pages" : "pagine"}
              </span>
              <span className="gf-badge gf-badge-2 absolute -right-1 bottom-28 rounded-2xl bg-white px-3.5 py-2 text-sm font-bold text-[#14231c] shadow-lg ring-1 ring-black/5">
                <BookOpenCheck size={15} className="mr-1.5 inline text-[#2d6a4f]" />
                {g.chapters} {en ? "chapters" : "capitoli"}
              </span>
              <span className="gf-badge gf-badge-3 absolute bottom-10 left-1/2 -translate-x-1/2 rounded-2xl bg-[#14231c] px-3.5 py-2 text-sm font-bold text-white shadow-lg">
                <Printer size={15} className="mr-1.5 inline text-[#f2b100]" />
                {en ? "Printable sheets" : "Schede stampabili"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Nastro in movimento con i titoli dei capitoli */}
      <div className="relative overflow-hidden border-y border-[#f0d9a0] bg-[#14231c] py-3.5" aria-hidden="true">
        <div className="gf-marquee flex w-max gap-8 whitespace-nowrap text-sm font-medium text-white/85">
          {[...chapterTitles, ...chapterTitles].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-8">
              {t}
              <span className="text-[#f2b100]">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[#fffdf8]">
        <div className="container-page py-16 sm:py-20">
          {/* Ti riconosci? */}
          <Reveal>
            <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-[#c2431f]">{en ? "Sound familiar?" : "Ti riconosci?"}</p>
            <h2 className={`font-editorial mx-auto mt-2 max-w-2xl text-center text-3xl font-semibold sm:text-4xl ${warm}`}>
              {en ? "Living gluten-free is easier when someone puts it all in order" : "Vivere senza glutine è più facile quando qualcuno mette tutto in ordine"}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pains.map((p, i) => (
              <Reveal key={p.text} delay={i * 70}>
                <div className="group h-full rounded-2xl border border-[#f0e3c4] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_30px_-18px_rgba(120,80,0,0.5)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fdf2d6] text-[#c2431f] transition group-hover:scale-110 group-hover:rotate-6">
                    <p.icon size={21} />
                  </span>
                  <p className={`mt-4 leading-relaxed ${warm}`}>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className={`mx-auto mt-8 max-w-2xl text-center text-lg ${warmSoft}`}>
              {en
                ? "This guide puts the answers in a row, one after the other, so you can stop searching and start living."
                : "Questa guida mette in fila le risposte, una dopo l'altra: smetti di cercare e torni a goderti la tavola."}
            </p>
          </Reveal>

          {/* Cosa ottieni */}
          <div className="mt-20">
            <Reveal>
              <p className="text-center text-xs font-bold uppercase tracking-[0.14em] text-[#2d6a4f]">{en ? "What you get" : "Cosa ottieni"}</p>
              <h2 className={`font-editorial mt-2 text-center text-3xl font-semibold sm:text-4xl ${warm}`}>
                {en ? "Everything you need, nothing you don't" : "Tutto quello che serve, niente di superfluo"}
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gains.map((b, i) => (
                <Reveal key={b.title} delay={i * 60}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-[#e3efe7] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#b7dcc6] hover:shadow-[0_18px_36px_-20px_rgba(27,67,50,0.55)]">
                    <div aria-hidden="true" className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#eaf5ee] transition-transform duration-500 group-hover:scale-150" />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1b4332] text-[#f2b100] shadow-md">
                      <b.icon size={22} />
                    </span>
                    <h3 className={`relative mt-4 text-lg font-semibold ${warm}`}>{b.title}</h3>
                    <p className={`relative mt-1.5 text-sm leading-relaxed ${warmSoft}`}>{b.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Anteprime */}
          <div className="mt-20">
            <Reveal>
              <h2 className={`font-editorial text-center text-3xl font-semibold sm:text-4xl ${warm}`}>{en ? "Take a look inside" : "Sbircia dentro"}</h2>
              <p className={`mt-2 text-center text-sm ${warmSoft}`}>
                {en ? "Real pages of the PDF, not mock-ups. Hover to straighten them." : "Pagine vere del PDF, non montaggi. Passaci sopra per raddrizzarle."}
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-5 sm:gap-8 lg:grid-cols-4">
              {previews.map((p, i) => (
                <Reveal key={p.name} delay={i * 80}>
                  <figure className={`${p.tilt} transition duration-500 hover:z-10 hover:rotate-0 hover:scale-[1.06]`}>
                    <Image
                      src={img(p.name)}
                      alt={p.alt}
                      width={1628}
                      height={2310}
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="h-auto w-full rounded-lg shadow-[0_20px_40px_-22px_rgba(20,35,28,0.6)] ring-1 ring-black/10"
                    />
                    <figcaption className={`mt-3 text-center text-sm font-medium ${warmSoft}`}>{p.cap}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Come funziona */}
          <div className="mt-20">
            <Reveal>
              <h2 className={`font-editorial text-center text-3xl font-semibold sm:text-4xl ${warm}`}>{en ? "Yours in four steps" : "Tua in quattro passi"}</h2>
            </Reveal>
            <ol className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div aria-hidden="true" className="gf-dash absolute left-[12%] right-[12%] top-7 hidden h-0.5 lg:block" />
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <li className="relative text-center">
                    <span className="gf-pulse relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2b100] font-editorial text-xl font-bold text-[#14231c] shadow-md">
                      {s.n}
                    </span>
                    <h3 className={`mt-4 font-semibold ${warm}`}>{s.title}</h3>
                    <p className={`mt-1 text-sm ${warmSoft}`}>{s.text}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Indice */}
          <div id="indice" className="mx-auto mt-20 max-w-3xl scroll-mt-24">
            <Reveal>
              <h2 className={`font-editorial text-center text-3xl font-semibold sm:text-4xl ${warm}`}>{en ? "The contents, chapter by chapter" : "L'indice, capitolo per capitolo"}</h2>
            </Reveal>
            <div className="mt-8 space-y-3">
              {g.toc.map((part, i) => (
                <details key={part.title} open={i === 0} className="group rounded-2xl border border-[#f0e3c4] bg-white shadow-sm open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fdf2d6] font-editorial font-bold text-[#963316]">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-semibold ${warm}`}>{part.title}</span>
                      <span className={`block text-xs ${warmSoft}`}>
                        {part.chapters.length} {en ? "chapters" : "capitoli"}
                      </span>
                    </span>
                    <span className="text-xl text-[#c2431f] transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className={`text-sm ${warmSoft}`}>{part.intro}</p>
                    <ol className="mt-3 space-y-1.5">
                      {part.chapters.map((c) => (
                        <li key={c.n} className={`flex items-baseline gap-3 text-sm ${warm}`}>
                          <span className="w-6 shrink-0 text-right font-editorial font-semibold text-[#2d6a4f]">{c.n}</span>
                          <span className="flex-1">{c.title}</span>
                          <span className={`shrink-0 text-xs tabular-nums ${warmSoft}`}>p. {c.page}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Prezzo */}
          <Reveal>
            <div className="relative mx-auto mt-20 max-w-3xl overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#1b4332,#2d6a4f)] p-1 shadow-[0_30px_60px_-30px_rgba(27,67,50,0.8)]">
              <div className="gf-spin-border absolute inset-[-50%] -z-0 bg-[conic-gradient(from_0deg,transparent_0deg,#f2b100_60deg,transparent_120deg)] opacity-70" aria-hidden="true" />
              <div className="relative grid gap-6 rounded-[1.35rem] bg-[#fffdf8] p-6 sm:grid-cols-[180px_1fr] sm:p-8">
                <Image src={img("cover")} alt="" width={1628} height={2310} sizes="180px" className="mx-auto h-auto w-36 rounded-lg shadow-xl ring-1 ring-black/10 sm:w-full" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2d6a4f]">{en ? "All included" : "Tutto incluso"}</p>
                  <p className={`font-editorial mt-1 text-5xl font-bold ${warm}`}>{GUIDE2.price}</p>
                  <p className={`text-sm ${warmSoft}`}>{en ? "one payment, yours to keep" : "un solo pagamento, la guida resta tua"}</p>
                  <ul className={`mt-4 space-y-1.5 text-sm ${warm}`}>
                    {(en
                      ? [`${g.chapters} chapters, ${g.pages} A5 pages`, "Quick sheet and restaurant checklist", "Phrase card to show the staff", "Clickable contents, readable offline"]
                      : [`${g.chapters} capitoli, ${g.pages} pagine A5`, "Scheda rapida e checklist per il ristorante", "Tessera di traduzione in cinque lingue", "Indice cliccabile, leggibile offline"]
                    ).map((x) => (
                      <li key={x} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="shrink-0 text-[#2d6a4f]" /> {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">{cta()}</div>
                  <p className={`mt-3 text-xs ${warmSoft}`}>
                    {en ? "Prefer to read online? Every topic is also on " : "Preferisci leggere online? Ogni argomento è anche sul "}
                    <Link href={h("/blog")} className="font-semibold underline">
                      {en ? "the blog" : "blog"}
                    </Link>
                    {en ? ", free, and so is the " : ", gratis, come la "}
                    <Link href={h("/checklist-ristorante")} className="font-semibold underline">
                      {en ? "restaurant checklist" : "checklist per il ristorante"}
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* FAQ */}
          <div className="mx-auto mt-20 max-w-3xl">
            <Reveal>
              <h2 className={`font-editorial flex items-center justify-center gap-2 text-center text-3xl font-semibold ${warm}`}>
                <HelpCircle size={26} className="text-[#c2431f]" /> {en ? "Before you buy" : "Prima di acquistare"}
              </h2>
            </Reveal>
            <div className="mt-8">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </div>
      </div>

      {/* CTA finale, solare */}
      <section id="guida-acquista" className="relative isolate overflow-hidden bg-[linear-gradient(120deg,#f2b100,#ffcf4d_45%,#ff9a6b)]">
        <div aria-hidden="true" className="gf-blob absolute -left-20 top-0 -z-10 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        <div aria-hidden="true" className="gf-blob gf-blob-2 absolute -right-16 bottom-0 -z-10 h-80 w-80 rounded-full bg-[#c2431f]/25 blur-3xl" />
        <div className="container-page py-16 text-center sm:py-20">
          <Reveal>
            <h2 className="font-editorial mx-auto max-w-2xl text-3xl font-semibold text-[#14231c] sm:text-4xl">
              {en ? "Tonight you can already know what to ask at the restaurant." : "Stasera puoi già sapere cosa chiedere al ristorante."}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[#3a2a10]">
              {en
                ? `${g.pages} pages, one payment of ${GUIDE2.price}, on your phone right after checkout.`
                : `${g.pages} pagine, un solo pagamento di ${GUIDE2.price}, sul tuo telefono subito dopo il pagamento.`}
            </p>
            <div className="mt-7 flex justify-center">{cta(true)}</div>
          </Reveal>
        </div>
      </section>

      <div className="bg-[#fffdf8]">
        <p className="container-page py-8 text-xs leading-relaxed text-[#5b6b62]">
          {en
            ? "This guide is for general information only and does not replace the advice of a doctor, dietitian or other qualified professional. Edition: "
            : "Questa guida ha scopo informativo e non sostituisce il parere di un medico, dietista o altro professionista qualificato. Edizione: "}
          {g.edition}.
        </p>
      </div>

      {checkoutUrl && <GuideBuyBar href={checkoutUrl} label={ctaLabel} price={GUIDE2.price} title={title} cover={img("cover")} />}
    </div>
  );
}
