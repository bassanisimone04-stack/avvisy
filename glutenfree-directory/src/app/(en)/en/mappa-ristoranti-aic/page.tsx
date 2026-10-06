import AicMapContent, { AIC_MAP_PATH } from "@/components/pages/AicMapContent";
import { aicRestaurants } from "@/lib/aic-map";
import { pageMetadata } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site-config";

const n = aicRestaurants().length;
const cities = new Set(aicRestaurants().map((b) => b.city)).size;

export const metadata = pageMetadata({
  title: `AIC restaurants map: ${n} certified venues`,
  description: `The map of restaurants and pizzerias in the AIC Alimentazione Fuori Casa program: ${n} venues in ${cities} cities, with address and listing on ${SITE_NAME}.`,
  path: AIC_MAP_PATH,
  locale: "en",
});

export default function AicMapPageEn() {
  return <AicMapContent locale="en" />;
}
