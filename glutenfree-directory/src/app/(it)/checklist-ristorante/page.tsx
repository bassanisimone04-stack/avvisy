import ChecklistContent, { CHECKLIST_PATH } from "@/components/pages/ChecklistContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Checklist ristorante senza glutine: da stampare",
    description: "Cosa chiedere prima di ordinare al ristorante se sei celiaco: checklist gratuita da stampare, con le domande su cucina, forno, friggitrice e acqua di cottura.",
    path: CHECKLIST_PATH,
    locale: "it",
  }),
};

export default function Page() {
  return <ChecklistContent locale="it" />;
}
