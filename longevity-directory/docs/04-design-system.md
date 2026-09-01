# Design system — direzione "Color Drenching"

Terza direzione visiva del progetto (documentate nella cronologia: "Afterglow" con gradienti
piatti, "spa premium calda" con Bodoni Moda, poi "Aurora / vetro" — multicolore freddo, in
produzione per gran parte dello sviluppo — tutte superate). Questa è la versione **implementata
nel codice** sotto `src/` — token, componenti e regole qui sotto corrispondono esattamente a
`src/styles/global.css` e ai componenti in `src/components/`.

Il cambio da "Aurora / vetro" a "Color Drenching" è stato un ricoloramento sistemico, non una
riscrittura: il meccanismo tecnico (canvas animato, glassmorphism, 8 copertine generate) è
identico. Cambia solo la sorgente cromatica — da una palette fredda multicolore (viola/ciano/
menta/rosa) a un'unica famiglia calda (terracotta/ruggine/ambra), ispirata alla tecnica
d'interior design omonima: un solo colore che avvolge ogni superficie invece di più accenti in
competizione. Tutta la palette è definita in un solo punto (`src/styles/global.css`), quindi il
ricoloramento non ha richiesto di toccare la stragrande maggioranza delle circa 90 pagine.

## 1. Firma visiva in cinque punti

1. **Aurora animata, ora monocromatica.** Stesso canvas a bassa risoluzione con masse di colore
   che derivano lentamente (`src/components/Aurora.astro`, invariato), ma alimentato da cinque
   tonalità della stessa famiglia calda invece che da colori diversi tra loro — è il "drenching":
   una superficie, un colore, non un arcobaleno pastello.
2. **Pannello "drenchato" nelle hero.** Le hero di home, `/per-i-centri` e la banda CTA finale
   hanno la classe `.hero-drench`, che ridefinisce localmente i token di inchiostro/vetro a
   valori scuri e saturi fissi — **indipendenti dal toggle chiaro/scuro del sito**, come il
   pannello fotografico sempre scuro della tecnica di riferimento. Testo crema su fondo ruggine,
   sempre, qualunque sia il tema scelto dal visitatore. Il resto del sito segue il tema normale.
3. **Titoli in Instrument Serif**, alto contrasto, peso 400. Nella hero, la parola d'accento
   ("vicino a te") usa il **corsivo vero** del font (`400-italic.css`, caricato esplicitamente in
   `BaseLayout.astro`) — non un obliquo sintetico del browser, e non un colore diverso dal resto
   del titolo: la differenza è tipografica (romano/corsivo), non cromatica, come nel riferimento.
4. **Vetro smerigliato**: card e barre di navigazione traslucide con `backdrop-filter: blur()`,
   bordo 1px chiaro, ombra ampia e sfumata (ora tinta calda, non più blu-grigio freddo).
5. **Copertine generate via CSS**, non immagini esterne: le stesse 8 combinazioni di gradienti
   radiali (`.cv1`…`.cv8`) di prima, ora nella nuova famiglia terracotta.

## 2. Token (da `src/styles/global.css`)

```css
:root{
  --bg:#FAF3EA; --surface:#FFFCF8; --surface-2:#F3E7D9;
  --glass:rgba(255,250,244,.62); --glass-2:rgba(255,250,244,.86); --brd:rgba(255,250,244,.9);
  --ink:#2A1B13; --ink-soft:#5C4A3C; --muted:#8C7768; --line:#E8D9C6;
  --a1:#F3C9A0; --a2:#E3905E; --a3:#C6592F; --a4:#E3A88A; --a5:#E8B65E; --abase:#F8ECDD;
}
```

Accenti Tailwind (`@theme`): `--color-iris:#C1502E` (terracotta, accento primario — link, CTA,
focus ring), `--color-mint:#6F8F57` (salvia calda — sostituisce il verde-menta freddo mantenendo
lo stesso ruolo semantico: verificato, evidenza solida, approvato), `--color-sky:#D9A441`
(ambra), `--color-rose:#D98E7C` (argilla). La dark mode (classe `.dark`, come prima) ridefinisce
tutti i token di superficie e inchiostro nella stessa famiglia calda ma scura (base `#1B120C`).

### `.hero-drench`

```css
.hero-drench {
  --a1:#6B2E15; --a2:#8C3A18; --a3:#A8451C; --a4:#5C2E24; --a5:#B5641E; --abase:#1B0F09;
  --ink:#FBEEDF; --ink-soft:#E8D2BC; --muted:#C9A98A;
  --glass:rgba(255,240,224,.1); --glass-2:rgba(30,16,9,.42); --brd:rgba(255,235,215,.22);
}
```

Va sempre accompagnata da uno **scrim uniforme** sopra l'Aurora (`background:color-mix(in srgb,
var(--abase) 46%, transparent)`) — non un gradiente solo sul fondo. La prima versione usava un
gradiente lineare che scuriva solo il 65% inferiore del pannello: su `/per-i-centri`, dove il
paragrafo sta più in alto, un frame dell'animazione con un blob chiaro (`--a5`, ambra) sotto il
testo lo rendeva quasi illeggibile — bug reale trovato con screenshot a frame diversi
dell'animazione (non un singolo screenshot), corretto con lo scrim uniforme su tutte e tre le
hero. Vedi §6.

Un elemento con superficie opaca propria dentro `.hero-drench` (es. la barra di ricerca, su
`var(--surface)`) va marcato con `.drench-card`: senza, eredita l'inchiostro crema del pannello
e il suo testo sparisce sulla superficie chiara. `.drench-card` ripristina l'inchiostro del tema
reale della pagina (chiaro o scuro), non quello fisso del pannello — bug reale trovato allo
stesso modo, corretto prima della consegna, vedi §6.

## 3. Tipografia

| Ruolo | Font | Note |
|---|---|---|
| Display (h1/h2/h3) | **Instrument Serif** | `font-weight:400`, `letter-spacing:-.015em`, `line-height:1.04` |
| UI e corpo | **Manrope** (variabile) | corpo 16px/1.65 |
| Etichette | Manrope 700, 10.5–11px | maiuscolo, `letter-spacing:.16-.18em` |
| Numeri (prezzi, statistiche) | `font-variant-numeric: tabular-nums` | sempre, ovunque le cifre siano in colonna |

## 4. Componenti chiave (mappati sul codice)

- **Aurora** (`Aurora.astro`): usata nell'hero della home, nella banda CTA finale e nell'hero
  di `/per-i-centri`. Non va mai messa come sfondo diretto di un elemento con `class="reveal"`
  — l'abbiamo fatto una volta e la sezione restava invisibile finché l'`IntersectionObserver`
  non scattava (bug reale, corretto: vedi §6).
- **BusinessCard** (`BusinessCard.astro`): copertina generata o foto, badge di stato
  (Verificata / In evidenza / Non rivendicata), 3 tag, prezzo "da € X" su un filetto separatore.
  Espone `data-*` per il filtro client-side quando `filterable`.
- **DirectoryApp** (`DirectoryApp.astro`): barra filtri sticky in vetro + griglia risultati,
  interamente filtrata via JavaScript su attributi `data-*` (nessuna richiesta di rete). Vedi
  doc 01 §4 per l'elenco completo dei filtri implementati.
- **CategoryBento** (`CategoryBento.astro`): griglia **uniforme** a 1/2/3 colonne. Una prima
  versione usava `col-span`/`row-span` misti per un bento asimmetrico: produceva un bug reale
  di auto-placement in CSS Grid (riquadri sovrapposti, altri mai renderizzati nel flusso —
  verificato con screenshot automatici, non a occhio). La griglia uniforme è deliberatamente
  meno "instagrammabile" ma robusta.

## 5. Movimento

- Aurora: derive continua, disattivata sotto `prefers-reduced-motion`.
- `.reveal`: opacity+translateY che si risolve quando l'elemento entra in viewport
  (`IntersectionObserver`, soglia 0.18) **con una rete di sicurezza**: dopo 2,5s ogni `.reveal`
  ancora nascosto viene comunque mostrato, per non lasciare mai una sezione invisibile a chi non
  scorre la pagina o su viewport/embed particolari. Vedi `BaseLayout.astro`.
- Contatori numerici: count-up con easing cubico su `requestAnimationFrame`, innescato dallo
  stesso `IntersectionObserver`.

## 6. Bug reali trovati e corretti in fase di implementazione

Per trasparenza sul processo (utile se si riparte da questo codice):

1. **Aurora grigia invece che iridescente**: i gradienti del canvas sfumavano verso
   `transparent`, che in un contesto RGB solido vira al nero — risultato lavato e spento.
   Corretto sfumando in alpha sullo stesso colore (`rgba(r,g,b,0→1)`).
   Vedi `Aurora.astro`.
2. **Sezione CTA invisibile**: il wrapper della banda finale aveva sia `class="reveal"`
   (opacity:0 iniziale) sia `<Aurora />` come figlio diretto — la sezione restava invisibile
   finché l'utente non ci scorreva sopra abbastanza a lungo da far scattare l'observer.
   Corretto rimuovendo `.reveal` dai contenitori strutturali grandi (l'animazione va sui singoli
   contenuti, non sulle bande con sfondo).
3. **Bento delle categorie rotto**: `col-span-2 row-span-2` misti su una griglia con
   `auto-rows` impliciti causavano sovrapposizioni e riquadri "persi" fuori dal flusso visibile
   (7 su 9 non intersecavano mai il viewport). Sostituito con la griglia uniforme di §4.
4. **Dot "Evidenza solida" invisibile ovunque nel blog**: `src/lib/evidence.ts` impostava
   `dot: "var(--mint)"`, ma il token si è sempre chiamato `--color-mint` — `--mint` non è mai
   stato definito. Il pallino colorato del badge di evidenza più usato del sito è stato
   `background: <valore non valido>` (quindi trasparente) fin dalla sua introduzione. Trovato
   controllando *perché* il "verde" del badge non compariva negli screenshot del ricoloramento,
   non cercandolo apposta. Corretto in `evidence.ts`.
5. **Focus ring sempre viola, indipendentemente dall'accento del tema**: `:focus-visible` usava
   `outline: 2px solid var(--iris, #6462E8)` — anche qui `--iris` non è mai esistito come token
   (solo `--color-iris`), quindi l'outline cadeva sempre sul valore di fallback hardcoded. Con la
   vecchia palette il fallback *coincideva* con l'accento reale, mascherando il bug; è emerso
   ricolorando `--color-iris` in terracotta e vedendo il focus ring restare viola. Corretto a
   `outline: 2px solid var(--color-iris)`.
6. **Corsivo mai realmente caricato**: il titolo della hero applicava `class="italic not-italic"`
   — le due classi Tailwind si annullano a vicenda. Il motivo, ricostruito dal codice: il
   pacchetto `@fontsource/instrument-serif` importava solo il peso 400 romano, mai il file
   `400-italic.css`; applicare `italic` avrebbe quindi prodotto un obliquo sintetico del
   browser (bruttissimo su un serif di questo tipo), e qualcuno aveva annullato l'effetto con
   `not-italic` senza rimuovere `italic`. Corretto importando il file italico reale in
   `BaseLayout.astro` e usando `class="italic"` da solo.
7. **Testo del campo di ricerca invisibile sul pannello scuro**: la barra di ricerca sta su
   `var(--surface)` (chiara) dentro l'hero `.hero-drench` (inchiostro forzato a crema): il testo,
   ereditando l'inchiostro del pannello, diventava crema su una superficie quasi bianca —
   trovato nello screenshot di verifica, non prevedibile leggendo il solo markup (nessun errore
   di build o di tipo lo segnala). Corretto con la classe `.drench-card` (§2).
8. **Freccia del bottone di ricerca invisibile dopo la correzione precedente**: fissando il bug
   #7 con `.drench-card`, il bottone `<button>` dentro quella stessa card ereditava a sua volta
   l'inchiostro "normale" invece di quello crema pensato per lui, collassando bordo e icona sullo
   stesso scuro. Corretto dando al bottone un colore fisso indipendente da entrambi gli scope
   (`background:var(--color-iris);color:#fff`) invece di far leva sull'ereditarietà.
9. **Testo illeggibile su `/per-i-centri` in certi frame dell'animazione**: la hero di
   `/per-i-centri` non aveva nessuno scrim scuro sopra l'Aurora (solo la home ne aveva uno, e
   solo sul 65% inferiore del pannello). Con l'Aurora libera di animarsi, un frame con un blob
   chiaro (ambra, `--a5`) sotto il paragrafo lo rendeva quasi invisibile. Trovato caricando la
   pagina più volte e confrontando screenshot a frame diversi, non con un singolo screenshot —
   un bug di questo tipo è intermittente per definizione. Corretto sostituendo il gradiente
   parziale con uno scrim uniforme su tutta l'area, su tutte e tre le hero (§2).

Tutti e nove sono stati trovati con screenshot reali via Playwright — gli ultimi cinque durante
il ricoloramento "Color Drenching", verificando esplicitamente sia il tema chiaro sia quello
scuro sia più frame dell'animazione, non un solo screenshot statico.

## 7. Accessibilità

Contrasto minimo 4.5:1 sul testo: i colori dell'aurora e delle copertine sono sempre sfondo,
mai testo (il testo resta `--ink` / `--ink-soft`, o l'inchiostro crema di `.hero-drench` dentro
le hero). Focus visibile (`outline: 2px solid var(--color-iris)`). Aree touch dei bottoni ≥ 44px.
`prefers-reduced-motion` disattiva aurora, count-up e transizioni.

Nota su `.hero-drench`: essendo un pannello a inchiostro fisso indipendente dal tema, il
contrasto testo/sfondo lì non si verifica con gli stessi strumenti usati per il resto del sito
(un controllo DOM `background-color` non "vede" lo sfondo dipinto dal canvas Aurora — dà falsi
allarmi). Va verificato con screenshot reali a più frame dell'animazione e in entrambi i temi,
come fatto per i bug #7-9.
