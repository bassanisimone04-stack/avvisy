# Design system — direzione "Aurora / vetro"

Direzione scelta dopo alcune iterazioni (documentate nella cronologia del progetto: una prima
versione "Afterglow" con gradienti piatti, una seconda "spa premium calda" con Bodoni Moda e
palette sabbia, entrambe superate). Questa è la versione **implementata nel codice** sotto
`src/` — token, componenti e regole qui sotto corrispondono esattamente a
`src/styles/global.css` e ai componenti in `src/components/`.

## 1. Firma visiva in cinque punti

1. **Aurora animata, non gradienti piatti.** Gli sfondi delle sezioni chiave sono un canvas a
   bassa risoluzione con masse di colore che derivano lentamente (turbolenza semplice, non un
   `<canvas>` costoso), ingrandito e sfocato via CSS. Si ricolora da sola al cambio tema.
   Implementazione: `src/components/Aurora.astro`.
2. **Titoli in Instrument Serif**, alto contrasto, peso 400, `letter-spacing:-.015em`. Solo nei
   titoli — mai nel corpo, mai nei bottoni.
3. **Vetro smerigliato**: card e barre di navigazione traslucide con `backdrop-filter: blur()`,
   bordo 1px bianco/chiaro, ombra ampia e sfumata. Sempre con un fondo opaco di sicurezza
   dietro (i token `--surface`), per chi ha il blur disattivato.
4. **Pill ovunque**: bottoni, filtri, badge di stato — tutti `border-radius: 999px`.
5. **Copertine generate via CSS**, non immagini esterne: 8 combinazioni di gradienti radiali
   (`.cv1`…`.cv8`) sulle variabili `--a1`…`--a5`, usate per bento delle categorie, card dei
   centri e articoli del blog finché non arriva una foto reale.

## 2. Token (da `src/styles/global.css`)

```css
:root{
  --bg:#F4F6FB; --surface:#FFFFFF; --surface-2:#F9FAFE;
  --glass:rgba(255,255,255,.6); --glass-2:rgba(255,255,255,.84); --brd:rgba(255,255,255,.9);
  --ink:#0B1020; --ink-soft:#39425A; --muted:#6B7590; --line:#E5E8F2;
  --a1:#CFC6F7; --a2:#A5DCF3; --a3:#A6EFCC; --a4:#F5D6E8; --a5:#DCE4FA; --abase:#EEF1FB;
}
```

Accenti Tailwind (`@theme`): `--color-iris:#6462E8`, `--color-mint:#2FB98A`,
`--color-sky:#7FB2E8`, `--color-rose:#E794C0`. La dark mode (classe `.dark` su `<html>`,
toggle in header, persistita in `localStorage`) ridefinisce tutti i token di superficie e
inchiostro con la stessa struttura, aurora compresa (colori più profondi, non semplicemente
invertiti).

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

Tutti e tre sono stati trovati con screenshot reali via Playwright (non "a occhio sul codice"),
prima di consegnare il lavoro.

## 7. Accessibilità

Contrasto minimo 4.5:1 sul testo: i colori dell'aurora e delle copertine sono sempre sfondo,
mai testo (il testo resta `--ink` / `--ink-soft`). Focus visibile (`outline: 2px solid iris`).
Aree touch dei bottoni ≥ 44px. `prefers-reduced-motion` disattiva aurora, count-up e transizioni.
