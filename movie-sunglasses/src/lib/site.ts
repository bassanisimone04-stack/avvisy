export const SITE = {
  name: "Screenshade",
  tagline: "Find the Sunglasses Behind the Screen.",
  description: "A research-driven directory of the sunglasses worn by actors in movies and TV, with evidence-based identification, price comparison and affordable alternatives.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en-US",
  currency: "USD",
  showUnreviewedNotice: process.env.NEXT_PUBLIC_SHOW_UNREVIEWED_NOTICE !== "false",
  contactEmail: "hello@example.com",
} as const;

/** Locales planned for hreflang. Only en-US is live; add entries when translated routes exist. */
export const LOCALES = [{ code: "en-US", path: "" }] as const;

export const MATCH_LABEL = {
  exact: "Exact Match",
  official_reissue: "Official Reissue",
  similar: "Similar Style",
  unconfirmed: "Unconfirmed",
} as const;

export const MATCH_HELP = {
  exact: "The original model is identified, backed by at least one primary/brand/press source or two independent sources, with no source disputing it.",
  official_reissue: "An official reissue, tribute edition or current production of the original design by the same maker, under the same evidence rules as Exact Match.",
  similar: "A visually similar alternative. It is a style judgement, not a claim about what was worn on screen.",
  unconfirmed: "Identification is uncertain: evidence is thin, from a single source, or sources contradict each other.",
} as const;

export const PRICE_BAND_LABEL = {
  under50: "Under $50", under100: "Under $100", under200: "Under $200", over200: "$200+",
} as const;

export const STYLES = [
  { slug: "aviator", name: "Aviator", blurb: "Teardrop lenses and thin metal frames, born in the cockpit and made famous on screen.", match: (s: string, t: string[]) => s === "aviator" },
  { slug: "wayfarer", name: "Wayfarer", blurb: "Bold trapezoid acetate frames — the shape that defined cool from the 1950s on.", match: (s: string, t: string[]) => s === "wayfarer" },
  { slug: "cat-eye", name: "Cat-Eye", blurb: "Upswept corners and feminine glamour.", match: (s: string, t: string[]) => s === "cat-eye" },
  { slug: "rectangular", name: "Rectangular", blurb: "Clean, flat-topped frames with a modern, utilitarian line.", match: (s: string, t: string[]) => s === "rectangular" },
  { slug: "oval", name: "Oval & Round", blurb: "Soft curves, from panto classics to folding vintage icons.", match: (s: string, t: string[]) => s === "oval" || s === "round" },
  { slug: "vintage", name: "Vintage", blurb: "Period pieces and tribute editions from earlier eras.", match: (s: string, t: string[]) => t.includes("vintage") },
  { slug: "futuristic", name: "Futuristic", blurb: "Wraparounds and sci-fi silhouettes.", match: (s: string, t: string[]) => s === "wrap" || t.includes("futuristic") },
] as const;

export const NAV = [
  { href: "/movies", label: "Movies" },
  { href: "/actors", label: "Actors" },
  { href: "/sunglasses", label: "Sunglasses" },
  { href: "/brands", label: "Brands" },
  { href: "/styles", label: "Styles" },
  { href: "/affordable-alternatives", label: "Alternatives" },
  { href: "/vintage", label: "Vintage" },
  { href: "/blog", label: "Guides" },
] as const;
