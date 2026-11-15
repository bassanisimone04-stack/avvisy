import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqAccordion from "@/components/FaqAccordion";
import { JsonLd, faqJsonLd } from "@/lib/seo";
import { localeHref, type Locale } from "@/lib/i18n/locale";
import type { FaqItem } from "@/lib/types";

export const NORMATIVA_PATH = "/normativa";
const UPDATED = { it: "13 ottobre 2026", en: "13 October 2026" };

function faqs(locale: Locale): FaqItem[] {
  return locale === "en"
    ? [
        { question: "What does «gluten-free» legally mean on a label?", answer: "That the food contains no more than 20 mg of gluten per kilo, as set by Implementing Regulation (EU) 828/2014. The wording «very low gluten content» allows up to 100 mg/kg and applies only to foods with cereal ingredients specially processed to reduce gluten." },
        { question: "Is a product suitable for celiacs also suitable for someone with a wheat allergy?", answer: "Not necessarily. AIC points out that a product suitable for celiacs (under 20 mg/kg) may not be suitable for people with a wheat allergy, and the other way round." },
        { question: "Can I spend the celiac voucher anywhere in Italy?", answer: "The 2026 Budget Law introduces a digital voucher usable across the country, but it depends on each Region activating it. Until then the paper voucher stays valid under the current rules, in the region of residence." },
        { question: "Is joining the AIC restaurant program mandatory?", answer: "No: it is voluntary. Venues that join follow staff training and procedures agreed with the association." },
      ]
    : [
        { question: "Cosa significa per legge «senza glutine» in etichetta?", answer: "Che l'alimento non contiene più di 20 mg di glutine per chilo, come stabilito dal Regolamento di esecuzione (UE) 828/2014. La dicitura «con contenuto di glutine molto basso» ammette fino a 100 mg/kg e riguarda solo alimenti con ingredienti a base di cereali trattati per ridurre il glutine." },
        { question: "Un prodotto adatto ai celiaci va bene anche per chi ha un'allergia al grano?", answer: "Non necessariamente. L'AIC segnala che un prodotto adatto ai celiaci (sotto i 20 mg/kg) può non essere adatto a chi ha un'allergia al grano, e viceversa." },
        { question: "Il buono per celiaci si può spendere in tutta Italia?", answer: "La Legge di Bilancio 2026 introduce un buono digitale spendibile su tutto il territorio, ma dipende dall'attivazione di ogni Regione. Fino ad allora il buono cartaceo resta valido con le regole attuali, nella regione di residenza." },
        { question: "L'adesione al programma AIC per i ristoranti è obbligatoria?", answer: "No: è volontaria. I locali che aderiscono seguono la formazione del personale e procedure condivise con l'associazione." },
      ];
}

export default function NormativaContent({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const b = (slug: string, t: string) => <Link href={localeHref(locale, `/blog/${slug}`)} className="link-underline text-brand-dark">{t}</Link>;
  const items = faqs(locale);

  return (
    <div className="container-page py-10">
      <JsonLd data={faqJsonLd(items)} />
      <Breadcrumbs locale={locale} items={[{ name: en ? "Celiac disease rules" : "Normativa celiachia", path: NORMATIVA_PATH }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="font-editorial text-3xl font-semibold text-ink sm:text-4xl">
          {en ? "Celiac disease rules in Italy: labels, voucher and law" : "Normativa sulla celiachia in Italia: etichette, buono e leggi"}
        </h1>
        <p className="mt-3 text-sm text-muted">{en ? "Last updated" : "Ultimo aggiornamento"}: {UPDATED[locale]}</p>
        <p className="mt-4 text-lg text-ink-soft">
          {en
            ? "The rules that matter in daily life with celiac disease, in one page that we keep updated. It is general information, not legal advice: for your own case check the official sources listed at the bottom."
            : "Le regole che contano nella vita di tutti i giorni con la celiachia, in una pagina che teniamo aggiornata. Sono informazioni generali, non consulenza legale: per il tuo caso verifica le fonti ufficiali indicate in fondo."}
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "When a product can be called «gluten-free»" : "Quando un prodotto può dirsi «senza glutine»"}</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "The Implementing Regulation (EU) 828/2014, in force since 20 July 2016, sets the limit: a food can be labelled «gluten-free» only if it contains no more than 20 mg of gluten per kilo. The wording «very low gluten content» allows up to 100 mg/kg and applies only to foods with cereal ingredients specially processed to reduce gluten. The two claims are different: "
            : "Il Regolamento di esecuzione (UE) 828/2014, in vigore dal 20 luglio 2016, fissa il limite: un alimento può riportare «senza glutine» solo se contiene non più di 20 mg di glutine per chilo. La dicitura «con contenuto di glutine molto basso» ammette fino a 100 mg/kg e riguarda solo alimenti con ingredienti a base di cereali trattati per ridurne il glutine. Le due diciture sono diverse: "}
          {b("come-leggere-le-etichette-alimentari-se-sei-celiaco", en ? "here is how to read them" : "come leggerle")}.
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "Oats" : "Avena"}</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "The same regulation says that oats in a product presented as «gluten-free» must have been specially produced, prepared or processed to avoid contamination by wheat, rye and barley, and must stay within 20 mg/kg. More in "
            : "Lo stesso regolamento prevede che l'avena contenuta in un prodotto presentato come «senza glutine» sia stata prodotta, preparata o lavorata in modo specifico per evitare la contaminazione da frumento, segale e orzo, e non superi i 20 mg/kg. Approfondimento: "}
          {b("l-avena-contiene-glutine-cosa-possono-mangiare-davvero-i-celiaci", en ? "do oats contain gluten?" : "l'avena contiene glutine?")}.
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "Allergens and celiac disease are not the same" : "Allergeni e celiachia non sono la stessa cosa"}</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "On packaged food, cereals containing gluten must be highlighted in the ingredient list. But AIC points out that a product suitable for celiacs (under 20 mg/kg) may not be suitable for someone with a wheat allergy, and the other way round: they are two different conditions with different thresholds."
            : "Sul confezionato i cereali che contengono glutine devono essere evidenziati nell'elenco ingredienti. Ma l'AIC segnala che un prodotto adatto ai celiaci (sotto i 20 mg/kg) può non essere adatto a chi ha un'allergia al grano, e viceversa: sono due condizioni diverse, con soglie diverse."}
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "The voucher for gluten-free products" : "Il buono per i prodotti senza glutine"}</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "Article 77 of the 2026 Budget Law introduces the digital voucher, usable across the whole country instead of only in the region of residence. The maximum monthly amount does not change. The Regions must sign agreements with participating stores and a ministerial decree will define the operating rules, so the start date varies by region; until then the paper voucher remains valid under current rules. Details in "
            : "L'articolo 77 della Legge di Bilancio 2026 introduce il buono digitale, spendibile su tutto il territorio invece che solo nella regione di residenza. L'importo massimo mensile non cambia. Le Regioni devono stipulare convenzioni con i punti vendita e un decreto ministeriale definirà le modalità operative, quindi l'attivazione varia da regione a regione; fino ad allora il buono cartaceo resta valido con le regole attuali. Dettagli in "}
          {b("novita-normative-2026-cosa-cambia-per-i-celiaci-in-italia", en ? "2026 regulatory updates" : "novità normative 2026")}
          {en ? " and, for the costs, in " : " e, per i costi, in "}
          {b("quanto-costa-la-dieta-senza-glutine-guida-a-costi-buoni-pasto-aic-e-detrazioni-fiscali", en ? "how much a gluten-free diet costs" : "quanto costa la dieta senza glutine")}.
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "The framework law" : "La legge quadro"}</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "The Italian framework law is Law no. 123 of 4 July 2005, «Rules for the protection of people with celiac disease». AIC cites its article 4 for the supply of gluten-free products within the essential levels of care."
            : "La legge quadro è la legge 4 luglio 2005, n. 123, «Norme per la protezione dei soggetti malati di celiachia». L'AIC ne cita l'articolo 4 per la fornitura dei prodotti senza glutine nei livelli essenziali di assistenza."}
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "Restaurants" : "Ristorazione"}</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {en
            ? "Joining AIC's Alimentazione Fuori Casa program is voluntary, not a legal requirement. Venues that join train their staff and put gluten in their HACCP self-control plan as a critical point. How it works and what it does not guarantee: "
            : "L'adesione al programma Alimentazione Fuori Casa dell'AIC è volontaria e non un obbligo di legge. I locali che aderiscono formano il personale e inseriscono il glutine come punto critico nel piano di autocontrollo HACCP. Come funziona e cosa non garantisce: "}
          {b("certificazione-aic-cosa-significa-e-come-riconoscere-un-locale-davvero-certificato", en ? "AIC certification" : "certificazione AIC")}.
          {" "}{en ? "The member restaurants we've checked are on the " : "I ristoranti aderenti che abbiamo verificato sono sulla "}
          <Link href={localeHref(locale, "/mappa-ristoranti-aic")} className="link-underline text-brand-dark">{en ? "AIC restaurants map" : "mappa dei ristoranti AIC"}</Link>.
        </p>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "Frequently asked questions" : "Domande frequenti"}</h2>
        <div className="mt-4"><FaqAccordion items={items} /></div>

        <h2 className="font-editorial mt-10 text-2xl font-semibold text-ink">{en ? "Official sources" : "Fonti ufficiali"}</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
          <li><a href="https://www.celiachia.it/la-normativa-sulletichettatura-approfondimento/" target="_blank" rel="noopener noreferrer" className="link-underline text-brand-dark">{en ? "AIC: labelling rules in depth" : "AIC: la normativa sull'etichettatura"}</a></li>
          <li><a href="https://eur-lex.europa.eu/legal-content/IT/TXT/PDF/?uri=CELEX:32014R0828" target="_blank" rel="noopener noreferrer" className="link-underline text-brand-dark">{en ? "EUR-Lex: Implementing Regulation (EU) 828/2014" : "EUR-Lex: Regolamento di esecuzione (UE) 828/2014"}</a></li>
          <li><a href="https://www.celiachia.it/diritti-e-norme/letichettatura-degli-alimenti/" target="_blank" rel="noopener noreferrer" className="link-underline text-brand-dark">{en ? "AIC: food labelling" : "AIC: l'etichettatura degli alimenti"}</a></li>
        </ul>
      </div>
    </div>
  );
}
