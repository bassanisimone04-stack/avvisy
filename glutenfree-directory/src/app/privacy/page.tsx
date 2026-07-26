import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Informativa sulla privacy di GlutenFree Directory: come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ name: "Privacy policy", path: "/privacy" }]} />
      <div className="prose-article mx-auto max-w-3xl">
        <h1>Privacy Policy</h1>
        <p>Questo prototipo dimostrativo non raccoglie né elabora dati personali reali. In una versione in produzione, questa pagina descriverebbe nel dettaglio le finalità del trattamento, le basi giuridiche, i tempi di conservazione e i diritti dell&apos;interessato ai sensi del GDPR (Regolamento UE 2016/679).</p>
        <h2>Dati raccolti</h2>
        <p>Account, preferiti e recensioni inseriti in questo prototipo sono salvati esclusivamente nel browser locale (localStorage) e non vengono trasmessi a nessun server esterno.</p>
        <h2>Contatti</h2>
        <p>Per qualsiasi domanda relativa alla privacy scrivi a privacy@glutenfreedirectory.it.</p>
      </div>
    </div>
  );
}
