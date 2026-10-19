import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal";
export const metadata = buildMetadata({ title: "Terms of Use", description: "Terms governing use of the Screenshade website and its content.", path: "/terms" });
export default function Page() {
  return (
    <LegalPage title="Terms of Use" updated="October 15, 2026">
      <h2>Information only</h2>
      <p>Identification of sunglasses is research-based, can be wrong, and is graded by evidence. Prices, availability and specifications come from third parties and may change; confirm with the seller before buying.</p>
      <h2>Trademarks and images</h2>
      <p>Brand, film and character names belong to their owners and are used only to identify products. We are not affiliated with or endorsed by any studio, actor or eyewear maker. Illustrations on this site are generated from recorded shape and colour and are not film stills or product photographs.</p>
      <h2>Third-party sites</h2>
      <p>We are not responsible for the content, products or practices of the stores we link to.</p>
      <h2>Corrections</h2>
      <p>Spotted an error or want a source reviewed? Tell us through the contact page; we will update records and note the correction date.</p>
      <h2>Liability and governing law</h2>
      <p>To the extent permitted by law, the site is provided “as is”. Governing law and venue: [jurisdiction].</p>
    </LegalPage>
  );
}
