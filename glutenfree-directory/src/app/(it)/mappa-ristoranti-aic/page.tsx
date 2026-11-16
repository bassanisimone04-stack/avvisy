import AicMapContent, { AIC_MAP_PATH } from "@/components/pages/AicMapContent";
import { aicRestaurants } from "@/lib/aic-map";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

const n = aicRestaurants().length;
const cities = new Set(aicRestaurants().map((b) => b.city)).size;

export const metadata = pageMetadata({
  title: `Mappa ristoranti AIC: ${n} locali certificati`,
  description: `Elenco e mappa di ristoranti e pizzerie AIC (Alimentazione Fuori Casa): ${n} locali in ${cities} città, anche Roma e Milano. Indirizzi su ${SITE_NAME}.`,
  path: AIC_MAP_PATH,
  locale: "it",
});

export default function AicMapPage() {
  return <AicMapContent locale="it" />;
}
