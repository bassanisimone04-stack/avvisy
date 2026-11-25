# CLAUDE.md — maker-platform

@AGENTS.md

Memoria operativa sintetica. Dettagli in `docs/`. Leggere prima di ogni fase.

## Obiettivo permanente
Piattaforma internazionale per maker (mercato iniziale USA, en-US, USD). Tre pilastri integrati:
**EXPLORE** (directory + mappa), **CREATE** (store di prodotti digitali), **TOOLS** (calcolatori).
Verticale attivo: Woodworking & CNC. Brand e dominio **non ancora decisi** → `src/config/site.ts`.

## Regole linguistiche
- Con l'utente, report, documentazione: **italiano**.
- Codice, nomi, DB, URL, commit, API: **inglese**.
- Contenuti pubblici: **inglese americano** naturale.

## Vincoli architetturali
- Monolite modulare Next.js 16 (App Router, Cache Components). Nessun microservizio.
- Logica di dominio in `src/features/<modulo>` (pura, testabile). UI in `src/components`. Route in `src/app` sottili.
- Accesso ai dati solo tramite `features/*/repository.ts` (oggi dati demo, poi Supabase).
- Verticali = dati (`src/config/verticals.ts`), non codice. Niente app separate per verticale.
- Lingua, mercato, valuta e unità sono dimensioni separate (`src/config/markets.ts`).
- Route dinamiche: `await params` **fuori** da Suspense + `notFound()` → 404 reali. `searchParams` dentro `<Suspense>`.
- Nessuna chiamata a `new Date()`/`Math.random()` in rendering statico.

## Regole grafiche
- Solo token di `src/app/globals.css` (`@theme`). Palette: ivory, forest, sage, clay, ink (+ varianti `-ink` per testo AA).
- Fraunces (titoli, `font-display`) + Inter (UI). Font self-hosted in `src/fonts/`.
- Raggi contenuti (≤14px), ombre leggere, niente gradienti vistosi, glassmorphism o emoji.
- Immagini: texture procedurali segnaposto (`scripts/generate-material-imagery.py`) o foto con licenza. Mai foto generiche spacciate per un'attività reale.

## Dati e onestà
- Tutto il dataset è **demo**: `isDemo: true`, badge "Demo", banner globale, `noindex`.
- Mai inventare recensioni, valutazioni, prezzi o disponibilità di attività reali.
- Integrazioni non implementate vanno dichiarate come tali nella UI (es. checkout disattivato).

## Sicurezza
- Nessun segreto nel repo; solo `.env.example` con placeholder.
- Chiavi privilegiate solo server-side. Autorizzazione sempre server-side (Fase 2+).
- Indicizzazione disattivata salvo `NEXT_PUBLIC_ALLOW_INDEXING=true` in produzione approvata.

## Comandi
```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm test:e2e            # dopo pnpm build; PLAYWRIGHT_CHROMIUM_PATH opzionale
pnpm assets:materials    # rigenera le texture segnaposto
pnpm assets:maps         # rigenera mappa statica e GeoJSON degli stati
```

## Testing
- Unit (Vitest): `tests/unit` — logica pura (calcolatori, ricerca directory).
- E2E (Playwright): `tests/e2e` — smoke, flussi, accessibilità axe (WCAG A/AA), desktop 1440 + mobile 390.
- Mai dichiarare un test passato se non è stato eseguito.

## Definition of Done
Implementato davvero · requisiti rispettati · responsive (390/768/1440) · stati loading/empty/error ·
autorizzazioni applicabili · zero errori TS/lint · test pertinenti verdi · build ok ·
documentazione + `docs/CHANGELOG.md` + `docs/TODO.md` aggiornati · distinzione implementato/demo/pianificato.

## Documentazione
`docs/PROJECT_CONTEXT.md` · `ARCHITECTURE.md` · `DATABASE.md` · `DESIGN_SYSTEM.md` · `SEO_STRATEGY.md` ·
`I18N_STRATEGY.md` · `DATA_SOURCES.md` · `SECURITY.md` · `ROADMAP.md` · `DEPLOYMENT.md` · `CHANGELOG.md` · `TODO.md`
