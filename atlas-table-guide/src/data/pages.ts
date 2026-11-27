import { BRAND } from "@/config/brand";

export type ContentPage = { slug: string; title: string; lead: string; sections: { h: string; p: string[] }[]; template?: boolean };
const B = BRAND.shortName;

/** Editable templates. Legal pages MUST be reviewed by a lawyer before launch (see docs/REPORT.md). */
export const LEGAL: ContentPage[] = [
  { slug: "privacy", template: true, title: "Privacy policy", lead: `How ${B} collects, uses and protects personal data.`, sections: [
    { h: "Controller", p: [`The data controller is ${BRAND.legalEntity}. Contact: ${BRAND.supportEmail}.`] },
    { h: "What we collect", p: ["Newsletter: email address, language, chosen topics and cities, consent timestamp and wording version.", "Forms (contact, corrections, concierge, waitlists): the details you type in.", "Accounts (when enabled): email address, saved items, comparisons, alerts and preferences.", "Affiliate clicks: the link identifier, the page you came from, a salted hash of your IP address and your browser's user agent — no cookies."] },
    { h: "Legal bases", p: ["Consent (newsletter, analytics cookies), contract (accounts), legitimate interest (security, fraud prevention, aggregated affiliate statistics)."] },
    { h: "Retention", p: ["Unconfirmed newsletter sign-ups are deleted after 30 days. Form submissions are kept for up to 24 months. Account data is kept until you delete your account."] },
    { h: "Your rights", p: ["You can access, export, correct and delete your data at any time from your account page or by emailing us. You may lodge a complaint with your supervisory authority."] },
    { h: "Processors", p: ["Hosting, database (Supabase), email delivery (Resend), payments (Stripe), privacy-friendly analytics (Plausible) — each only when configured."] },
  ] },
  { slug: "cookies", template: true, title: "Cookie policy", lead: "Which cookies and local storage we use, and why.", sections: [
    { h: "Strictly necessary", p: ["atg_consent (your cookie choices, 180 days), atg_currency (preferred currency, 1 year). Local storage keeps favourites, comparisons and recent searches on your device."] },
    { h: "Analytics (optional)", p: ["Only after consent, we load Plausible, which does not use cookies and does not track you across sites."] },
    { h: "Changing your choice", p: ["Use the \"Cookie settings\" link in the footer at any time."] },
  ] },
  { slug: "terms", template: true, title: "Terms of use", lead: `Conditions for using ${B}.`, sections: [
    { h: "Information only", p: [`${B} publishes information about restaurants, hotels and experiences. Prices, opening hours and availability can change; always confirm with the venue.`] },
    { h: "Bookings and purchases", p: ["Reservations, hotel stays and experiences are contracts between you and the venue or partner. Gift cards and memberships are sold only once merchant agreements are in place."] },
    { h: "Acceptable use", p: ["Do not scrape, overload or attempt to bypass security measures of this site."] },
  ] },
  { slug: "affiliate-disclosure", template: true, title: "Affiliate disclosure", lead: "How we earn money from some links.", sections: [
    { h: "What affiliate links are", p: ["Some links to hotels and experiences go through /go/ and may earn us a commission if you book. They are marked as sponsored links."] },
    { h: "Editorial independence", p: [`Commissions, partner plans and sponsorships never influence recognitions, the ${BRAND.selectionName} or the order of directory results.`] },
  ] },
  { slug: "sponsored-content", template: true, title: "Sponsored content policy", lead: "How paid content is labelled.", sections: [
    { h: "Labelling", p: ["Sponsored articles carry a visible \"Sponsored\" label at the top and in listings, name the sponsor, and are marked as sponsored in structured data."] },
    { h: "Separation", p: ["Sponsors do not review editorial content, recognitions or price data."] },
  ] },
  { slug: "data-correction", template: true, title: "Data correction policy", lead: "How to report and how we fix incorrect information.", sections: [
    { h: "Reporting", p: ["Use \"Report incorrect information\" on any profile or the contact page. Venues can also claim their profile to update operational details."] },
    { h: "Handling", p: ["We acknowledge reports within 5 working days, verify against a primary source, update the record, and log the change with its source and date."] },
  ] },
];

export const STATIC: ContentPage[] = [
  { slug: "about", title: `About ${B}`, lead: `${B} is an independent guide to fine dining: what it costs, where it is, and whether the information is current.`, sections: [
    { h: "What we do", p: ["We publish structured, sourced profiles of restaurants, with verified tasting-menu prices, opening hours, dietary options and recognitions — each with the date it was last checked.", "We also map hotels, experiences and culinary itineraries around those restaurants."] },
    { h: "Independence", p: [`${B} is not affiliated with any restaurant guide or award body. When we mention third-party recognitions, we state them as facts with the awarding body, year and a source link.`] },
  ] },
  { slug: "editorial-policy", title: "Editorial policy", lead: "How we decide what to publish and how we stay independent.", sections: [
    { h: "Our own selection", p: [`The ${BRAND.selectionName} is an editorial distinction awarded by our team. It cannot be bought, and partners cannot influence it.`] },
    { h: "Third-party recognitions", p: ["We report third-party recognitions only as plain text, attributed to the awarding body, with the year and a source link. We never reproduce third-party logos or symbols."] },
    { h: "Commercial separation", p: ["Partner plans can improve how complete a profile is (photos, menus, booking links) but never its recognition, its ranking under \"Recommended\", or its inclusion in collections."] },
  ] },
  { slug: "methodology", title: "Methodology", lead: "How prices and facts are collected, verified and displayed.", sections: [
    { h: "Sources", p: ["Restaurant submissions, licensed datasets, official websites where terms allow, confirmed bookings and editorial research. Every record stores its source URL and collection date."] },
    { h: "Price statuses", p: ["Verified: confirmed from a primary source within the staleness window (default 180 days). Estimated: from a reliable but indirect source. Missing: we do not have it and say so."] },
    { h: "Price history", p: ["Prices are stored in their original currency and every change is appended to an immutable price history; we never overwrite old prices."] },
    { h: "Price Index", p: ["Figures use verified prices only. Each figure shows its sample size (n) and collection date; figures with fewer than 5 verified prices are hidden. Currency conversions use ECB reference rates when available."] },
    { h: "Quality gates", p: ["Destination pages are indexed by search engines only when they list at least 5 verified restaurants and have an original introduction."] },
  ] },
];

export const BUSINESS: (ContentPage & { form: "claim" | "partner-lead" })[] = [
  { slug: "claim-your-restaurant", form: "claim", title: "Claim your restaurant", lead: "Keep your profile accurate: menus, prices, photos, hours and booking links.", sections: [{ h: "Verification", p: ["We verify claims by email domain, a document check, or a phone call-back to the number on your official website. An editor approves every claim before you can edit."] }, { h: "What you can edit", p: ["Operational details only: description, contact, opening hours, menus and prices (marked as restaurant-supplied until verified), authorised photos (with licence confirmation) and booking links. Recognitions and editorial fields are never editable by partners."] }] },
  { slug: "list-your-hotel", form: "partner-lead", title: "List your hotel", lead: "For hotels built around their kitchens.", sections: [{ h: "Who we list", p: ["Hotels with notable restaurants, restaurants with rooms, wine estates, gastronomic resorts and countryside retreats."] }] },
  { slug: "experience-partner", form: "partner-lead", title: "Become an experience partner", lead: "Chef's tables, classes, tastings, tours and culinary weekends.", sections: [{ h: "Integration", p: ["Start with a booking link; a supplier API integration is available for partners with live inventory."] }] },
  { slug: "advertise", form: "partner-lead", title: "Advertise", lead: "Clearly labelled placements for brands relevant to fine dining and travel.", sections: [{ h: "Rules", p: ["All placements are labelled as sponsored and never alter recognitions or rankings."] }] },
  { slug: "sponsored-editorial", form: "partner-lead", title: "Sponsored editorial", lead: "Partner stories, labelled and separated from our editorial.", sections: [{ h: "Disclosure", p: ["Sponsored articles carry a prominent label and the sponsor's name."] }] },
  { slug: "brand-partnerships", form: "partner-lead", title: "Brand partnerships", lead: "Collaborations with wine, hospitality and travel brands.", sections: [{ h: "How it works", p: ["Tell us about your brand and goals; we propose formats that keep our editorial independence intact."] }] },
  { slug: "supplier-marketplace", form: "partner-lead", title: "Supplier marketplace", lead: "A planned marketplace connecting restaurants with specialist suppliers.", sections: [{ h: "Status", p: ["In development — register interest and we will contact you when it opens."] }] },
  { slug: "careers", form: "partner-lead", title: "Careers", lead: "Editors, data verifiers and engineers who care about getting the details right.", sections: [{ h: "Open roles", p: ["No open roles are published yet. Send us a note and we will keep it on file."] }] },
  { slug: "media-kit", form: "partner-lead", title: "Media kit", lead: "Brand assets and audience information for press and partners.", sections: [{ h: "Assets", p: ["Logo files are available on request. Audience statistics will be published once measured — we do not publish estimates."] }] },
  { slug: "contact-sales", form: "partner-lead", title: "Contact sales", lead: "Talk to us about partner plans and campaigns.", sections: [{ h: "Response time", p: ["We reply within two working days."] }] },
];

export const PLANS = [
  { name: "Basic", price: "Free", features: ["Claimed profile", "Edit hours and contact", "Correction requests"] },
  { name: "Professional", price: "€49 / month", features: ["Menus & prices", "Authorised photo gallery", "Booking link", "Monthly analytics"] },
  { name: "Premium", price: "€99 / month", features: ["Everything in Professional", "Gift card listing", "Experience listings"] },
  { name: "Elite", price: "€199 / month", features: ["Everything in Premium", "Campaign tools", "Priority support"] },
  { name: "Enterprise", price: "Custom", features: ["Groups and hotel collections", "API access", "Dedicated manager"] },
];
