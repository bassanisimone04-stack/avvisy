# Checklist di lancio

Cose che **solo tu** puoi fare o decidere (non automatizzabili da qui).

## 1. Marchio e dominio
- [ ] Nome definitivo + verifica del marchio (ricerca anteriorità, consulente).
- [ ] Dominio acquistato → `NEXT_PUBLIC_SITE_URL` e `src/config/brand.ts` (vedi docs/BRAND.md).
- [ ] `BRAND_NAME="NOME" npm run images` per rigenerare `og-default.png`.

## 2. Testi legali
- [ ] Un legale rivede privacy, cookie, termini, affiliazione, sponsorizzati, correzione dati (`src/data/pages.ts`, versioni EN + IT).
- [ ] Ragione sociale in `legalEntity` (compare in privacy, footer, newsletter).

## 3. Foto e dati
- [ ] Foto con licenza (`npm run photos -- ./cartella`, elenco in docs/PHOTOS.md). Per i ristoranti veri: foto fornite dal locale con licenza registrata in `media`.
- [ ] Dati reali via importatore CSV (`/admin/import`), poi "Admin → Dati demo → archivia" e `ALLOW_DEMO_DATA=false`.
- [ ] Descrizioni italiane dei locali reali in `restaurant_translations`.

## 4. Servizi esterni (variabili in .env.example)
- [ ] Supabase: progetto, `supabase db push` delle migrazioni 1–6, seed opzionale; utenti staff con `profiles.role`.
- [ ] Resend: dominio verificato (newsletter double opt-in, avvisi di prezzo).
- [ ] Stripe: chiavi **di test** + webhook su `/api/stripe/webhook/` (evento `checkout.session.completed`). Le chiavi live sono rifiutate dal codice finché non rimuovi il vincolo in `src/lib/stripe.ts` dopo gli accordi con l'esercente.
- [ ] `CRON_SECRET` (Vercel Cron chiama `/api/cron/price-alerts/` ogni giorno alle 07:00 UTC, vedi `vercel.json`).
- [ ] Typesense (facoltativo): `npm run search:sync` dopo ogni importazione.
- [ ] Reti di affiliazione: righe in `affiliate_links`.

## 5. Verifiche sul sito pubblicato
- [ ] `npm run jsonld:dump`, poi incolla i file di `docs/jsonld-samples/` in https://validator.schema.org e prova gli URL in Google Rich Results Test; annota i risultati in docs/REPORT.md.
- [ ] Lighthouse mobile su home, elenco e scheda **dall'URL pubblico** (CDN): obiettivo prestazioni ≥ 95, LCP < 2,5 s.
- [ ] Google Search Console + Bing Webmaster: invia `/sitemap.xml`.
- [ ] Prova end-to-end in test: iscrizione newsletter, gift card (carta 4242 4242 4242 4242), avviso di prezzo, rivendicazione partner.
