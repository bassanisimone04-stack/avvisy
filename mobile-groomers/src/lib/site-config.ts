export const SITE_NAME = "FindMobileGrooming";
export const SITE_DOMAIN = "findmobilegrooming.com";
export const SITE_URL = "https://findmobilegrooming.com";
export const SITE_DESCRIPTION =
  "Find top-rated mobile dog groomers near you. Compare van-based groomers by zip code, book stress-free at-home grooming, and see real service radius, pricing, and availability.";
export const SUPPORT_EMAIL = "hello@findmobilegrooming.com";

/** Featured metro areas shown on the homepage and used for /cities pages. */
export const FEATURED_CITIES = [
  { city: "Los Angeles", state: "CA", slug: "los-angeles-ca" },
  { city: "Houston", state: "TX", slug: "houston-tx" },
  { city: "Miami", state: "FL", slug: "miami-fl" },
  { city: "Phoenix", state: "AZ", slug: "phoenix-az" },
  { city: "Dallas", state: "TX", slug: "dallas-tx" },
  { city: "Chicago", state: "IL", slug: "chicago-il" },
  { city: "Atlanta", state: "GA", slug: "atlanta-ga" },
  { city: "Denver", state: "CO", slug: "denver-co" },
  { city: "Seattle", state: "WA", slug: "seattle-wa" },
  { city: "San Diego", state: "CA", slug: "san-diego-ca" },
  { city: "Austin", state: "TX", slug: "austin-tx" },
  { city: "Charlotte", state: "NC", slug: "charlotte-nc" },
] as const;

export const PRICING_TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/mo",
    tagline: "Get listed and start building trust.",
    cta: "Claim for Free",
    highlight: false,
    features: [
      "Business name, city & category",
      "1 phone line displayed",
      "Basic service tags",
      "Customer reviews visible",
    ],
  },
  {
    id: "pro",
    name: "Pro Van",
    price: "$39",
    period: "/mo",
    tagline: "Rank higher, get more direct leads.",
    cta: "Start Pro Van",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "Priority ranking in local city search",
      "Direct website & booking links",
      "Verified Mobile Unit badge",
      "Custom zip code coverage map",
      "Lead forwarding by call & text",
    ],
  },
  {
    id: "fleet",
    name: "Multi-Fleet",
    price: "$99",
    period: "/mo",
    tagline: "For businesses running multiple vans.",
    cta: "Talk to Sales",
    highlight: false,
    features: [
      "Everything in Pro Van",
      "Manage multiple vans & technicians",
      "Smart lead distribution across vans",
      "Homepage & category featured placement",
      "Priority support",
    ],
  },
] as const;
