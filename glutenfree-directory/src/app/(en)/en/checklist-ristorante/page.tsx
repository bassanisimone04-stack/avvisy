import ChecklistContent, { CHECKLIST_PATH } from "@/components/pages/ChecklistContent";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Gluten-Free Restaurant Checklist: Printable",
    description: "What to ask before ordering at a restaurant if you have celiac disease: a free printable checklist on kitchen, oven, fryer and cooking water.",
    path: CHECKLIST_PATH,
    locale: "en",
  }),
};

export default function Page() {
  return <ChecklistContent locale="en" />;
}
