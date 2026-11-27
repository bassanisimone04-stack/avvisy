# Atlas Table Guide (placeholder brand)

Independent global fine-dining guide & marketplace — Next.js 15 · TypeScript · Tailwind v4 · Supabase/PostGIS.
Brand name, domain and tagline are placeholders defined **only** in [`src/config/brand.ts`](src/config/brand.ts) (see [docs/BRAND.md](docs/BRAND.md)).

> This deployment ships with **clearly labelled fictional demo data** (30 restaurants, 10 destinations, 12 hotels, 15 experiences, 6 itineraries, 12 articles, 6 gift cards). No demo venue carries a real award. Set `ALLOW_DEMO_DATA=false` to hide it.

## Quick start (≈5 minutes)

```bash
cd atlas-table-guide
npm install
cp .env.example .env.local      # everything optional — the site runs on demo data without any key
npm run dev                     # http://localhost:3100  → redirects to /en/
```

Optional full local stack (Docker): `npm run dev:setup` starts PostgreSQL 16 + PostGIS (and Typesense), applies migrations and the demo seed.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js (port 3100) |
| `npm run lint` / `typecheck` | ESLint (next/core-web-vitals + TS) / `tsc --noEmit` (strict) |
| `npm test` | Vitest unit tests (filters/sort, prices & FX, slugs, JSON-LD validity, compare URLs, RBAC & admin guard, CSV import + duplicates, facet indexation, contrast, search, demo-data rules, ICS, Price Index) |
| `npm run e2e` | Playwright: smoke, keyboard-only journey, axe (WCAG 2.2 AA, 13 pages × 2 widths), no-horizontal-scroll, visual baselines (390/768/1280) |
| `npm run a11y` | Only the `@a11y`-tagged Playwright tests |
| `npm run seo:check` | Crawls the **built** site: 1 H1 per page, every `<img>` has `alt`, JSON-LD allow-list validation (no flat lat/long), ItemList+BreadcrumbList on hubs, canonical/hreflang/noindex rules, sitemap-only-indexable, unique titles, no dead internal links, real 404 |
| `npm run check:banned` | Fails on third-party guide names/marks anywhere in the repo |
| `npm run check:secrets` | Scans the client bundle for secrets (run after build) |
| `npm run db:test` | Spins up a throwaway Postgres+PostGIS, applies migrations + seed, runs the RLS test-suite |
| `npm run db:seed-sql` | Regenerates `supabase/seed.sql` from the demo dataset |
| `npm run images` | Regenerates the procedural illustrations + blur placeholders |
| `npm run ci` | Everything above in order |

## Structure

```
src/config      brand.ts (single source of truth), site.ts (thresholds/flags), tokens.ts
src/app         [locale]/… public pages · admin/… (own root layout, role-gated) · api/… · go/[id] · robots/sitemaps/llms.txt
src/features    directory (filters, map, toolbar), restaurant (gallery, sparkline, map), forms, admin, concierge, account…
src/lib         filters, price/FX, search, slug, compare-url, csv-import, rbac, geo, ics, price-index…
src/seo         typed JSON-LD builders + validator, metadata/hreflang, facet indexation policy, sitemaps, llms.txt
src/db          domain types, repository (Supabase + demo), queries, writes
supabase        migrations (schema, RLS, views), seed.sql, tests (RLS)
docs            PLAN, REPORT, SEO, DATA, BRAND
```

See [docs/REPORT.md](docs/REPORT.md) for what is done, stubbed, needs credentials, and the launch blockers.
