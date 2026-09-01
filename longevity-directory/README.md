# Directory Longevità, Biohacking e Medicina Preventiva

Prototipo navigabile di una directory italiana di cliniche, centri diagnostici e professionisti
della longevità, del biohacking e della medicina preventiva — con blog editoriale e area B2B
per le strutture. Costruito con **Astro 5 + Tailwind v4**, dati mock via Content Collections.

> Prototipo dimostrativo: le 20 strutture e i 4 articoli sono **dati fittizi**. I moduli di
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
| [`docs/04-design-system.md`](docs/04-design-system.md) | Design system "Aurora / vetro" — token, componenti, e i 3 bug reali trovati e corretti in fase di build |

## Contenuti editoriali sorgente

Le bozze originali (con checklist di revisione medica, note sui prezzi da verificare) sono in
[`contenuti/`](contenuti/); sono state migrate e sono pubblicate come Content Collection in
`src/content/blog/`.

## Architettura del codice

```
src/
├─ content.config.ts     # schema Zod delle collection "centri" e "blog"
├─ content/
│  ├─ centri/             # 20 schede — un file .md per struttura
│  └─ blog/                # 4 articoli — migrati da contenuti/, stesso standard editoriale
├─ lib/
│  ├─ taxonomy.ts          # le 9 categorie + sottocategorie, tipi di struttura, MIN_LISTINGS_FOR_CITY_PAGE
│  ├─ seo.ts                # helper JSON-LD (MedicalClinic, Article, FAQPage, BreadcrumbList, ItemList)
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
```

## Cosa implementa davvero (non solo mockup)

- **Filtri client-side reali** su categoria (multi-select), città, prezzo massimo (slider),
  solo verificate, ordinamento — nessuna richiesta di rete, tutto su attributi `data-*`.
- **Regola anti-thin-content applicata a livello di build**: `getStaticPaths` di
  `directory/[categoria]/[citta].astro` genera una pagina solo per le combinazioni con almeno
  `MIN_LISTINGS_FOR_CITY_PAGE` (3) schede — verificato: su 20 strutture mock, solo
  `diagnostica-avanzata/milano` e `terapie-tecnologie/milano` vengono generate.
- **JSON-LD corretto**: `aggregateRating` viene emesso solo se `numeroRecensioni > 0` (mai un
  rating vuoto o inventato — regola esplicita di doc 01 §5.1).
- **Dark mode** completa, persistita, con l'aurora che si ricolora da sola.
- **47 pagine statiche** generate a build time (`npm run build`), zero errori `astro check`.

## Stato e prossimi passi

Fase implementata: architettura, tassonomia, 20 schede mock, 4 articoli, tutte le pagine di
servizio, filtri funzionanti, SEO tecnica. Non implementati (fuori scope di un prototipo
statico): backend reale per i moduli di contatto/registrazione, autenticazione, pagamenti
Stripe, area riservata delle strutture, invio email di outreach — tutti descritti nei doc
`01`–`03` e pronti per essere collegati a un layer server (Astro supporta SSR se serve, o si
può portare la stessa tassonomia su Next.js + Supabase come `glutenfree-directory`).
