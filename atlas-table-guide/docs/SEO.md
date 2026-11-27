# SEO / AEO / GEO rules

## Non-negotiables (enforced by `npm run seo:check` and unit tests)
- Exactly **one `<h1>`** per page, from a template — never from counters or pagination (counts go in a `<p>`).
- Every `<img>` has `alt`; content images use `buildAlt()` (`src/lib/alt.ts`) from structured data, decorative images `alt=""`.
- JSON-LD only via typed builders in `src/seo/jsonld.ts`. Each `@type` has an allow-list (`ALLOWED`); `validateJsonLd()` rejects unknown props, empty values, flat `latitude/longitude` outside `GeoCoordinates`, and boilerplate such as `hasDriveThroughService`.
- Every hub/collection has `ItemList` (matching the visible list, 1-based positions) + `BreadcrumbList`. Inner pages have visible breadcrumbs + `BreadcrumbList`.
- `FAQPage` only when the Q&A is visible on the page. `aggregateRating` only from first-party reviews ≥ `MIN_REVIEWS_FOR_RATING`. `award` only for real awards stored with a source.
- Self-referencing canonical; hreflang `en`, `it`, `x-default` on every indexable page; OG/Twitter with a dynamic `next/og` image.

## Indexation policy (`src/seo/indexable-facets.ts`)
| URL | Robots | Canonical | Sitemap |
|---|---|---|---|
| Hub without params, passing the quality gate (≥ `DESTINATION_MIN_VERIFIED` verified + original intro) | index | self | ✓ |
| Hub below the gate | noindex,follow | self | ✗ |
| City hub + exactly one `cuisine` with ≥ `FACET_MIN_RESULTS` verified | index | self (`?cuisine=x`) | ✓ |
| Any other filter / sort / view / page / near / bbox / q | noindex,follow | parent hub | ✗ |
| Compare, account, design-system, admin, `/go/`, APIs | noindex (and robots-disallowed where private) | — | ✗ |

## Crawl policy
`src/app/robots.ts`: all search engines allowed on public content; `/admin`, `/account`, `/api`, `/go/`, compare and parameterised facet URLs disallowed. `AI_CRAWLERS_POLICY` = `allow-all` | `search-only` (default: AI *search/answer* bots allowed; training-only bots blocked except opted-in Google-Extended/ClaudeBot) | `block-all`. `/llms.txt` and `/llms-full.txt` list canonical hubs, collections and (full) every profile with its price status and verification date.

## Adding a page type
1. Create the route under `src/app/[locale]/…` with `generateStaticParams` (+ `dynamicParams = false` for slugs) and `revalidate`.
2. `generateMetadata` → `buildMetadata({ locale, path, title, description, noindex? })` — title must be unique per locale.
3. Render `PageShell` (breadcrumbs + single H1) and an answer-first summary when the page answers a factual question.
4. Add a typed JSON-LD builder (or reuse one), extend `ALLOWED` for any new `@type`, add a unit test.
5. Add the URL family to `src/seo/sitemap-data.ts` if indexable, and to `llms.ts` if it is a hub.
6. Run `npm run build && npm run seo:check`.
