import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PrintButton from "@/components/PrintButton";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import { localeHref, type Locale } from "@/lib/i18n/locale";

export const CHECKLIST_PATH = "/checklist-ristorante";

type Item = { it: string; en: string };
const BEFORE: Item[] = [
  { it: "Dico che sono celiaco/a, non che «preferisco il senza glutine».", en: "I say I have celiac disease, not that I «prefer gluten-free»." },
  { it: "Il locale ha un menu senza glutine?", en: "Does the venue have a gluten-free menu?" },
  { it: "Hanno una cucina o un forno dedicati, oppure cucinano nello stesso spazio?", en: "Do they have a dedicated kitchen or oven, or do they cook in the same space?" },
  { it: "La friggitrice è separata?", en: "Is the fryer separate?" },
  { it: "La pasta senza glutine si cuoce in acqua separata?", en: "Is the gluten-free pasta cooked in separate water?" },
  { it: "Le farine senza glutine sono conservate a parte, in contenitori chiusi?", en: "Are the gluten-free flours stored apart, in sealed containers?" },
  { it: "Aderiscono al programma AIC Alimentazione Fuori Casa?", en: "Do they take part in the AIC Alimentazione Fuori Casa program?" },
];
const TABLE: Item[] = [
  { it: "Il piatto che arriva è quello senza glutine? Lo chiedo prima di mangiare.", en: "Is the plate that arrives the gluten-free one? I ask before eating." },
  { it: "Il pane è confezionato o servito a parte, non dal cestino comune?", en: "Is the bread packaged or served apart, not from the shared basket?" },
  { it: "Salse, condimenti e contorni: sono senza glutine o li hanno preparati con altro?", en: "Sauces, dressings and sides: are they gluten-free, or made with something else?" },
  { it: "Posate e piatti puliti, senza briciole.", en: "Clean cutlery and plates, with no crumbs." },
];
const FLAGS: Item[] = [
  { it: "Risposte vaghe o esitanti su forno, friggitrice, acqua di cottura.", en: "Vague or hesitant answers about the oven, fryer, cooking water." },
  { it: "«Un po' di glutine non fa male».", en: "«A little gluten won't hurt»." },
  { it: "Nessuno sa dire come viene preparato il piatto.", en: "Nobody can say how the dish is prepared." },
];

function List({ items, locale }: { items: Item[]; locale: Locale }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((i) => (
        <li key={i.it} className="flex items-start gap-3 text-ink-soft">
          <span aria-hidden className="mt-1 inline-block h-4 w-4 shrink-0 rounded border border-line-strong" />
          <span>{i[locale]}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ChecklistContent({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <div className="container-page py-10">
      <Breadcrumbs locale={locale} items={[{ name: en ? "Restaurant checklist" : "Checklist ristorante", path: CHECKLIST_PATH }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="font-editorial text-3xl font-semibold text-ink sm:text-4xl">
          {en ? "Gluten-free restaurant checklist" : "Checklist per il ristorante senza glutine"}
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          {en
            ? "What to ask before ordering, in one page you can print or keep on your phone. Free, no sign-up."
            : "Cosa chiedere prima di ordinare, in una pagina da stampare o da tenere sul telefono. Gratis, senza iscrizione."}
        </p>
        <div className="mt-4"><PrintButton label={en ? "Print the checklist" : "Stampa la checklist"} /></div>

        <section className="mt-8">
          <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "1. Before you go (a one-minute call)" : "1. Prima di andare (telefonata di un minuto)"}</h2>
          <List items={BEFORE} locale={locale} />
        </section>
        <section className="mt-8">
          <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "2. At the table" : "2. Al tavolo"}</h2>
          <List items={TABLE} locale={locale} />
        </section>
        <section className="mt-8">
          <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "3. Warning signs" : "3. Segnali di allarme"}</h2>
          <List items={FLAGS} locale={locale} />
          <p className="mt-3 text-sm text-ink-soft">
            {en
              ? "If you see them, it's fine to choose another venue: a cautious choice costs less than contamination."
              : "Se li vedi, puoi scegliere un altro locale: una scelta prudente costa meno di una contaminazione."}
          </p>
        </section>
        <section className="mt-8">
          <h2 className="font-editorial text-2xl font-semibold text-ink">{en ? "Notes" : "Appunti"}</h2>
          <div className="mt-3 h-28 rounded-xl border border-dashed border-line-strong" aria-hidden />
        </section>

        <p className="mt-8 text-sm text-muted">
          {en
            ? "This checklist is general guidance, not a guarantee: always follow your doctor's advice. "
            : "Questa checklist è una guida generale, non una garanzia: segui sempre le indicazioni del tuo medico. "}
          {SITE_NAME} · {SITE_URL.replace("https://", "")}
        </p>

        <div className="no-print mt-8 rounded-2xl border border-line p-5 text-sm text-ink-soft">
          {en ? "More: " : "Per approfondire: "}
          <Link href={localeHref(locale, "/blog/come-evitare-la-contaminazione-crociata-al-ristorante-la-guida-completa-per-mangiare-senza-glutine-in-sicurezza")} className="link-underline text-brand-dark">
            {en ? "how to avoid cross-contamination at a restaurant" : "come evitare la contaminazione crociata al ristorante"}
          </Link>
          {" · "}
          <Link href={localeHref(locale, "/mappa-ristoranti-aic")} className="link-underline text-brand-dark">{en ? "AIC restaurants map" : "mappa dei ristoranti AIC"}</Link>
          {en && (<>{" · "}<Link href={localeHref(locale, "/blog/mangiare-senza-glutine-in-italia-guida-per-chi-viene-dall-estero")} className="link-underline text-brand-dark">gluten-free travel in Italy</Link></>)}
        </div>
      </div>
    </div>
  );
}
