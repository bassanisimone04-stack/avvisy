# Guida PDF "Vivere Senza Glutine"

Il PDF a pagamento (IT e EN) e le anteprime della landing si generano dai contenuti del sito:
nessun testo dei capitoli è scritto a mano qui.

## Rigenerare

```bash
cd glutenfree-directory
npx tsx guida/export-content.ts   # legge gli articoli del sito -> guida/content.json
python3 guida/build.py            # -> guida/out/*.pdf, src/lib/guide-meta.json, public/images/guida/*.jpg
```

Requisiti: Node (tsx), Playwright con Chromium (`render.js` usa quello globale o `/opt/pw-browsers/chromium`),
Python 3 con `pypdf`, `pypdfium2`, `Pillow`.

## Cosa contiene

- `export-content.ts`: sceglie i capitoli e li raggruppa in 5 parti (modifica `PARTS` per cambiare ordine o contenuti).
- `build.py`: testi fissi (copertina, avvertenze, appendici A-E, glossario) in IT/EN; impagina l'HTML, stampa il PDF,
  calcola i numeri di pagina dell'indice (più passate), aggiunge segnalibri, etichette di pagina e metadati.
- `style.css`: impaginazione A5 e font di marca (cartella `fonts/`, licenza OFL).
- `render.js`: stampa HTML -> PDF con Chromium.
- La checklist dell'appendice B è la stessa della pagina `/checklist-ristorante` (`src/lib/checklist-items.ts`).

## Dopo aver rigenerato

1. `src/lib/guide-meta.json` aggiorna da solo pagine, capitoli e indice mostrati nella landing `/vivere-senza-glutine`.
2. Carica i PDF di `guida/out/` su Payhip (sostituisci il file del prodotto). Il link EN va in `GUIDE2.checkoutUrlEn`
   in `src/lib/site-config.ts`: finché è vuoto la pagina inglese mostra "disponibile a breve".
3. Il copyright in `build.py` e il prezzo in `site-config.ts` sono scelte modificabili.
