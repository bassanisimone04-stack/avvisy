import NormativaContent, { NORMATIVA_PATH } from "@/components/pages/NormativaContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Celiac Disease Rules in Italy: Labels and Voucher",
    description: "Celiac disease rules in Italy on one updated page: gluten-free labels, the 20 mg/kg limit, the celiac voucher, the framework law and restaurants.",
    path: NORMATIVA_PATH,
    locale: "en",
  }),
};

export default function Page() {
  return <NormativaContent locale="en" />;
}
