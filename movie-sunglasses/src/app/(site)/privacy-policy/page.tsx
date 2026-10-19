import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal";
export const metadata = buildMetadata({ title: "Privacy Policy", description: "How Screenshade handles personal data, aggregate analytics and contact messages.", path: "/privacy-policy" });
export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="October 15, 2026">
      <p>This policy explains what data [Operator legal name, address, contact email] (“we”) processes when you use this website.</p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Aggregate page counters.</strong> When you open a product, movie or guide page, a request increments a per-day counter. We do not store your IP address, user agent or any identifier with it, and we respect the Do Not Track signal.</li>
        <li><strong>Store-link clicks.</strong> When you press a store button, we log the time, the store, the product and the page you came from — no IP address and no identifier — to understand which guides are useful.</li>
        <li><strong>Contact messages.</strong> If you write to us through the contact form, we store your name, email and message to reply. Retention: [12] months, then deleted.</li>
        <li><strong>Consent choice.</strong> Your cookie choice is kept in your browser’s local storage.</li>
        <li><strong>Optional analytics.</strong> Only if enabled and only after you accept: Google Analytics 4 with IP anonymisation.</li>
      </ul>
      <h2>Legal bases</h2>
      <p>Aggregate counters and click logs: legitimate interest in operating and improving the site. Contact messages: your request. Analytics: your consent (GDPR/ePrivacy).</p>
      <h2>Third parties</h2>
      <p>When you leave for a store, that store processes your data under its own policy and may set its own cookies. Our hosting and database providers act as processors.</p>
      <h2>Your rights</h2>
      <p>You may request access, correction, deletion, restriction or portability, and may object to processing, by writing to [contact email]. You can also complain to your data protection authority. California residents may have additional rights under the CCPA/CPRA; we do not sell personal information.</p>
    </LegalPage>
  );
}
