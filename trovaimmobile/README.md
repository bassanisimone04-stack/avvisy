# TrovaImmobile

Piattaforma di annunci d'affitto per tutta Italia, costruita attorno alla verifica:
disponibilità riconfermata, visite su calendario reale, costo d'ingresso trasparente,
fiducia misurata dalle interazioni reali.

## Avvio rapido

```bash
cd trovaimmobile
npm install
cp .env.example .env.local        # imposta almeno AUTH_SECRET e NOMINATIM_USER_AGENT
npm run seed                      # dati DEMO (persone e indirizzi di fantasia)
npm run dev                       # http://localhost:3000
```

Account demo (password `demo1234`): `agenzia.milano@demo.it`, `agenzia.roma@demo.it`,
`giulia@demo.it` (privata), `sara@demo.it` (cerca casa).

Senza accesso a internet usa `GEOCODER=mock` (geocoder offline con i principali capoluoghi,
posizioni simulate: solo sviluppo).

Altri comandi: `npm test` (logica di dominio), `npm run typecheck`, `npm run build`,
`npm run reminders` (invio promemoria di riconferma).

## Stack

- **Next.js 15** (App Router, Server Components, Server Actions) + React 19 + TypeScript
- **SQLite** (better-sqlite3) — schema relazionale in `src/lib/db.ts`, creato all'avvio
- Autenticazione email/password (scrypt + cookie di sessione firmato HMAC)
- Foto su disco (`STORAGE_DRIVER=local`) o su qualunque object storage **S3-compatibile** (`STORAGE_DRIVER=s3`)
- Geocoding con **OpenStreetMap/Nominatim** (cache in DB, rispetto del limite di 1 richiesta/s)
- CSS puro con variabili: mobile-first, tema chiaro/scuro (automatico + interruttore)

### Modello dati

```
users 1─n listings n─1 properties          un immobile ha più annunci nel tempo, mai il contrario
properties 1─n price_history               storico prezzi della scheda
listings 1─n listing_photos / contacts / visits
visits 1─1 reviews                         recensione possibile solo per una visita reale
users 1─n availability_rules / busy_blocks fasce di visita e impegni del calendario esterno
```

## Come sono implementate le funzionalità

| Funzionalità | Dove | Come |
|---|---|---|
| Identità immobile persistente | `lib/address.ts`, `lib/listings.ts` | Chiave univoca normalizzata `comune\|via\|civico\|interno` (accenti, maiuscole, abbreviazioni "V.le", "C.so", "P.zza", civici "12/A" = "12 a"). Vincolo `UNIQUE` in DB: un duplicato è impossibile. La verifica dell'indirizzo mostra la scheda esistente e gli altri interni allo stesso civico prima di pubblicare. |
| Storico | `/immobili/[id]` | Grafico del canone nel tempo e tutti gli annunci collegati (anche chiusi, anche di altri inserzionisti). |
| Disponibilità verificata | `lib/freshness.ts`, `lib/reminders.ts` | Badge "Disponibile — confermato X ore fa". Dopo 6 giorni parte un promemoria con link firmato; la conferma è un click sul pulsante della pagina (non all'apertura del link, così i filtri antispam non confermano da soli). Ordinamento: confermati ≤7 gg, poi ≤14 gg, poi il resto. |
| Visite reali | `lib/slots.ts`, `lib/calendar.ts`, `lib/ical.ts` | Fasce = regole settimanali − impegni del calendario Google/iCal importato (con ricorrenze, eccezioni, fusi orari e ora legale) − visite già prenotate. Prenotazione in transazione con ricontrollo della fascia: conferma istantanea, niente doppie prenotazioni. Feed `.ics` personale per vedere le visite in Google Calendar. Se il calendario collegato non si sincronizza da oltre un'ora, le prenotazioni si sospendono invece di mostrare orari potenzialmente falsi. |
| Costo totale d'ingresso | `lib/costs.ts`, `components/trust.tsx` | Canone, spese, cauzione e commissione sono campi numerici obbligatori; il totale è su ogni card dei risultati e filtrabile. I privati non possono inserire commissioni. |
| Fiducia e anti-frode | `lib/trust.ts` | Tempo di risposta = mediana delle risposte reali degli ultimi 90 giorni (mostrato solo con ≥3 richieste). Recensioni legate 1:1 a una visita prenotata e già avvenuta, non segnata "non presentato". Avviso "Non pagare nulla prima di aver visitato l'immobile" su ricerca e annuncio; annunci che chiedono caparre/quote bloccati in pubblicazione; messaggi sospetti segnalati al destinatario. Badge Privato/Agenzia (con P. IVA) ovunque. |

## Produzione: cosa configurare

- `AUTH_SECRET` (obbligatorio), `APP_URL`, `NOMINATIM_USER_AGENT` con un contatto reale.
  Per volumi alti usare un'istanza Nominatim propria o un provider commerciale (`NOMINATIM_URL`).
- **Email**: `src/lib/mail.ts` oggi salva i messaggi nella tabella `outbox` (visibile in dashboard
  in sviluppo). Va collegato un provider SMTP/API prima di andare online.
- **Promemoria**: chiamare periodicamente `POST /api/cron/reminders` con
  `Authorization: Bearer $CRON_SECRET` (o `npm run reminders`).
- **Storage**: `STORAGE_DRIVER=s3` con le variabili `S3_*`. Il driver S3 non è stato provato in
  questo ambiente (nessun bucket disponibile); quello locale sì.
- **Database**: SQLite va bene per un solo server. Per più istanze migrare lo schema su PostgreSQL
  (lo schema è SQL standard; cambiano solo le query di data in `lib/freshness.ts`/`trust.ts`).

## Limiti noti

- La sincronizzazione con Google Calendar usa l'indirizzo iCal segreto (sola lettura, ogni 15 min)
  e un feed iCal in uscita, non l'API OAuth di Google: nessuna scrittura diretta nel calendario.
  Ricorrenze iCal avanzate (es. "primo lunedì del mese") non vengono espanse: la dashboard lo segnala.
- La P. IVA delle agenzie è verificata solo nel formato, non presso registri ufficiali.
- La verifica di identità dei privati (es. SPID/documento) non è implementata.
- Il rilevamento di richieste di pagamento anticipato è basato su parole chiave: riduce il rischio,
  non lo elimina.
