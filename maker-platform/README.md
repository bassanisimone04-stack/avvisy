# maker-platform

Piattaforma per maker, artigiani e appassionati DIY: **directory con mappa**, **store di prodotti digitali** e **strumenti gratuiti**, con un unico brand, un unico design system e un'unica infrastruttura. Mercato iniziale: Stati Uniti (en-US, USD). Verticale attivo: **Woodworking & CNC**.

> **Stato: Fase 1 — frontend dimostrativo.** Tutte le attività, i prodotti e i prezzi sono **dati demo fittizi**. Non ci sono servizi esterni collegati: niente database, pagamenti, email o tile cartografiche di terze parti. Brand e dominio sono ancora da decidere: il nome provvisorio è "YourBrand" e si cambia in `src/config/site.ts` o con `NEXT_PUBLIC_BRAND_NAME`.

## Avvio rapido

Requisiti: Node.js ≥ 20 (testato con 22.23) e pnpm 10.

```bash
cd maker-platform
pnpm install
pnpm dev
```

Il sito è disponibile su <http://localhost:3000>.

Build di produzione in locale:

```bash
pnpm build && pnpm start
```

## Comandi

| Comando | Descrizione |
|---|---|
| `pnpm dev` | Server di sviluppo (copia prima il worker MapLibre in `public/vendor`) |
| `pnpm build` / `pnpm start` | Build e server di produzione |
| `pnpm typecheck` | TypeScript strict |
| `pnpm lint` | ESLint (config Next.js) |
| `pnpm test` | Test unitari Vitest |
| `pnpm test:e2e` | Playwright (smoke, flussi, accessibilità) sulla build di produzione |
| `pnpm check` | typecheck + lint + test + build |
| `pnpm assets:materials` | Rigenera le texture segnaposto (Python 3 + numpy + Pillow) |
| `pnpm assets:maps` | Rigenera la mappa statica USA e il GeoJSON degli stati |

In ambienti con Chromium preinstallato e versione di Playwright diversa: `PLAYWRIGHT_CHROMIUM_PATH=/percorso/chrome pnpm test:e2e`.

## Cosa funziona oggi

| Area | Stato | Note |
|---|---|---|
| Homepage completa | Operativa | Hero, verticali, anteprima directory, progetti, strumenti, how it works, business, newsletter |
| Directory `/explore/us/woodworking` | Operativa su dati demo | Ricerca testuale, località demo (Austin, Portland, Brooklyn, Denver e relativi ZIP), raggio, categoria, filtri, paginazione, URL condivisibili, mappa MapLibre con cluster, "cerca in quest'area", bottom sheet mobile, funziona anche senza JS |
| Scheda attività `/business/[slug]` | Demo | Servizi, capacità, provenienza dati, segnalazione errori (UI), rivendicazione (UI) |
| Store `/shop`, `/shop/woodworking` | Demo | Categorie, ricerca, filtri per formato e difficoltà, ordinamento |
| Scheda prodotto `/shop/[slug]` | Demo | Licenze personal/commercial, file inclusi, "make it locally", correlati |
| Carrello e preferiti | Dimostrativi | Salvati solo nel `localStorage` del browser; checkout disattivato |
| Strumenti `/tools/*` | **Operativi e testati** | Board Foot, CNC Project Cost, Cut List (con stima stock semplificata) |
| Bozze legali `/legal/*` | Bozze | Da sottoporre a revisione legale |
| Account, checkout, download, newsletter, admin | Pianificati | Fasi 2–5 |

## Struttura

```
src/app/            route (sottili)
src/components/     UI: ui/, layout/, home/, directory/, maps/, marketplace/, tools/, account/
src/features/       dominio: directory/, catalog/, tools/, local-state/, legal/
src/config/         site, verticals, markets, navigation
src/data/demo/      dati demo fittizi
src/lib/            utilità (format, seo)
messages/           stringhe UI (next-intl)
scripts/            generazione asset
tests/unit, tests/e2e
docs/               documentazione permanente
```

Dettagli in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). Le regole operative sono in [`CLAUDE.md`](CLAUDE.md).
