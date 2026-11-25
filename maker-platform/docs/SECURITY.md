# Sicurezza e privacy

## Già in atto (Fase 1)
- Nessun segreto nel repository; `.env.example` contiene solo placeholder; `.env*` è in gitignore.
- Header: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, `X-Robots-Tag` fuori dalla produzione; `poweredByHeader` disattivato.
- JSON-LD serializzato con escape di `<`.
- Input dei calcolatori e query della directory validati e troncati (`parseDirectoryQuery`, `parseCatalogQuery`, Zod per l'email).
- Link esterni con `rel="nofollow noopener"`.
- Nessun cookie di tracciamento. `localStorage` solo per carrello e preferiti demo.

## Da implementare
| Fase | Misura |
|---|---|
| 2 | Supabase Auth, ruoli in `profiles`, RLS su tutte le tabelle, autorizzazione server-side per admin (mai solo UI), audit log |
| 2 | Rate limiting su form pubblici (segnalazioni, claim, newsletter) |
| 3 | Upload sicuri (tipo/size, storage privato, scansione), moderazione |
| 4 | Stripe: verifica firma webhook, idempotenza (`webhook_events`), stato pagamento solo da webhook, storage privato + URL firmati a scadenza, log dei download |
| 5 | Cookie consent prima di analytics, data minimization, export ed eliminazione account |
| 6 | Audit sicurezza, CSP, revisione dipendenze |

## Ambienti
Development (locale), Preview (Vercel, sempre noindex), Production (dominio approvato). Variabili separate per ambiente su Vercel; chiavi Stripe in **test mode** fino all'approvazione.

## Note legali
Le pagine `/legal/*` sono **bozze** da sottoporre a revisione legale. Operare dall'Italia vendendo negli USA non esclude obblighi su sales tax (nexus per stato), IVA/OSS, GDPR e tutela dei consumatori.
