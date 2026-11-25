/**
 * LEGAL DRAFTS — NOT REVIEWED. Placeholders that describe intended practices.
 * They must be reviewed by qualified counsel (US consumer law, sales tax,
 * EU/Italian obligations such as GDPR and VAT/OSS) before launch.
 */
export interface LegalDraft {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
}

export const legalDrafts: LegalDraft[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "How we intend to collect, use and protect personal data.",
    sections: [
      { heading: "Data we collect", body: ["Account details you provide (such as your email), orders, favorites, and messages you send us. Basic technical data needed to run the site securely."] },
      { heading: "How we use it", body: ["To provide the service, deliver purchases, prevent abuse and, with your consent, send the newsletter. We aim to collect the minimum data necessary."] },
      { heading: "Analytics and cookies", body: ["Any non-essential analytics will run only with consent where required. See the Cookie Policy."] },
      { heading: "Your rights", body: ["You will be able to access, correct, export and delete your data, including deleting your account. Contact details will be published before launch."] },
      { heading: "International transfers", body: ["The operator is based in Italy and serves customers primarily in the United States. Transfer safeguards will be documented after legal review."] },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    summary: "The rules for using the site, the directory and the store.",
    sections: [
      { heading: "Using the directory", body: ["Listings are provided for information. Always confirm hours, prices, safety requirements and availability directly with the business."] },
      { heading: "Accounts", body: ["You are responsible for activity on your account. We may suspend accounts that abuse the service."] },
      { heading: "Digital products", body: ["Purchases grant a license to use files, not ownership of the underlying designs. See the Digital Product License."] },
      { heading: "Safety", body: ["Woodworking and machining are dangerous. Plans and calculators do not replace training, manufacturer instructions or professional judgment."] },
    ],
  },
  {
    slug: "refunds",
    title: "Refund Policy",
    summary: "What happens if a digital product does not work for you.",
    sections: [
      { heading: "Digital goods", body: ["Because files are delivered instantly, refund terms for digital goods will be defined after legal review, in line with applicable consumer protection rules."] },
      { heading: "Defective files", body: ["If a file is corrupted or materially different from its description, we intend to fix it or refund you."] },
    ],
  },
  {
    slug: "digital-license",
    title: "Digital Product License",
    summary: "What you can and cannot do with purchased files.",
    sections: [
      { heading: "Personal license", body: ["Make the project for yourself, your family and friends. You may not sell items made from the files."] },
      { heading: "Commercial license", body: ["Make and sell finished physical items. Limits on quantity may apply per product."] },
      { heading: "Never allowed", body: ["Reselling, sharing, uploading or redistributing the files, in original or modified form."] },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    summary: "Which cookies and similar technologies the site uses.",
    sections: [
      { heading: "Today", body: ["This preview uses no tracking cookies. Your cart and favorites are stored in your browser’s local storage and never leave your device."] },
      { heading: "Later", body: ["If analytics or marketing tools are added, this policy and a consent mechanism will be updated before they run."] },
    ],
  },
  {
    slug: "affiliate-disclosure",
    title: "Affiliate Disclosure",
    summary: "How we label paid placements and affiliate links.",
    sections: [
      { heading: "Affiliate links", body: ["Some future links to tools or materials may earn us a commission at no extra cost to you. They will be labeled."] },
      { heading: "Sponsored listings", body: ["Paid placements in the directory will always be clearly marked as sponsored. Correcting information or verifying ownership is always free."] },
    ],
  },
];

export function getLegalDraft(slug: string) {
  return legalDrafts.find((d) => d.slug === slug);
}
