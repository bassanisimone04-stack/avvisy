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

Review them at **`/admin/claims`**. Set `ADMIN_EMAILS` in `.env.local` to a
comma-separated list of the addresses allowed in, then sign in with one of
them. Approving assigns the listing's `owner` to the claimant, who can then
edit it and receive its leads.

The page shows each claimant's work email, phone and city so you can check
them against the business's published contact details before approving. A
claim is a request, not proof of ownership — verify it. Approval refuses to
reassign a listing that already has a different owner, so a second claimant
cannot quietly take over a page that is already held.

The allow-list is an env var rather than a database role: a role column is
only as safe as every policy that touches it, and an env var cannot be
escalated into through SQL. An empty or unset value grants **nobody** access
and the route 404s rather than 403s, so it does not advertise itself.

### Why some features need the service-role key

`SUPABASE_SERVICE_ROLE_KEY` is server-only and bypasses RLS. Three things
genuinely require it, because they act where there is no user session:

- **Lead rate limiting.** `leads` has no public SELECT policy by design, so an
  anonymous count query returns zero and the limit would never fire. Without
  this key leads are still stored — they are just not throttled.
- **Lead forwarding.** The groomer's email is revoked from the anon role (see
  below), so only the server can read it.
- **The Stripe webhook.** A webhook request carries no session.

### Why groomer emails are column-revoked

RLS decides which *rows* are visible, not which *columns*. Published listings
are world-readable, so a `select *` with the anon key would hand out every
groomer's contact email — a ready-made spam list for anyone who views source.
`schema.sql` therefore revokes `select (email)` and the Stripe identifiers
from the `anon` and `authenticated` roles, and public queries select an
explicit column list (`PUBLIC_COLUMNS` in `src/lib/groomers.ts`).

If you add a column that must stay private, add it to both places.

## 2. Resend — forwarding leads to the groomer

Storing a lead is not the promise the outreach templates make; delivering it
is. Without this step leads sit in the database and the business never hears
about them.

1. Sign up at **https://resend.com** and verify your sending domain.
2. **API Keys → Create** → copy the key (`re_...`).
3. Set `RESEND_API_KEY` and `LEAD_FROM_EMAIL` (an address on the verified
   domain) in `.env.local`.

The notification email sets **reply-to** to the customer's address when they
left one, so the groomer answers straight from their inbox.

Forwarding is best-effort by design: the lead row is committed *before* any
mail is attempted, so an outage at the mail provider can never cost the
business the lead. A failed send just leaves the row's status at `new`.

## 3. Stripe — paid plans

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

## 4. Going live

- Swap the Stripe test keys for live keys (requires completing Stripe's
  account activation: company details, VAT number, bank account, ID).
- Set `LEAD_HASH_SALT` to a long random string. It salts the hashed submitter
  IP used for lead rate limiting, so the hashes are not a reversible lookup
  over the small IPv4 space.
- Re-enable email confirmation in Supabase **Authentication → Providers**.
- Leave `NEXT_PUBLIC_SITE_URL` unset in production — it falls back to the real
  domain. Preview deploys derive their own origin from `NEXT_PUBLIC_VERCEL_URL`
  and are served `Disallow: /`, so a staging copy never competes with
  production for the same queries.

---

## Tests

```bash
npm test
```

Covers the outreach engine — CSV parsing, template rendering, and every
cadence rule. Those rules are the ones that decide whether someone who
unsubscribed gets emailed again, so they are the part worth guarding against
a silent regression.

## What runs where

| Feature | No keys | + Supabase anon | + service role | + Resend | + Stripe |
| --- | --- | --- | --- | --- | --- |
| Public directory, SEO, FAQ | ✅ from JSON | ✅ from DB | ✅ | ✅ | ✅ |
| Zip code search | ✅ seed data | ✅ from DB | ✅ | ✅ | ✅ |
| Quote form stores a lead | accepts, discards | ✅ | ✅ | ✅ | ✅ |
| Lead rate limiting | — | — | ✅ | ✅ | ✅ |
| Lead emailed to groomer | — | — | — | ✅ | ✅ |
| Sign in / dashboard | — | ✅ magic link | ✅ | ✅ | ✅ |
| Edit zip coverage | — | ✅ | ✅ | ✅ | ✅ |
| Paid plans, ranking boost | — | manual tier edit | manual | manual | ✅ self-service |
