# GlutenFree Directory

Prototipo navigabile di **GlutenFree Directory**, la directory italiana di
ristoranti, pizzerie, hotel, farmacie, supermercati e negozi senza glutine,
con blog editoriale, sezione prodotti, area utente e pannello di
amministrazione.

> Prototipo dimostrativo: attività, articoli, prodotti, recensioni e
> statistiche sono **dati fittizi**. Login, preferiti, recensioni, commenti e
> le azioni della dashboard admin sono **simulati** e salvati solo nel
> `localStorage` del browser — nessun backend reale è coinvolto.

## Stack tecnico

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** con design system a variabili CSS (palette verde /
  bianco / arancione, dark mode via `data-theme`)
- **lucide-react** per l'iconografia
- Dati **mock locali** (`src/lib`) e **stato client-side** (React Context +
  `localStorage`) per preferiti, sessione utente e notifiche — nessun
  database
- Illustrazioni generate via **SVG inline** (nessuna immagine esterna):
  caricamento istantaneo, zero dipendenze da CDN immagini
- **Metadata API** di Next.js per SEO (title/description/canonical/OG/Twitter
  Card), `sitemap.ts` e `robots.ts` nativi, JSON-LD per `Organization`,
  `LocalBusiness`, `Article`, `FAQPage`, `BreadcrumbList`, `Product`,
  `ItemList`
- Immagine Open Graph generata dinamicamente con `next/og`

## Avvio

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build di produzione
npm start        # serve la build
```

## Struttura

```
src/
├─ app/
│  ├─ page.tsx                 # Home: hero, ricerca, mappa, articoli, top ristoranti, prodotti, FAQ, newsletter
│  ├─ directory/                # Directory pubblica
│  │  ├─ page.tsx               # Elenco con filtri (regione, provincia, comune, categoria, prezzo, voto, aperto ora, consegna, take away, certificato AIC)
│  │  └─ [slug]/page.tsx        # Scheda attività completa (orari, contatti, menu, recensioni, FAQ, attività simili)
│  ├─ blog/                     # Blog editoriale (10 categorie)
│  │  ├─ page.tsx
│  │  └─ [slug]/page.tsx        # Articolo con TOC, FAQ, breadcrumb, JSON-LD, articoli correlati, commenti
│  ├─ prodotti/                 # Catalogo prodotti senza glutine
│  ├─ accedi/ registrati/       # Autenticazione (mock)
│  ├─ account/                  # Area utente: profilo, preferiti, recensioni, notifiche, segnalazioni
│  ├─ admin/                    # Dashboard amministratore
│  │  ├─ attivita/ articoli/ utenti/ recensioni/ categorie/ banner/ newsletter/ analytics/ seo/
│  ├─ chi-siamo/ contatti/ per-le-aziende/ privacy/ cookie/ termini/
│  ├─ sitemap.ts  robots.ts  opengraph-image.tsx
├─ components/                  # Componenti UI riutilizzabili (card, filtri, ricerca, mappa, FAQ, TOC, ecc.)
└─ lib/                         # Tipi, dati mock, SEO helper, ricerca, store client-side
```

## Funzionalità principali

- **Ricerca intelligente** con autocomplete su attività, articoli, città,
  regioni e categorie (`src/lib/search.ts`), utilizzabile da header e hero.
- **Directory filtrabile** via query string (regione, provincia, comune,
  categoria, fascia di prezzo, valutazione minima, aperto ora, consegna,
  take away, certificazione AIC), con ordinamento e paginazione.
- **Mappa interattiva stilizzata**: pin cliccabili/hover sulle attività in
  evidenza, senza dipendere da chiavi API esterne (Google Maps/Mapbox).
- **SEO automatizzata su ogni pagina**: meta title/description, canonical,
  Open Graph, Twitter Card, breadcrumb e structured data (`src/lib/seo.tsx`),
  sitemap e robots.txt generati automaticamente da tutti i contenuti.
- **Articoli con TOC, FAQ Schema, tempo di lettura, autore, articoli
  correlati, condivisione social e commenti** (mock).
- **Area utente**: registrazione/login mock, preferiti persistiti in
  `localStorage`, form recensioni, segnalazione errori, notifiche.
- **Dashboard admin**: gestione attività/articoli/utenti/categorie/banner,
  moderazione recensioni, composer newsletter, analytics e SEO dashboard con
  controlli automatici e Core Web Vitals dimostrativi.
- **Dark mode** persistente senza flash iniziale, animazioni leggere allo
  scroll (`Reveal`), rispetto di `prefers-reduced-motion`.

## Roadmap verso una versione in produzione

Il prototipo è pensato per essere collegato in futuro a servizi reali,
mantenendo la stessa struttura di componenti e pagine:

- **Supabase/PostgreSQL + Prisma ORM** al posto dei dati mock in `src/lib`
- **Autenticazione reale** (Supabase Auth) al posto del mock in `src/lib/store.tsx`
- **Algolia o Meilisearch** per la ricerca full-text su larga scala
- **Google Maps o Mapbox** per la mappa interattiva con geolocalizzazione reale
- **Cloudinary** per upload, ottimizzazione e CDN delle immagini reali (oggi
  sostituite da illustrazioni SVG generate)
- **Vercel** per hosting, edge caching e Web Analytics
- Automazione SEO avanzata: suggerimenti AI per nuovi articoli, internal
  linking automatico, generazione programmatica di pagine locali (città ×
  categoria) per la SEO programmatica su larga scala
