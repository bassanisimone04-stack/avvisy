# Setup — from demo mode to a live product

The site runs with **no configuration at all**. In that state it is in *demo
mode*: listings come from `src/data/groomers.json`, and accounts, leads and
billing are switched off. Every public page still works, which means you can
deploy and start ranking before wiring up any backend.

Adding keys turns features on progressively. Nothing breaks in between.

---

## 1. Supabase — database, accounts, leads

1. Create a free project at **https://supabase.com** (region: pick one close
   to your US audience, e.g. `us-east-1`).
2. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
3. Optional, so the directory is not empty: run `supabase/seed.sql` the same way.
4. **Project Settings → API** → copy the **Project URL** and the **anon public** key.
5. Copy `.env.local.example` to `.env.local` and paste them in.
6. Restart (`npm run dev`).

At this point listings are read from the database, the claim flow files real
claims, and quote requests are stored as leads.

### How the security model works

Every table uses Row Level Security:

- **groomers** — published listings are world-readable; a business can only
  update the listing it owns.
- **leads** — anyone may submit one, but only the receiving groomer can read
  it back. There is deliberately no public select policy, so one visitor can
  never read another's quote request.
- **claims** — a signed-in user sees only their own claims.

Claims are recorded as `pending` and are **never auto-approved**. Assigning a
listing to whoever asks first would let a competitor take over a rival's page.
Approve them yourself in the Supabase table editor by setting the listing's
`owner` to the claimant's user id.

## 2. Stripe — paid plans

1. Create an account at **https://dashboard.stripe.com** (stays in test mode).
2. Create a **Product** with two recurring prices: Pro Van ($39/mo) and
   Multi-Fleet ($99/mo). Copy both price IDs (`price_...`).
3. **Developers → API keys** → copy the secret key (`sk_test_...`).
4. **Developers → Webhooks → Add endpoint**:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`,
     `customer.subscription.deleted`
   - Copy the **signing secret** (`whsec_...`).
5. Fill in `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO`,
   `STRIPE_PRICE_FLEET`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

### Why the webhook needs the service-role key

A webhook request carries no user session, so RLS would reject the tier
update. The endpoint verifies Stripe's signature first — that signature is
what authenticates the caller. Without the signature check, anyone could POST
to the endpoint and grant themselves a paid plan.

The amount is never taken from the client: the browser names a *tier*, and the
server resolves it to a price ID.

## 3. Going live

- Swap the Stripe test keys for live keys (requires completing Stripe's
  account activation: company details, VAT number, bank account, ID).
- Set `LEAD_HASH_SALT` to a long random string. It salts the hashed submitter
  IP used for lead rate limiting, so the hashes are not a reversible lookup
  over the small IPv4 space.
- Re-enable email confirmation in Supabase **Authentication → Providers**.
- Point `SITE_URL` in `src/lib/site-config.ts` at the real domain.

---

## What runs where

| Feature | Without keys | With Supabase | With Supabase + Stripe |
| --- | --- | --- | --- |
| Public directory, SEO, FAQ | ✅ from JSON | ✅ from database | ✅ |
| Zip code search | ✅ over seed data | ✅ over database | ✅ |
| Quote request form | accepts, discards | ✅ stored as lead | ✅ |
| Sign in / dashboard | disabled | ✅ magic link | ✅ |
| Edit zip coverage | — | ✅ | ✅ |
| Paid plans, ranking boost | — | manual tier edit | ✅ self-service |
