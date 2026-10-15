# Screenshade — Movie Sunglasses Directory & Affiliate Platform

Directory premium (mercato USA, inglese americano, prezzi in USD) degli occhiali da sole indossati nei film e nelle serie TV:
ricerca con autocomplete, identificazione **graduata dalle prove**, comparatore prezzi, alternative per budget, sezione vintage, blog SEO,
pannello amministrativo in italiano e tracciamento dei clic affiliati.

> Concept: **"Find the Sunglasses Behind the Screen."**

Stack: Next.js 15 (App Router, SSR/ISR) · TypeScript · Tailwind CSS 4 · PostgreSQL/Supabase (opzionale in sviluppo) · Vercel.

---

## 1. Avvio rapido (sviluppo)

```bash
cd movie-sunglasses
npm install
cp .env.example .env.local   # poi imposta almeno: SESSION_SECRET (npm run admin:secret), ADMIN_EMAIL e, solo in sviluppo, ADMIN_PASSWORD
npm run dev          # http://localhost:3000
npm test             # 36 test (prove, auth, CSV, claims, integrità del seed, titoli/description SEO)
npm run build && npm start
```

Admin: <http://localhost:3000/admin> — in sviluppo funziona senza database: i dati stanno nei seed (`src/data/*`) e le modifiche vengono scritte in `.data/store.json`.

---

## 2. Cosa è completato e cosa richiede altro

### ✅ Funziona ed è stato testato (build di produzione + test end-to-end con browser)
| Area | Dettaglio |
|---|---|
| Sito pubblico | Home (hero, ricerca, Trending, Iconic Looks, Popular Actors, Shop by Movie/Style, Affordable Alternatives, Vintage & Rare, Latest Guides, Featured Brands), film, attori, catalogo, marchi, stili, alternative, vintage, blog, ricerca, pagine legali, About/metodologia, Contact |
| Ricerca | Autocomplete accessibile (combobox ARIA, tastiera), ricerche recenti, palette globale con `/` o Ctrl/⌘+K, API `/api/search`, pagina `/search` |
| Interattività | Filtri che aggiornano i risultati mentre si cambiano (e restano URL condivisibili, anche senza JavaScript), salvataggio dei modelli (cuore) e **confronto fino a 3 modelli** con differenze evidenziate (`/compare`, `/saved`; dati solo nel browser), barra di confronto flottante, indice dei contenuti e barra di lettura negli articoli, pulsante Condividi, barra sticky nelle schede, hero che segue il puntatore (disattivato con touch e `prefers-reduced-motion`), skeleton di caricamento |
| Filtri | Film, attore, marchio, forma, colore, prezzo, evidenza, stato, tipo, ordinamento — URL condivisibili, funzionano anche senza JavaScript |
| Schede prodotto | Specifiche, apparizioni, fonti con data e contestazioni, alternative per fascia, articoli correlati, comparatore |
| Etichette | Exact Match / Official Reissue / Similar Style / Unconfirmed **calcolate** (`src/lib/evidence.ts`): una proposta "Exact" decade a "Unconfirmed" se nessuna fonte forte la sostiene o se una fonte la contesta |
| Comparatore | Tabella offerte (negozio, prezzo, disponibilità, spedizione, ultimo aggiornamento, *View Deal*). **Senza offerte inserite non appare nessun prezzo**: solo link di ricerca eBay/Google Shopping, senza prezzo |
| Tracciamento | `/go` (redirect affiliato server-side, destinazione solo da database → no open redirect), click log senza IP, contatori viste aggregati senza cookie, attribuzione ai guide letti |
| Admin | Login sicuro, CRUD per 16 entità, controllo integrità (riferimenti, URL https, slug unici, redirect 301 automatico al cambio slug, blocco eliminazione se in uso), statistiche con ricavi **reali** e **stimati** separati |
| Editoriale | Import CSV keyword (Semrush/Ahrefs/Keyword Planner), raggruppamento in cluster, creazione brief, meta suggeriti, link interni suggeriti, collegamento prodotti, controllo affermazioni non verificate, flusso bozza → revisione → programmazione → pubblicazione (bloccato senza revisione umana e fonti) |
| SEO | SSR/ISR, URL descrittivi, title ≤ 60 e description ≤ 155 su tutte le pagine, FAQ guidate dai dati, canonical, breadcrumb + JSON-LD (WebSite, Organization, BreadcrumbList, Product, Movie/TVSeries, Person, Brand, Article, FAQPage, ItemList), immagini Open Graph, sitemap dinamica, robots, filtri e pagine sottili `noindex`, predisposizione hreflang, redirect gestiti, **audit SEO e generatore di keyword candidate nell'admin** (vedi `docs/SEO-STRATEGY.md`) |
| Prestazioni | Font locali con fallback a metriche compatibili (CLS 0), solo il font di display in precaricamento, CSS inline, cookie banner/palette/barra di confronto caricati a browser inattivo (con replay delle richieste anticipate), indici in memoria sul catalogo condiviso tra richieste (si ricostruisce solo se i dati cambiano), cache CDN sulle pagine di elenco, `error.tsx`/`global-error.tsx` |
| Legale/UX | Privacy, Cookie, Terms, Affiliate Disclosure, About; banner consenso (analytics GA4 solo dopo consenso); skip-link, focus visibile, `prefers-reduced-motion`, ARIA |
| Sicurezza | Cookie di sessione HMAC `HttpOnly; SameSite=Strict; Secure`, scrypt, rate-limit login/ricerca/contatti/tracking, header di sicurezza, middleware + `requireAdmin()` in ogni azione, sanitizzazione markdown (niente HTML grezzo) |

### 🔑 Richiede credenziali o servizi esterni (codice pronto, **non verificato contro servizi reali**)
| Funzione | Cosa serve |
|---|---|
| Persistenza in produzione | Progetto **Supabase**: esegui `supabase/schema.sql`, poi `npm run db:seed`, imposta `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`. Il driver (`src/lib/store/supabase.ts`) è scritto ma **non è stato provato** su un progetto reale |
| Bozze AI | `AI_API_KEY` (+ `AI_PROVIDER=anthropic|openai`, `AI_MODEL`, `AI_BASE_URL`). Chiamata implementata, mai eseguita qui (nessuna chiave) |
| Prezzi reali | Programmi affiliati approvati (eBay Partner Network, Ray-Ban/altri via rete): inserisci offerte in Admin → Offerte, oppure **importa un CSV/feed** in Admin → Importa offerte (verifica a secco, tutto o niente, https e USD obbligatori). Il collegamento automatico a API/feed in tempo reale **non è implementato** |
| Analytics | `NEXT_PUBLIC_GA_ID` (caricato solo dopo consenso) |
| Foto autorizzate | File su Supabase Storage + record in Admin → Fotografie (licenza obbligatoria). Nessuna foto di film è inclusa |
| Volumi SEO | Export CSV da Semrush/Ahrefs/Keyword Planner → Admin → Keyword & cluster |

### ⏳ Non implementato (onestamente)
- Supabase Auth (l'admin usa credenziali singole via variabili d'ambiente; vedi §7).
- Upload diretto di immagini dal pannello (si incolla l'URL).
- Import automatico e programmato di offerte da API affiliate (esiste solo l'import manuale da CSV) e controllo periodico di prezzi/disponibilità.
- Traduzioni/routing multilingua (c'è solo la predisposizione `hreflang` in `src/lib/site.ts` e `src/lib/seo.ts`).
- Rate-limit distribuito (ora in memoria per istanza), invio email dei messaggi di contatto (vengono salvati e visibili in admin).
- Pubblicità: `<AdSlot>` esiste ma è disattivato (`NEXT_PUBLIC_ADS_ENABLED=true` per mostrare i segnaposto).
- Analisi competitor diretta: i due siti non erano raggiungibili da qui (vedi `docs/COMPETITORS.md`).

---

## 3. Contenuti iniziali e loro affidabilità

- **18 titoli**, **31 modelli** (21 visti sullo schermo + 10 alternative), **21 attori**, **19 marchi**, **31 identificazioni**, **49 citazioni di fonti**, **33 coppie originale→alternativa**, **20 articoli** (8 sviluppati, 12 brief).
- I fatti derivano da una ricerca web del **2026-10-15** e da fonti **quasi solo secondarie** (rivenditori, database di appassionati, stampa). **Nessuna fonte primaria** (studio, costumista, casa d'aste) è stata consultata.
- Per questo molte identificazioni risultano *Unconfirmed* per regola (es. tutte quelle di James Bond: una sola fonte fan; F1: fonti contrastanti; Taxi Driver: Ray-Ban vs American Optical).
- Tutti i record sono marcati "in attesa di revisione editoriale" (avviso visibile finché `NEXT_PUBLIC_SHOW_UNREVIEWED_NOTICE` ≠ `false`). **Rivedi ogni scheda prima del lancio.**
- Le fasce di prezzo ("Under $50", ecc.) sono **stime editoriali** mostrate come "(est.)": non sono prezzi. Verificale con i negozi.
- Nessun prezzo, offerta o disponibilità è inventato: `seed.offers` è vuoto (test automatico).
- Immagini: nessuna. Le illustrazioni SVG sono generate da forma/colori registrati, dichiarate come tali nella pagina.

Piano editoriale e brief: `docs/EDITORIAL-PLAN.md`.

---

## 4. Architettura

```
src/
  app/
    (site)/            sito pubblico (layout con header/footer/consenso)
    (admin)/admin/     pannello (login + (panel): dashboard, statistiche, CRUD, editor articoli, keyword)
    api/search, api/track, go/, sitemap.ts, robots.ts
  components/          UI (cards, glasses SVG, search-box, price-table, filtri, admin/entity-form…)
  lib/
    types.ts           modello dati (Movie, Actor, Character, Brand, SunglassesModel, MovieAppearance,
                       IdentificationEvidence(Evidence), ProductAlternative, Merchant, AffiliateOffer, Article, Keyword…)
    store/             driver file (dev) e Supabase (prod) dietro la stessa interfaccia listAll/upsert/remove
    catalog.ts         join in memoria + regole (etichetta effettiva, fascia prezzo, offerte)
    evidence.ts        regole delle etichette · search.ts · filter.ts · seo.ts
    admin/             configurazione entità, validazione/salvataggio, statistiche
    ai.ts, claims.ts, editorial.ts, keywords.ts   strumenti editoriali
  data/                seed (film, attori, modelli, apparizioni, fonti, alternative, articoli)
supabase/schema.sql    schema relazionale con vincoli, indici e RLS
tests/core.test.ts     test unitari
```

Relazioni: un modello può apparire in più film e un film può avere più modelli tramite `movie_appearances` (modello↔film↔attore↔personaggio), a cui si agganciano le prove `identification_evidence`.

### Regola delle etichette
`exact` / `official_reissue` restano tali solo se **nessuna** fonte contesta e c'è **almeno una** fonte primaria/marchio/stampa/riferimento **oppure due** domini indipendenti. Altrimenti si mostra *Unconfirmed* con la motivazione. Un modello senza apparizioni è un'alternativa (*Similar Style*).

### Sitemap del sito
`/` · `/movies` `/movies/[slug]` · `/actors` `/actors/[slug]` · `/sunglasses` `/sunglasses/[slug]` · `/brands` `/brands/[slug]` · `/styles` `/styles/[slug]` (aviator, wayfarer, cat-eye, rectangular, oval, vintage, futuristic) · `/affordable-alternatives` · `/vintage` · `/blog` `/blog/[slug]` · `/search` · `/about` `/contact` `/privacy-policy` `/cookie-policy` `/terms` `/affiliate-disclosure` · `/sitemap.xml` `/robots.txt` · `/admin/*` (noindex).

### Design system
Palette: bianco caldo `#faf9f6`, grafite `#121316/#1f2024`, grigi, accento champagne `#c9aa71` (testo `#7a6133` per contrasto). Tipografia: Cormorant Garamond (display) + Inter Variable, entrambi auto-ospitati via `@fontsource` (nessuna richiesta a Google Fonts → più veloce e GDPR-friendly). Animazioni: reveal allo scroll, marquee, float, hover; tutte disattivate con `prefers-reduced-motion`.

---

## 5. Guida rapida all'admin (senza codice)

1. **Accedi** a `/admin`.
2. **Aggiungere un film con occhiali**: *Film e serie* → Nuovo; *Attori*; *Personaggi* (film+attore); *Occhiali (modelli)*; *Identificazioni* (collega modello↔film↔personaggio e scegli l'etichetta proposta); *Prove e fonti* (aggiungi almeno una fonte forte, oppure due indipendenti; usa «Contesta» per le fonti discordanti).
3. **Prezzi**: *Negozi* (parametri affiliato dopo l'approvazione) → *Offerte e prezzi*: inserisci solo prezzi verificati. Compaiono subito nel comparatore e nel JSON-LD.
4. **Articoli**: *Keyword & cluster* → importa CSV → Raggruppa → "Crea brief". In *Articoli SEO* apri il brief: collega modelli/film, usa "Genera bozza" (se l'AI è configurata), controlla il pannello "informazioni non verificate", applica meta e link suggeriti, spunta **Revisione umana completata** e poi pubblica o programma.
5. **Statistiche e ricavi**: i ricavi *reali* si inseriscono da report affiliati (Ricavi); quelli *stimati* sono clic × EPC e restano separati.

Cambiare uno slug crea un redirect 301 automatico. Un elemento in uso non può essere eliminato.

---

## 6. Monetizzazione e tracciamento

- Link in uscita sempre tramite `/go?m=<negozio>&model=<modello>[&o=<offerta>]` con `rel="sponsored nofollow noopener"`; i parametri affiliato del negozio vengono aggiunti lato server.
- Click log: ora, negozio, modello, offerta, pagina di provenienza (o guide letto). **Nessun IP/identificatore.**
- CTR = clic ÷ viste delle schede modello. "Visite organiche" da Google: usa Search Console/GA4 (le viste interne sono contatori aggregati, non analytics SEO).
- Separazione **reale/stimato** garantita dal modello dati (`revenue_entries.kind`) e dalla UI.
- Spazi pubblicitari/sponsorizzazioni: `AdSlot` pronto, disattivato.

---

## 7. Sicurezza

- Admin: `SESSION_SECRET` (≥ 32 caratteri), `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (scrypt; genera con `npm run admin:hash -- "password-lunga"`). In produzione `ADMIN_PASSWORD` in chiaro è **ignorata**.
- Sessione 8 ore, cookie `HttpOnly; SameSite=Strict; Secure; path=/admin`; 5 tentativi falliti / 15 minuti per IP.
- Server Actions con controllo Origin integrato di Next.js; ogni azione richiama `requireAdmin()`.
- API pubbliche con rate-limit (in memoria: per limiti globali usa Upstash/Vercel KV).
- Supabase: RLS attivo senza policy pubbliche; la service-role key resta solo lato server.
- Header: HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP e una **Content-Security-Policy** moderata (solo risorse dello stesso dominio più Google Tag Manager/Analytics; blocca frame, `object`, `form-action` esterni e `base` alterato). Resta `'unsafe-inline'` per gli script/stili di avvio di Next: una CSP con nonce renderebbe dinamiche tutte le pagine e farebbe perdere l'ISR.
- Per un team o 2FA, sostituisci `src/lib/auth*.ts` con Supabase Auth (non implementato).

---

## 8. Deploy (Vercel + Supabase)

1. **Supabase**: nuovo progetto → SQL editor → incolla `supabase/schema.sql`. Crea un bucket pubblico `photos` (Storage).
2. **Seed**: in locale con `.env.local` che contiene `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` → `npm run db:seed`.
3. **Vercel**: importa il repo, imposta *Root Directory* = `movie-sunglasses`. Variabili d'ambiente (vedi `.env.example`): `NEXT_PUBLIC_SITE_URL` (dominio reale), `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, opzionali `AI_*`, `NEXT_PUBLIC_GA_ID`.
4. **Dopo il deploy**: invia `https://<dominio>/sitemap.xml` a Google Search Console; completa i segnaposto in Privacy/Terms (`[Operator legal name]…`) con un legale; imposta `NEXT_PUBLIC_SHOW_UNREVIEWED_NOTICE=false` solo dopo la revisione editoriale.
5. **Senza Supabase su Vercel** il file system è in sola lettura: l'admin mostra un avviso e le modifiche non vengono salvate.

Nota: con Supabase le pagine pubbliche sono ISR (5–10 minuti) e si rigenerano subito dopo ogni salvataggio da admin (`revalidatePath`).

### Passi di lancio consigliati
1. Revisione umana di tutte le schede e fonti (idealmente cercare fonti primarie).
2. Verifica volumi/SERP degli articoli (Semrush/Ahrefs).
3. Iscrizione ai programmi affiliati e inserimento delle prime offerte verificate.
4. Foto autorizzate (o accordo con i marchi).
5. Rivedere i testi legali con un professionista.

---

## 9. Verifiche eseguite

- `npm run build` (produzione) senza errori; `tsc --noEmit` pulito.
- `npm test`: 36 test — regole delle prove, integrità referenziale del seed, nessun prezzo inventato, ricerca, parser CSV, clustering, controllo affermazioni, link interni, token di sessione.
- Test end-to-end con Chromium su build di produzione: autocomplete con tastiera, filtri/canonical/noindex, comparatore con offerta reale + JSON-LD `AggregateOffer`, redirect `/go` (e rifiuto di destinazioni arbitrarie), login corretto/errato e attributi del cookie, rifiuto URL non-https, blocco pubblicazione senza revisione, redirect automatico al cambio slug, blocco eliminazione di record in uso, import CSV + cluster, statistiche reali/stimate, pannello AI disattivato senza chiave.
- Lighthouse (mobile, throttling simulato, build locale): Accessibility 100, Best Practices 100, SEO 100, Performance 87–98 a seconda della pagina e della corsa, CLS 0. L'LCP *misurato* in locale è ~0,2 s; i 2,5–3,5 s del punteggio sono la simulazione di rete lenta. Va ripetuto sul dominio reale (PageSpeed/CrUX).
- Suite e2e nel repo: `tests/e2e` (vedi il README lì).
- Carico locale (10 richieste parallele, 4 core): pagine statiche/ISR 30–45 ms; ogni pagina dinamica costa 13–22 ms a richiesta singola. Le pagine di elenco con filtri sono cacheabili dal CDN per 2 minuti (`s-maxage=120`).
- Non eseguito: audit axe completo, test con Supabase reale, chiamate reali all'API AI, test su dispositivi fisici.
