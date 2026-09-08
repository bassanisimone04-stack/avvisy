# Directory Longevità, Biohacking e Medicina Preventiva

Directory italiana di cliniche, centri diagnostici e professionisti della longevità, del
biohacking e della medicina preventiva — con blog editoriale e area B2B per le strutture.
Costruito con **Astro 5 + Tailwind v4**, contenuti (schede centri, articoli) via Content
Collections, backend reale (SQLite + Astro Actions) per moduli, autenticazione e area riservata.

> Le 28 strutture e i 75 articoli sono **dati mock** pensati per popolare il prototipo. Moduli di
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
| [`docs/04-design-system.md`](docs/04-design-system.md) | Design system "Color Drenching" (terracotta/ruggine, ex "Aurora / vetro") — token, componenti, e i bug reali trovati e corretti in fase di build |

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

## Guide pilastro

Il sito ha ora **tutte e 9 le guide pilastro** previste dal doc 02 (§3) — il piano dei contenuti
è completo. I pilastri 5 (sonno), 1 (healthspan) e 8 (prevenzione malattie croniche) sono scritti
*insieme* ai loro cluster, nell'ordine che il doc raccomanda: prima gli approfondimenti, poi la
guida che li raccoglie. La guida healthspan include un articolo volutamente controcorrente — una
lettura critica delle Blue Zones, basata sull'analisi demografica 2024 di Newman (premiata con
l'Ig Nobel) che mette in discussione la qualità dei dati anagrafici dietro quella narrazione.

**Il pilastro 9 (guide città e costi) è implementato diversamente da come lo descrive il doc**, per
scelta deliberata: non 4 articoli scritti a mano con prezzi indicativi, ma una pagina
`/citta/[citta]` generata a build time dai dati reali di `src/content/centri/` — prezzo minimo,
medio e conteggio per categoria calcolati davvero, non inventati. Con solo 29 schede mock,
scrivere quei prezzi a mano avrebbe significato inventarli, contro la regola del doc 01 §5.1 sui
dati mai inventati. Oggi genera Milano, Roma, Torino e Bologna (le uniche con ≥3 strutture),
e cresce da sola con la directory invece di richiedere una riscrittura a ogni prezzo che cambia.

| Pilastro | Guida | Cluster collegati |
|---|---|---|
| 2 — Esami e prevenzione | `/guide/esami-prevenzione-longevita` | ApoB, test età biologica, check-up completo |
| 3 — Nutrizione | `/guide/alimentazione-longevita` | insulino-resistenza, digiuno intermittente 16/8 |
| 4 — Allenamento | `/guide/allenamento-longevita` | come aumentare il VO₂max |
| 5 — Sonno | `/guide/sonno-longevita` | apnee notturne, quante ore dormire, HRV |
| 1 — Healthspan | `/guide/healthspan-longevita` | lifespan vs healthspan, 12 meccanismi, Blue Zones |
| 8 — Prevenzione malattie croniche | `/guide/prevenzione-malattie-croniche` | rischio cardiovascolare, screening oncologici, declino cognitivo |
| 6 — Integratori | `/guide/integratori-longevita` | NMN e NAD⁺ |
| 7 — Terapie e tecnologie | `/guide/terapie-biohacking` | crioterapia, camera iperbarica |

**Tutti e 75 gli articoli del blog** puntano ora "in su" alla propria guida pilastro (sezione
"Approfondimenti correlati"), e ogni guida elenca i suoi cluster e punta alla categoria directory
corrispondente: il ciclo pilastro → cluster → directory del doc 02 §1 è chiuso in entrambe le
direzioni, non più solo sulla carta.

Le guide 2, 6 e 7 applicano la gradazione dell'evidenza (🟢 solida / 🟡 promettente / 🔴
insufficiente) molecola per molecola e terapia per terapia — inclusi i giudizi scomodi: revisione
Cochrane sulla crioterapia, avviso FDA sul "plasma giovane", resveratrolo ridimensionato,
vitamina D e omega-3 che non funzionano come integrazione universale.

## Contenuti editoriali sorgente

Le bozze originali (con checklist di revisione medica, note sui prezzi da verificare) sono in
[`contenuti/`](contenuti/); sono state migrate e sono pubblicate come Content Collection in
`src/content/blog/`, con l'aggiunta di link interni contestuali tra articoli correlati
("Approfondimenti correlati") secondo la regola del doc 02 (pilastro + cluster fratelli).

## Architettura del codice

```
src/
├─ content.config.ts     # schema Zod delle collection "centri", "blog" e "guide"
├─ content/
│  ├─ centri/             # 28 schede — un file .md per struttura
│  ├─ blog/                # 75 articoli cluster, stesso standard editoriale
│  └─ guide/                # 9 guide pilastro — il piano del doc 02 è completo
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
│  ├─ KeyTakeaways.astro    # box "in sintesi" a inizio articolo/guida (doc 02 §4.1)
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
   ├─ blog/index.astro, blog/[slug].astro  # FAQ ora renderizzate visibili, non solo nel JSON-LD
   ├─ guide/index.astro, guide/[slug].astro  # guide pilastro: KeyTakeaways + cluster collegati come card
   ├─ citta/[citta].astro                 # panoramica città: dati REALI dalla directory, non testo scritto a mano
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

Il sito è passato da mockup statico a **applicazione ibrida**: `output: "server"`, ma ogni
pagina di contenuto ha `export const prerender = true` esplicito — resta generata staticamente
in build. Solo le pagine che dipendono da una sessione (`/accedi`, `/account`, `/admin`) e le
Astro Actions girano on demand.

L'adapter si sceglie da solo in base all'ambiente (`astro.config.mjs`): Vercel imposta da sé la
variabile `VERCEL` in build, quindi lì si usa l'adapter Vercel (funzioni serverless); in locale,
dove `VERCEL` non è definita, si usa l'adapter Node standalone — lo stesso su cui sono stati
fatti tutti i test end-to-end reali di questo progetto (curl, Playwright).

- **Persistenza**: [libSQL](https://turso.tech) via `@libsql/client` — stesso dialetto SQL di
  SQLite, ma compatibile anche con ambienti serverless. Senza `TURSO_DATABASE_URL` punta a un
  file locale (`data/app.db`, gitignored, creato al primo avvio) — zero configurazione in
  sviluppo, come prima. Con quella variabile impostata (produzione) punta a un database Turso
  remoto: necessario su Vercel, dove il filesystem di una funzione serverless è effimero e non
  condiviso tra istanze — un file SQLite locale lì non sopravviverebbe tra una richiesta e
  l'altra. Tabelle: `business_users`, `sessions`, `submissions`, `leads`, `contact_messages`.
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

Bug reali trovati e corretti durante l'implementazione (dettagli nei commit):
1. **403 su tutte le Actions** — `security.allowedDomains` vuoto in `astro.config.mjs` fa cadere
   l'header `Host` anche in richieste dirette senza proxy, rompendo il controllo Origin/CSRF.
   Risolto configurando esplicitamente `allowedDomains`.
2. **500 "Right-hand side of 'instanceof' is not an object" su tutte le Actions** — conflitto fra
   due versioni di zod installate contemporaneamente (zod v4 richiesto da dipendenze transitive
   di Astro, zod v3 usato dal runtime interno delle Actions). Risolto forzando `"overrides":
   {"zod": "3.25.76"}` in `package.json`. Come conseguenza, `@astrojs/sitemap` (che vuole zod v4)
   è stato rimosso e sostituito da `src/pages/sitemap.xml.ts` scritta a mano.
3. **Un punto della migrazione a libSQL rimasto sincrono** — `per-i-centri/registrazione.astro`
   chiamava `getUserFromSession()` (ora asincrona) senza `await`: sarebbe rimasto un redirect
   rotto per chi arriva già loggato su quella pagina. Trovato con un grep mirato sull'intero
   `src/`, non solo sui file toccati direttamente, prima di committare.

Verificato con un run Playwright end-to-end completo (browser reale, non solo lettura del
codice): registrazione → redirect area riservata con stato corretto, logout, login (corretto e
con password sbagliata), invio lead su una scheda reale, invio contatto, `/admin` e checkout
Stripe entrambi onestamente "non configurati" in assenza delle rispettive credenziali. Rifatto
identico dopo la migrazione a libSQL, con verifica diretta via query SQL che una singola
richiesta produca una sola scrittura (nessun doppio insert nascosto).

## Deploy su Vercel

1. Crea un database gratuito su [turso.tech](https://turso.tech) e recupera `TURSO_DATABASE_URL`
   e `TURSO_AUTH_TOKEN` (vedi `.env.example` per i comandi esatti della CLI Turso).
2. Su [vercel.com/new](https://vercel.com/new), importa questo repository (serve il tuo account
   GitHub collegato a Vercel — è un passaggio che solo tu puoi fare, non è automatizzabile da
   qui) e seleziona il branch da deployare.
3. Nelle impostazioni del progetto Vercel, imposta le variabili d'ambiente: `TURSO_DATABASE_URL`,
   `TURSO_AUTH_TOKEN`, e opzionalmente `ADMIN_PASSWORD` / le chiavi Stripe.
4. Deploy. Vercel imposta da sé la variabile `VERCEL` in build, quindi l'adapter giusto
   (`@astrojs/vercel`) si attiva automaticamente — non serve toccare `astro.config.mjs`.

Verificato in questa sessione: `astro build` con `VERCEL=1` completa senza errori e produce una
struttura `.vercel/output/` valida (funzione serverless + asset statici). Non verificabile da
qui: il comportamento a runtime della funzione serverless vera e propria (cold start, il
controllo CSRF di Astro sotto il proxy di Vercel) — richiede un account Vercel reale, che questa
sessione non ha. Se dopo il primo deploy le Actions rispondono 403, il problema è quasi
certamente lo stesso Origin-check già risolto per l'adapter Node (vedi bug #1 sopra): aggiungi il
dominio Vercel reale a `security.allowedDomains` in `astro.config.mjs`.

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
- **FAQ visibili, non solo nel markup**: gli articoli `/blog/[slug]` e le guide `/guide/[slug]`
  emettevano `FAQPage` JSON-LD senza mai renderizzare le domande in pagina — un disallineamento
  reale fra dati strutturati e contenuto visibile, contrario alle linee guida sui rich result.
  Corretto aggiungendo l'accordion delle FAQ visibile su entrambi i template.
- **Title e meta description auditati programmaticamente** (script Node su tutto l'HTML di build,
  non lettura a occhio): 0 pagine sopra i limiti di lunghezza, 0 senza H1 univoco, canonical o
  `og:image`, 0 blocchi JSON-LD non parsabili, 0 pagine con `FAQPage` senza FAQ visibili — su
  tutte le 86 pagine statiche generate, incluso il controllo che nessuna data di pubblicazione sia
  nel futuro (aggiunto dopo aver trovato 10 contenuti su 14 datati fino a 27 giorni avanti, poi
  scattato di nuovo — e verificato — su altri 8 contenuti nel resto di questa sessione). Un secondo
  script verifica i link interni: 0 rotti su 85 pagine.
- **Dark mode** completa, persistita, con l'aurora che si ricolora da sola.
- **86 pagine statiche** generate a build time (`npm run build`), zero errori `astro check`.

## Stato e prossimi passi

Fase implementata: architettura, tassonomia, 28 schede mock, 10 keyword di lancio, il piano
editoriale del doc 02 completo (9 guide pilastro, 75 articoli cluster, tutti collegati nelle due
direzioni), tutte le pagine di servizio, filtri funzionanti, SEO tecnica auditata (incluso il fix
delle FAQ invisibili e il controllo sulle date future), backend reale (SQLite + Astro Actions) per
contatti, lead, registrazione, autenticazione e area riservata, pannello admin. Il pilastro 9
(guide città/costi) è deliberatamente diverso dal piano originale: pagina generata dai dati reali
della directory invece di articoli con prezzi scritti a mano — vedi la sezione "Guide pilastro"
sopra per il perché.

Richiede configurazione con le tue credenziali (impossibile fabbricarle in questa sessione — vedi
`.env.example`):

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
