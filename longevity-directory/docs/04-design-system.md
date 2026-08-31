# Design system — stile "Afterglow" (riferimento visivo fornito)

Traduzione operativa dei riferimenti Dribbble (Afterglow: *Better investments for a better planet*,
*PHYSIQ*, *AEROVIA*) in un sistema applicabile a WordPress, Webflow o al nostro stack Next.js.

## 1. Firma visiva in 6 punti

1. **Gradienti iridescenti pastello** come sfondo delle sezioni chiave (lavanda → menta → azzurro
   ghiaccio), mai piatti: sfumature morbide, tipo paesaggio fuori fuoco.
2. **Titoli in Fraunces** (serif variabile ad alto contrasto, peso leggero), di grandi dimensioni, su due righe centrate.
   È l'elemento che dà il tono "premium clinico" e distingue da qualsiasi directory italiana.
3. **Corpo testo in sans neutro**, piccolo, grigio-blu, molto arioso.
4. **Vetro smerigliato**: card bianche traslucide con blur, bordo 1px bianco al 60%, ombra ampia
   e bassissima opacità.
5. **Pill ovunque**: badge di sezione ("Explore Projects" → "Categoria", "Verificato"), barra di
   ricerca a pillola con bottone circolare, bottoni navy pieni.
6. **Layout bento**: griglia asimmetrica di riquadri di dimensioni diverse — perfetta per la home
   della directory (categorie + centro in evidenza + numero + articolo).

## 2. Token

```css
:root{
  /* superfici */
  --bg:            #F7F8FA;
  --surface:       #FFFFFF;
  --glass:         rgba(255,255,255,.62);
  --glass-brd:     rgba(255,255,255,.75);

  /* inchiostro */
  --ink:           #0E1424;   /* navy quasi nero: titoli, bottoni */
  --ink-soft:      #3A4356;
  --muted:         #6B7488;
  --line:          #E7E9EF;

  /* accenti */
  --iris:          #7C7BEE;   /* periwinkle */
  --mint:          #7FE3B4;
  --sky:           #BBD5F2;
  --lilac:         #D6D2F7;
  --sand:          #F3EDE4;

  /* gradienti */
  --grad-hero: radial-gradient(120% 90% at 15% 20%, #D9D5F8 0%, transparent 55%),
               radial-gradient(110% 85% at 85% 15%, #BFE9F5 0%, transparent 50%),
               radial-gradient(120% 100% at 50% 110%, #B9EFD2 0%, transparent 60%),
               linear-gradient(180deg,#F2F3FB 0%,#EAF3F4 100%);
  --grad-pill: linear-gradient(135deg,#7C7BEE,#7FE3B4);

  /* raggi e ombre */
  --r-sm: 12px; --r-md: 18px; --r-lg: 26px; --r-xl: 34px; --r-pill: 999px;
  --sh-card: 0 18px 50px -22px rgba(14,20,36,.28);
  --sh-soft: 0 2px 10px rgba(14,20,36,.05);
}
```

**Dark mode**: `--bg #0B0F1A`, superfici `#141A28`, vetro `rgba(255,255,255,.06)`, gli stessi
accenti a saturazione ridotta del 15%. I gradienti diventano profondi (indaco → verde bosco).

## 3. Tipografia

| Ruolo | Font | Dimensioni |
|---|---|---|
| Display / H1-H2 | **Fraunces** variabile (`opsz 9..144`, `wght 300–400`, `SOFT 0`, `WONK 0`) | H1 clamp(2.4rem, 6.2vw, 4.6rem), peso 300, interlinea 1.0, `letter-spacing:-.022em` |
| UI e corpo | **Manrope** | corpo 16/1.65, small 13,5px, numeri con `tabular-nums` dove sono in colonna |
| Micro-label / pill | Manrope 600, 11px, `letter-spacing:.14em`, maiuscolo | |

Regola: **il serif solo nei titoli**, mai nel corpo o nei bottoni. È ciò che rende il look
"editoriale premium" invece che "template".

## 4. Componenti chiave (mappati sull'architettura)

- **Hero home**: gradiente a tutta larghezza, pill di categoria in alto, H1 serif su due righe,
  sottotitolo 1 riga, **barra di ricerca a pillola** (servizio + città) con bottone circolare
  navy, e sotto una fascia bento con 3 card in vetro (centri in evidenza, numero "1.240 centri
  verificati", ultimo articolo).
- **Card centro** (`BusinessCard`): foto in alto con raggio 18px, pill categoria sovrapposta,
  nome in serif 20px, città + distanza, riga di badge (Verificato / Telemedicina / Convenzionato),
  prezzo "da € X", bottone pill "Vedi scheda".
- **Barra filtri**: chip pill selezionabili in orizzontale (scroll su mobile), pannello filtri in
  vetro con blur, contatore risultati animato.
- **Scheda centro**: cover con gradiente, colonna sinistra contenuti, **card contatto sticky in
  vetro** a destra (telefono, prenota, WhatsApp) — è la card che converte.
- **Blocco articolo**: `KeyTakeaways` in card menta chiara, box "Evidenza 🟢/🟡/🔴" con bordo
  colorato a sinistra, TOC sticky, box FAQ ad accordion.
- **Sezione dati**: numeri grandi in serif (140k style) su fondo pastello, uno per riquadro bento.
- **CTA finale**: banner a gradiente pieno con titolo serif bianco e bottone pill bianco.

## 5. Immagini e illustrazioni

Il riferimento usa render fotografici morbidi. Per una directory sanitaria: fotografia reale dei
centri (obbligatoria e verificata) + **gradienti mesh generati** come sfondo di fallback quando
la foto manca — mai stock foto di medici che sorridono con il camice, che azzerano la credibilità.
Riusare l'approccio SVG/mesh già adottato in `glutenfree-directory` (`PlaceholderImage`,
`CoverPhoto`) cambiando palette.

## 6. Accessibilità (non negoziabile su un sito salute)

- Contrasto minimo 4.5:1 per il testo: i pastelli vanno usati **come sfondo**, mai come colore
  del testo. Il testo resta `--ink` / `--ink-soft`.
- Il vetro smerigliato richiede sempre un fondo opaco di sicurezza (`background-color` sotto il blur)
  per chi ha `backdrop-filter` disattivato.
- `prefers-reduced-motion`: disattivare parallasse e animazioni dei gradienti.
- Target touch ≥ 44px, focus ring visibile (`outline: 2px solid var(--iris)`).
