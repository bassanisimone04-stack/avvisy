# Glasshouse Weddings

A production-ready front end for a niche directory + editorial site covering
**greenhouse, glasshouse and conservatory wedding venues** in the United States,
with a destination section for Italy.

Static HTML + one compiled Tailwind CSS v4 file + ~7 KB of vanilla JS. No
framework, no CDN, no runtime dependencies.

```bash
npm install
npm run build       # placeholder images + minified CSS + FAQ parity check
npm run dev         # watch mode while editing markup
npm run serve       # http://localhost:4321
npm run check:faq   # FAQ schema/visible parity + keyword coverage
```

---

## 1. Design system

### 1.1 Colour

Tokens live in `src/styles/tailwind.css` under `@theme`, which is what makes them
available as Tailwind utilities (`bg-botanical-800`, `text-champagne-500`, …).

| Role | Token | Hex | Where it is used |
|---|---|---|---|
| **Primary** — Deep Botanical Emerald | `--color-botanical-800` | `#1B4332` | Primary buttons, headings, footer, hero ground |
| Primary, deepest | `--color-botanical-950` | `#081C15` | Footer, CTA bands, image ground |
| Primary, mid | `--color-botanical-600` | `#2D6A4F` | Eyebrows, icons, focus ring |
| Primary, tint | `--color-botanical-50` | `#EDF8F1` | Icon chips, table headers, hover states |
| **Accent** — Warm Soft Champagne Gold | `--color-champagne-500` | `#D4AF37` | The single highest-intent CTA per view, rules, active states |
| Accent, deep (text-safe) | `--color-champagne-700` | `#8A6D1F` | Gold text on light grounds — passes AA, `#D4AF37` does not |
| **Background** — warm cream | `--color-cream` | `#F8F9FA` | Page ground |
| Surface | `--color-shell` | `#FFFFFF` | Cards, alternating sections |
| Ink | `--color-ink-900 / 700 / 500 / 300` | `#14201B` → `#8C9A93` | Body copy, secondary copy, labels |
| Hairlines | `--color-line` / `--color-line-strong` | `#E4E9E6` / `#CFD8D3` | Borders, dividers, field outlines |

**Rules that keep it looking expensive**

- Gold is punctuation, not paint. One gold element per viewport, on the action you
  most want taken. Everything else is emerald or ink.
- Never put `#D4AF37` as text on cream — it fails contrast. Use `champagne-700`.
- Shadows are emerald-tinted (`--shadow-soft`, `--shadow-lift`), never neutral grey.
  Grey shadows on a warm ground read as cheap.

### 1.2 Typography

- **Playfair Display** (500/600/700 + 500 italic) — all headings, pull quotes,
  stat figures. Applied automatically to `h1–h4` in the base layer.
- **Plus Jakarta Sans** (400–800) — body, UI, labels, navigation.

Loaded from Google Fonts with `preconnect` and `display=swap`, two families only.
Headings use `letter-spacing: -0.02em` and `text-wrap: balance`; body copy uses
`text-wrap: pretty`.

> **Ship-it upgrade:** self-host both families as `woff2` in `assets/fonts/` and
> `<link rel="preload">` the two weights above the fold. That removes two DNS
> lookups and roughly 300 ms from LCP on a cold 4G connection.

### 1.3 Component primitives

Defined once in `src/styles/tailwind.css` so page markup stays readable:

| Class | What it is |
|---|---|
| `.shell` / `.shell-narrow` | Page gutters + max width |
| `.btn` + `.btn-primary` / `.btn-gold` / `.btn-outline` / `.btn-ghost-light` / `.btn-sm` | Button set |
| `.card` / `.card-interactive` | Surfaces; the second adds hover lift |
| `.eyebrow` / `.eyebrow-gold` / `.rule-gold` | Section kickers |
| `.badge` + `.badge-emerald` / `.badge-gold` / `.badge-glass` | Status pills |
| `.chip` | Filter toggle; styled from `aria-pressed`, not a class |
| `.label` / `.field` / `.field-select` | Form controls |
| `.nav-link` | Nav item with the gold underline animation |
| `.prose-editorial` | Long-form article body |
| `.ad-slot` / `.ad-label` | Ad + affiliate containers |
| `.glass-panel` / `.hairline-grid` | Hero glass and grid textures |
| `.skip-link` | Keyboard skip-to-content |

### 1.4 Accessibility

- Visible focus ring on every interactive element (`:focus-visible`, 2px emerald).
- Skip link on every page.
- Filter chips use `aria-pressed`; the drawer is a real `role="dialog"` with
  Escape-to-close; the mobile nav toggles `aria-expanded`.
- All decorative SVGs are `aria-hidden`; all meaningful images carry descriptive alt text.
- `prefers-reduced-motion` disables every transition and the scroll-reveal.
- Body copy is `#2F3D36` on `#F8F9FA` (12.4:1); secondary copy `#5A6B63` (6.3:1).

---

## 2. Site architecture

```
/                                             Home — "greenhouse wedding venues"
├── /venues/                                  All venues, filterable
│   ├── /venues/california/                   State category (money page)
│   ├── /venues/texas/
│   ├── /venues/florida/
│   ├── /venues/new-york/
│   ├── /venues/north-carolina/
│   └── /venues/{state}/{venue-slug}/         Venue detail
├── /italy-destination-weddings/              Destination category
└── /blog/                                    Guides hub
    └── /blog/{post-slug}/                    Long-form guide
```

Three clicks from home to any venue. Every venue page links up to its state page
and sideways to three similar venues in the same state; every state page links to
the cost guide; the cost guide links back into five state pages and two filtered
views. That loop is the internal-linking engine — keep it intact when you add pages.

### Keyword → URL map

| Keyword (US monthly volume) | Intent | Where it lives |
|---|---|---|
| greenhouse wedding venues (22–33k) | Commercial | Homepage `<h1>` + title |
| botanical garden wedding venues (14–22k) | Commercial | `/venues/?type=botanical-garden`, homepage H2 copy |
| glasshouse wedding venue near me (12–18k) | Transactional / local | Nav + footer anchor text, hero "popular" links |
| greenhouse wedding venue **[State]** (1–4.5k each) | Transactional | `/venues/{state}/` `<h1>` + title |
| small greenhouse wedding venues (3.5–5.4k) | Transactional | `?capacity=micro` filter, footer link, guide |
| greenhouse wedding cost (2.4–4.1k) | Informational | `/blog/greenhouse-wedding-cost/` `<h1>` |
| conservatory wedding venues (2.9–4.8k) | Commercial | Meta descriptions + on-page synonym throughout |
| greenhouse wedding venue Italy (1.6–2.9k) | Transactional | `/italy-destination-weddings/` `<h1>` |
| rain-proof outdoor wedding venues (0.8–1.5k) | Problem-solving | `/blog/rain-proof-outdoor-wedding-venues/` |

Titles follow `Primary keyword | Qualifier` and stay under ~62 characters. The
brand name appears once per title at most — never twice, and never before the keyword.

---

## 3. Templates delivered

| File | What it demonstrates |
|---|---|
| `index.html` | Full responsive homepage: hero + quick-search, trust strip, state grid, featured venues, type shortcuts, cost band, Italy band, guides, FAQ, owner CTA |
| `venues/index.html` | Directory hub with the complete filter component over 21 venues |
| `venues/california/index.html` | State category page (+ four more states, same template) |
| `venues/california/crystal-conservatory-napa/index.html` | Venue detail: gallery, quick facts, spec table, climate notes, affiliate block, map placeholder, enquiry form, owner-claim form, FAQ, similar venues |
| `blog/greenhouse-wedding-cost/index.html` | Long-form article: reading progress, sticky TOC with scrollspy, key-takeaways box, data table, three ad/affiliate placements, author box, related posts |
| `blog/index.html` | Guides hub with lead article + archive grid |
| `italy-destination-weddings/index.html` | Destination category page |

### The filter component

`assets/js/venue-filters.js` (5 KB, no dependencies) filters **State**,
**Capacity**, **Indoor/Outdoor blend** and **Price range**, plus free-text search
and sort. Design notes:

- Cards are server-rendered HTML and stay in the DOM — the filter only toggles
  `hidden`. Everything remains crawlable and the page works with JS disabled.
- State lives in the URL (`?state=california&price=4`), so filtered views are
  shareable and the back button behaves.
- Active filters render as removable pills; an empty state offers a reset.
- Desktop gets a sticky rail, mobile a bottom-sheet drawer, driven by the same markup.

To wire it to real data, keep the `data-*` contract documented at the top of the file:

```html
<article data-venue data-name data-city data-state data-capacity
         data-blend="enclosed|hybrid|openair" data-price="1|2|3|4" data-featured>
```

Above a few hundred venues, move filtering server-side and render real paginated
URLs (`/venues/california/under-50-guests/`) — those rank, query strings do not.

---

## 4. Structured data

Every page ships JSON-LD in `<head>`, and `/schema/` holds standalone,
commented templates to copy for new pages:

| File | Use on |
|---|---|
| `schema/website-organization.jsonld` | Homepage only (everything else references it by `@id`) |
| `schema/event-venue.jsonld` | Venue detail pages — `EventVenue` + `LocalBusiness` |
| `schema/collection-page.jsonld` | State + filtered category pages |
| `schema/blog-posting.jsonld` | Guides |
| `schema/breadcrumb-list.jsonld` | Every page except the homepage |
| `schema/faq-page.jsonld` | Any page with a visible FAQ |

Two rules the templates enforce:

1. **Never mark up an FAQ the user cannot see.** Every `Question`/`Answer` pair in
   the JSON-LD appears verbatim in the visible HTML on the same page.
2. **No `aggregateRating` without genuine first-party reviews.** The venue template
   deliberately omits it and says why. Invented ratings are a spam-policy violation
   that costs rich results across the whole domain.

Validate with [validator.schema.org](https://validator.schema.org) and the
[Rich Results Test](https://search.google.com/test/rich-results).

---

## 5. FAQs and keyword coverage

Every page carries a visible FAQ accordion **and** matching `FAQPage` JSON-LD —
75 questions in total. Each question is written around a keyword from the map in
§2 rather than invented, so the FAQ block does double duty: it answers the
objection that stops a booking, and it targets the long-tail phrasing people
actually type.

| Page | FAQs | Keywords carried by the questions |
|---|---|---|
| `/` | 9 | greenhouse wedding venues · greenhouse wedding cost · glasshouse wedding venue near me · conservatory wedding venues · botanical garden wedding venues · rain-proof · small greenhouse wedding venues · greenhouse wedding venue Italy |
| `/venues/` | 8 | glasshouse wedding venues near me · conservatory wedding venues · botanical garden wedding venues · small greenhouse wedding venues · cost · rain-proof · Italy |
| `/venues/{state}/` | 6 each | greenhouse wedding venue **in [State]** · small greenhouse wedding venues in [State] · botanical garden wedding venues in [State] · glasshouse wedding venues near me in [State] |
| `/italy-destination-weddings/` | 8 | greenhouse wedding venue in Italy · conservatory wedding venues in Italy · small greenhouse wedding venues in Italy |
| Venue detail | 7 | this venue's cost · conservatory wedding venues nearby · small greenhouse wedding venues in California · rain-proof |
| `/blog/greenhouse-wedding-cost/` | 8 | greenhouse wedding cost · conservatory vs greenhouse cost · botanical garden wedding venues · cost in Italy · rain-proof |
| `/blog/` | 5 | greenhouse wedding cost · rain-proof outdoor wedding venues · small greenhouse wedding venues · conservatory wedding venues · botanical garden wedding venues |

**The rule that must not break:** every marked-up question appears verbatim in a
visible `<summary>` on the same page. Marking up an FAQ the user cannot see is a
structured-data violation. `npm run check:faq` enforces it — it parses the built
HTML, compares each JSON-LD question against the visible accordion, reports
keyword coverage, and exits non-zero on a mismatch. It runs as part of `npm run
build`, so a hand-edit to one half of the pair cannot ship on its own.

Answers are written to be quotable on their own: a direct answer in the first
sentence, then the qualifier, then a link into the page that covers it properly.
That is what an answer-engine extracts, and it is also what a couple skim-reading
on a phone needs.

---

## 6. Performance

- One stylesheet, minified, ~69 KB uncompressed (~10 KB gzipped), no CDN, no FOUC.
- Two JS files, both `defer`, ~7 KB total, zero dependencies.
- Every `<img>` has explicit `width`/`height` (no CLS), `decoding="async"`, and
  `loading="lazy"` below the fold / `fetchpriority="high"` above it.
- The Google Map is click-to-load: the production `<iframe>` sits commented in the
  venue template so ~900 KB never touches first paint or the consent path.
- Ad slots have reserved minimum heights so late-loading creative cannot shift layout.

Before launch: self-host fonts, convert the placeholder SVGs to real AVIF/WebP with
`srcset`, and add `Cache-Control: public, max-age=31536000, immutable` on `/assets/`.

---

## 7. What is placeholder, and what to replace

This is a design-and-architecture deliverable, so the content is realistic sample
data rather than researched fact. Before publishing anything, replace:

- **All venue records, prices, statistics and editorial claims.** Venue names,
  addresses, phone numbers, capacities, the "241 venues / 38 states" counters, the
  cost tables and the author are invented for demonstration. Nothing here is a
  verified fact about a real business.
- **`https://www.glasshouseweddings.com`** — the canonical base URL, hard-coded in
  every `<link rel="canonical">`, Open Graph tag and JSON-LD `@id`. One find and
  replace across `*.html`, `sitemap.xml` and `robots.txt`.
- **`/assets/img/**.svg`** — generated placeholders (`scripts/generate-placeholders.mjs`).
  Keep the same paths and `width`/`height` attributes and the markup needs no changes.
- **Form actions** (`/api/enquiry`, `/api/claim`, `/newsletter/`) — no backend here.

Routes referenced in the markup but not built here, in rough priority order: the
20 remaining venue detail pages (one full example is built — the other 20 venue
cards link to their intended URLs), the five remaining blog posts,
`/list-your-venue/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`,
`/affiliate-disclosure/`, `/authors/*`, blog category pages, and the 45 remaining
state pages. Every one of them is a copy of a template in this repo with different
data — the URL structure is already correct, so nothing has to be re-planned.

Run this to see exactly which internal links do not yet resolve:

```bash
grep -rho 'href="/[^"#?]*' --include='*.html' . | sed 's/href="//' | sort -u
```

Header and footer markup is duplicated per page, which is the honest shape for a
static template set. If the site grows past a dozen pages, move them into partials
(Eleventy, Astro or plain includes) before adding more.
