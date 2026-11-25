# Strategia multilingua

- **next-intl 4** in modalità senza routing per locale: una sola lingua pubblicata (en-US), senza prefisso. Le stringhe UI condivise sono in `messages/en-US.json`; i contenuti di dominio sono nei dati.
- **Dimensioni separate** (`src/config/markets.ts`): `locale` (lingua), `market` (us, ca, uk, au, eu), `currency`, `unitSystem`. La traduzione dello store non implica l'espansione della directory (`market.directory`).
- **Formattazione** tramite `Intl` (`lib/format.ts`): prezzi in centesimi, numeri, miglia, pollici e cm.
- **Attivazione futura di una lingua:**
  1. traduzione completa e revisionata da un madrelingua per le sezioni scelte (es. solo shop + tools);
  2. routing next-intl con `localePrefix: "as-needed"` (`/it/shop/...`);
  3. `hreflang` solo tra pagine equivalenti;
  4. nessuna traduzione automatica di massa;
  5. nessun redirect geografico obbligatorio, al massimo un banner di suggerimento.
- Il selettore di lingua nel footer mostra le lingue pianificate come disabilitate.
