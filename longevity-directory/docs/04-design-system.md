# Design system — direzione "spa premium calda"

Direzione scelta: lusso quieto. Palette sabbia, creta e oliva, serif ad alto contrasto, moltissimo
spazio bianco, fotografia materica. Parla al pubblico alto-spendente e alle medical spa, che sono
i clienti con il ticket più alto della directory.

## 1. Firma visiva in sei punti

1. **Filetti, non ombre.** Nessuna ombra, nessun angolo arrotondato: la gerarchia si costruisce con
   linee da 1px, spazi ampi e contrasto tipografico. È la differenza tra "premium" e "template".
2. **Didone nei titoli.** Bodoni Moda ad alto contrasto, corpo grande, interlinea stretta (0,92–1,02),
   corsivo usato con parsimonia per una parola sola.
3. **Geometrica nel testo.** Jost in peso 300, corpo 16,5px, interlinea 1,78: molta aria tra le righe.
4. **Micro-etichette maiuscole** con `letter-spacing: .3em`, mai più di due-tre parole.
5. **Fotografia a tutta larghezza**, che esce dai margini del contenuto: è l'elemento che stabilisce
   il livello di prezzo percepito.
6. **Numerazione romana** dove l'elenco è un indice (le nove discipline), mai come decorazione.

## 2. Token

```css
:root{
  --paper:#F5F2EC;  /* carta calda, fondo */
  --sand:#E8E1D6;   /* fasce e riquadri in evidenza */
  --clay:#C9B8A4;   /* accenti materici, segni */
  --card:#FBF9F5;   /* superfici sollevate */
  --olive:#5A6650;  /* accento unico */
  --olive-deep:#3E4838;
  --brass:#9A7B4F;  /* riserva, per dettagli di lusso */
  --ink:#1C1A17;    /* nero morbido */
  --ink-soft:#4A453C;
  --muted:#8A8175;
  --line:#DED6C9; --line-soft:#EAE3D8;
}
```

**Dark mode calda** (non un'inversione): `--paper:#14120F`, superfici `#1A1713`, oliva schiarito a
`#9FB093`, inchiostro `#F2EDE3`, filetti `#2E2921`. La temperatura del colore resta calda anche al
buio: un dark mode blu tradirebbe la direzione.

**Regola di contrasto**: sabbia e creta sono solo fondi. Il testo è sempre `--ink` o `--ink-soft`,
mai creta su sabbia.

## 3. Tipografia

| Ruolo | Font | Impostazioni |
|---|---|---|
| Display H1 | **Bodoni Moda** (opsz variabile) | clamp(2.9rem, 8.2vw, 6.4rem), interlinea .92, corsivo su una parola |
| H2 / H3 | Bodoni Moda 400 | H2 clamp(1.9rem, 4.2vw, 3.4rem), interlinea 1.02 |
| Corpo e UI | **Jost** 300 | 16,5px / 1,78 — la colonna di lettura si ferma a 64ch |
| Etichette | Jost 500, 10px | maiuscolo, `letter-spacing:.3em` |
| Prezzi e numeri | Bodoni Moda 400 | i numeri in didone sono metà dell'effetto lusso |
| Bottoni | Jost 400, 11,5px | maiuscolo, `letter-spacing:.2em`, bordo 1px, riempimento all'hover |

Fallback obbligatori: `"Bodoni Moda", Didot, "Bodoni MT", Georgia, serif` e `Jost, Futura,
-apple-system, sans-serif`.

## 4. Componenti

- **Hero**: titolo a sinistra e nota a destra separata da un filetto verticale, poi immagine 21:9 a
  tutta larghezza, e la barra di ricerca che ci sale sopra di 46px — tre campi divisi da filetti,
  nessun angolo arrotondato.
- **Indice discipline**: righe con numero romano, titolo, descrizione, freccia; filetto sopra ogni
  riga e uno slittamento di 12px a sinistra all'hover. Sostituisce la griglia di card.
- **Card centro**: immagine 4:5, nome in didone, città in micro-etichetta, due pill a bordo sottile,
  prezzo in didone separato da un filetto.
- **Scheda**: colonna contenuti con listino a righe filettate; pannello contatto sticky su fondo card.
- **Piani**: quattro colonne dentro un unico bordo, divise da filetti verticali; quella in evidenza
  su fondo sabbia, senza ombre né badge.
- **Segnaposto foto**: gradiente materico nella palette + grana SVG, con etichetta dello scatto da
  commissionare. Resta in produzione come fallback quando la struttura non ha ancora fornito le foto.

## 5. Movimento

Lento e minimo: transizioni da 350–400 ms su colore di fondo dei bottoni e sullo slittamento delle
righe dell'indice. Nessuna comparsa allo scroll, nessun parallasse. Il lusso quieto si comunica
togliendo, non aggiungendo. `prefers-reduced-motion` disattiva tutto.

## 6. Accessibilità

Contrasto minimo 4,5:1 sul testo (verificato: `--ink` su `--paper` e su `--sand`); il verde oliva è
usato per accenti e bordi, e come testo solo sopra 14px in peso 400. Focus visibile con outline
oliva a 1px e offset 4px. Aree touch ≥ 44px: i bottoni hanno padding 14×28.
