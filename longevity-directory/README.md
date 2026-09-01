# Directory Longevità, Biohacking e Medicina Preventiva

Directory italiana di cliniche, centri diagnostici e professionisti della longevità, del
biohacking e della medicina preventiva — con blog editoriale e area B2B per le strutture.
Costruito con **Astro 5 + Tailwind v4**, contenuti (schede centri, articoli) via Content
Collections, backend reale (SQLite + Astro Actions) per moduli, autenticazione e area riservata.

> Le 28 strutture e i 9 articoli sono **dati mock** pensati per popolare il prototipo. Moduli di
> contatto/lead, registrazione, login e pannello admin sono invece **backend reale e funzionante**
> (vedi sotto) — non simulazioni. Pagamenti Stripe e pannello admin richiedono le proprie
> credenziali per essere attivi (vedi `.env.example`).

## Avvio

```bash
cd longevity-directory
npm install
cp .env.example .env.local   # opzionale: ADMIN_PASSWORD, chiavi Stripe
npm run dev      # http://localhost:4321 (SQLite creato al volo in data/app.db)
npm run build    # build di produzione (SSR ibrido: pagine di contenuto statiche + Actions server)
npm run start    # serve la build di produzione (node ./dist/server/entry.mjs)
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
│  ├─ taxonomy.ts          # le 9 categorie + sottocategorie, tipi di struttura, MIN_LISTINGS_FOR_CITY_PAGE, getCityPageCombos()
│  ├─ seo.ts                # helper JSON-LD (MedicalClinic, Article, FAQPage, BreadcrumbList, ItemList, WebSite)
│  ├─ evidence.ts           # gradazione dell'evidenza scientifica del blog
│  ├─ db.ts                 # connessione SQLite (better-sqlite3) + schema tabelle, creato al volo
│  ├─ auth.ts                # hash/verify password (scrypt nativo), sessioni struttura (cookie httpOnly)
│  ├─ admin-auth.ts          # gate /admin: cookie HMAC stateless, nessuna tabella dedicata
│  ├─ stripe.ts               # wrapper Stripe, disattivo finché STRIPE_SECRET_KEY non è impostata
│  └─ format.ts, site.ts
├─ actions/index.ts       # Astro Actions: contatti, lead, registrazione, login/logout, admin, Stripe
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
   ├─ centri/[slug].astro                # scheda: listino, FAQ, JSON-LD, strutture simili, form lead reale
   ├─ blog/index.astro, blog/[slug].astro
   ├─ chi-siamo.astro, contatti.astro    # form contatti reale (Astro Action + SQLite)
   ├─ accedi.astro                       # login struttura (SSR)
   ├─ account/index.astro                # area riservata struttura: stato pratica, lead, upsell Stripe (SSR, protetta)
   ├─ admin/index.astro                  # pannello admin: approvazione strutture, lead, messaggi (SSR, protetto)
   ├─ per-i-centri.astro, per-i-centri/registrazione.astro  # registrazione reale (crea account + invia in revisione)
   ├─ sitemap.xml.ts                     # sitemap scritta a mano (vedi nota sotto)
   └─ disclaimer-medico.astro, privacy.astro, cookie.astro, termini.astro, 404.astro
public/
├─ og-image.png                          # immagine di condivisione, generata via script (palette del sito)
├─ favicon.svg, favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png
└─ robots.txt
data/                     # SQLite (app.db), creato al volo, gitignored — non versionato
```

## Backend reale: cosa fa e come è verificato

Il sito è passato da mockup statico a **applicazione ibrida**: `output: "server"` con adapter
Node (`@astrojs/node`, modalità standalone), ma ogni pagina di contenuto ha
`export const prerender = true` esplicito — resta generata staticamente in build. Solo le pagine
che dipendono da una sessione (`/accedi`, `/account`, `/admin`) e le Astro Actions girano on
demand.

- **Persistenza**: SQLite via `better-sqlite3`, file singolo in `data/app.db` (gitignored,
  creato al primo avvio). Tabelle: `business_users`, `sessions`, `submissions`, `leads`,
  `contact_messages`.
- **Autenticazione struttura**: password hashate con `crypto.scrypt` nativo di Node (nessuna
  dipendenza esterna tipo bcrypt), sessioni con token casuale + cookie `httpOnly`/`sameSite=lax`.
  Login, logout, redirect automatico se già autenticato.
- **Registrazione struttura** (`/per-i-centri/registrazione`): form reale che crea l'account e
  inserisce la pratica in `submissions` con stato `in_attesa`.
- **Area riservata** (`/account`): mostra lo stato della pratica (in attesa / approvata /
  rifiutata), i lead ricevuti, upsell ai piani a pagamento.
- **Pannello admin** (`/admin`): gate a password singola tramite cookie firmato HMAC (nessuna
  tabella dedicata). Approva/rifiuta pratiche, elenca lead e messaggi di contatto. Mostra
  onestamente "ADMIN_PASSWORD non è impostata" se non configurata — nessuna finta funzionalità.
- **Lead e contatti**: form sulla scheda di ogni centro e in `/contatti` scrivono davvero su
  SQLite (verificato via query dirette al db, non solo lettura del codice).
- **Stripe**: integrazione con import dinamico, attiva solo se `STRIPE_SECRET_KEY` è impostata;
  altrimenti mostra un messaggio onesto di "non configurato" invece di fallire o fingere.
  Richiede le chiavi del tuo account Stripe — non possono essere fabbricate in questa sessione.

Due bug reali trovati e corretti durante l'implementazione (dettagli nel commit):
1. **403 su tutte le Actions** — `security.allowedDomains` vuoto in `astro.config.mjs` fa cadere
   l'header `Host` anche in richieste dirette senza proxy, rompendo il controllo Origin/CSRF.
   Risolto configurando esplicitamente `allowedDomains`.
2. **500 "Right-hand side of 'instanceof' is not an object" su tutte le Actions** — conflitto fra
   due versioni di zod installate contemporaneamente (zod v4 richiesto da dipendenze transitive
   di Astro, zod v3 usato dal runtime interno delle Actions). Risolto forzando `"overrides":
   {"zod": "3.25.76"}` in `package.json`. Come conseguenza, `@astrojs/sitemap` (che vuole zod v4)
   è stato rimosso e sostituito da `src/pages/sitemap.xml.ts` scritta a mano.

Verificato con un run Playwright end-to-end completo (browser reale, non solo lettura del
codice): registrazione → redirect area riservata con stato corretto, logout, login (corretto e
con password sbagliata), invio lead su una scheda reale, invio contatto, `/admin` e checkout
Stripe entrambi onestamente "non configurati" in assenza delle rispettive credenziali.

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
- **Sitemap coerente con i meta robots**: le pagine `noindex` (`/per-i-centri/registrazione`,
  `/account`, `/admin`, `/accedi`) sono escluse dalla sitemap scritta a mano in
  `sitemap.xml.ts` — evita il segnale contraddittorio "non indicizzarmi" + "eccomi, scansionami".
- **og:image reale** (1200×630, generata via script Python nella palette del sito) più
  apple-touch-icon e favicon multi-formato — prima di questo lavoro il sito non aveva alcuna
  immagine di condivisione social.
- **Title e meta description auditati programmaticamente** su tutte le pagine (statiche e
  generate): 0 su 64 sopra i limiti di lunghezza, 0 senza H1 univoco o canonical.
- **Dark mode** completa, persistita, con l'aurora che si ricolora da sola.
- **64 pagine statiche** generate a build time (`npm run build`), zero errori `astro check`.

## Stato e prossimi passi

Fase implementata: architettura, tassonomia, 28 schede mock, 9 articoli su 10 keyword di lancio,
tutte le pagine di servizio, filtri funzionanti, SEO tecnica auditata, backend reale (SQLite +
Astro Actions) per contatti, lead, registrazione, autenticazione e area riservata, pannello
admin. Richiedono configurazione con le tue credenziali (impossibile fabbricarle in questa
sessione — vedi `.env.example`):

- `ADMIN_PASSWORD` per attivare `/admin`;
- `STRIPE_SECRET_KEY` + `STRIPE_PRICE_VERIFICATO/PREMIUM/ESCLUSIVA` per attivare i checkout a
  pagamento;
- `SITE.url` in `src/lib/site.ts` e `security.allowedDomains` in `astro.config.mjs` vanno
  aggiornati con il dominio reale prima del deploy in produzione.

Limite noto: i lead in `/account` sono abbinati per nome struttura (`centro_nome`), perché le
strutture registrate via form non sono ancora collegate alle schede pubblicate in
`src/content/centri/` (che restano contenuto mock curato a mano). Collegarle con un id reale è il
prossimo passo naturale quando le prime strutture vere verranno onboardate.

Contenuti ancora da scrivere prima del lancio reale: revisione medica effettiva di tutti gli
articoli (i nomi dei revisori nel prototipo sono fittizi), verifica dei prezzi citati su centri
reali, foto vere delle strutture al posto delle copertine generate, invio email di outreach (doc
`03`).
