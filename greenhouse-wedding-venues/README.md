# Glasshouse Weddings

A directory and editorial site for **greenhouse, glasshouse and conservatory
wedding venues** in the United States, with a destination section for Italy.

Static HTML generated from a single data file, one compiled Tailwind CSS v4
stylesheet, and a handful of small vanilla JS files. No framework, no CDN, no
runtime dependencies.

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

- **No invented capacities or prices.** Today that means 0 of 30 listings carry
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

Thirty real venues across 16 states and regions, each seeded with name,
city/state, type and its official events URL. **Verify each one before
launch** — open `official_url`, confirm the venue still hosts weddings, fill
in what it publishes, and set `last_verified`.

---

## 2. Architecture

```
data/
  venues.json        ← the only place venue facts live
  site.json          ← site name, base URL, nav states
build/
  build.py           ← entry point: renders every page + assets/data/venues.json
  chrome.py          ← <head>, header, footer, breadcrumbs, JSON-LD helper
  cards.py           ← data loading + the venue card (handles missing values)
  filters.py         ← the filter component (rail + drawer)
  faqs.py            ← every FAQ set, keyword-targeted
  shared.py          ← accordion, FAQ schema, ad slots, shortlist button, checklist
  page_home.py  page_directory.py  page_content.py  page_shortlist.py
scripts/
  generate-placeholders.mjs   check-faq-parity.mjs
src/styles/tailwind.css       ← design system source
assets/
  css/site.css       ← compiled Tailwind output
  js/                ← site.js, venue-filters.js, shortlist.js, checklist.js
  img/patterns/      ← generated decorative SVGs
  data/venues.json   ← public trimmed copy, written at build time — client-side only
```

Generated output (`index.html`, `venues/`, `blog/`, `italy-destination-weddings/`,
`methodology/`, `shortlist/`, `sitemap.xml`, `assets/data/venues.json`) is
committed so the site can be served straight from the repo, but it is
**derived** — edit the data or the builders, then `npm run build:html`.

### URL structure

```
/                                        Home
├── /venues/                             All listings, filterable
│   ├── /venues/{state}/                 State page (one per state with listings)
│   └── /venues/{state}/{venue}/         Venue page
├── /italy-destination-weddings/         Destination hub
│   └── /italy-destination-weddings/{venue}/
├── /blog/  →  /blog/{post}/             Guides
├── /methodology/                        Sourcing and editorial standards
└── /shortlist/                          Saved venues + compare (noindex, client-only)
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

## 5. Interactivity: shortlist, compare, checklists

Three tools, all client-side, all `localStorage`-only — there is no backend, so
there is nothing to build to keep this honest: what a visitor saves lives in
their browser and nowhere else.

**Shortlist** (`assets/js/shortlist.js`, ~14 KB unminified — it also drives
the `/shortlist/` page below). A heart toggle on every card
(`build/shared.py` `shortlist_button()`) and on each venue page saves a slug to
`localStorage`. The header shows a live count on every page. Buttons render
unpressed from the server — there is no session — and JS corrects
`aria-pressed`/`aria-label` on load, the same pattern `.chip[aria-pressed]`
already used for the filters.

**Compare**, on `/shortlist/` (`build/page_shortlist.py`). The page ships as an
empty shell and hydrates from `/assets/data/venues.json` — a public, trimmed
copy of `data/venues.json` that `build/build.py` writes on every build.
Checking "Compare this venue" on two to four saved listings renders a table of
their *confirmed* fields only; an unconfirmed one is a dash here exactly as it
is everywhere else on the site — the compare tool does not get to know more
than the directory does. The page is `noindex`: it has no content of its own to
rank for, only a visitor's saved state.

**Interactive checklists** (`assets/js/checklist.js`, ~3 KB), on the cost guide
and on every venue page (`build/shared.py` `checklist()`). Same question-and-
why content a static list would carry, just checkable, with progress saved per
checklist key — a venue page's checklist is keyed to that venue, so a couple
comparing quotes from several venues can track each one separately. "Copy as
list" builds a plain-text version (questions only, never the "why" — that
explanation is for the couple, not the venue) for pasting into an email; on a
venue page the copied text opens with that venue's real name.

One data-correctness note worth knowing if you touch this code: `data/venues.json`
stores venue names pre-escaped for HTML (`"Sherman Library &amp; Gardens"`),
which every Python template relies on by interpolating them unescaped. The
JS-rendered shortlist/compare cards do the same — they must **not** run venue
text through an HTML-escaper, or `&amp;` becomes `&amp;amp;`. The one place that
needs the *opposite* — real plain text for the clipboard — decodes it first via
a detached `<textarea>` (`decodeEntities()` in `shortlist.js`). Both directions
are commented in place; if you add a fourth surface that touches venue names,
match whichever of the two it actually needs.

---

## 6. Structured data

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

## 7. Performance

- One stylesheet, minified, ~65 KB (~10 KB gzipped). No CDN, no FOUC.
- Four deferred JS files (filters, shortlist/compare, checklist, site chrome),
  ~34 KB unminified combined, zero dependencies, no bundler.
- Every `<img>` has explicit `width`/`height` (no CLS), `decoding="async"`, and
  `loading="lazy"` below the fold / `fetchpriority="high"` above it.
- Ad slots reserve their height so late creative cannot shift layout.

Before launch: self-host the fonts, add real photography with `srcset`, and set
`Cache-Control: public, max-age=31536000, immutable` on `/assets/`.

---

## 8. Before you launch

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
