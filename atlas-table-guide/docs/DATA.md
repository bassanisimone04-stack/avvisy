# Data sourcing & verification policy

## Allowed sources only
Restaurant submissions (claimed profiles), licensed datasets/APIs, restaurant-supplied photos with a recorded licence, official websites where their terms permit, confirmed bookings, original editorial research, manual verification. **No scraping** of third-party guides or sites whose robots.txt/terms forbid it; no hotlinked images.

## Every record carries
`source_url`, `verification_status` (`unverified | pending | verified | stale | rejected`), `last_verified_at`, `publication_status` (`draft | in_review | published | archived`), `is_demo`. Verified records become **stale** after `STALE_AFTER_DAYS` (default 180) and show "Needs re-verification".

## Prices
- Stored in the **original currency** (ISO 4217) with status `verified | estimated | missing`, source and collection date. A `verified` or `estimated` price requires amount + source + date (DB check constraint).
- Every insert/change appends to `price_history` (trigger); updates/deletes of history are rejected.
- Partners may submit prices but cannot mark them verified (RLS).
- Conversions use ECB reference rates (Frankfurter) and are labelled; Price Index figures require n ≥ `PRICE_INDEX_MIN_SAMPLE`.

## Awards & recognitions
Third-party recognitions live in `restaurant_awards` (body, title, year, level, mandatory `source_url`) and are displayed as plain attributed text. Demo rows cannot carry real awards (check constraint). The editorial selection is ours and cannot be bought.

## CSV import (admin)
Columns: `name, city, country, lat, lng, cuisine, website, lunch_price, dinner_price, wine_price, currency, source_url` (`source_url` mandatory). Dry-run validates every row (zod), normalises prices (`€ 1.250,00` → 1250), and detects duplicates against the database and within the file:
- **duplicate (skipped):** same website domain; or name similarity ≥ 0.6 within 150 m; or ≥ 0.9 within 2 km
- **possible duplicate (review):** similarity ≥ 0.75 within 1 km, or within 25 m regardless of name
Committed rows are created as **draft / unverified**; an editor verifies and publishes.

## Corrections
"Report incorrect information" on every profile and in the footer → `form_submissions` (`kind = correction`). Acknowledge within 5 working days, verify against a primary source, update, log in `audit_logs`.

## Demo data
`scripts/generate-seed-sql.ts` writes `supabase/seed.sql` (all `is_demo = true`). Remove with Admin → Demo data (archives demo rows) and `ALLOW_DEMO_DATA=false`.
