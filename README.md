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
- Dati **mock locali** in `src/lib/` — nessun backend

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
