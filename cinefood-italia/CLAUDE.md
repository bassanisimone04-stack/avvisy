# CineFood Italia — CLAUDE.md

Guida ai ristoranti, bar, caffè e trattorie d'Italia apparsi al cinema
e in TV. Directory bilingue (italiano/inglese), sito statico Astro,
deploy su Vercel. Repo: `bassanisimone04-stack/avvisy`, cartella
`cinefood-italia`.

## Regola più importante: niente contenuti inventati

Questo è un sito che afferma fatti verificabili (un locale reale è
apparso in un film/serie reale). **Non pubblicare mai un abbinamento
film-locale senza una fonte verificabile.** Meglio scartare un'idea
buona ma non verificata che pubblicare un'informazione falsa.

**Fonti accettate (in ordine di forza):**
1. Sito ufficiale del locale (una pagina dedicata al legame col film).
2. Film commission regionale (es. Italy for Movies, FCTP, FCRC) o
   materiali ufficiali di produzione (pagina ufficiale di un episodio,
   press kit).
3. Stampa nazionale riconosciuta: Corriere, Repubblica, La Stampa,
   ANSA, Il Sole 24 Ore, Variety, o testate di settore equivalenti
   (food journalism serio, non blog/aggregatori).

**Fonti NON accettate da sole:**
- Siti della rete "Today"/CityNews (torinotoday.it, napolitoday.it,
  ecc.) — solo se corroborati da una fonte di primo livello.
- Forum/aggregatori crowd-sourced (es. Davinotti) senza altra conferma.
- Blog di viaggio/fan generici senza fonte primaria citata.
- Wikipedia da sola (usarla come indizio, non come fonte finale).

**Altre regole non negoziabili:**
- Se due fonti si contraddicono sullo stesso abbinamento, **scarta**
  l'abbinamento finché non trovi una conferma che risolve il
  conflitto.
- **Mai pubblicare un locale chiuso** come se fosse ancora attivo.
  Un locale storicamente rilevante ma chiuso può restare pubblicato
  con `stato: "chiuso"` (es. Café de Paris, Via Veneto), mai rimosso
  silenziosamente se ha valore storico documentato.
- **Mai usare locandine o foto di scena coperte da copyright.** Le
  immagini di film/locali sono sfondi astratti generati (gradiente +
  blur), non screenshot o poster reali.
- Ogni file `.md` di film/locale deve avere un commento HTML interno
  (`<!-- ... -->`) che riporta la fonte esatta e, quando possibile, la
  citazione testuale usata per verificare il fatto. Se il dominio
  della fonte non è raggiungibile per verifica diretta durante la
  sessione, scrivilo esplicitamente nel commento ("confermato solo via
  snippet di ricerca — verificare a mano").
- Quando le fonti disponibili non bastano (nessuna fonte primaria,
  solo aggregatori), è corretto **non pubblicare** e dirlo
  esplicitamente, anche se questo significa non raggiungere un numero
  di contenuti richiesto.

## Stack tecnico

- **Astro 5** + TypeScript, **Tailwind 4**, immagini ottimizzate con
  `sharp`. Deploy statico su Vercel.
- **Content Collections** definite in `src/content.config.ts`:
  `films`, `restaurants`, `blog`. Lo schema Zod lì dentro è la fonte
  di verità per ogni campo — controllalo prima di aggiungere contenuti,
  non fidarti a memoria di questo file.
- **i18n manuale**: italiano alla root (`/`), inglese sotto `/en/`.
  Le traduzioni EN di film e ristoranti (titolo, sinossi, FAQ,
  descrizione, scena) vivono in `src/i18n/content-en.ts`
  (`filmsEn`, `restaurantsEn`), indicizzate per slug. Gli articoli di
  blog EN sono invece file separati con suffisso `-en.md` e
  `lang: "en"` nel frontmatter.
- **Configurazione centrale** del sito (nome, descrizione, social,
  link di affiliazione Booking.com/GetYourGuide, link Payhip della
  guida PDF) in `src/config/site.ts`. Non duplicare questi valori
  altrove.

## Struttura dei contenuti

- `src/content/films/*.md` — un file per film/serie. Campi chiave:
  `titolo`, `anno`, `regista` (accetta anche "creatore"/host per serie
  o show non-fiction), `serieTv`, `sinossi`, `locandina`, `citta[]`
  (deve combaciare con la `citta` di almeno un ristorante collegato,
  altrimenti il link città generato nella pagina film è rotto),
  `faq[]` (minimo 2-3, in italiano anche per lo show in lingua
  originale).
- `src/content/restaurants/*.md` — un file per locale. Campi chiave:
  `nome`, `citta`, `regione`, `indirizzo`, `coordinate`, `tipo`
  (ristorante/trattoria/bar/caffè/pasticceria/pizzeria), `categoria`
  (`set-reale` = location reale in cui si è girato davvero, `legato-al-film` = locale reale NON girato nel film (vicino al set o legato al
  fenomeno raccontato): va dichiarato tale nella scheda e negli articoli;
  `a-tema-cinema` = locale a tema cinema senza essere una vera location), `prezzo`,
  `stato` (aperto/chiuso/temporaneamente-chiuso), `film[]` (array,
  può avere più voci se lo stesso locale appare in più film — vedi
  Del Cambio o Caffè San Marco), `descrizione`.
- `src/content/blog/*.md` — articoli. Campi chiave: `titolo`,
  `descrizione`, `dataPubblicazione`, `faq[]`, `tags[]`, `bozza`
  (mai lasciare `true` un articolo pronto), `lang` (`"en"` solo per
  la variante inglese), più `prenotazioni[]`/`esperienze[]` opzionali
  per i box di affiliazione.

## SEO tecnica: URL senza slash finale, sempre

Il sito usa `trailingSlash: "never"` + `build: { format: "file" }` in
`astro.config.mjs`: ogni pagina ha **una sola URL reale, senza slash
finale** (es. `/blog/slug`, mai `/blog/slug/`), coerente con come sono
scritti tutti i link interni nel codice. Questo evita redirect inutili
e le varianti slash/no-slash indicizzate come pagine separate in
Search Console (causa reale di un problema di "duplicata: canonical
diversa" già osservato).

**Attenzione**: con `build.format: "file"`, `Astro.url.pathname`
espone il pathname CON l'estensione `.html` (es. `/blog/slug.html`)
durante il build statico. Non usarlo mai direttamente per costruire
canonical, hreflang o confronti di percorso — passalo sempre prima
per `cleanPathname()` (`src/i18n/ui.ts`), che rimuove `.html` e slash
finale. È già usato in `SEO.astro`, `LanguageSwitcher.astro` e
`Header.astro`; usalo in qualsiasi nuovo componente che legge
`Astro.url`.

Non è presente (e non serve) un redirect automatico basato sulla
lingua del browser: fu rimosso perché Google sconsiglia esplicitamente
i redirect basati su `navigator.language`/`Accept-Language`, che
possono portare Googlebot lontano dalla pagina che sta cercando di
indicizzare. La scelta della lingua resta manuale (bandiere in header).

## Checklist SEO per ogni articolo di blog

- `titolo`: lunghezza + 18 caratteri ≤ 70 (spazio per il suffisso del
  sito nel tag `<title>`).
- `descrizione` (meta description): tra 70 e 160 caratteri.
- Almeno 3 domande in `faq[]`.
- Corpo dell'articolo: almeno 200 parole.
- Almeno 2-3 link interni reali ad altri contenuti del sito (mai
  inventati: verifica che lo slug collegato esista davvero).
- Title/description più efficaci quando includono un numero, un
  dettaglio concreto o un elemento di curiosità ("solo 2 pizze dal
  1870", "4 città vere") invece di formule generiche — utile in
  particolare per le pagine con più impressioni ma CTR basso in
  Search Console.

## Attenzione ai contenuti duplicati/sovrapposti

Il blog ha già diversi articoli "roundup" (liste per città, per tema,
per regione). **Prima di creare un nuovo articolo generico** (lista,
guida città, weekend itinerario), controlla se esiste già qualcosa di
simile (`grep` sui titoli in `src/content/blog/`): sovrapporre due
articoli quasi identici crea cannibalizzazione e problemi di
"duplicate canonical" in Search Console. Se un contenuto nuovo si
inserisce meglio in un hub già esistente, **aggiungi una sezione lì**
invece di pubblicare un articolo a parte.

## Manutenzione ricorrente (fai questi controlli prima di ogni pubblicazione)

1. **Cache**: prima di `astro check`/`npm run build`, pulisci
   `.astro`, `node_modules/.astro` e `dist` se il container è stato
   riavviato di recente.
2. **Type/content check**: `npx astro check` deve dare 0 errori.
3. **Build**: `npm run build` deve completare senza errori.
4. **Link rotti**: esiste uno script di controllo link salvato in
   `/tmp/check-links.mjs` (rigenera lo script se manca — deve
   costruire l'elenco delle route dai file `.html` generati in
   `dist/`, es. `dist/blog/slug.html` → `/blog/slug`, dato che il
   sito usa `build.format: "file"`, non cartelle con `index.html`).
   Un sito pulito deve dare **0 link rotti**: non ci sono più falsi
   positivi noti da quando esiste anche `src/pages/en/404.astro`.
5. **Coerenza EN**: ogni film/ristorante deve avere una voce
   corrispondente in `filmsEn`/`restaurantsEn` dentro
   `src/i18n/content-en.ts`. Controllo rapido: confronta gli slug dei
   file in `src/content/films`/`restaurants` con le chiavi presenti
   nel file di traduzione.
6. **Locali orfani**: ogni ristorante con `categoria: "set-reale"`
   dovrebbe essere linkato da almeno un articolo di blog
   (`/locale/<slug>`). Un ristorante `a-tema-cinema` può restare senza
   articolo dedicato, è normale.

## Workflow Git

Si lavora sul branch `claude/cinefood-italia-directory-43xd81`, poi si
sincronizza `main`:

```
git add -A && git commit -m "..."
git push -u origin claude/cinefood-italia-directory-43xd81
git fetch origin main
git checkout main
git merge origin/main --no-edit
git merge claude/cinefood-italia-directory-43xd81 --no-edit
git push origin main
git checkout claude/cinefood-italia-directory-43xd81
```

Non forzare push, non saltare i controlli di build prima del merge su
`main`.

## Immagini

- Locandine film: 800×1200, sfondo a gradiente radiale astratto +
  blur, generato con `sharp` via script inline (`node -e "..."`),
  salvato in `src/assets/films/<slug>.jpg`.
- Placeholder locali: 1200×800, stesso trattamento, in
  `src/assets/placeholder/<slug>.jpg`.
- Mai usare foto stock di piatti/locali non verificate come reali, né
  immagini di scena protette da copyright.

## Tono editoriale

Testi in italiano naturale, diretto, senza riempitivi da SEO
aggressivo. I titoli devono restare veritieri rispetto al contenuto:
niente clickbait che promette più di quanto l'articolo mantenga.
