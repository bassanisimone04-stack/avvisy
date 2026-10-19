import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal";

export const metadata = buildMetadata({ title: "Copyright Notice and Takedown Requests", description: "How to report an image or text you believe infringes your copyright on Screenshade, and how we respond.", path: "/copyright" });

export default function Page() {
  return (
    <LegalPage title="Copyright Notice" updated="October 15, 2026">
      <p>Screenshade identifies the sunglasses worn on screen. Where we show a still from a film or TV title, we do so to comment on and identify the eyewear, with credit to the rights holder and a link to the source. Film titles, studio names and brand names belong to their owners, and we are not affiliated with them.</p>
      <h2>Reporting an infringement</h2>
      <p>If you own or control rights in material on this site and believe it is used without permission, <Link href="/contact">contact us</Link> or write to [designated agent name, postal address, email]. Please include:</p>
      <ul>
        <li>a description of the work you say is infringed;</li>
        <li>the exact page address (URL) of the material;</li>
        <li>your name, address, email and phone number;</li>
        <li>a statement that you have a good-faith belief the use is not authorised by the owner, its agent or the law;</li>
        <li>a statement that the information in your notice is accurate and, under penalty of perjury, that you are the owner or authorised to act for the owner;</li>
        <li>your physical or electronic signature.</li>
      </ul>
      <h2>What we do</h2>
      <p>We review notices promptly and remove or disable access to material that appears to infringe while we do. If you are the person who supplied the material, we may tell you about the notice and you may send a counter-notice as the law allows. We may end access for repeat infringers.</p>
      <h2>Licensed images</h2>
      <p>Images we hold under a licence or other permission show their credit and licence type underneath. Rights questions about those images can be sent to the same address.</p>
    </LegalPage>
  );
}
