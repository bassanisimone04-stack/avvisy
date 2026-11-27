#!/usr/bin/env bash
# One-shot local setup: deps, env file, generated images, seed SQL, and (if Docker is available) a local database.
set -euo pipefail
cd "$(dirname "$0")/.."
npm install
[ -f .env.local ] || { cp .env.example .env.local; echo "→ created .env.local (edit as needed)"; }
[ -f src/data/generated/image-manifest.json ] || npm run images
npm run db:seed-sql
if command -v docker >/dev/null && docker info >/dev/null 2>&1; then
  docker compose up -d db
  export DATABASE_URL="postgresql://postgres:postgres@localhost:54322/atlas"
  until docker compose exec -T db pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/tests/00_supabase_shim.sql
  for f in supabase/migrations/*.sql; do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$f"; done
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f supabase/seed.sql
  echo "→ local Postgres+PostGIS ready at $DATABASE_URL (plain Postgres: use Supabase for Auth/REST)"
else
  echo "→ Docker not available: skipping local DB. The site runs on bundled demo data."
fi
echo "✓ done — run: npm run dev  (http://localhost:3100)"
