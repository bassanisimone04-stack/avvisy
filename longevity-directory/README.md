# Directory Longevità, Biohacking e Medicina Preventiva

Prototipo navigabile di una directory italiana di cliniche, centri diagnostici e professionisti
della longevità, del biohacking e della medicina preventiva — con blog editoriale e area B2B
per le strutture. Costruito con **Astro 5 + Tailwind v4**, dati mock via Content Collections.

> Prototipo dimostrativo: le 28 strutture e i 9 articoli sono **dati fittizi**. I moduli di
> contatto e registrazione non sono collegati a un backend reale.

## Avvio

```bash
cd longevity-directory
npm install
npm run dev      # http://localhost:4321
npm run build    # build statica di produzione
npm run preview  # serve la build
```

## Documentazione strategica

| Documento | Contenuto |
|---|---|
| [`docs/01-architettura-informativa.md`](docs/01-architettura-informativa.md) | Alberatura del menu, struttura URL, tassonomia (9 macro-categorie + sottocategorie), regola anti-thin-content per le pagine categoria+città, filtri, modello dati, piani di abbonamento, conformità sanitaria |
| [`docs/02-strategia-blog-e-keyword.md`](docs/02-strategia-blog-e-keyword.md) | Modello pilastro-cluster, 10 categorie del blog, standard editoriale con gradazione delle evidenze, le 10 keyword di lancio |
| [`docs/03-acquisizione-centri-outreach.md`](docs/03-acquisizione-centri-outreach.md) | Criteri per i primi 50 centri, cold email, inbound listing, piano operativo a 6 settimane |
| [`docs/04-design-system.md`](docs/04-design-system.md) | Design system "Aurora / vetro" — token, componenti, e i bug reali trovati e corretti in fase di build |

## Le 10 keyword di lancio — stato

Tutte e dieci le keyword del piano hanno oggi una pagina reale sul sito:

| # | Keyword | Destinazione | Stato |
|---|---|---|---|
| 1 | test età biologica | `/blog/test-eta-biologica-come-funziona-quanto-costa` | ✅ |
| 2 | medicina funzionale milano | `/directory/medicina-funzionale/milano` | ✅ |
| 3 | crioterapia whole body prezzo | `/blog/crioterapia-whole-body-prezzi-benefici` | ✅ |
| 4 | camera iperbarica prezzo | `/blog/camera-iperbarica-prezzo-indicazioni` | ✅ |
| 5 | check up completo quanto costa | `/blog/check-up-completo-prevenzione-quanto-costa` | ✅ |
| 6 | insulino resistenza sintomi | `/blog/insulino-resistenza-sintomi-cosa-fare` | ✅ |
| 7 | come aumentare vo2 max | `/blog/come-aumentare-vo2-max` | ✅ |
| 8 | nmn integratore funziona | `/blog/nmn-nad-cosa-dice-la-scienza` | ✅ |
| 9 | digiuno intermittente 16/8 | `/blog/digiuno-intermittente-16-8-benefici` | ✅ |
| 10 | apob esame | `/blog/apob-esame-valori-perche-conta` | ✅ |

## Contenuti editoriali sorgente

Le bozze originali (con checklist di revisione medica, note sui prezzi da verificare) sono in
[`contenuti/`](contenuti/); sono state migrate e sono pubblicate come Content Collection in
`src/content/blog/`, con l'aggiunta di link interni contestuali tra articoli correlati
("Approfondimenti correlati") secondo la regola del doc 02 (pilastro + cluster fratelli).

## Architettura del codice

```
src/
├─ content.config.ts     # schema Zod delle collection "centri" e "blog"
├─ content/
│  ├─ centri/             # 28 schede — un file .md per struttura
│  └─ blog/                # 9 articoli — migrati da contenuti/, stesso standard editoriale
├─ lib/
│  ├─ taxonomy.ts          # le 9 categorie + sottocategorie, tipi di struttura, MIN_LISTINGS_FOR_CITY_PAGE
│  ├─ seo.ts                # helper JSON-LD (MedicalClinic, Article, FAQPage, BreadcrumbList, ItemList, WebSite)
│  ├─ evidence.ts           # gradazione dell'evidenza scientifica del blog
│  └─ format.ts, site.ts
├─ components/
│  ├─ Aurora.astro          # sfondo animato su canvas, riusato in home / CTA / per-i-centri
│  ├─ DirectoryApp.astro    # filtri + griglia risultati, tutto client-side
│  ├─ BusinessCard.astro, ArticleCard.astro, CategoryBento.astro, EvidencePill.astro
│  └─ SiteHeader.astro, SiteFooter.astro, SEO.astro, ThemeToggle.astro
├─ layouts/BaseLayout.astro # <head>, script anti-FOUC del tema, sistema di reveal allo scroll
└─ pages/
   ├─ index.astro
   ├─ directory/
   │  ├─ index.astro                    # tutte le strutture, filtri completi
   │  ├─ [categoria]/index.astro         # una per ciascuna delle 9 categorie
   │  └─ [categoria]/[citta].astro       # SOLO dove ≥3 schede (regola anti-thin-content)
   ├─ centri/[slug].astro                # scheda: listino, FAQ, JSON-LD, strutture simili
   ├─ blog/index.astro, blog/[slug].astro
   ├─ chi-siamo.astro, contatti.astro
   ├─ per-i-centri.astro, per-i-centri/registrazione.astro
   └─ disclaimer-medico.astro, privacy.astro, cookie.astro, termini.astro, 404.astro
public/
├─ og-image.png                          # immagine di condivisione, generata via script (palette del sito)
├─ favicon.svg, favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png
└─ robots.txt
```

## Cosa implementa davvero (non solo mockup)

- **Filtri client-side reali** su categoria (multi-select), città, prezzo massimo (slider),
  solo verificate, ordinamento — nessuna richiesta di rete, tutto su attributi `data-*`.
- **Regola anti-thin-content applicata a livello di build**: `getStaticPaths` di
  `directory/[categoria]/[citta].astro` genera una pagina solo per le combinazioni con almeno
  `MIN_LISTINGS_FOR_CITY_PAGE` (3) schede — verificato: su 28 strutture mock, 6 combinazioni
  superano la soglia (Milano×3, Roma, Torino, Bologna), tutte le altre restano assenti di
  proposito.
- **JSON-LD corretto e completo**: `MedicalClinic` con `priceRange` e `areaServed`,
  `aggregateRating` emesso solo se `numeroRecensioni > 0` (mai un rating vuoto o inventato —
  regola esplicita di doc 01 §5.1), `Article` con `publisher`/`mainEntityOfPage`, `WebSite` con
  `SearchAction` in home per l'eleggibilità alla sitelinks search box.
- **Sitemap coerente con i meta robots**: le pagine `noindex` (es. `/per-i-centri/registrazione`)
  sono escluse dalla sitemap via `filter` — evita il segnale contraddittorio "non indicizzarmi"
  + "eccomi, scansionami".
- **og:image reale** (1200×630, generata via script Python nella palette del sito) più
  apple-touch-icon e favicon multi-formato — prima di questo lavoro il sito non aveva alcuna
  immagine di condivisione social.
- **Title e meta description auditati programmaticamente** su tutte le pagine (statiche e
  generate): 0 su 64 sopra i limiti di lunghezza, 0 senza H1 univoco o canonical.
- **Dark mode** completa, persistita, con l'aurora che si ricolora da sola.
- **64 pagine statiche** generate a build time (`npm run build`), zero errori `astro check`.

## Stato e prossimi passi

Fase implementata: architettura, tassonomia, 28 schede mock, 9 articoli su 10 keyword di lancio,
tutte le pagine di servizio, filtri funzionanti, SEO tecnica auditata. Non implementati (fuori
scope di un prototipo statico): backend reale per i moduli di contatto/registrazione,
autenticazione, pagamenti Stripe, area riservata delle strutture, invio email di outreach —
tutti descritti nei doc `01`–`03` e pronti per essere collegati a un layer server (Astro
supporta SSR se serve, o si può portare la stessa tassonomia su Next.js + Supabase come
`glutenfree-directory`).

Contenuti ancora da scrivere prima del lancio reale: revisione medica effettiva di tutti gli
articoli (i nomi dei revisori nel prototipo sono fittizi), verifica dei prezzi citati su centri
reali, foto vere delle strutture al posto delle copertine generate.
