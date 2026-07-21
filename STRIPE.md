# Pagamenti reali con Stripe — Guida

Scortvia usa **Stripe Checkout** per i pagamenti reali. Il compratore, su un
ordine non pagato, clicca "Paga ora", viene portato alla pagina di pagamento
sicura di Stripe e, al ritorno, l'ordine risulta pagato.

Se le variabili Stripe **non** sono impostate, l'app resta in modalità
dimostrativa (pagamento simulato): nulla si rompe.

---

## 1. Crea un account Stripe
1. Vai su https://dashboard.stripe.com/register e registrati (gratis).
2. Resti automaticamente in **modalità test**: in alto vedrai l'interruttore
   "Test mode" attivo. Va bene così per provare.

## 2. Copia le chiavi (TEST)
1. Nel menu Stripe: **Developers → API keys**.
2. Copia:
   - **Publishable key** → inizia con `pk_test_...`
   - **Secret key** → clicca "Reveal", inizia con `sk_test_...`

## 3. Imposta le variabili su Vercel
Nel progetto su Vercel: **Settings → Environment Variables**, aggiungi:

| Nome | Valore |
|------|--------|
| `STRIPE_SECRET_KEY` | la tua `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | la tua `pk_test_...` |

Poi fai **Redeploy** (le variabili valgono dal deploy successivo).

## 4. Prova
1. Accedi come compratore, crea un ordine (acquisto o offerta accettata).
2. Vai su **Ordini → Paga ora**: vieni portato su Stripe.
3. Usa la carta di test: **4242 4242 4242 4242**, scadenza futura qualsiasi
   (es. 12/34), CVC qualsiasi (es. 123).
4. Al ritorno l'ordine risulta **Pagato / Confermato**.

---

## Passare ai soldi VERI (live)
1. In Stripe completa **"Activate account"**: dati azienda, **partita IVA**,
   **IBAN**, documento d'identità. Stripe verifica (può richiedere tempo).
2. Disattiva "Test mode" e copia le chiavi **live** (`pk_live_...`,
   `sk_live_...`).
3. Sostituisci le due variabili su Vercel con le chiavi live e fai Redeploy.

## Note
- L'importo del pagamento è calcolato **dal server** leggendo l'ordine dal
  database: il client non può modificarlo.
- In questa versione l'incasso arriva sul **tuo** conto Stripe (della
  piattaforma). Distribuire i soldi ai venditori con split automatico della
  commissione richiede **Stripe Connect** (fase successiva).
- Robustezza opzionale: si può aggiungere un **webhook** Stripe per confermare
  i pagamenti anche se il compratore non torna sul sito. Non è necessario per
  iniziare.
