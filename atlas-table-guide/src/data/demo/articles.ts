import type { Article, ArticleCategory } from "@/db/types";

const A = (
  n: number, slug: string, category: ArticleCategory, title: string, titleIt: string, excerpt: string,
  author: string, publishedAt: string, image: string, sections: Article["sections"],
  extra: Partial<Article> = {},
): Article => ({
  id: `art-${n}`, slug, isDemo: true, publicationStatus: "published", verificationStatus: "verified",
  updatedAt: extra.updatedAt ?? publishedAt, lastVerifiedAt: publishedAt, category,
  title: { en: title, it: titleIt }, excerpt: { en: excerpt }, author: { name: author, role: "Editor (demo)" },
  publishedAt, sections, sponsored: false, relatedRestaurants: [], relatedCities: [],
  image: { key: image, subject: "dish", illustrative: true }, ...extra,
});

/** 12 demo articles. Authors are fictional; venues referenced are fictional demo venues. */
export const articles: Article[] = [
  A(1, "how-to-read-a-tasting-menu-price", "guides", "How to read a tasting-menu price", "Come leggere il prezzo di un menu degustazione",
    "Service charges, taxes, supplements and pairings: what the headline figure includes, and what it leaves out.", "Elena Varga", "2026-10-02", "tasting-menu", [
      { heading: "The headline number", paragraphs: [
        "The price printed next to a tasting menu is rarely the price you pay. In much of continental Europe it includes VAT and service; in the United Kingdom a discretionary service charge of around 12.5% is usually added; in the United States and Singapore, tax and gratuity sit on top of the menu price.",
        "Before comparing two restaurants, normalise the figure: add the expected service and tax for each city, and decide whether you are comparing food alone or the full evening.",
      ] },
      { heading: "Supplements and pairings", paragraphs: [
        "Many menus list optional supplements — a cheese course, a caviar addition, a premium wine flight. These can add 20–60% to the bill. Wine pairings are usually priced per person and can range from roughly half of the food price to more than the food price itself.",
        "On every profile we show lunch, dinner and pairing prices separately, each with its own status: verified, estimated or missing.",
      ] },
      { heading: "Why the date matters", paragraphs: [
        "Prices change, often once or twice a year. A price without a collection date is of limited use, which is why every figure on this site carries the date it was collected and a link to its source.",
      ] },
    ], { relatedRestaurants: ["maison-lune-paris", "the-tidewater-london"] }),
  A(2, "lunch-versus-dinner-value-gap", "price-index", "Lunch versus dinner: the value gap", "Pranzo o cena: il divario di prezzo",
    "Why a weekday lunch is often the most accessible way into an ambitious dining room — and when it is not.", "Elena Varga", "2026-09-25", "restaurant-interior", [
      { heading: "A shorter menu, a lower price", paragraphs: [
        "Many restaurants offer a shorter lunch menu at a fraction of the dinner price. In our demo dataset the lunch menu is typically around half of the evening price, but the number of courses also drops, so the price per course is not always lower.",
        "The Price Index on this site computes these ratios only from verified prices and hides any figure where the sample is too small.",
      ] },
      { heading: "When dinner is better value", paragraphs: [
        "Some kitchens reserve their signature dishes for the evening, and counter restaurants may serve the same menu at both services. Read the menu details rather than assuming lunch is a cut-down version.",
      ] },
    ]),
  A(3, "what-a-wine-pairing-includes", "wine-champagne", "What a wine pairing really includes", "Cosa include davvero un abbinamento vini",
    "Pours, glass counts and non-alcoholic alternatives: a practical guide before you say yes to the pairing.", "Marco Bellini", "2026-09-12", "wine-experience", [
      { heading: "How much wine is poured", paragraphs: [
        "A pairing typically means one smaller pour per course or per group of courses. Across a long menu that can add up to the equivalent of a bottle per person, so many restaurants offer a shorter or half pairing.",
      ] },
      { heading: "Non-alcoholic pairings", paragraphs: [
        "Juices, ferments, teas and infusions are increasingly common and are often priced below the wine pairing. Ask in advance: these are frequently prepared in small batches.",
        "When we record a pairing price we note whether it is wine, non-alcoholic, or both, and whether it is verified.",
      ] },
    ]),
  A(4, "counter-dining-etiquette-tokyo", "fine-dining", "Counter dining etiquette in Tokyo", "Il galateo del bancone a Tokyo",
    "Fixed seatings, fragrance-free visits and how to handle dietary requirements at a small counter.", "Aiko Mori", "2026-08-30", "chefs-table", [
      { heading: "Arrive on time", paragraphs: [
        "Many counters serve every guest at the same moment. Arriving late can mean missing courses that cannot be repeated. Plan travel time generously.",
      ] },
      { heading: "Leave the perfume at home", paragraphs: [
        "Strong fragrances interfere with delicate aromas at a counter where guests sit close together. Many restaurants ask guests to avoid them.",
        "Dietary requirements should be shared at booking; small kitchens may not be able to adapt a fixed menu on the day.",
      ] },
    ], { relatedRestaurants: ["sushi-kawase-tokyo", "sumibi-oak-tokyo"], relatedCities: ["tokyo"] }),
  A(5, "interview-anders-holm", "interviews", "In conversation with Anders Holm (demo)", "Intervista ad Anders Holm (demo)",
    "A demo interview with the fictional chef of Skov og Hav on short seasons and long ferments.", "Marco Bellini", "2026-08-14", "chef-editorial", [
      { heading: "About this interview", paragraphs: [
        "This is demo content: Anders Holm is a fictional chef created to illustrate how interviews are presented on this site. Real interviews will be published with the chef's approval and a record of the conversation date.",
      ] },
      { heading: "Seasons in the north", paragraphs: [
        "In a demo conversation, the chef describes a menu written around three short growing windows, with preserving and fermenting carrying flavours into the long winter.",
      ] },
    ], { relatedRestaurants: ["skov-og-hav-copenhagen"], relatedCities: ["copenhagen"] }),
  A(6, "why-dine-and-stay", "hotels", "Why dine and stay", "Perché cenare e dormire nello stesso posto",
    "Restaurants with rooms remove the taxi, the late train and the rush — and often add breakfast from the same kitchen.", "Elena Varga", "2026-07-30", "dine-and-stay", [
      { heading: "The appeal", paragraphs: [
        "A long tasting menu with a pairing rarely ends before eleven. Sleeping upstairs turns dinner into the centrepiece of a short trip rather than an evening with a deadline.",
      ] },
      { heading: "What to check", paragraphs: [
        "Room numbers are often small, so packages sell out first. Check whether dinner is included, whether the menu is the full tasting menu, and what the cancellation terms are for each part of the booking.",
      ] },
    ], { relatedRestaurants: ["terrazza-celeste-rome", "marina-ember-dubai", "jade-lantern-singapore"] }),
  A(7, "planning-a-culinary-trip-to-tuscany", "luxury-travel", "Planning a culinary trip to Tuscany", "Organizzare un viaggio gastronomico in Toscana",
    "When to go, how to move between estates, and how to balance long lunches with tasting-menu dinners.", "Giorgia Rinaldi", "2026-07-12", "tuscany-travel", [
      { heading: "Seasons", paragraphs: [
        "Late spring and early autumn are the most comfortable months. Harvest brings activity to the estates; the white-truffle season runs from autumn into early winter.",
      ] },
      { heading: "Getting around", paragraphs: [
        "Distances look short on the map but hill roads are slow. Plan no more than one estate visit and one major meal per day, and arrange a driver if you intend to taste.",
      ] },
    ], { relatedCities: ["rome"] }),
  A(8, "dietary-requests-at-tasting-menus", "guides", "Dietary requests at tasting menus", "Esigenze alimentari nei menu degustazione",
    "How far ahead to ask, what kitchens can usually accommodate, and how we record dietary options.", "Aiko Mori", "2026-06-20", "tasting-menu", [
      { heading: "Ask early", paragraphs: [
        "Most kitchens can handle vegetarian requests with notice; vegan and gluten-free menus vary much more. Give at least 48 hours, and more for small counters.",
      ] },
      { heading: "How we record it", paragraphs: [
        "Profiles show vegetarian, vegan and gluten-free options only when the restaurant has confirmed them. The directory filters use exactly the same data.",
      ] },
    ]),
  A(9, "chef-profile-tan-wei-lin", "chefs", "Tan Wei Lin's shophouse kitchen (demo)", "La cucina nella shophouse di Tan Wei Lin (demo)",
    "A demo chef profile illustrating how we present chefs: background, approach and where to eat their food.", "Giorgia Rinaldi", "2026-06-02", "chef-editorial", [
      { heading: "Demo profile", paragraphs: [
        "Tan Wei Lin is a fictional chef. The profile format — background, approach, signature dishes, where to eat — is what real chef profiles will follow, with facts confirmed by the restaurant.",
      ] },
    ], { relatedRestaurants: ["rumah-tan-singapore"], relatedCities: ["singapore"] }),
  A(10, "autumn-openings-demo", "news", "Autumn notes from the demo dataset", "Note d'autunno dal dataset demo",
    "Illustrative news format: menu changes, closures and new counters among the demo venues.", "Elena Varga", "2026-10-20", "restaurant-interior", [
      { heading: "Format example", paragraphs: [
        "News items on this site always link to the affected profile and record the date of the change. The items below refer to fictional demo venues only.",
        "Skov og Hav (demo) has moved to its autumn menu; Le Quai Bleu (demo) now closes on weekends; Copper Counter (demo) has added two counter seats.",
      ] },
    ], { relatedRestaurants: ["skov-og-hav-copenhagen", "le-quai-bleu-paris", "copper-counter-new-york"] }),
  A(11, "sparkling-wine-at-the-table", "wine-champagne", "Sparkling wine at the table", "Le bollicine a tavola",
    "Sponsored demo article: how traditional-method sparkling wines are matched with tasting-menu courses.", "Partner content (demo)", "2026-09-01", "wine-experience", [
      { heading: "Sponsored content", paragraphs: [
        "This is a demo of how sponsored content is labelled. Sponsors never influence editorial recognitions or the order of directory results.",
      ] },
      { heading: "Matching bubbles and courses", paragraphs: [
        "Lean, high-acid sparkling wines suit raw seafood and salty starters; richer, longer-aged styles stand up to poultry, mushrooms and butter sauces.",
      ] },
    ], { sponsored: true, sponsor: "Demo Sponsor Ltd" }),
  A(12, "how-we-verify-prices", "restaurants", "How we verify prices", "Come verifichiamo i prezzi",
    "Sources, collection dates and the three statuses — verified, estimated, missing — explained.", "Editorial team", "2026-05-15", "tasting-menu", [
      { heading: "Sources", paragraphs: [
        "Prices come from the restaurant directly, from its official website where terms permit, or from a confirmed booking. Every price stores its source and the date it was collected.",
      ] },
      { heading: "Statuses", paragraphs: [
        "Verified means confirmed from a primary source within the staleness window. Estimated means derived from a reliable but indirect source. Missing means we do not have the figure — and we say so rather than guessing.",
      ] },
    ], { updatedAt: "2026-10-01" }),
];
