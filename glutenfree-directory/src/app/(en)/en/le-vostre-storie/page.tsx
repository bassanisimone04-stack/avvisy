import StoriesContent, { STORIES_PATH } from "@/components/pages/StoriesContent";
import { STORIES } from "@/lib/stories";
import { pageMetadata } from "@/lib/seo";

const meta = pageMetadata({
  title: "Your Stories: Share Your Gluten-Free Experience",
  description: "Tried a venue from our map? Tell us how it went: we only publish real experiences, with your consent.",
  path: STORIES_PATH,
  locale: "en",
});

// Finche' non ci sono storie reali la pagina resta fuori dall'indice (pagina quasi vuota).
export const metadata = STORIES.length === 0 ? { ...meta, robots: { index: false, follow: true } } : meta;

export default function Page() {
  return <StoriesContent locale="en" />;
}
