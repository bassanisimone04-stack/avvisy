# Glasshouse Weddings

A directory and editorial site for **greenhouse, glasshouse and conservatory
wedding venues** in the United States, with a destination section for Italy.

Static HTML generated from a single data file, one compiled Tailwind CSS v4
stylesheet, and ~7 KB of vanilla JS. No framework, no CDN, no runtime dependencies.

```bash
npm install
npm run build       # patterns → HTML → CSS → FAQ parity check
npm run build:html  # regenerate pages from data/venues.json
npm run dev         # Tailwind watch while editing markup
npm run serve       # http://localhost:4321
npm run check:faq   # FAQ schema/visible parity + keyword coverage
```

---

## 1. The sourcing rule

**A field is filled in only when the venue's own website states it.** Not a
listing marketplace, not a photographer's blog, not a review aggregator. Those
sources go stale, disagree with each other, and are how a directory ends up
publishing something untrue about a real business.

Anything unconfirmed stays `null` in `data/venues.json` and renders as a dash
with a link to the venue's own page. The site says explicitly that a dash means
"not confirmed", never "small" or "cheap".

Consequences, by design:

- **No invented capacities or prices.** Today that means 0 of 12 listings carry
  either — the capacity, blend and price filters correctly return nothing rather
  than pretending. Fill them in as you verify, and the filters come alive.
- **No `aggregateRating`, no reviews.** We hold no first-party reviews, so none
  appear on the site or in the structured data. Invented ratings are both a
  Google spam-policy violation and a lie about someone's business.
- **No borrowed photography.** Images are generated decorative patterns
  (`scripts/generate-placeholders.mjs`), marked `alt="" aria-hidden`, with a
  visible "No photo on file" label on venue cards. Nothing here should be
  mistaken for a photograph of a real venue.
- **No named author persona.** Guides are bylined to the publisher, not to an
  invented editor.
- **No averages we cannot source.** The cost guide deliberately publishes no
  median price; it teaches the cost structure and gives a quote checklist instead.

The visible version of this policy is [`/methodology/`](methodology/index.html),
referenced from the `Organization` schema as `publishingPrinciples`.

### The listings currently in the file

Twelve real venues, each seeded with name, city/state, type and its official
events URL. **Verify each one before launch** — open `official_url`, confirm the
venue still hosts weddings, fill in what it publishes, and set `last_verified`.

---

## 2. Architecture

```
data/
  venues.json        ← the only place venue facts live
  site.json          ← site name, base URL, nav states
build/
  build.py           ← entry point: renders every page
  chrome.py          ← <head>, header, footer, breadcrumbs, JSON-LD helper
  cards.py           ← data loading + the venue card (handles missing values)
  filters.py         ← the filter component (rail + drawer)
  faqs.py            ← every FAQ set, keyword-targeted
  shared.py          ← accordion, FAQ schema, ad slots
  page_home.py  page_directory.py  page_content.py
scripts/
  generate-placeholders.mjs   check-faq-parity.mjs
src/styles/tailwind.css       ← design system source
assets/                       ← compiled CSS, JS, generated patterns
```

Generated output (`index.html`, `venues/`, `blog/`, `italy-destination-weddings/`,
`methodology/`, `sitemap.xml`) is committed so the site can be served straight
from the repo, but it is **derived** — edit the data or the builders, then
`npm run build:html`.

### URL structure

```
/                                        Home
├── /venues/                             All listings, filterable
│   ├── /venues/{state}/                 State page (one per state with listings)
│   └── /venues/{state}/{venue}/         Venue page
├── /italy-destination-weddings/         Destination hub
│   └── /italy-destination-weddings/{venue}/
├── /blog/  →  /blog/{post}/             Guides
└── /methodology/                        Sourcing and editorial standards
```

Adding a venue to `data/venues.json` creates its page, adds it to its state page
(creating that page if it is the first listing in the state), adds it to the hub,
the sitemap, the facets and the counters. There is no second place to update.

### Keyword → URL map

| Keyword (US monthly volume) | Intent | Where it lives |
|---|---|---|
| greenhouse wedding venues (22–33k) | Commercial | Homepage `<h1>` + title |
| botanical garden wedding venues (14–22k) | Commercial | `/venues/?type=botanical-garden`, on-page copy |
| glasshouse wedding venue near me (12–18k) | Transactional / local | Nav and FAQ anchor text |
| greenhouse wedding venue **[State]** (1–4.5k each) | Transactional | `/venues/{state}/` `<h1>` + title |
| small greenhouse wedding venues (3.5–5.4k) | Transactional | `?capacity=micro`, FAQs |
| greenhouse wedding cost (2.4–4.1k) | Informational | `/blog/greenhouse-wedding-cost/` `<h1>` |
| conservatory wedding venues (2.9–4.8k) | Commercial | Meta descriptions + on-page synonym |
| greenhouse wedding venue Italy (1.6–2.9k) | Transactional | `/italy-destination-weddings/` `<h1>` |
| rain-proof outdoor wedding venues (0.8–1.5k) | Problem-solving | `/blog/rain-proof-outdoor-wedding-venues/` |

Titles follow `Primary keyword | Qualifier`, under ~62 characters, brand at most
once and never before the keyword.

---

## 3. Design system

Tokens live in `src/styles/tailwind.css` under `@theme`, which makes them real
Tailwind utilities (`bg-botanical-800`, `text-champagne-700`).

| Role | Token | Hex |
|---|---|---|
| **Primary** — deep botanical emerald | `--color-botanical-800` | `#1B4332` |
| Primary, deepest / mid / tint | `botanical-950 / 600 / 50` | `#081C15` · `#2D6A4F` · `#EDF8F1` |
| **Accent** — warm champagne gold | `--color-champagne-500` | `#D4AF37` |
| Accent, text-safe on light | `--color-champagne-700` | `#8A6D1F` |
| **Background** — warm cream | `--color-cream` | `#F8F9FA` |
| Surface / ink / hairlines | `shell`, `ink-900…300`, `line` | `#FFFFFF` · `#14201B`→`#8C9A93` · `#E4E9E6` |

Rules that keep it looking expensive: gold is punctuation, one gold element per
viewport, on the action you most want taken; never `#D4AF37` as text on cream
(fails contrast — use `champagne-700`); shadows are emerald-tinted, never grey.

**Typography** — Playfair Display (500/600/700) on `h1–h4`, Plus Jakarta Sans
(400–800) for body and UI, two families only, `preconnect` + `display=swap`.
Self-host both as `woff2` before launch to remove two DNS lookups from LCP.

**Primitives** — `.shell`, `.btn-*`, `.card`, `.chip`, `.badge-*`, `.field`,
`.nav-link`, `.eyebrow`, `.prose-editorial`, `.ad-slot`, `.glass-panel`,
`.skip-link`. Bases are shared selector lists inside `@layer components`: in
Tailwind v4 a later cascade layer beats higher specificity, so a base defined as
`@utility` would override `.chip[aria-pressed="true"]` and `.btn-sm`.

**Accessibility** — visible focus ring everywhere, skip link on every page,
`aria-pressed` filter chips, a real `role="dialog"` drawer with Escape-to-close,
decorative SVGs `aria-hidden`, and `prefers-reduced-motion` disabling all motion.
Body copy `#2F3D36` on `#F8F9FA` is 12.4:1.

---

## 4. The filter component

`assets/js/venue-filters.js` (~5 KB, no dependencies) filters **state**,
**venue type**, **capacity**, **indoor/outdoor blend** and **price range**, plus
free-text search and sort.

- Cards are server-rendered and stay in the DOM — the filter only toggles
  `hidden`, so everything remains crawlable and the page works with JS off.
- State lives in the URL (`?state=california&type=conservatory`), so filtered
  views are shareable and the back button behaves.
- **A listing with an unconfirmed value is excluded while that facet is active,
  never bucketed by guesswork.** Sorting pushes unconfirmed values last in both
  directions, so a missing number never reads as a zero.
- Desktop gets a sticky rail, mobile a bottom sheet, from the same markup.

Above a few hundred venues, move filtering server-side and render real paginated
URLs (`/venues/california/under-50-guests/`) — those rank, query strings do not.

---

## 5. Structured data

Every page ships JSON-LD; `/schema/` holds standalone commented templates.

| Template | Used on |
|---|---|
| `website-organization.jsonld` | Homepage only (others reference it by `@id`) |
| `event-venue.jsonld` | Venue pages — `EventVenue` + `LocalBusiness` |
| `collection-page.jsonld` | Hub, state and destination pages |
| `blog-posting.jsonld` | Guides |
| `breadcrumb-list.jsonld` | Every page except the homepage |
| `faq-page.jsonld` | Any page with a visible FAQ |

Two rules the build enforces:

1. **Every marked-up FAQ question appears verbatim in a visible `<summary>` on
   the same page.** `npm run check:faq` parses the built HTML and exits non-zero
   on a mismatch; it runs inside `npm run build`.
2. **Structured data asserts only confirmed fields.** `maximumAttendeeCapacity`
   and `priceRange` are emitted only when the data holds them.

161 FAQs across the site, all keyword-targeted — coverage is printed by
`npm run check:faq`.

---

## 6. Performance

- One stylesheet, minified, ~65 KB (~10 KB gzipped). No CDN, no FOUC.
- Two deferred JS files, ~7 KB total, zero dependencies.
- Every `<img>` has explicit `width`/`height` (no CLS), `decoding="async"`, and
  `loading="lazy"` below the fold / `fetchpriority="high"` above it.
- Ad slots reserve their height so late creative cannot shift layout.

Before launch: self-host the fonts, add real photography with `srcset`, and set
`Cache-Control: public, max-age=31536000, immutable` on `/assets/`.

---

## 7. Before you launch

1. **Verify every listing.** Open each `official_url`, confirm the venue still
   hosts weddings, fill in what its site publishes, set `last_verified`, rebuild.
2. **Change the domain.** `base_url` in `data/site.json` feeds every canonical,
   `og:url` and JSON-LD `@id`. Change it there, rebuild, and update
   `robots.txt`.
3. **Point the forms somewhere.** `/api/suggest` has no backend in this build.
4. **Add the pages a real site needs** and link them in the footer: privacy,
   terms, contact, and an affiliate disclosure if you add affiliate links. They
   are not stubbed here because they would have to describe a real legal entity.
5. **Replace the decorative patterns** with licensed photography, give it
   descriptive alt text, and remove the "No photo on file" label in
   `build/cards.py`.
6. **Fill the ad slots or remove them.** They currently render as empty reserved
   boxes labelled "unsold".
