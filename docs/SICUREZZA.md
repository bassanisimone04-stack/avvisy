# Piano di sicurezza — Avvisy

Come proteggiamo i dati di **utenti** (chi prenota) e **gestori** (le strutture).
Documento di progetto: alcune parti sono già fatte, altre si completano con Supabase.

## 1. Stato attuale (senza database)

Oggi Avvisy usa solo dati demo scritti nel codice: non conserva dati reali,
quindi non c'è ancora una superficie d'attacco sui dati personali. Sono però
già presenti le fondamenta:

- **Informativa privacy** (`/privacy`) e **consenso** obbligatorio nella
  prenotazione (GDPR).
- **Minimizzazione dei dati**: raccogliamo solo nome e telefono per l'utente,
  email per il gestore.
- **Validazione input** sui form (nome, telefono) per ridurre dati sporchi e
  inserimenti abusivi.
- **Impianto di autenticazione**: pagina di login, `middleware` che protegge
  `/dashboard`, sessione via cookie **httpOnly**, logout. La verifica delle
  credenziali è oggi un **accesso demo provvisorio** (`src/app/login/actions.ts`).

## 2. Cuore della sicurezza (con Supabase — prossimo passo)

### 2.1 Autenticazione gestori
- Sostituire l'accesso demo con **Supabase Auth** (`signInWithPassword`).
- Le password non vengono mai salvate in chiaro: Supabase le conserva con hash
  (bcrypt/scrypt) lato server.
- La sessione resta gestita via cookie httpOnly; il `middleware` verificherà il
  token Supabase invece del cookie demo.

### 2.2 Isolamento dei dati (Row Level Security)
La protezione più importante. Con le **RLS** di Postgres/Supabase:
- Ogni riga (appuntamento, servizio, coda) è legata a un `org_id`.
- Una policy consente a un gestore di leggere/scrivere **solo** le righe della
  propria struttura: `org_id = (organizzazione dell'utente autenticato)`.
- Un gestore non può in alcun modo vedere i dati di un'altra struttura, nemmeno
  manipolando le richieste.

### 2.3 Dati pubblici vs privati
- **Pubblici** (pagina struttura, servizi, "ora in servizio"): leggibili da
  tutti in sola lettura, tramite policy dedicate o `anon key`.
- **Privati** (elenco clienti con telefono, dashboard): accessibili solo al
  gestore autenticato della struttura.

### 2.4 Chiavi e segreti
- La `anon key` (pubblica) sta nel frontend: da sola non dà accesso ai dati
  privati grazie alle RLS.
- La `service_role key` (onnipotente) resta **solo lato server**, mai nel
  browser, mai nel repository. Tutte le chiavi in variabili d'ambiente
  (`.env.local`, escluso da git).

### 2.5 Cifratura
- **In transito**: HTTPS ovunque (Vercel + Supabase lo forniscono).
- **A riposo**: Supabase cifra il database su disco.

## 3. Buone pratiche trasversali
- Validazione anche **lato server** (non fidarsi mai del solo controllo nel
  browser).
- Rate limiting sulle azioni sensibili (login, prenotazione) per prevenire abusi.
- Log di accesso minimi e nessun dato sensibile nei log.
- Diritto alla cancellazione (GDPR): funzione per eliminare i dati di un utente
  su richiesta.

## 4. Checklist di implementazione
- [ ] Progetto Supabase + variabili d'ambiente
- [ ] Tabelle con colonna `org_id` e policy RLS
- [ ] Supabase Auth al posto dell'accesso demo
- [ ] `middleware` che valida la sessione Supabase
- [ ] Separazione policy dati pubblici / privati
- [ ] `service_role` solo lato server
- [ ] Validazione lato server sui form
- [ ] Funzione di cancellazione dati (GDPR)
