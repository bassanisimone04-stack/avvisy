# Implementation report

_Last updated: 2026-11-27. Status of every requirement of the master prompt, with honest notes on what is stubbed, what needs credentials, and known limitations._

## 1. Verification results (this commit)

| Check | Result |
|---|---|
| `npm run build` | ✅ passes (Next.js 15.5, 0 type errors) |
| `npm run lint` / `typecheck` | ✅ 0 errors, 0 warnings |
| `npm test` (Vitest) | ✅ 154 tests, 12 files |
| `npm run e2e` (Playwright) | ✅ 53 tests: smoke, keyboard-only journey (search → filter → profile → compare → save), 27 axe scans (13 pages × 390/1280 + img-alt), no horizontal scroll at 390 px, 9 visual baselines |
| `npm run seo:check` | ✅ 294 pages + 229 internal links crawled, 286 sitemap URLs; 0 violations |
| `npm run check:banned` / `check:secrets` | ✅ |
| `npm run db:test` (PostgreSQL 16 + PostGIS 3) | ✅ all migrations + seed apply; 22 RLS assertions pass (users can't read/write others' data, can't escalate role; partners edit only approved+verified claims, never editorial fields, can't self-verify prices; price_history append-only; demo rows can't carry real awards; anon newsletter insert-only; RLS on every table) |
| JSON-LD validity | ✅ every page's JSON-LD validated against per-type allow-lists in unit tests and in `seo:check` (home, hubs, profiles, hotel, article, experience, itinerary, chef). ⚠️ Google Rich Results Test / validator.schema.org **not run** — the sandbox has no access to those services. Run them on the first preview URL (see §7). |

### Lighthouse (mobile, simulated slow 4G, Lighthouse 12, local production build)

| Page | Perf | A11y | Best Pr. | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/en/` | 93 | 100 | 100 | 100 | 3.2 s | 0 | 52 ms |
| `/en/restaurants/` (hub) | 92 | 100 | 100 | 100 | 3.3 s | 0 | 70 ms |
| `/en/restaurant/maison-lune-paris/` (profile) | 97 | 100 | 100 | 100 | 2.6 s | 0 | 73 ms |
| `/en/restaurants/france/paris/` | 94 | 100 | 100 | 66* | 3.1 s | 0 | 64 ms |

\* Deliberate: the Paris hub is `noindex` because only 4 of its 5 demo venues are currently "verified" (one is stale), below the quality gate of 5. Lighthouse scores any noindex page down.
**Gap vs. target:** Perf ≥ 95 and LCP < 2.5 s are **not yet met** on home and hubs under Lighthouse's simulated throttling (real-network numbers on a CDN will differ). Next steps: serve images from a CDN with long-lived caching, inline critical CSS, reduce client JS on hubs (the filter panel hydrates the whole sidebar).

## 2. Done

- **Brand & guardrails**: single `brand.ts`; original compass-rose-with-fork mark (`Logo`, `SelectionMark`, `favicon.svg`, `apple-touch-icon.png`, `og-default.png`); independence disclaimer in every footer; recognitions are text-only and attributed; demo venues show "Demo distinction · Level N" (never a real award — enforced in data tests **and** a DB check constraint); banned-terms CI script.
- **Design system**: tokens as CSS variables + Tailwind theme, mirrored in `tokens.ts`; contrast unit test on 27 pairs + CSS-sync test; self-hosted Inter + Playfair Display; focus ring, reduced-motion, 44 px targets; `/design-system` (noindex).
- **Layout per §3B**: Carmine sticky header (single row desktop / second scrollable row mobile, collapses on scroll), mega-menus, `/` command-palette search, prefs popover (language/currency/units), favourites badge, Join the Club, focus-trapped drawer; inset rounded hero inside a Carmine frame with H1 *below* the image, white search bar with Garnet *Explore* button expanding into the advanced panel, outline chips; destination cards 3:4 with text below; 2×2 experience cards; "Travel for taste" banner + 3 itinerary cards.
- **Homepage**: all 11 content sections in the §7 order (+ footer).
- **Directory hubs** (global/country/region/city): 23 operational, URL-synced filters, 7 sorts (distance is permission-gated geolocation), active chips, clear all, numbered pagination, Grid ↔ Map (MapLibre, clusters, hover sync, popups, "Search this area"), mobile bottom sheet with live count, skeletons on navigation, empty & error states; template H1; answer-first summary; intro + data-driven FAQ; `ItemList` + `BreadcrumbList` (+ `FAQPage`, `Place`).
- **Restaurant profile**: gallery (mosaic / mobile carousel / keyboard lightbox), 4-card price dashboard with status pills, source, collection date and sparkline from price history, at-a-glance table (15 facts), menus, chef, map + directions, hours & closures, nearby hotels/experiences, itineraries, similar, FAQ, report form, sticky booking card / mobile bottom bar; honest reservation state ("not yet available — request concierge"); valid `Restaurant` JSON-LD (nested geo, `openingHoursSpecification`, `hasMenu` with offers, amenity features, no rating without first-party reviews).
- **Comparison** (≤4, tray in localStorage, shareable `?r=` URL, best-value highlight, sticky first column, mobile swipe cards, noindex).
- **Destinations, collections (12), chefs, hotels (+ affiliate `/go/{id}` with click logging, `rel="sponsored nofollow noopener"`), experiences, travel itineraries (day-by-day, map, budget estimate, save/share, PDF via print stylesheet, ICS export), Price Index (n + date on every figure, suppression below threshold), magazine (categories, TOC, sponsored disclosure, `Article` JSON-LD), gifts, club, concierge, account, business portal pages, about/editorial/methodology/contact, 6 legal templates, custom 404/500/maintenance.**
- **SEO/AEO/GEO**: per-page titles/descriptions, self-canonicals, reciprocal hreflang + x-default, OG/Twitter with dynamic `next/og` images, sitemap index + 9 segmented sitemaps (only indexable URLs, `lastmod` from verification dates, locale alternates, image sitemap for licensed photos), `robots.txt` with AI-crawler policy switch, `llms.txt` + `llms-full.txt`, facet whitelist (`src/seo/indexable-facets.ts`), WebSite SearchAction, answer-first blocks.
- **Database**: 45 tables incl. all requested ones, RLS on every table, PostGIS geography + GIST, FTS + trigram indexes, append-only `price_history` via trigger, materialised `price_index_city` with `sample_size` + `collected_at`, radius & fuzzy search functions, generated seed (`is_demo=true`).
- **Security & privacy**: CSP, HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy; zod validation on every input; rate limiting (forms, search, count API, `/go/`, concierge, admin login); same-origin check on server actions (plus Next's built-in Origin check); honeypots; secrets server-only (scan in CI); GDPR consent banner with categories — Plausible loads only after consent; GDPR export & deletion.
- **Admin** (`/admin`, noindex, role-gated, audit-logged): KPI dashboard, restaurants table with verification/staleness/content-completeness score, outdated-prices queue, CSV import with dry-run, validation report and fuzzy name + geo-distance duplicate detection, "Replace demo data" tool, audit log viewer.

## 3. Stubbed / partial (honest states shown in the UI)

Implemented since the first report — **code complete and unit-tested where possible, but not exercised against live services** (Supabase, Stripe, Resend and Typesense are not reachable from this sandbox):

| Area | State |
|---|---|
| Admin auth | Supabase email+password sign-in; role read server-side from `profiles` (service role), cookie httpOnly. Dev-token login remains for development only. |
| Partner dashboard | `/business/dashboard`: magic-link sign-in, create partner profile, request claims, edit details and submit prices (saved as *estimated*) — all through the partner's own session, so RLS/triggers decide what is allowed. |
| Stripe | `/api/checkout` (gift cards, **test keys only**, live keys refused) + `/api/stripe/webhook` (signature verification, unit-tested) + `orders` table. Club and partner-plan checkout not built. |
| Price alerts | "Alert me" button (needs account), `alerts` table, daily cron `/api/cron/price-alerts` (+ Resend email), logic unit-tested. |
| Typesense | Adapter with automatic fallback to the built-in search; `npm run search:sync`. Not tested against a server. |

Still partial / not done:

| Area | State |
|---|---|
| Accounts | Supabase magic-link sign-in, favourites merge, GDPR export/delete implemented; untested against a live project. |
| Admin editing modules | Restaurants/prices are read-only views; editing chefs, awards, hotels, articles, media, translations, SEO overrides, redirects still uses Supabase Studio. |
| Supabase loader | Loads countries/regions/cities/chefs/cuisines/restaurants only; hotels, experiences, itineraries, articles, gift cards come from the bundled dataset. |
| Reservations | No provider integration; profiles never show availability (by design). |
| Languages | EN + IT only. FR, ES, DE, JA, PT, AR, ZH are **not** started (architecture allows it). |
| Photos | All images are generated illustrations until real photos are imported (`npm run photos`). |
| Performance | Lighthouse mobile 90–96, LCP ≈ 3 s under simulated 4G in this sandbox; must be re-measured on a CDN (see docs/LAUNCH.md). |
| Phase 4 | Reservation providers, B2B marketplace, licensed data API are not started. |

## 4. Images — REPLACE BEFORE LAUNCH

No image-generation tool or licensed photography was available. All 46 images in `public/images/generated/` are **procedurally generated, art-directed illustrations** (`scripts/generate-images.mjs`) in the brand palette, recorded in the manifest with licence `generated-illustrative (REPLACE BEFORE LAUNCH)` and shown with an "Illustrative image" label: `hero-mediterranean`, `destination-{paris,tokyo,milan,london,new-york,dubai,rome,barcelona,copenhagen,singapore}`, `tasting-menu`, `restaurant-interior`, `dine-and-stay`, `romantic-dining`, `wine-experience`, `chefs-table`, `gift-card`, `tuscany-travel`, `luxury-hotel`, `chef-editorial`, `terrace-1`, `dish-1…16`, `interior-1…8`. Real venue profiles must use restaurant-supplied photos with the licence recorded in `media`.

## 5. Decisions made (defaults)

- Separate app folder `atlas-table-guide/` because the repository already hosts other projects.
- Pagination/sort/filter URLs: `noindex,follow` + canonical to the parent hub (acceptance checklist wins over the "self-canonical pagination" line); whitelisted `city + single cuisine` is indexable and self-canonical when ≥ `FACET_MIN_RESULTS` verified results.
- `--warning` token darkened from `#B26A00` to `#8A5200`: the original fails WCAG AA on white (4.24:1); caught by the contrast test.
- Hero chips keep the "1/2/3 Stars" wording from the brief as plain text; their tooltip explains attribution, and demo venues are explicitly "Demo distinction". Consider neutral wording ("Level 1–3") before launch.
- FX: Frankfurter (ECB) daily rates; when unreachable and demo data is on, clearly labelled *illustrative demo rates* are used to rank fictional prices; otherwise original currency only.
- Unknown slugs return a real HTTP 404 (`dynamicParams = false` + `global-not-found`); new DB records therefore appear after revalidation/redeploy.
- CSP keeps `'unsafe-inline'` for scripts: nonce-based CSP would force every page to render dynamically (no SSG/ISR). Revisit with Next's nonce + PPR when stable.
- Rate limiter is in-memory per instance; use Upstash/Redis for multi-region.

## 6. Credentials & external integrations

| Integration | Env vars | Enables | Without it |
|---|---|---|---|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Real data, form storage, accounts, admin writes, click logs, GDPR deletion | Demo dataset; forms say "not stored — database not configured"; local favourites |
| Map tiles | `NEXT_PUBLIC_MAP_STYLE_URL` | Map view & mini-maps | Default OpenFreeMap (no key); list alternative always shown |
| Typesense | `TYPESENSE_HOST`, `TYPESENSE_API_KEY` | Hosted search (`npm run search:sync`) | Built-in search |
| Stripe (test) | `STRIPE_SECRET_KEY` (sk_test_), `STRIPE_WEBHOOK_SECRET` | Gift-card test checkout + orders | "Not available yet" + interest form |
| Resend | `RESEND_API_KEY`, `EMAIL_FROM` | Double opt-in emails | Subscription stored as pending; UI says emails aren't configured |
| LLM | `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` | AI concierge annotations (DB-restricted) | Rule-based planner, labelled |
| FX rates | `FX_PROVIDER` | Live ECB conversions | Original currency only (or labelled demo rates) |
| Affiliate networks | rows in `affiliate_links` | Hotel/experience booking links | Demo `example.com` links |
| Analytics | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Consent-gated Plausible | No analytics |
| Admin (dev) | `ADMIN_DEV_TOKEN` | `/admin` without Supabase (dev only) | Admin login disabled |
| Cron | `CRON_SECRET` | Daily price-alert emails | Job returns 501 |

## 7. Launch blockers for the owner (full checklist: docs/LAUNCH.md)

1. Final brand name, **trademark clearance**, domain → edit `src/config/brand.ts`, run `npm run images` (OG image text) and redeploy.
2. **Legal review** of all templates in `src/data/pages.ts` (privacy, cookies, terms, affiliate, sponsored, data-correction) and the legal entity name.
3. **Licensed photography & data**: replace every generated illustration; load real, sourced restaurant data (CSV importer), then archive demo rows and set `ALLOW_DEMO_DATA=false`.
4. Supabase project + switch the admin guard to Supabase sessions; Resend domain verification; merchant agreements (Stripe) and affiliate contracts.
5. Run Google Rich Results Test / Schema validator on the preview deployment (home, hub, profile, hotel, article) and record the results here; re-run Lighthouse on the CDN.
6. Supply the reference screenshots and review the visual baselines against them.
