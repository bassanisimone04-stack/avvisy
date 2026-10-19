import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal";
export const metadata = buildMetadata({ title: "Affiliate Disclosure", description: "How Screenshade earns commissions and how it keeps identification labels independent of them.", path: "/affiliate-disclosure" });
export default function Page() {
  return (
    <LegalPage title="Affiliate Disclosure" updated="October 15, 2026">
      <p>Some links to stores on this site are affiliate links: if you buy after clicking, we may earn a commission at no extra cost to you. Such links are marked <code>rel=&quot;sponsored&quot;</code> and the “View Deal” and “Find listings” buttons are affiliate or search links.</p>
      <h2>Independence</h2>
      <ul>
        <li>Labels (Exact Match, Official Reissue, Similar Style, Unconfirmed) are assigned by evidence rules and never by commission rates.</li>
        <li>We do not show a price we have not received from a merchant or affiliate feed. Where no verified offer exists we say so and offer a plain search link.</li>
        <li>Editorial price bands are marked as estimates.</li>
        <li>Sponsored placements or collaborations, if ever added, will be labelled as such.</li>
      </ul>
      <h2>Programmes</h2>
      <p>Programmes we are approved for are listed here once active: [none configured yet].</p>
    </LegalPage>
  );
}
