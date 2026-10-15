-- Screenshade — PostgreSQL schema for Supabase.
-- Run in the Supabase SQL editor (or `psql`). Column names are snake_case versions of the app's camelCase fields.
-- The Next.js server accesses these tables with the SERVICE ROLE key (server-side only); RLS is enabled with NO public
-- policies, so the anon key can read/write nothing.

create table if not exists movies (
  id text primary key, slug text unique not null, title text not null, year int not null check (year between 1880 and 2100),
  kind text not null check (kind in ('film','series')), genre text not null, synopsis text not null,
  image_url text, image_credit text
);
create table if not exists actors (
  id text primary key, slug text unique not null, name text not null, bio text, image_url text, image_credit text
);
create table if not exists characters (
  id text primary key, name text not null,
  actor_id text not null references actors(id) on delete restrict,
  movie_id text not null references movies(id) on delete restrict
);
create table if not exists brands (
  id text primary key, slug text unique not null, name text not null, country text not null, description text not null, website text
);
create table if not exists sunglasses_models (
  id text primary key, slug text unique not null, name text not null,
  brand_id text not null references brands(id) on delete restrict,
  model_code text, shape text not null, style_tags jsonb not null default '[]',
  frame_color text not null, lens_color text not null,
  status text not null check (status in ('in_production','discontinued','vintage','unknown')),
  price_band text check (price_band in ('under50','under100','under200','over200')),
  description text not null, specs jsonb not null default '[]',
  image_url text, image_credit text, reviewed boolean not null default false, verified_at text
);
-- A model can appear in many movies and a movie can have many models: that is this table.
create table if not exists movie_appearances (
  id text primary key,
  model_id text not null references sunglasses_models(id) on delete restrict,
  movie_id text not null references movies(id) on delete restrict,
  actor_id text not null references actors(id) on delete restrict,
  character_id text not null references characters(id) on delete restrict,
  match_type text not null check (match_type in ('exact','official_reissue','similar','unconfirmed')),
  notes text not null default ''
);
create table if not exists identification_evidence (
  id text primary key,
  appearance_id text not null references movie_appearances(id) on delete restrict,
  source_type text not null check (source_type in ('primary','brand','press','reference','fan_database','retailer')),
  source_title text not null, source_url text not null, checked_at text not null, supports text not null,
  stance text not null default 'supports' check (stance in ('supports','disputes'))
);
create table if not exists product_alternatives (
  id text primary key,
  original_model_id text not null references sunglasses_models(id) on delete restrict,
  alternative_model_id text not null references sunglasses_models(id) on delete restrict,
  reason text not null, check (original_model_id <> alternative_model_id)
);
create table if not exists merchants (
  id text primary key, slug text unique not null, name text not null, network text not null, domain text not null,
  search_url_template text, affiliate_params text, estimated_epc numeric, active boolean not null default true
);
create table if not exists affiliate_offers (
  id text primary key,
  model_id text not null references sunglasses_models(id) on delete restrict,
  merchant_id text not null references merchants(id) on delete restrict,
  price numeric check (price is null or price >= 0), currency text not null default 'USD',
  availability text not null check (availability in ('in_stock','limited','out_of_stock','unknown')),
  shipping text not null default '', url text not null check (url like 'https://%'), last_checked text not null
);
create table if not exists articles (
  id text primary key, slug text unique not null, title text not null, meta_title text not null default '', meta_description text not null default '',
  excerpt text not null default '', answer text not null default '', body text not null default '',
  faq jsonb not null default '[]', sources jsonb not null default '[]',
  model_ids jsonb not null default '[]', movie_ids jsonb not null default '[]',
  category text not null, target_keyword text not null default '', search_intent text not null default '',
  status text not null check (status in ('brief','draft','in_review','scheduled','published')),
  publish_at text, created_at text not null, updated_at text not null,
  reviewed boolean not null default false, ai_generated boolean not null default false
);
create table if not exists keywords (
  id text primary key, term text not null, volume int, difficulty int, intent text not null default '',
  cluster text not null default '', source text not null default '', article_id text, target_url text
);
create table if not exists click_events (
  id text primary key, at text not null, merchant_id text not null, model_id text not null, offer_id text, src text not null,
  kind text not null check (kind in ('offer','search'))
);
create index if not exists click_events_at on click_events (at);
create table if not exists view_counts (
  id text primary key, type text not null check (type in ('model','article','movie')), ref_id text not null, date text not null, count int not null default 0
);
create table if not exists revenue_entries (
  id text primary key, merchant_id text not null references merchants(id) on delete restrict,
  period_start text not null, period_end text not null, amount numeric not null check (amount >= 0),
  kind text not null check (kind in ('reported','estimated')), note text not null default ''
);
create table if not exists redirects ("id" text primary key, "from" text unique not null, "to" text not null, permanent boolean not null default true);
create table if not exists contact_messages (
  id text primary key, at text not null, name text not null, email text not null, subject text not null, body text not null, handled boolean not null default false
);
create table if not exists photos (
  id text primary key, url text not null check (url like 'https://%'), alt text not null, credit text not null, license text not null, license_url text,
  model_id text references sunglasses_models(id) on delete set null, movie_id text references movies(id) on delete set null, approved boolean not null default false
);

-- Lock everything down: the anon/authenticated roles get no access; only the service role (server) bypasses RLS.
do $$
declare t text;
begin
  for t in select unnest(array['movies','actors','characters','brands','sunglasses_models','movie_appearances','identification_evidence','product_alternatives','merchants','affiliate_offers','articles','keywords','click_events','view_counts','revenue_entries','redirects','contact_messages','photos'])
  loop execute format('alter table %I enable row level security', t); end loop;
end $$;

-- Storage (authorised photographs): create a PUBLIC bucket named "photos" in the Supabase dashboard, then record each file's
-- URL, credit and licence in the admin ("Fotografie autorizzate"). Only approve images you have rights to.
