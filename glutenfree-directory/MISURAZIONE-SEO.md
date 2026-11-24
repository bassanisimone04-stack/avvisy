# Misurazione SEO: punto di partenza e cosa confrontare

File di lavoro, non fa parte del sito. Serve a rispondere a una domanda sola:
**le modifiche di ottobre hanno funzionato?** Prima di investire altro tempo nella
stessa direzione.

## Punto di partenza (export Search Console del 6 ottobre 2026, ultimi 3 mesi)

Totali del sito: **272 clic, 12.494 impressioni**.

| Pagina o query | Impressioni | Clic | Posizione | Cosa abbiamo cambiato |
|---|---|---|---|---|
| Articolo McDonald's | 949 | 8 (CTR 0,84%) | 8,0 | Titolo "McDonald's gluten free: panino, patatine e gelato" |
| Home | 1.409 | 125 (CTR 8,87%) | 22,4 | Titolo "Mappa Senza Glutine: ristoranti e locali in Italia" |
| `/directory` | 265 | 0 | 35,5 | Titolo "Mappa ristoranti AIC certificati in Italia" |
| `/directory?comune=Torino` | 132 | 0 | 46,2 | Titolo e descrizione per città |
| `/directory?comune=Palermo` | 125 | 0 | 34,2 | Titolo con numero di locali e certificati AIC |
| `/directory?comune=Venezia` | 64 | 0 | 42,1 | idem |
| Il Secchio e l'Olivaro (scheda) | 430 | 0 | 12,6 | Titolo con "Porto Fluviale" |
| Query "mappa ristoranti aic" | 130 | 6 | 8,0 | Nuova pagina dedicata `/mappa-ristoranti-aic` |
| Query "senza glutine vicino a me" | 42 | 0 | 34,4 | Nuovo articolo "vicino a me" |
| Query "ristoranti certificati aic roma" | 32 | 0 | 39,6 | Titolo città con numero di certificati AIC |
| Query "gluten free bologna" | 47 | 0 | 75,5 | Nessuno: servono più locali |

Per paese: Stati Uniti 449 impressioni, 2 clic, posizione 14,8.

## Come misurare (importante)

L'export a 3 mesi **mescola il prima e il dopo** e diluisce l'effetto. Meglio:

1. Aspetta almeno **14 giorni dopo il merge** della PR #5 (e le richieste di indicizzazione).
2. In Search Console, Rendimento, usa **Confronta**: "Ultimi 28 giorni" contro "Periodo precedente".
3. Per ogni riga della tabella qui sopra guarda **posizione** e **CTR**, non solo i clic: con poche
   impressioni i clic sono rumore.
4. Aspettati i primi segnali sul **CTR** (il titolo cambia subito in vetrina) e solo dopo sulla
   **posizione** (Google impiega settimane a riordinare).

## Come leggere il risultato

- **CTR di McDonald's sopra l'1,5% con posizione simile**: il ragionamento sui titoli era giusto,
  si può ripetere sulle altre pagine.
- **Posizione delle pagine città migliorata di 5 posti o più**: la differenziazione di titoli e
  canonical funziona, vale la pena aggiungere locali nelle città che ne hanno pochi.
- **Nessun cambiamento dopo 4 settimane**: il limite non è il titolo ma l'autorevolezza
  (link in entrata, contenuti, numero di locali). Allora conviene investire lì.

## Cosa non misura questo file

Le vendite del PDF (Payhip) e i clic sul pulsante "Acquista": il sito non li registra.

## Aggiornamento del 24 novembre 2026: nuovi contenuti da misurare

Punto di partenza: export Search Console del 24 novembre (ultimi 3 mesi, fino al 22 novembre). Le righe sono gruppi di query raccolti per argomento; «posizione» è la media pesata sulle impressioni.

| Argomento | Impressioni | Posizione | Cosa abbiamo fatto |
|---|---|---|---|
| Surgelati senza glutine (11 query) | 124 | 11-16 | Nuovo articolo «Surgelati senza glutine: come riconoscere quelli sicuri» |
| Negozi e catene (Mondo Senza Glutine, Le Bontà Italiane...) | 261 | circa 51 | Nuovo articolo «Negozi senza glutine a Roma e Milano» |
| Firenze (guida assente) | 138 | circa 58 | Nuovo articolo «Firenze senza glutine» |
| Torino (guida assente) | 77 | circa 53 | Nuovo articolo «Torino senza glutine» |
| Arancini / arancine | 94 | circa 8 | Nuovo articolo «Arancini senza glutine» |
| Pub per celiaci a Napoli | 67 | circa 35 | Nuovo articolo «Pub senza glutine» (nessun pub verificato in directory) |
| Vendita / cash and carry / ingrosso | 123 | circa 42 | Nuovo articolo «Prodotti senza glutine per ristoratori» |
| Circuito AIC, lista ristoranti AIC | 160 | circa 19 | Nuovo blocco in /mappa-ristoranti-aic e FAQ |
| «Se un celiaco mangia glutine dopo quanto sta male» | 41 | 9,5 | Titolo di sezione e FAQ nell'articolo sull'ingestione accidentale |
| Amido di frumento deglutinato | 67 | 11 | Sottosezione e FAQ nell'articolo sugli ingredienti dubbi |
| «Gluten free holidays Italy» (EN) | 65 | circa 45 | Nuovo titolo EN della guida sulle migliori città |
| Farro | 28 | circa 33 | Titolo di sezione e FAQ «contiene glutine?» |
| Pizza con Mix It! Universale Schär | 30 | 8-12 | Ricetta riscritta con le dosi ufficiali del produttore |
| Quartieri di Roma e Milano (Ostiense, Navigli, Isola...) | 284 | circa 29 | Sezioni «per zona» nelle due guide città |

**Come misurare:** aspetta almeno 14 giorni dal merge e confronta «Ultimi 28 giorni» con il periodo precedente, riga per riga, guardando **posizione** e **CTR** prima dei clic. Per i nuovi articoli fai «Richiedi indicizzazione» in Search Console il giorno della pubblicazione.
