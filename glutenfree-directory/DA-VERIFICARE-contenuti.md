# Da verificare e da decidere: schede locali, filtri e contenuti

File di lavoro, non fa parte del sito. Raccoglie tutto quello che ho costruito
**senza poterlo confermare da una fonte primaria**, e le decisioni che spettano a te.
Nel sito pubblicato non compare nessun marcatore: qui c'è l'elenco.

## 1. Schede locale

| Dato | Stato oggi | Cosa serve |
|---|---|---|
| **Tipo di produzione** (dedicato / misto) | 28 locali su 45 hanno l'etichetta (14 dedicati, 14 misti), ricavata dal testo già verificato della scheda ("100%", "esclusivamente", "forno dedicato"...). Gli altri 17 non hanno etichetta e non compaiono nel filtro | Conferma dal locale (mail o telefono), una riga per locale |
| **Link al menu senza glutine** | Campo pronto (`menuUrl`), **vuoto per tutti** | Per ogni locale, il link alla pagina o al PDF del menu senza glutine, dal suo sito |
| **Tipi di piatto** (pizza, pasta, dolci...) | Ricavati automaticamente da menu e servizi già in scheda | Controllo a campione: ogni locale conferma cosa serve davvero |
| **Opzioni vegane / senza lattosio** | Ricavate dal testo della scheda (6 vegane, 14 senza lattosio): sono "opzioni", non garanzie | Conferma dal locale |
| **Fascia di prezzo** (€, €€, €€€) | Presente in tutte le schede ma **non verificata** da me | Il locale o un controllo sul menu |
| **Orari e "aperto ora"** | Presenti ma **non verificati** (e non li pubblico nei dati strutturati) | Orari dal locale; oppure togliere il filtro "aperto ora" finché non sono confermati |
| **Recensioni** | **0 su 45**. Il sito non ne inventa e mostra solo un invito a scrivere | Un canale reale per raccoglierle (vedi punto 2) |
| **Badge AIC** | Già presente; 13 locali su 45 non risultano AIC e sono segnati come verificati dalla community | Verifica sull'elenco AIC (vedi `DA-VERIFICARE-torino-bologna.md`) |

Locali **senza** etichetta di produzione: aggiungili dopo la conferma in
`src/lib/business-attributes.ts`, riga per riga (c'è il commento con la fonte).

## 2. Community e storie dei lettori

- **Pagina `/le-vostre-storie`**: pronta, con modulo che prepara un'email a
  `info@mappasenzaglutine.it`. [DA VERIFICARE] che quella casella sia letta davvero.
  La pagina resta fuori da Google finché non c'è almeno una storia reale
  (`src/lib/stories.ts`, oggi vuoto).
- **Hashtag** (stile #pasticceratidavoi): [DA DECIDERE] il nome (proposta:
  `#mappasenzaglutine`) e [DA VERIFICARE] che sia libero e che esista un profilo social
  dove raccoglierli. **Oggi il sito non ha profili social**: senza non c'è dove raccogliere.
- **Privacy**: la pagina chiede il consenso alla pubblicazione, ma [DA VERIFICARE] se
  l'informativa privacy va aggiornata per i contenuti inviati dagli utenti.
- **Foto dei lettori**: serve una regola per i volti e per i minorenni (la pagina già chiede
  il consenso; [DA DECIDERE] se accettare allegati).

## 3. Contenuti editoriali

| Voce | Cosa ho fatto | Cosa resta |
|---|---|---|
| **Vero o falso** | Articolo con 15 affermazioni, tutte ricavate da articoli già verificati e dalle FAQ AIC | Altre puntate man mano che verifichi altre FAQ AIC (formaggi stagionati, salumi, dolcificanti, integratori: **non verificati**, non inclusi) |
| **Frasario con pronuncia** | In inglese su 8 guide città e nella guida per turisti. Pronuncia = trascrizione all'inglese, **di servizio** | [DA VERIFICARE] con un madrelingua inglese che la trascrizione sia chiara |
| **Guida alla spesa da soli** | Sezione nuova nell'articolo "dove comprare", con le linee dei discount già verificate | [DA VERIFICARE] altre catene (Coop, Conad, Esselunga, Carrefour): non incluse. MD: nessuna linea dedicata trovata |
| **Calendario eventi/fiere** | **Non creato.** Esiste solo l'articolo sugli eventi 2026 | Serve l'elenco annuale dell'AIC. Ho verificato un solo evento: Settimana Nazionale della Celiachia 9-17 maggio 2026 (Giornata mondiale il 16 maggio). [DA VERIFICARE] date 2027 |
| **Spiegazione "Certificato AIC"** | Già presente nell'articolo sulla certificazione (formazione, incontri periodici, HACCP) e nella mappa AIC | [DA VERIFICARE] se le sezioni regionali AIC chiedono requisiti diversi |
| **Galateo (invitare un amico celiaco)** | Articolo nuovo | Nessuna dato da verificare; testo di buone maniere |
| **Normativa (pagina fissa)** | `/normativa`: etichette (Reg. UE 828/2014, 20 e 100 mg/kg), avena, allergeni, buono, legge 123/2005, ristorazione | [DA VERIFICARE] su Normattiva l'articolo 4 della legge 123/2005; [DA VERIFICARE] lo stato di attivazione del buono digitale per regione (la data della pagina è 13 ottobre 2026) |
| **Ingestione accidentale / ingredienti** | Due articoli con fonti AIC | [DA VERIFICARE] da un gastroenterologo prima di promuoverli: sono temi medici |

## 4. Collaborazioni con chef e ristoratori

[DA DECIDERE] Non esiste nessuna collaborazione e **non ho scritto nessuna intervista né
ricetta firmata**: sarebbe inventare. Cosa serve: un locale che accetti. Bozza di mail:

> Buongiorno, gestisco Mappa Senza Glutine (mappasenzaglutine.it), una directory gratuita
> di locali senza glutine in cui compare anche il vostro. Vorremmo pubblicare una breve
> intervista (5 domande, risposte vostre) o una ricetta firmata da voi, con link al vostro
> sito, e raccontarvela prima della pubblicazione. Vi interessa? Grazie, Simone

Cinque domande tipo: come è nato il vostro percorso senza glutine; cosa fate per evitare la
contaminazione; un piatto di cui andate fieri; un consiglio per chi è celiaco e viene da voi;
come vi trovano i clienti.

## 5. Lead magnet e newsletter

- **Fatto**: la checklist `/checklist-ristorante`, stampabile, **libera e senza iscrizione**.
  Così è indicizzabile e condivisibile (più utile ora, con poche visite, di una pagina dietro
  un modulo).
- [DA DECIDERE] se chiedere l'email in cambio: serve un servizio di newsletter conforme al
  GDPR (non c'è). Il sito non ha nessun modulo di iscrizione né elenco iscritti: non esiste
  nessun numero di iscritti da citare.

## 6. Filtri multi-intolleranza

Fatto con i dati che già c'erano: locali con "opzioni vegane" e "opzioni senza lattosio";
prodotti con i tag già presenti "vegano" e "senza lattosio". Sono tag di dati esistenti, non
nuove verifiche.

## 7. Torino e Bologna

Vedi `DA-VERIFICARE-torino-bologna.md`.
