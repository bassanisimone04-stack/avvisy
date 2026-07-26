import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Termini di servizio",
  description: "Termini e condizioni di utilizzo della piattaforma GlutenFree Directory.",
  path: "/termini",
});

export default function TermsPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Termini di servizio", path: "/termini" }]} />
      <div className="prose-article mx-auto max-w-3xl">
        <h1>Termini di servizio</h1>
        <p>GlutenFree Directory è un prototipo dimostrativo. Le informazioni su attività, prodotti e recensioni presenti nel sito sono inventate a scopo illustrativo e non rappresentano dati reali.</p>
        <h2>Uso del servizio</h2>
        <p>L&apos;utilizzo della piattaforma è gratuito. Gli utenti si impegnano a pubblicare contenuti (recensioni, commenti, segnalazioni) veritieri e rispettosi della community.</p>
        <h2>Limitazione di responsabilità</h2>
        <p>Le informazioni sulla sicurezza alimentare pubblicate dagli utenti hanno natura orientativa: si raccomanda sempre di verificare direttamente con l&apos;attività eventuali dubbi su allergeni e contaminazioni.</p>
      </div>
    </div>
  );
}
