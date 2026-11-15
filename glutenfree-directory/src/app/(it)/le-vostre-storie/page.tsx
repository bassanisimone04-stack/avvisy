import StoriesContent, { STORIES_PATH } from "@/components/pages/StoriesContent";
import { STORIES } from "@/lib/stories";
import { pageMetadata } from "@/lib/seo";

const meta = pageMetadata({
  title: "Le vostre storie: racconta il tuo locale senza glutine",
  description: "Hai provato un locale della nostra mappa? Raccontaci com'è andata: pubblichiamo solo esperienze vere, con il tuo consenso.",
  path: STORIES_PATH,
  locale: "it",
});

// Finche' non ci sono storie reali la pagina resta fuori dall'indice (pagina quasi vuota).
export const metadata = STORIES.length === 0 ? { ...meta, robots: { index: false, follow: true } } : meta;

export default function Page() {
  return <StoriesContent locale="it" />;
}
