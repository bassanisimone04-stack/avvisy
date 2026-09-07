-- ===========================================================================
-- FindMobileGrooming — database schema (Supabase / PostgreSQL)
-- Paste and run this file in the Supabase SQL Editor.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type listing_tier as enum ('free','pro','fleet');
exception when duplicate_object then null; end $$;

do $$ begin
  create type claim_status as enum ('pending','approved','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('new','forwarded','contacted','won','lost');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- Groomers (directory listings)
-- ---------------------------------------------------------------------------
create table if not exists groomers (
  id uuid primary key default gen_random_uuid(),
  -- Owner is null until the business claims the listing.
  owner uuid references auth.users(id) on delete set null,
  slug text not null,
  name text not null,
  city text not null,
  state text not null,
  city_slug text not null,
  phone text not null default '',
  email text not null default '',
  website text,
  tagline text not null default '',
  about text not null default '',
  tags text[] not null default '{}',
  zip_codes text[] not null default '{}',
  price_range text not null default '',
  response_time text not null default '',
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  tier listing_tier not null default 'free',
  verified boolean not null default false,
  -- Published listings are publicly readable; drafts are owner-only.
  published boolean not null default true,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (city_slug, slug)
);

create index if not exists groomers_city_slug_idx on groomers (city_slug);
create index if not exists groomers_zip_codes_idx on groomers using gin (zip_codes);
create index if not exists groomers_owner_idx on groomers (owner);

drop trigger if exists groomers_updated on groomers;
create trigger groomers_updated before update on groomers
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Leads (quote requests from pet owners)
-- ---------------------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  groomer_id uuid not null references groomers(id) on delete cascade,
  name text not null,
  contact text not null,
  zip_code text not null default '',
  pet text not null default '',
  message text not null default '',
  status lead_status not null default 'new',
  -- Light abuse control: the hashed submitter IP, never the raw address.
  source_hash text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_groomer_idx on leads (groomer_id, created_at desc);

drop trigger if exists leads_updated on leads;
create trigger leads_updated before update on leads
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Claims (a business asserting ownership of a listing)
-- ---------------------------------------------------------------------------
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  groomer_id uuid references groomers(id) on delete cascade,
  claimant uuid references auth.users(id) on delete cascade,
  business_name text not null,
  city text not null default '',
  phone text not null default '',
  email text not null,
  status claim_status not null default 'pending',
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists claims_claimant_idx on claims (claimant);

drop trigger if exists claims_updated on claims;
create trigger claims_updated before update on claims
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table groomers enable row level security;
alter table leads    enable row level security;
alter table claims   enable row level security;

-- Groomers: published listings are world-readable; owners manage their own.
drop policy if exists groomers_public_read on groomers;
create policy groomers_public_read on groomers
  for select using (published = true or owner = auth.uid());

drop policy if exists groomers_owner_update on groomers;
create policy groomers_owner_update on groomers
  for update using (owner = auth.uid()) with check (owner = auth.uid());

drop policy if exists groomers_owner_insert on groomers;
create policy groomers_owner_insert on groomers
  for insert with check (owner = auth.uid());

-- Leads: anyone may submit one; only the receiving groomer may read them.
-- No public select policy, so leads are never exposed to other visitors.
drop policy if exists leads_public_insert on leads;
create policy leads_public_insert on leads
  for insert with check (true);

drop policy if exists leads_owner_read on leads;
create policy leads_owner_read on leads
  for select using (
    exists (select 1 from groomers g where g.id = leads.groomer_id and g.owner = auth.uid())
  );

drop policy if exists leads_owner_update on leads;
create policy leads_owner_update on leads
  for update using (
    exists (select 1 from groomers g where g.id = leads.groomer_id and g.owner = auth.uid())
  );

-- Claims: a signed-in user may file and read only their own claims.
drop policy if exists claims_own_insert on claims;
create policy claims_own_insert on claims
  for insert with check (claimant = auth.uid());

drop policy if exists claims_own_read on claims;
create policy claims_own_read on claims
  for select using (claimant = auth.uid());

-- ---------------------------------------------------------------------------
-- Column-level privacy
-- ---------------------------------------------------------------------------
-- RLS decides which ROWS are visible, not which columns. Published listings
-- are world-readable, so without this a `select *` with the anon key would
-- hand out every groomer's contact email — a ready-made spam list. The email
-- is only ever needed server-side (lead forwarding), which uses the
-- service-role key and is unaffected by these grants.
--
-- Public reads therefore select an explicit column list; see
-- PUBLIC_COLUMNS in src/lib/groomers.ts.
revoke select (email) on groomers from anon;
revoke select (email) on groomers from authenticated;

-- Billing identifiers are server-only for the same reason.
revoke select (stripe_customer_id, stripe_subscription_id) on groomers from anon;
revoke select (stripe_customer_id, stripe_subscription_id) on groomers from authenticated;

-- ---------------------------------------------------------------------------
-- Outreach suppression list
-- ---------------------------------------------------------------------------
-- CAN-SPAM requires a working opt-out in commercial email, honored within ten
-- business days. An address here must never be contacted again, so the
-- outreach generator checks this list before rendering anything.
create table if not exists suppressions (
  email text primary key,
  reason text not null default 'unsubscribed',
  created_at timestamptz not null default now()
);

alter table suppressions enable row level security;

-- Anyone holding an unsubscribe link may opt out; nobody may read the list
-- back through the anon key, so it cannot be scraped as an address list.
drop policy if exists suppressions_public_insert on suppressions;
create policy suppressions_public_insert on suppressions
  for insert with check (true);
