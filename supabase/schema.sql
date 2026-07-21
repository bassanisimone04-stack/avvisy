-- ===========================================================================
-- Scortvia — Schema database (Supabase / PostgreSQL)
-- Incolla ed esegui questo file nel SQL Editor di Supabase.
-- ===========================================================================

-- Estensioni
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enumerazioni di stato
-- ---------------------------------------------------------------------------
do $$ begin
  create type verification_status as enum ('Non verificata','In verifica','Verificata','Sospesa');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lot_status as enum ('Bozza','In revisione','Pubblicato','Riservato','Venduto','Scaduto','Sospeso');
exception when duplicate_object then null; end $$;

do $$ begin
  create type offer_status as enum ('Inviata','Visualizzata','In valutazione','Controproposta','Accettata','Rifiutata','Ritirata','Scaduta');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum ('In attesa di conferma','Confermato','In preparazione','Spedito','Consegnato','Completato','Contestato','Annullato');
exception when duplicate_object then null; end $$;

do $$ begin
  create type delivery_mode as enum ('Spedizione','Ritiro in sede','Spedizione e ritiro');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Funzione updated_at
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- Aziende
-- ---------------------------------------------------------------------------
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  owner uuid references auth.users(id) on delete set null,
  ragione_sociale text not null,
  display_name text not null,
  vat_number text not null,
  sector text not null default '',
  description text not null default '',
  region text not null default '',
  province text not null default '',
  address text not null default '',
  founded_year int,
  employees text not null default '',
  verification verification_status not null default 'In verifica',
  rating numeric(2,1) not null default 0,
  reviews_count int not null default 0,
  logo text not null default '',
  verified_documents text[] not null default '{}',
  registered_at timestamptz not null default now(),
  sales_count int not null default 0,
  wallet_balance numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
drop trigger if exists companies_updated on companies;
create trigger companies_updated before update on companies
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Lotti
-- ---------------------------------------------------------------------------
create table if not exists lots (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  category text not null,
  subcategory text not null default '',
  images text[] not null default '{}',
  image_urls text[] not null default '{}',
  quantity numeric not null,
  unit text not null default 'pz',
  min_quantity numeric not null default 1,
  unit_price numeric(12,2) not null,
  negotiable boolean not null default true,
  condition text not null,
  region text not null default '',
  province text not null default '',
  delivery delivery_mode not null default 'Spedizione e ritiro',
  documents text[] not null default '{}',
  certifications text[] not null default '{}',
  seller_id uuid not null references companies(id) on delete cascade,
  published_at date not null default current_date,
  expires_at date not null default (current_date + 45),
  views int not null default 0,
  offers_count int not null default 0,
  status lot_status not null default 'In revisione',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists lots_status_idx on lots(status);
create index if not exists lots_category_idx on lots(category);
create index if not exists lots_seller_idx on lots(seller_id);
drop trigger if exists lots_updated on lots;
create trigger lots_updated before update on lots
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Offerte
-- ---------------------------------------------------------------------------
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references lots(id) on delete cascade,
  buyer_id uuid not null references companies(id) on delete cascade,
  seller_id uuid not null references companies(id) on delete cascade,
  quantity numeric not null,
  unit_price numeric(12,2) not null,
  total_value numeric(12,2) not null,
  message text not null default '',
  date date not null default current_date,
  expires_at date not null default (current_date + 7),
  status offer_status not null default 'Inviata',
  history jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create index if not exists offers_seller_idx on offers(seller_id);
create index if not exists offers_buyer_idx on offers(buyer_id);

-- ---------------------------------------------------------------------------
-- Ordini
-- ---------------------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  lot_id uuid references lots(id) on delete set null,
  lot_title text not null,
  buyer_id uuid not null references companies(id) on delete cascade,
  seller_id uuid not null references companies(id) on delete cascade,
  quantity numeric not null,
  unit_price numeric(12,2) not null,
  subtotal numeric(12,2) not null,
  commission numeric(12,2) not null,
  total numeric(12,2) not null,
  delivery delivery_mode not null,
  status order_status not null default 'In attesa di conferma',
  history jsonb not null default '[]',
  documents text[] not null default '{}',
  date date not null default current_date,
  paid boolean not null default false,
  payment_method text,
  created_at timestamptz not null default now()
);
create index if not exists orders_seller_idx on orders(seller_id);
create index if not exists orders_buyer_idx on orders(buyer_id);

-- ---------------------------------------------------------------------------
-- Notifiche
-- ---------------------------------------------------------------------------
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  type text not null,
  title text not null,
  detail text not null default '',
  date date not null default current_date,
  read boolean not null default false,
  href text,
  audience text not null default 'both',
  created_at timestamptz not null default now()
);
create index if not exists notifications_company_idx on notifications(company_id);

-- ---------------------------------------------------------------------------
-- Recensioni
-- ---------------------------------------------------------------------------
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  author_company text not null,
  rating int not null check (rating between 1 and 5),
  date date not null default current_date,
  title text not null,
  body text not null default '',
  lot_id uuid references lots(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Preferiti e ricerche salvate (per utente autenticato)
-- ---------------------------------------------------------------------------
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lot_id uuid not null references lots(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, lot_id)
);

create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  query text not null default '',
  alerts boolean not null default true,
  created_at timestamptz not null default now()
);

-- ===========================================================================
-- Row Level Security (RLS)
-- ===========================================================================
alter table companies enable row level security;
alter table lots enable row level security;
alter table offers enable row level security;
alter table orders enable row level security;
alter table notifications enable row level security;
alter table reviews enable row level security;
alter table favorites enable row level security;
alter table saved_searches enable row level security;

-- Helper: id delle aziende possedute dall'utente corrente
-- (usato nelle policy tramite subquery)

-- COMPANIES: lettura pubblica, scrittura solo del proprietario
drop policy if exists companies_read on companies;
create policy companies_read on companies for select using (true);
drop policy if exists companies_write on companies;
create policy companies_write on companies for insert with check (owner = auth.uid());
drop policy if exists companies_update on companies;
create policy companies_update on companies for update using (owner = auth.uid());

-- LOTS: lettura pubblica dei pubblicati + i propri; scrittura del venditore
drop policy if exists lots_read on lots;
create policy lots_read on lots for select using (
  status = 'Pubblicato'
  or seller_id in (select id from companies where owner = auth.uid())
);
drop policy if exists lots_write on lots;
create policy lots_write on lots for insert with check (
  seller_id in (select id from companies where owner = auth.uid())
);
drop policy if exists lots_update on lots;
create policy lots_update on lots for update using (
  seller_id in (select id from companies where owner = auth.uid())
);
drop policy if exists lots_delete on lots;
create policy lots_delete on lots for delete using (
  seller_id in (select id from companies where owner = auth.uid())
);

-- OFFERS: visibili a compratore e venditore coinvolti
drop policy if exists offers_read on offers;
create policy offers_read on offers for select using (
  buyer_id in (select id from companies where owner = auth.uid())
  or seller_id in (select id from companies where owner = auth.uid())
);
drop policy if exists offers_write on offers;
create policy offers_write on offers for insert with check (
  buyer_id in (select id from companies where owner = auth.uid())
);
drop policy if exists offers_update on offers;
create policy offers_update on offers for update using (
  buyer_id in (select id from companies where owner = auth.uid())
  or seller_id in (select id from companies where owner = auth.uid())
);

-- ORDERS: visibili a compratore e venditore
drop policy if exists orders_read on orders;
create policy orders_read on orders for select using (
  buyer_id in (select id from companies where owner = auth.uid())
  or seller_id in (select id from companies where owner = auth.uid())
);
drop policy if exists orders_write on orders;
create policy orders_write on orders for insert with check (
  buyer_id in (select id from companies where owner = auth.uid())
  or seller_id in (select id from companies where owner = auth.uid())
);
drop policy if exists orders_update on orders;
create policy orders_update on orders for update using (
  buyer_id in (select id from companies where owner = auth.uid())
  or seller_id in (select id from companies where owner = auth.uid())
);

-- NOTIFICATIONS: le proprie (della propria azienda) o globali
drop policy if exists notifications_read on notifications;
create policy notifications_read on notifications for select using (
  company_id is null
  or company_id in (select id from companies where owner = auth.uid())
);
drop policy if exists notifications_update on notifications;
create policy notifications_update on notifications for update using (
  company_id in (select id from companies where owner = auth.uid())
);
drop policy if exists notifications_write on notifications;
create policy notifications_write on notifications for insert with check (true);

-- REVIEWS: lettura pubblica, inserimento autenticato
drop policy if exists reviews_read on reviews;
create policy reviews_read on reviews for select using (true);
drop policy if exists reviews_write on reviews;
create policy reviews_write on reviews for insert with check (auth.uid() is not null);

-- FAVORITES / SAVED SEARCHES: solo il proprio utente
drop policy if exists favorites_all on favorites;
create policy favorites_all on favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists saved_searches_all on saved_searches;
create policy saved_searches_all on saved_searches for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ===========================================================================
-- Storage: immagini e documenti dei lotti
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('lot-images', 'lot-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('lot-documents', 'lot-documents', false)
on conflict (id) do nothing;

-- Lettura pubblica immagini
drop policy if exists lot_images_read on storage.objects;
create policy lot_images_read on storage.objects for select
  using (bucket_id = 'lot-images');

-- Upload immagini per utenti autenticati
drop policy if exists lot_images_write on storage.objects;
create policy lot_images_write on storage.objects for insert to authenticated
  with check (bucket_id = 'lot-images');

-- Documenti: lettura/scrittura solo autenticati
drop policy if exists lot_docs_rw on storage.objects;
create policy lot_docs_rw on storage.objects for all to authenticated
  using (bucket_id = 'lot-documents')
  with check (bucket_id = 'lot-documents');
