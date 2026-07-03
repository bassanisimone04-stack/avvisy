# Avvisy

MVP di Avvisy: appuntamenti, check-in e code live per piccoli uffici e studi. Solo dati mock — niente Supabase, autenticazione o pagamenti (per ora).

## Avvio

```bash
npm install
npm run dev
```

Apri http://localhost:3000.

## Route

| Route | Descrizione |
|---|---|
| `/` | Landing page |
| `/s/demo-caf` | Pagina pubblica della struttura demo (CAF Navigli) |
| `/s/demo-caf/book` | Flusso di prenotazione (3 step, mock) |
| `/checkin/demo-appointment` | Check-in con ticket mock |
| `/dashboard` | Panoramica struttura |
| `/dashboard/appointments` | Lista appuntamenti |
| `/dashboard/services` | Servizi prenotabili |
| `/dashboard/queue` | Coda live (interattiva con stato locale) |
| `/dashboard/settings` | Impostazioni struttura (form mock) |

## Struttura

```
src/
  app/            # Route (App Router)
  components/     # AppHeader, LandingHero, OrganizationCard, ServiceCard,
                  # BookingForm, DashboardShell, AppointmentTable,
                  # QueueList, CheckinTicket
  lib/
    types.ts      # Modello dati (Organization, Service, Appointment, QueueEntry)
    mock-data.ts  # Dati demo + helper di lettura
    utils.ts      # cn(), formattazione date, etichette stato
```

## Design

- Token in `src/app/globals.css` (Tailwind v4, `@theme`): teal `--color-brand` per le azioni, ambra `--color-signal` per i numeri in servizio.
- Font: Bricolage Grotesque (titoli), Instrument Sans (testo), JetBrains Mono (ticket e orari).
- Elemento firma: la card "biglietto" con bordo perforato (`.ticket`), usata in hero, check-in e coda.

## Prossimi passi

1. **Supabase** — sostituire `src/lib/mock-data.ts` con query reali; gli helper (`getOrganizationBySlug`, ecc.) sono già il punto di aggancio.
2. **Autenticazione** — proteggere `/dashboard` e derivare `ORG_ID` dalla sessione.
3. **shadcn/ui** — `cn()` in `utils.ts` è già pronto per essere sostituito da `clsx` + `tailwind-merge`.
4. **Realtime** — coda live con Supabase Realtime al posto dello stato locale in `QueueList`.
