# Changelog

## [0.1.0] — 2026-11-25 — Fase 0 + Fase 1 (frontend dimostrativo)

### Aggiunto
- Progetto Next.js 16.4 in `maker-platform/` (TypeScript strict, Tailwind 4, Cache Components, next-intl, pnpm).
- Design system con token centralizzati, Fraunces + Inter self-hosted, primitive UI in stile shadcn.
- Texture procedurali originali come segnaposto fotografici (`scripts/generate-material-imagery.py`).
- Tavole tecniche isometriche dei prodotti generate dai dati (`IsoDrawing`, `PlanSheet`).
- Homepage completa: hero con ricerca e collage, verticali, anteprima directory, progetti, strumenti, how it works, sezione business, newsletter (non collegata).
- Directory `/explore/us/woodworking`: ricerca, località demo, raggio, categorie, filtri, paginazione, URL condivisibili, mappa MapLibre offline con cluster, "cerca in quest'area", overlay mappa mobile con bottom sheet, funzionamento senza JS.
- Scheda attività, store, pagina verticale, scheda prodotto (licenze, file, make it locally, correlati).
- Calcolatori operativi: Board Foot, CNC Project Cost, Cut List (con stima stock FFD dichiarata come semplificata).
- Carrello e preferiti dimostrativi (`localStorage`), checkout disattivato.
- Pagine: cart, favorites, search, sign-in (disattivato), resources, for-business, legal (bozze), about-this-preview, 404, error.
- SEO: metadata, canonical, Open Graph, breadcrumb JSON-LD, robots/sitemap, noindex globale finché non è autorizzato.
- Test: 22 unitari (Vitest), 47 e2e Playwright (smoke, flussi, accessibilità axe) su desktop 1440 e mobile 390.
- CI GitHub Actions dedicata a `maker-platform/**`.
- Documentazione permanente (`CLAUDE.md`, `README.md`, `docs/*`).
