# Architettura

## Stack (versioni installate)
Next.js 16.4 (App Router, Turbopack, **Cache Components**) · React 19.3 · TypeScript 6 strict · Tailwind CSS 4.3 · primitive in stile shadcn/ui scritte a mano su Radix (`radix-ui`), con CVA e tailwind-merge · Lucide · next-intl 4 · MapLibre GL 6 + supercluster · d3-geo + us-atlas · Zod 4 · Vitest 5 · Playwright 1.65 + axe-core.

Il registry shadcn non era raggiungibile dall'ambiente di sviluppo. Le primitive (`Button`, `Badge`, `Input`, `Select`, `Checkbox`) seguono le stesse convenzioni (`cn`, `cva`, `asChild`) e si possono sostituire con quelle del registry senza impatti.

## Livelli
```
src/app/            Routing, metadata, Suspense. Nessuna logica di dominio.
src/components/     UI riusabile, raggruppata per area.
src/features/<m>/   Dominio: tipi, logica pura, repository (accesso ai dati).
src/config/         Configurazione dichiarativa (site, verticals, markets, navigation).
src/data/demo/      Dataset fittizio (solo Fase 1).
src/lib/            Utilità trasversali (format, seo, cn).
```

**Repository pattern.** `features/directory/repository.ts` e `features/catalog/repository.ts` oggi leggono `src/data/demo`. Nella Fase 2 vengono reimplementati su Supabase con la stessa firma, senza toccare la UI.

## Rendering
- Cache Components attivo; **Partial Prefetching disattivato**. Con il prefetch parziale, un `notFound()` dentro `<Suspense>` veniva inviato dopo una shell già partita con status 200 (soft 404).
- Le route dinamiche (`/business/[slug]`, `/shop/[slug]`, `/tools/[slug]`, `/legal/[slug]`) fanno `await params` a livello di pagina, chiamano `notFound()` se serve (404 reali) e sono prerenderizzate con `generateStaticParams`.
- Le pagine che leggono `searchParams` (directory, shop, search) lo fanno dentro `<Suspense>`: l'HTML iniziale è comunque generato sul server.
- `/shop/[slug]` serve sia i verticali (`/shop/woodworking`) sia i prodotti. Gli slug dei prodotti non devono collidere con quelli dei verticali.

## Directory
- `features/directory/search.ts` è la funzione pura che fa da riferimento per filtri, distanza, raggio, bounding box, paginazione e serializzazione dell'URL. È testata.
- `DirectoryExplorer` (client) mantiene lo stato e sincronizza l'URL con `history.replaceState`. Il form dei filtri è un normale GET, quindi funziona anche senza JavaScript.
- `DirectoryMap` è caricata in modo lazy (`next/dynamic`, `ssr:false`). Usa marker HTML focalizzabili e cluster supercluster.
- Il worker MapLibre viene copiato in `public/vendor` da `scripts/copy-vendor.mjs` (predev/prebuild), perché il bundler non risolve l'URL del worker.
- Basemap offline: GeoJSON degli stati (`public/geo`). `NEXT_PUBLIC_MAP_STYLE_URL` la sostituisce con uno stile commerciale.

## Stato client (demo)
`features/local-state/store.ts` usa `useSyncExternalStore` e `localStorage` per carrello e preferiti. È esplicitamente dimostrativo e verrà sostituito (preferiti su Supabase, carrello validato lato server e Stripe Checkout).

## Verticali e feature flag
I verticali sono dati: `src/config/verticals.ts`, con stato `active`, `coming_soon` o `hidden`. Le rotte dei verticali non attivi restituiscono 404. In Fase 2 la configurazione passa alla tabella `verticals`.
