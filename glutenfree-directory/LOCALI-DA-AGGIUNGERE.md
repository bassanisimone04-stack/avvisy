# Locali da aggiungere alla directory (flusso di lavoro)

File di lavoro, non fa parte del sito. Scopo: far crescere la directory (oggi 45 locali, 5 con foto) con locali **verificati** e con foto vere. Le schede dei locali sono le pagine più viste dopo la home, e ogni scheda in più con foto e dati certi vale più di un articolo.

## Perché non li abbiamo già aggiunti

Una scheda richiede indirizzo, CAP, telefono, sito, orari, coordinate e stato AIC esatti. Nessuno dei candidati sotto è stato verificato (vengono da guide private, vedi `DA-VERIFICARE-nuovi-articoli.md`), quindi non vanno pubblicati. Meglio 5 schede giuste che 20 con un dubbio.

## Candidati, in ordine di priorità

Priorità = città che oggi hanno pochi locali e hanno molte ricerche (Firenze 2 locali, Torino 1, Napoli 3, Verona 4).

| Città | Locale | Dato da confermare |
|---|---|---|
| Firenze | Hostaria Il Desco (via delle Terme 23R) | AIC sì/no, orari, telefono |
| Firenze | Trattoria La Gratella | indirizzo, AIC |
| Firenze | Trattoria Cammillo | indirizzo, AIC |
| Firenze | Garibaldi (Mercato Centrale) | cosa è senza glutine e se c'è cucina separata |
| Firenze | Giannino | indirizzo, AIC |
| Firenze | Lorenzo de' Medici | indirizzo, AIC |
| Firenze | Antica Gelateria (via Faenza) | gusti senza glutine, coni e palette |
| Torino | Kipling (via Mazzini 10) | AIC, orari |
| Torino | La Capannina | indirizzo, AIC |
| Torino | Alma Latina (San Salvario) | indirizzo, AIC |
| Torino | Duca 102 (corso Duca degli Abruzzi 102) | AIC, orari |
| Torino | La Barrique (corso Dante 53) | AIC, orari |
| Napoli | Babette, Foria 46, Johnny's Irish Pub, L'Oca Nera (pub) | nessuna fonte AIC: chiamare e chiedere come gestiscono birra e fritti |
| Milano | La Tellina, Biscottando | indirizzo, AIC |

## Come verificare un locale (5 minuti)

1. **App AIC / sito AIC** (celiachia.it, sezione «Alimentazione Fuori Casa»): il locale è nell'elenco? Segna la data del controllo.
2. **Sito o profilo Instagram/Facebook del locale**: indirizzo, telefono, orari.
3. **Telefonata o messaggio** per le domande che contano: «Avete cucina o forno separati? Fate il fritto in una friggitrice dedicata? Il personale è formato?»
4. **Google Maps**: coordinate (tasto destro sul punto → primi due numeri).

Se un dato non è confermato, la scheda non esce.

## Messaggio da inviare al locale (Instagram, email o WhatsApp)

> Buongiorno, sono [nome] di Mappa Senza Glutine (mappasenzaglutine.it), la directory dei locali per celiaci. Vorremmo inserire gratuitamente [nome locale] nella nostra mappa.
> Ci servirebbero: 1) conferma di indirizzo, telefono e orari; 2) se avete certificazione AIC o come gestite la cucina senza glutine (forno/cucina separata, friggitrice dedicata); 3) 2 o 3 foto del locale o dei piatti, che possiamo usare con il vostro permesso (indicate se vanno citati l'autore o il locale).
> L'inserimento è gratuito e la scheda resta modificabile da voi. Grazie!

Così i dati arrivano dal locale e le foto sono sue e concesse: si evitano sia l'errore sia il problema dei diritti.

## Foto: come mandarmele

- Orizzontali, almeno 1600 px di larghezza, senza persone riconoscibili e senza testi leggibili di altri marchi.
- Scrivimi il nome del locale e «la foto è mia / concessa dal locale».
- Le collego io con `src/lib/business-photos.ts`, come per i primi cinque locali.

## Modello di scheda (da compilare dopo la verifica)

Quando i dati sono confermati, mandameli in questo formato e li inserisco:

```
Nome:
Tipo: ristorante | pizzeria | hotel | farmacia | supermercato | negozio | bar-pasticceria | gelateria
Regione / Provincia (sigla) / Città:
Indirizzo e CAP:
Coordinate (lat, lng):
Telefono / Sito:
Orari (giorno per giorno):
Certificato AIC: sì | no, verificato il (data) su (fonte)
Cucina / forno / friggitrice dedicati: sì | no | non so
Piatti senza glutine (3-5):
Descrizione breve (1 frase):
Foto: sì / no
```

## Dove far conoscere la possibilità

La pagina «Per le aziende» (`/per-le-aziende`) permette già ai locali di proporsi. Conviene linkarla nei messaggi sopra e nei profili social del sito.
