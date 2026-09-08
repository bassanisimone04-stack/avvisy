# FindMobileGrooming.com

A US local service directory for **mobile dog groomers** — van-based, at-home
grooming services. Built as a Next.js 15 App Router project with Tailwind CSS 4,
matching the conventions of the sibling directory projects in this repo.

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm test        # outreach engine unit tests
```

## Design system

| Token | Value | Role |
| --- | --- | --- |
| Navy | `#0F172A` | Primary — trust, authority; headers, footer, dark sections |
| Teal | `#0EA5E9` | Accent — CTAs, active filters, badges |
| Slate off-white | `#F8FAFC` | Page canvas |
| White | `#FFFFFF` | Card and surface backgrounds |

Typography: **Plus Jakarta Sans** (headings, 600–800) + **Inter** (UI and body),
both loaded via `next/font/google`. Tokens and the component layer
(`.btn`, `.card`, `.chip`, `.field`, `.container-page`) live in
`src/app/globals.css`.

## Routes

```
/                              Homepage — hero + zip search, value props, cities, FAQ
/cities                        City hub
/cities/[citySlug]             City listing page
/groomers/[citySlug]/[slug]    Single groomer listing (monetization surface)
/pricing                       Tiered plans for groomers
/for-groomers                  B2B landing page
/claim                         Listing claim / verification funnel
/faq                           FAQ hub
/blog, /blog/[slug]            Editorial hub and guides
/login                         Passwordless sign-in (magic link)
/dashboard                     Groomer portal — zip coverage, leads, upgrade
/unsubscribe                   Outreach opt-out (CAN-SPAM)
/admin/claims                  Claim review (allow-listed admins only)
/about  /privacy  /terms       Company and legal
/sitemap.xml  /robots.txt      Generated from data at build time
```

## Backend

The app degrades gracefully: with no environment variables it runs in **demo
mode** (listings from JSON, no accounts, no billing) and every public page
still works. Adding keys turns features on progressively — see
[`docs/SETUP.md`](docs/SETUP.md).

| Area | Files |
| --- | --- |
| Schema + RLS | `supabase/schema.sql`, `supabase/seed.sql` |
| Clients | `src/lib/supabase/{config,client,server,public,admin}.ts` |
| Data access | `src/lib/groomers.ts`, `src/lib/leads.ts` |
| Auth | `src/lib/supabase/auth-actions.ts`, `src/app/login`, `src/app/auth/callback`, `src/middleware.ts` |
| Lead capture + forwarding | `src/app/api/leads/route.ts`, `src/lib/lead-rules.ts`, `src/lib/email.ts` |
| Share cards | `src/lib/og.tsx` + `opengraph-image.tsx` per route |
| Billing | `src/lib/stripe.ts`, `src/app/api/stripe/{checkout,webhook}/route.ts` |
| Dashboard | `src/app/dashboard`, `src/components/{ZipCodeEditor,UpgradeButton}.tsx` |
| Outreach generator | `scripts/outreach.mjs`, `scripts/outreach/` |
| Admin | `src/lib/admin.ts`, `src/lib/admin-rules.ts`, `src/lib/actions/claims.ts`, `src/app/admin` |
| Tests | `tests/` (node:test, no dependencies) |

Public directory reads go through a **session-less** Supabase client
(`supabase/public.ts`) rather than the cookie-backed one. Calling `cookies()`
opts a route out of static rendering, and directory pages are identical for
every visitor — so this keeps city and listing pages statically generated.

## Monetization

Three tiers defined in `src/lib/site-config.ts` (`PRICING_TIERS`) and rendered by
`src/components/PricingTable.tsx`:

- **Free ($0)** — name, city, one phone line
- **Pro Van ($39/mo)** — priority city ranking, website links, verified badge,
  custom zip coverage, lead forwarding
- **Multi-Fleet ($99/mo)** — multi-van management, lead distribution, homepage
  featured placement

Each listing page carries a claim banner and a lead sidebar (call, text, and a
free-quote form). The quote form posts to `/api/leads`, which validates the
input, applies a per-IP rate limit (hashed, never the raw address), screens a
honeypot field, stores the lead for the owning groomer only, and emails it to
them with reply-to set to the customer. The row is committed before any mail
is attempted, so a mail outage can never cost the business the lead.

Column privileges do the work RLS cannot: RLS scopes an owner to their own
**row**, not to particular **columns**. Groomer emails and Stripe identifiers
are revoked from `anon` for reads, and `tier`, `verified`, `rating`,
`review_count`, `owner` and the slugs are revoked from `authenticated` for
writes — otherwise a business that claimed its listing could grant itself paid
placement and the verified badge straight through the anon key. See
`docs/SETUP.md`; `tests/schema-privileges.test.mjs` guards the grant set.

Upgrades run through Stripe Checkout. The client names a *tier*; the server
resolves it to a price ID and verifies listing ownership before charging. The
signed webhook applies the tier, and a lapsed subscription drops the listing
back to free rather than deleting it — the business keeps its page and reviews.

## Data

Listings live in Supabase when configured, falling back to
`src/data/groomers.json`; both are read through `src/lib/groomers.ts`. The
seed file holds 9 **real** unclaimed businesses (name, city, phone, website —
compiled from public web search results, unverified), one each in Los
Angeles, Houston, Miami, Phoenix, Chicago, Denver, Seattle, Dallas and Austin.
No fabricated rating, review count, zip coverage, pricing or service tags are
included, because none of that was independently confirmed — see "Honesty by
construction" below. Paid tiers rank above free ones within a market, then by
rating — the ordering the Pro Van plan actually sells, kept in one place. FAQs
live in `src/data/faqs.ts` and feed both the rendered accordion and the
`FAQPage` JSON-LD, so visible text and markup cannot drift apart. Featured
metros are in `src/lib/site-config.ts`; 3 of the 12 (Atlanta, San Diego,
Charlotte) have no listing yet and show the existing empty state rather than
a fabricated one.

## Honesty by construction

Every field on `Groomer` beyond name, city, state and slug is optional, and
every component that renders one checks for its presence rather than
defaulting to a placeholder:

- No rating shown → "Not yet reviewed", not "★ 0.0 (0)"
- No zip coverage → "hasn't confirmed its exact coverage area yet", not an
  empty grid
- No tags, price range, response time, or about text → the section doesn't
  render, rather than rendering empty
- `verified` is only ever set by an admin approving a claim or a Stripe
  payment succeeding — never by seed data or by the listing's own edits (see
  the column-privilege revokes in `supabase/schema.sql`)

The same discipline applies to marketing copy: the homepage's groomer count
is computed from `getAllGroomers()` at request time, not a fixed number —
see `src/app/page.tsx`.

See `docs/SEO.md` for the plan on scaling past the current 12 featured metros.

## Structured data

`src/lib/schema.tsx` generates `Organization`, `FAQPage`, `BreadcrumbList`, and
a dual-typed `LocalBusiness` + `HomeAndConstructionBusiness` block for listing
pages, with `areaServed` carrying the van's zip code coverage.

## Documentation

- [`docs/SEO.md`](docs/SEO.md) — metadata, URL architecture, authority copy,
  schema map, featured-snippet FAQ strategy, scaling plan
- [`docs/OUTREACH.md`](docs/OUTREACH.md) — the outreach campaign: templates,
  cadence, prospect CSV format, and CAN-SPAM/TCPA compliance. The generator
  in `scripts/outreach.mjs` renders these against a prospect list and enforces
  the rules; it never sends, so a bad merge surfaces in a diff.
- [`docs/SETUP.md`](docs/SETUP.md) — Supabase and Stripe setup, the RLS
  security model, and what works at each configuration stage
