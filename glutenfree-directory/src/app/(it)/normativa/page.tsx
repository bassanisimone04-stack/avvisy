import NormativaContent, { NORMATIVA_PATH } from "@/components/pages/NormativaContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Normativa celiachia in Italia: etichette, buono, leggi",
    description: "Le regole sulla celiachia in Italia in una pagina aggiornata: etichette senza glutine, limite di 20 mg/kg, buono per celiaci, legge quadro e ristorazione.",
    path: NORMATIVA_PATH,
    locale: "it",
  }),
};

export default function Page() {
  return <NormativaContent locale="it" />;
}
