#!/usr/bin/env bash
# Spins up a throwaway PostgreSQL (+PostGIS) cluster, applies the Supabase shim, all migrations,
# the seed, and runs the RLS test-suite. Requires local PostgreSQL 15+/16 binaries and PostGIS.
# With DATABASE_URL set, runs against that database instead (it must be a disposable one).
set -euo pipefail
cd "$(dirname "$0")/.."
export PGOPTIONS="-c client_min_messages=warning"
run() { psql -v ON_ERROR_STOP=1 -q "$@"; }
if [ -z "${DATABASE_URL:-}" ]; then
  PGBIN="$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)"
  [ -x "$PGBIN/initdb" ] || { echo "PostgreSQL binaries not found; set DATABASE_URL"; exit 2; }
  DIR="$(mktemp -d)"; PORT=55432
  if [ "$(id -u)" = "0" ]; then chown -R postgres "$DIR"; AS="runuser -u postgres --"; else AS=""; fi
  $AS "$PGBIN/initdb" -D "$DIR/data" -U postgres --auth=trust >/dev/null
  $AS "$PGBIN/pg_ctl" -D "$DIR/data" -o "-p $PORT -k $DIR" -l "$DIR/log" -w start >/dev/null
  trap '$AS "$PGBIN/pg_ctl" -D "$DIR/data" -m immediate stop >/dev/null; rm -rf "$DIR"' EXIT
  export DATABASE_URL="postgresql://postgres@localhost:$PORT/postgres?host=$DIR"
fi
run "$DATABASE_URL" -f supabase/tests/00_supabase_shim.sql
for f in supabase/migrations/*.sql; do echo "→ $f"; run "$DATABASE_URL" -f "$f"; done
if [ -f supabase/seed.sql ]; then echo "→ seed"; run "$DATABASE_URL" -f supabase/seed.sql; fi
run "$DATABASE_URL" -c "refresh materialized view price_index_city;" >/dev/null
echo "→ RLS tests"; PGOPTIONS="" psql -v ON_ERROR_STOP=1 "$DATABASE_URL" -f supabase/tests/rls.test.sql 2>&1 | grep -E "ok -|FAILED|PASSED|ERROR"
