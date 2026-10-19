import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal";
export const metadata = buildMetadata({ title: "Cookie Policy", description: "Which cookies and browser storage Screenshade uses, and how to change your choice.", path: "/cookie-policy" });
export default function Page() {
  return (
    <LegalPage title="Cookie Policy" updated="October 15, 2026">
      <h2>What we use</h2>
      <ul>
        <li><strong>Essential — local storage <code>ss-consent</code>.</strong> Remembers your cookie choice.</li>
        <li><strong>Essential — admin session cookie.</strong> Set only for the site operator after login (HttpOnly, SameSite=Strict). Visitors never receive it.</li>
        <li><strong>Optional — Google Analytics 4</strong> (<code>_ga</code> cookies). Loaded only if the site is configured with an analytics ID <em>and</em> you click “Accept analytics”.</li>
      </ul>
      <h2>Store cookies</h2>
      <p>After you click a store link, the store and its affiliate network may set cookies to attribute a purchase to us. Those cookies are governed by their policies.</p>
      <h2>Change your choice</h2>
      <p>Use “Cookie settings” in the footer at any time, or clear this site’s data in your browser.</p>
    </LegalPage>
  );
}
