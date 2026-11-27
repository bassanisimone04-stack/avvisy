-- ============ Users (Supabase Auth) ============
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  display_name text, locale text not null default 'en', currency char(3) not null default 'EUR',
  units text not null default 'metric' check (units in ('metric','imperial')),
  newsletter_opt_in boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles (id) values (new.id) on conflict do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Current user's role (security definer to avoid recursive RLS on profiles)
create or replace function public.auth_role() returns app_role language sql stable security definer set search_path = public as $$
  select coalesce((select role from profiles where id = auth.uid()), 'user'::app_role)
$$;
create or replace function public.is_staff(roles app_role[] default array['admin','editor','data-verifier']::app_role[]) returns boolean
language sql stable security definer set search_path = public as $$ select public.auth_role() = any(roles) $$;

-- Users cannot escalate their own role
-- SECURITY INVOKER on purpose: current_user must be the caller's role, not the function owner
create or replace function public.protect_role() returns trigger language plpgsql set search_path = public as $$
begin
  if new.role is distinct from old.role and public.auth_role() <> 'admin' and current_user not in ('postgres','service_role','supabase_admin') then
    raise exception 'only admins can change roles';
  end if;
  return new;
end $$;
drop trigger if exists profiles_protect_role on profiles;
create trigger profiles_protect_role before update on profiles for each row execute function protect_role();

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  entity_type text not null check (entity_type in ('restaurant','hotel','experience','itinerary','article')),
  entity_slug text not null, created_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_slug)
);

create table if not exists comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  slugs text[] not null check (cardinality(slugs) between 1 and 4),
  name text, created_at timestamptz not null default now()
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  kind text not null default 'price_change' check (kind in ('price_change','price_below','reopening')),
  threshold_amount numeric(12,2), currency char(3), active boolean not null default true,
  last_notified_at timestamptz, created_at timestamptz not null default now()
);

-- ============ Partners ============
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  company text not null, contact_email text not null, email_domain text generated always as (lower(split_part(contact_email, '@', 2))) stored,
  verified boolean not null default false, verified_at timestamptz, verified_by uuid references profiles(id),
  plan text not null default 'basic' check (plan in ('basic','professional','premium','elite','enterprise')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists partner_claims (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references partners(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  hotel_id uuid references hotels(id) on delete cascade,
  status claim_status not null default 'pending',
  evidence_kind text not null check (evidence_kind in ('email-domain','document','phone-callback')),
  evidence_note text, reviewed_by uuid references profiles(id), reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check (restaurant_id is not null or hotel_id is not null)
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partners(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  product text not null check (product in ('partner-plan','club')),
  plan text not null, status text not null default 'incomplete',
  stripe_customer_id text, stripe_subscription_id text unique, test_mode boolean not null default true,
  current_period_end timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists gift_cards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, name_en text not null, name_it text,
  category text not null, design text not null, values numeric(12,2)[] not null, currency char(3) not null,
  description_en text, description_it text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft', is_demo boolean not null default false
);

create table if not exists affiliate_links (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, partner text not null, url text not null check (url ~ '^https://'),
  label text not null, entity_type text, entity_slug text, active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists affiliate_clicks (
  id bigint generated always as identity primary key,
  link_id uuid not null references affiliate_links(id) on delete cascade,
  clicked_at timestamptz not null default now(), referrer_path text, ip_hash text, user_agent text
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  provider text not null, external_ref text, party_size int check (party_size between 1 and 30),
  requested_for timestamptz, status text not null default 'requested' check (status in ('requested','confirmed','cancelled','failed')),
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid, actor_role text, action text not null, entity_type text not null, entity_id text,
  diff jsonb, created_at timestamptz not null default now()
);
drop trigger if exists audit_logs_immutable on audit_logs;
create trigger audit_logs_immutable before update or delete on audit_logs for each row execute function reject_mutation();

-- ============ Inbound forms ============
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  locale text not null default 'en', topics text[] not null default '{}', cities text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  confirm_token_hash text, consent_text_version text not null, consent_at timestamptz not null default now(),
  confirmed_at timestamptz, created_at timestamptz not null default now()
);

create table if not exists form_submissions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact','correction','waitlist','concierge','claim','partner-lead','gift-interest')),
  email text not null, name text, subject_ref text, message text, payload jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new','in_progress','closed','spam')),
  created_at timestamptz not null default now()
);
