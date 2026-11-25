# Strategia database (Fase 2+, non ancora implementata)

Supabase PostgreSQL + PostGIS, migrazioni SQL versionate in `supabase/migrations/`. Le tabelle si introducono **solo quando la funzionalità che le usa viene sviluppata**.

| Fase | Tabelle |
|---|---|
| 2 | `profiles` (ruolo), `verticals`, `categories`, `category_attributes`, `countries`, `regions`, `cities`, `businesses`, `business_categories`, `data_sources`, `favorites`, `audit_logs` |
| 3 | `business_media`, `business_claims`, `business_reports`, tabelle di staging per l'import |
| 4 | `products`, `product_files`, `product_licenses`, `orders`, `order_items`, `download_entitlements`, `download_logs`, `webhook_events` |
| 5+ | `articles`, `newsletter_subscribers`, `business_subscriptions` |

## Regole
- `businesses.location geography(Point, 4326)` con indice GiST; ricerca con `ST_DWithin` e bounding box.
- Attributi specifici dei verticali in `jsonb`, validati con Zod (applicazione) e `CHECK` / JSON schema (database).
- Provenienza dei dati su ogni attività: `source_id`, `source_record_id`, `license`, `attribution`, `last_verified_at`, `publication_status`, `ownership_status`.
- Deduplicazione: nome normalizzato (`pg_trgm`) unito alla prossimità (`ST_DWithin` ≤ 50 m).
- RLS attiva su **tutte** le tabelle. `service_role` solo lato server.
- `webhook_events.event_id` univoco, per garantire l'idempotenza dei webhook Stripe.
- Prezzi in centesimi interi (già così nei tipi TypeScript).

I tipi attuali (`features/directory/types.ts`, `features/catalog/types.ts`) anticipano già questi campi.
