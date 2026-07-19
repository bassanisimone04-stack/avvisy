# Scortvia — La nuova via delle scorte aziendali

Prototipo navigabile di **Scortvia**, marketplace B2B italiano per la
compravendita di scorte aziendali, componenti industriali, ricambi, materiali
inutilizzati e rimanenze di produzione.

> Prototipo dimostrativo: **dati fittizi**, saldi e pagamenti **simulati**,
> verifica KYB **simulata**. Nessuna transazione, identità o servizio esterno
> reale è coinvolto.

## Stack tecnico

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- Dati **mock locali** e **stato applicativo interattivo** (React Context +
  reducer, persistito in `localStorage`) — nessun backend

## Architettura dello stato

Il prototipo è pienamente interattivo: ogni azione (pubblicare un lotto,
inviare/gestire un'offerta, creare un ordine, salvare un preferito, leggere una
notifica) aggiorna uno **store client-side** condiviso da tutte le pagine e
persistito nel browser.

- `src/lib/types.ts` — modello dati completo (Azienda, Lotto, Offerta, Ordine,
  Notifica) con tutti gli stati richiesti.
- `src/lib/mock-data.ts` — dati demo (20 lotti, 8 aziende, 12 offerte, 8 ordini,
  10 notifiche, 8 recensioni, 12 categorie).
- `src/lib/services.ts` — servizi simulati: ricerca, filtri, ordinamento,
  paginazione, calcolo commissioni/totali, factory di lotti/offerte/ordini.
- `src/lib/store.tsx` — `StoreProvider`, reducer e azioni; persistenza
  `localStorage`.
- `src/lib/hooks.ts` — hook (`useDebounce`, `useSimulatedLoading`, …).

### Percorso end-to-end simulabile

1. il venditore pubblica un lotto → stato **In revisione**;
2. l'admin/venditore lo pubblica → **Pubblicato**;
3. il compratore lo trova con ricerca e filtri;
4. invia un'offerta (validazione, differenza %, commissione, scadenza);
5. il venditore rilancia con una **controproposta**;
6. il compratore accetta;
7. viene creato un **ordine** con commissione Scortvia del **2,5%**;
8. l'ordine e le notifiche compaiono nelle dashboard di entrambi.

## Avvio

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build di produzione
npm start        # serve la build
```

## Struttura

```
src/
├─ app/
│  ├─ (public)/            # sito pubblico (header + footer condivisi)
│  │  ├─ page.tsx          # Home
│  │  ├─ marketplace/      # Ricerca, filtri, ordinamento, griglia/elenco
│  │  ├─ lotto/[id]/       # Pagina del lotto (acquisto, offerta, info)
│  │  ├─ categorie/  come-funziona/  vendi/  soluzioni/  assistenza/
│  │  ├─ accedi/  registrati/   # Login e registrazione multi-step
│  ├─ venditore/           # Area venditore (dashboard + sottopagine)
│  ├─ compratore/          # Area compratore (dashboard + sottopagine)
│  └─ admin/               # Pannello amministratore
├─ components/             # Componenti riutilizzabili (card, modali, tabelle…)
└─ lib/                    # Tipi, dati mock, formattazione, commissione 2,5%
```

## Tema chiaro/scuro

Il sito supporta tema chiaro e scuro con toggle nell'header e nelle dashboard,
persistito in `localStorage` e senza flash al caricamento.

## Directory aziende e soluzioni

- `/aziende` — directory pubblica dei venditori con ricerca e filtri (settore,
  regione, verifica), collegata ai profili `/azienda/[id]`.
- `/soluzioni` — analisi dei problemi delle scorte ferme (magazzino
  immobilizzato, liquidità, obsolescenza, trasporto, sostenibilità) con due
  calcolatori interattivi: costo del magazzino/liquidità recuperabile e stima
  trasporto/ritiro.

## Pagamento simulato

Il flusso di pagamento è simulato ("Scortvia Pay", demo): cassa con riepilogo,
scelta del metodo (carta / bonifico / saldo), form carta con validazione e
carta di test, animazione di elaborazione e conferma. Nessun dato o addebito
reale. Gli ordini non ancora pagati mostrano "Paga ora" nell'area compratore.

## Funzionalità del prototipo

- **Homepage** con hero, ricerca, vantaggi, categorie e lotti in evidenza.
- **Marketplace** con ricerca testuale, filtri (categoria, regione, prezzo,
  quantità, condizione, verifica, spedizione, ritiro, immediato/negoziabile),
  ordinamento e viste griglia/elenco.
- **Pagina del lotto** con galleria, specifiche, documenti, certificazioni,
  logistica, dati venditore, recensioni e modali di **Acquisto** e **Offerta**
  (con riepilogo valore + commissione stimata).
- **Sistema di offerte** con stati (Inviata, In valutazione, Controproposta,
  Accettata, Rifiutata, Scaduta) e azioni Accetta / Rifiuta / Rilancia.
- **Area venditore**: dashboard, i miei lotti, pubblicazione lotto, offerte
  ricevute, ordini, messaggi, documenti, statistiche, profilo aziendale.
- **Area compratore**: dashboard, offerte inviate, ordini, acquisti, lotti e
  ricerche salvate, messaggi, notifiche.
- **Registrazione aziendale** in 7 passaggi con verifica KYB simulata.
- **Pannello amministratore**: aziende, annunci, utenti, segnalazioni,
  transazioni e commissioni, categorie, controversie.
- Stati vuoti, notifiche simulate (toast) e layout completamente responsive.

## Dati dimostrativi

12 lotti · 5 aziende verificate · 3 aziende in verifica · 8 offerte · 5 ordini
· 6 recensioni — tutti inventati (`src/lib/mock-data.ts`).

## Architettura predisposta (integrazioni future)

Il prototipo è pensato per collegare in futuro: provider di pagamento per
marketplace, verifica KYC/KYB, messaggistica, logistica, fatturazione,
notifiche email e gestione documentale. Nel prototipo questi servizi sono
simulati.
