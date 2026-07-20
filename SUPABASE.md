# Collegare Scortvia a Supabase (guida passo-passo)

Questa guida ti porta dal nulla ad avere Scortvia con **database reale,
autenticazione e storage**. Non serve saper programmare: si copia e incolla.

> Finché non completi questi passaggi, l'app funziona in **modalità demo**
> (dati finti nel browser). Appena aggiungi le chiavi, passa automaticamente al
> backend reale.

---

## 1. Crea un progetto Supabase (gratuito)

1. Vai su **https://supabase.com** e registrati (anche con Google/GitHub).
2. Clicca **New project**.
3. Dai un nome (es. `scortvia`), scegli una **password del database** (salvala)
   e la regione **West EU (Ireland)** o **Frankfurt**.
4. Attendi ~2 minuti che il progetto sia pronto.

## 2. Crea le tabelle (schema)

1. Nel menu a sinistra apri **SQL Editor** → **New query**.
2. Apri il file `supabase/schema.sql` di questo progetto, **copia tutto** e
   incollalo nell'editor.
3. Clicca **Run** (in basso a destra). Deve comparire *Success*.

## 3. (Facoltativo) Inserisci i dati dimostrativi

Così marketplace e directory non sono vuoti al primo avvio.

1. Sempre in **SQL Editor** → **New query**.
2. Copia il contenuto di `supabase/seed.sql`, incolla e **Run**.

## 4. Disattiva la conferma email (per la demo)

Così la registrazione fa accedere subito, senza email di conferma.

1. Menu **Authentication** → **Providers** → **Email**.
2. Disattiva **Confirm email** e salva.

## 5. Copia le due chiavi

1. Menu **Project Settings** (icona ingranaggio) → **API**.
2. Copia:
   - **Project URL** (es. `https://abcd1234.supabase.co`)
   - **anon public** key (una stringa lunga che inizia con `eyJ...`)

## 6. Incolla le chiavi nell'app

1. Nella cartella del progetto, copia il file `.env.local.example` in
   **`.env.local`**.
2. Apri `.env.local` e incolla i due valori:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...la-tua-anon-key...
   ```

3. Riavvia l'app (`npm run dev`). Da questo momento Scortvia usa Supabase.

## 7. Crea il primo account

1. Vai su **/registrati**, compila i dati e completa: viene creato un utente
   reale e la sua azienda (stato "In verifica").
2. Oppure crea un utente da **Authentication → Users → Add user** in Supabase.
3. Accedi da **/accedi** con email e password.

---

## Come funziona (in breve)

- **Modalità demo** (senza chiavi): dati finti in `localStorage`, tutto navigabile.
- **Modalità collegata** (con chiavi): l'app legge i dati da Supabase e salva le
  azioni (nuovi lotti, offerte, ordini, preferiti, notifiche) nel database.
- **Sicurezza**: le tabelle usano Row Level Security — ogni azienda vede/modifica
  solo i propri dati; i lotti pubblicati e le aziende sono pubblici.
- **Storage**: due bucket, `lot-images` (pubblico) e `lot-documents` (privato),
  pronti per il caricamento di immagini e documenti dei lotti.
- **Aree protette**: `/venditore`, `/compratore`, `/admin` richiedono il login
  quando Supabase è collegato (middleware).

## File coinvolti

```
supabase/schema.sql          -- tabelle, enum, RLS, storage
supabase/seed.sql            -- dati dimostrativi (facoltativi)
.env.local.example           -- modello per le chiavi
src/lib/supabase/config.ts   -- rileva se le chiavi ci sono
src/lib/supabase/client.ts   -- client lato browser
src/lib/supabase/server.ts   -- client lato server (sessione)
src/lib/supabase/data.ts     -- lettura dati (idratazione)
src/lib/supabase/persist.ts  -- salvataggio delle azioni sul database
src/lib/supabase/mappers.ts  -- conversione righe DB <-> tipi app
src/lib/supabase/auth-actions.ts -- login / registrazione / logout
src/middleware.ts            -- protezione delle aree riservate
```

## Note per la produzione

- Le policy RLS sono un punto di partenza ragionevole: puoi irrigidirle.
- Per un marketplace reale, i pagamenti vanno gestiti da un provider dedicato
  (Stripe Connect o simili): il flusso attuale è simulato.
- Riattiva la conferma email in produzione.
