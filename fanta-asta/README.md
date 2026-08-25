# FantAsta — gestionale per l'asta del fantacalcio

Applicazione per condurre e vincere l'asta del fantacalcio: listone della Serie A
Enilive 2026/27 con valutazione dei giocatori, prezzi consigliati calcolati sulle
regole della **tua** lega, gestione dei crediti in tempo reale durante l'asta e
rassegna stampa delle principali testate.

Tutto gira nel browser: nessun account, nessun server, nessun dato che esce dal
tuo dispositivo. L'asta è salvata in `localStorage` ed esportabile in JSON/CSV.

## Avvio

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # produzione
```

Nessuna variabile d'ambiente richiesta.

## Le sei sezioni

| Pagina | A cosa serve |
| --- | --- |
| **Asta live** (`/`) | La schermata da tenere aperta al tavolo: chiamata rapida, rilanci, semaforo sul prezzo, aggiudicazione, crediti e slot di ogni squadra |
| **Listone** (`/listone`) | Database completo con fantaindice, prezzo consigliato, convenienza; filtri per ruolo, squadra, fascia e tag; import/export CSV |
| **Serie A** (`/squadre`) | Le 20 squadre: allenatore, modulo, formazione tipo, gerarchia dai rigori, chiave di lettura per l'asta |
| **News** (`/news`) | Rassegna stampa aggregata da 10 testate di fantacalcio, sport e mercato |
| **Guida** (`/guida`) | Fasce ruolo per ruolo, rigoristi di tutte le squadre, bug del listone, strategie di budget, fonti |
| **Lega** (`/impostazioni`) | Budget, slot, ripartizione per reparto, partecipanti, rose, backup |

## Il motore di valutazione

Il cuore dell'applicazione è `src/lib/valuation.ts`, che risponde a due domande
distinte e poi le mette a confronto.

**Quanto vale — il fantaindice (0-100).** Sintesi di fascia d'asta (34%),
titolarità (18%), bonus attesi da rigori e piazzati (22%), forza della squadra
(16%) e rendimento della scorsa stagione (10%). Col modificatore di difesa
attivo, portieri e difensori ricevono una spinta.

**Quanto costa — il prezzo consigliato.** Un modello di equilibrio: in una lega
da N squadre con S slot per reparto verranno comprati esattamente N×S giocatori
di quel reparto, spendendo la quota di budget che la lega dedica al reparto.
Quei crediti vengono distribuiti due volte — una in proporzione al fantavalore
(quanto chiede il mercato), una in proporzione al fantaindice (quanto ritiene
giusto il modello) — e il prezzo finale è la media pesata delle due.

**Dove sta l'affare — la convenienza.** È il rapporto tra le due distribuzioni:
100 significa che mercato e modello concordano, sopra 125 il modello vede più
valore di quanto il mercato chieda, sotto 65 è una trappola.

Il modello si taratura da sé: raddoppia il budget e i prezzi raddoppiano,
aggiungi squadre e i top si scaldano, sposta la ripartizione verso la difesa e i
difensori si rivalutano. Le costanti di taratura (`CONCENTRAZIONE_MERCATO`,
`CONVESSITA_INDICE`, `PESO_MERCATO`) sono in cima al file, documentate.

Durante l'asta due numeri contano più degli altri e sono sempre a schermo:

- **offerta massima** = crediti residui − (slot ancora da riempire − 1). Oltre
  quella cifra arrivi a fine asta con caselle vuote.
- **media per slot** = crediti residui ÷ slot vuoti. Quando scende sotto 2, puoi
  solo riempire a 1 credito.

## I dati

`src/lib/players.ts` contiene 258 giocatori e `src/lib/teams.ts` le 20 squadre,
compilati dalle guide all'asta pubblicate ad agosto 2026 (l'elenco delle fonti è
in fondo alla pagina `/guida`).

> **Le quotazioni del dataset interno sono stime, non i numeri ufficiali di
> Leghe Fantacalcio.** Sono calibrate per far girare il motore con un ordine di
> grandezza corretto fin da subito. Ciò che invece deriva da fonti verificate
> sono ruoli, formazioni tipo, gerarchie dai rigori, tag e note.

Per lavorare sui numeri esatti, scarica il listone ufficiale, salvalo in CSV e
importalo da `/listone`. Il parser riconosce le intestazioni dell'export di Leghe
Fantacalcio (`Nome`, `Squadra`, `R`, `RM`, `Qt.A`, `FVM`), salta le righe di
titolo, rileva il separatore e **riporta sui giocatori riconosciuti i tag, le
note e le statistiche del dataset interno**, così l'import non fa perdere il
lavoro di analisi. Gli acquisti già registrati restano validi.

Il dataset interno copre i giocatori che contano davvero all'asta, non i ~500
nomi del listone completo: se non bastano a riempire gli slot della tua lega,
l'applicazione te lo dice in cima alla schermata invece di lasciartelo scoprire
al momento di comprare il sesto attaccante.

## Struttura

```
src/
  app/
    page.tsx              Asta live
    listone/ squadre/ news/ guida/ impostazioni/
    api/news/route.ts     Aggregatore RSS/Atom lato server (cache 10 min)
  components/
    AstaBoard.tsx         La schermata d'asta
    ListoneTable.tsx      Database e valutazioni
    PlayerSheet.tsx       Scheda giocatore e aggiudicazione
    SquadrePanel.tsx      Le 20 squadre di Serie A
    NewsPanel.tsx         Rassegna stampa
    ImpostazioniPanel.tsx Lega, partecipanti, rose, backup
    CoperturaListone.tsx  Avviso quando il listone non copre gli slot
    ui.tsx                Badge, statistiche, avvisi
  lib/
    types.ts       Modello dati
    players.ts     Listone di partenza
    teams.ts       Le 20 squadre
    valuation.ts   Motore di valutazione
    store.tsx      Stato dell'asta + persistenza locale
    csv.ts         Import listone ufficiale, export CSV
    news-sources.ts Le testate interrogate
```

## Note sulla rassegna stampa

I feed vengono letti dal server (`/api/news`), quindi il browser non incontra
problemi di CORS. Ogni fonte ha un timeout di 8 secondi e viene gestita in
isolamento: se una testata non risponde o blocca le richieste automatiche, la
pagina mostra comunque le altre e segnala lo stato di ciascun feed, lasciando il
link diretto al sito. Se la rete in uscita è filtrata, la pagina degrada
nell'elenco ragionato delle testate da consultare a mano.

## Scorciatoie

- `/` porta il cursore sulla ricerca dell'asta
- `Invio` sulla ricerca mette in asta il primo risultato
- `Esc` chiude la scheda giocatore
