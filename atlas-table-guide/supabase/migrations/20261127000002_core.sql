-- ============ Geography ============
create table if not exists countries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code char(2) not null unique,
  name_en text not null, name_it text,
  currency char(3) not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified',
  source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft',
  is_demo boolean not null default false
);

create table if not exists regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null, country_id uuid not null references countries(id) on delete cascade,
  name_en text not null, name_it text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft', is_demo boolean not null default false,
  unique (country_id, slug)
);

create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  subject text not null,
  licence text not null,              -- e.g. 'owner-supplied', 'CC BY 4.0', 'generated-illustrative'
  author text, source_url text,
  is_illustrative boolean not null default false,
  width int, height int, alt_override_en text, alt_override_it text,
  uploaded_by uuid, licence_confirmed boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  is_demo boolean not null default false,
  constraint media_licence_recorded check (length(licence) > 0)
);

create table if not exists cities (
  id uuid primary key default gen_random_uuid(),
  slug text not null, country_id uuid not null references countries(id) on delete cascade,
  region_id uuid references regions(id) on delete set null,
  name_en text not null, name_it text,
  lat double precision not null, lng double precision not null,
  location geography(Point,4326) generated always as (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored,
  intro_en text, intro_it text, best_time_en text, best_time_it text,
  hero_media_id uuid references media(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft', is_demo boolean not null default false,
  unique (country_id, slug)
);

create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, city_id uuid not null references cities(id) on delete cascade,
  featured_order int, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  publication_status publication_status not null default 'draft', is_demo boolean not null default false,
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz
);

-- ============ People & taxonomy ============
create table if not exists chefs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, name text not null, bio_en text, bio_it text, media_id uuid references media(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft', is_demo boolean not null default false
);

create table if not exists cuisines (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, name_en text not null, name_it text
);

create table if not exists amenities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, name_en text not null, name_it text,
  schema_feature text -- name used in LocationFeatureSpecification (null = not emitted)
);

create table if not exists data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null, kind text not null check (kind in ('restaurant-submission','licensed-dataset','official-website','editorial-research','manual-verification','partner-portal')),
  licence text, url text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- ============ Restaurants ============
create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  country_id uuid not null references countries(id),
  region_id uuid references regions(id),
  city_id uuid not null references cities(id),
  chef_id uuid references chefs(id) on delete set null,
  data_source_id uuid references data_sources(id),
  street text, postal_code text, locality text, address_region text,
  lat double precision not null, lng double precision not null,
  location geography(Point,4326) generated always as (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored,
  website text, phone text, email text,
  style_en text, description_en text,
  recognition_level smallint not null default 0 check (recognition_level between 0 and 3),
  recognition_kind text not null default 'none' check (recognition_kind in ('award','demo','none')),
  atlas_selection boolean not null default false,
  vegetarian boolean not null default false, vegan boolean not null default false, gluten_free boolean not null default false,
  reservation_method reservation_method not null default 'online', reservation_url text, reservation_instructions_en text,
  dress_code_en text, duration_minutes int, languages text[] not null default '{}',
  atmosphere_en text, family_policy_en text, cancellation_policy_en text,
  featured boolean not null default false,
  review_count int not null default 0, review_avg numeric(3,2),
  search tsvector generated always as (
    setweight(to_tsvector('simple', f_unaccent(coalesce(name,''))), 'A') ||
    setweight(to_tsvector('simple', f_unaccent(coalesce(style_en,''))), 'B') ||
    setweight(to_tsvector('english', coalesce(description_en,'')), 'C')
  ) stored,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft', is_demo boolean not null default false,
  -- demo venues may never carry a real award
  constraint demo_no_real_award check (not (is_demo and recognition_kind = 'award')),
  constraint real_no_demo_level check (is_demo or recognition_kind <> 'demo')
);
create index if not exists restaurants_location_gix on restaurants using gist (location);
create index if not exists restaurants_search_gin on restaurants using gin (search);
create index if not exists restaurants_name_trgm on restaurants using gin (f_unaccent(lower(name)) gin_trgm_ops);
create index if not exists restaurants_city_idx on restaurants (city_id, publication_status);

create table if not exists restaurant_translations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  locale text not null check (locale ~ '^[a-z]{2}$'),
  slug text, style text, description text, dress_code text, atmosphere text, family_policy text,
  cancellation_policy text, reservation_instructions text,
  needs_review boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (restaurant_id, locale)
);

create table if not exists restaurant_cuisines (
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  cuisine_id uuid not null references cuisines(id) on delete cascade,
  primary key (restaurant_id, cuisine_id)
);

create table if not exists restaurant_images (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  media_id uuid not null references media(id) on delete restrict,
  position int not null default 0, subject text not null, dish text,
  created_at timestamptz not null default now()
);

create table if not exists restaurant_amenities (
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  amenity_id uuid not null references amenities(id) on delete cascade,
  primary key (restaurant_id, amenity_id)
);

create table if not exists restaurant_awards (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  body text not null, title text not null, year int not null check (year between 1900 and 2100),
  level smallint not null check (level between 1 and 3),
  source_url text not null check (source_url ~ '^https?://'),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'pending', last_verified_at timestamptz
);

create table if not exists awards_history (
  id uuid primary key default gen_random_uuid(),
  award_id uuid references restaurant_awards(id) on delete set null,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  body text not null, title text not null, year int not null, change text not null check (change in ('gained','retained','lost','changed')),
  source_url text not null, recorded_at timestamptz not null default now()
);

create table if not exists opening_hours (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  day_of_week smallint check (day_of_week between 1 and 7),  -- ISO: 1 = Monday
  opens time, closes time, valid_from date, valid_through date,
  is_closure boolean not null default false, closure_date date, note text,
  check ((is_closure and closure_date is not null) or (not is_closure and day_of_week is not null and opens is not null and closes is not null))
);

create table if not exists menus (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name_en text not null, name_it text, kind menu_kind not null, service menu_service not null default 'any',
  courses int, season_from date, season_to date, position int not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists menu_prices (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references menus(id) on delete cascade,
  amount numeric(12,2) check (amount is null or amount >= 0),
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  status price_status not null default 'missing',
  source_url text, collected_at date,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (status = 'missing' or (amount is not null and source_url is not null and collected_at is not null))
);

create table if not exists wine_pairings (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references menus(id) on delete cascade,
  kind text not null default 'wine' check (kind in ('wine','non_alcoholic','premium')),
  amount numeric(12,2), currency char(3) not null, status price_status not null default 'missing',
  source_url text, collected_at date,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

-- Append-only price history. Rows are written by trigger; UPDATE/DELETE are rejected.
create table if not exists price_history (
  id bigint generated always as identity primary key,
  menu_price_id uuid references menu_prices(id) on delete set null,
  menu_id uuid not null references menus(id) on delete cascade,
  amount numeric(12,2), currency char(3) not null, status price_status not null,
  source_url text, recorded_at timestamptz not null default now()
);
create index if not exists price_history_menu_idx on price_history (menu_id, recorded_at);

create or replace function public.price_history_append() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' or new.amount is distinct from old.amount or new.currency is distinct from old.currency or new.status is distinct from old.status then
    insert into price_history (menu_price_id, menu_id, amount, currency, status, source_url, recorded_at)
    values (new.id, new.menu_id, new.amount, new.currency, new.status, new.source_url, coalesce(new.collected_at::timestamptz, now()));
  end if;
  return new;
end $$;
drop trigger if exists menu_prices_history on menu_prices;
create trigger menu_prices_history after insert or update on menu_prices for each row execute function price_history_append();

create or replace function public.reject_mutation() returns trigger language plpgsql as $$
begin raise exception '% is append-only', tg_table_name; end $$;
drop trigger if exists price_history_immutable on price_history;
create trigger price_history_immutable before update or delete on price_history for each row execute function reject_mutation();

-- ============ Hotels, experiences, travel ============
create table if not exists hotels (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, name text not null,
  city_id uuid not null references cities(id), country_id uuid not null references countries(id),
  category text not null check (category in ('recognised-restaurant','restaurant-with-rooms','boutique','gastronomic-resort','wine-estate','countryside-retreat')),
  description_en text, description_it text, amenities text[] not null default '{}', rooms int,
  lat double precision not null, lng double precision not null,
  location geography(Point,4326) generated always as (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored,
  street text, postal_code text, locality text,
  price_from numeric(12,2), price_currency char(3), price_status price_status not null default 'missing',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft', is_demo boolean not null default false
);
create index if not exists hotels_location_gix on hotels using gist (location);

create table if not exists hotel_restaurants (
  hotel_id uuid not null references hotels(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  primary key (hotel_id, restaurant_id)
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, name text not null,
  category text not null check (category in ('chefs-table','private-dining','cooking-class','wine-tasting','vineyard-tour','truffle-hunting','food-tour','market-visit','culinary-weekend')),
  city_id uuid not null references cities(id), country_id uuid not null references countries(id),
  restaurant_id uuid references restaurants(id) on delete set null, supplier_ref text,
  description_en text, description_it text, duration_hours numeric(5,1),
  price numeric(12,2), price_currency char(3), price_status price_status not null default 'missing',
  lat double precision not null, lng double precision not null,
  location geography(Point,4326) generated always as (st_setsrid(st_makepoint(lng, lat), 4326)::geography) stored,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft', is_demo boolean not null default false
);

create table if not exists itineraries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, title_en text not null, title_it text, summary_en text, summary_it text,
  country_id uuid references countries(id), budget_amount numeric(12,2), budget_currency char(3),
  hero_media_id uuid references media(id), owner_id uuid, -- null = editorial; otherwise a user's saved itinerary
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft', is_demo boolean not null default false
);

create table if not exists itinerary_items (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references itineraries(id) on delete cascade,
  day int not null check (day > 0), position int not null default 0, time time,
  item_type text not null check (item_type in ('restaurant','hotel','experience','note')),
  restaurant_id uuid references restaurants(id), hotel_id uuid references hotels(id), experience_id uuid references experiences(id),
  note_en text, note_it text
);

-- ============ Editorial ============
create table if not exists article_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, name_en text not null, name_it text
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique, category_id uuid not null references article_categories(id),
  title_en text not null, title_it text, excerpt_en text, excerpt_it text,
  body jsonb not null default '[]'::jsonb, author_name text not null, author_role text,
  published_at timestamptz, sponsored boolean not null default false, sponsor_name text,
  hero_media_id uuid references media(id),
  related_restaurant_ids uuid[] not null default '{}', related_city_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  verification_status verification_status not null default 'unverified', source_url text, last_verified_at timestamptz,
  publication_status publication_status not null default 'draft', is_demo boolean not null default false,
  constraint sponsored_needs_sponsor check (not sponsored or sponsor_name is not null)
);

create table if not exists translations (
  id uuid primary key default gen_random_uuid(),
  namespace text not null, key text not null, locale text not null, value text not null,
  needs_review boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (namespace, key, locale)
);

create table if not exists redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique check (from_path ~ '^/'),
  to_path text, status_code int not null check (status_code in (301, 308, 410)),
  created_at timestamptz not null default now(),
  check (status_code = 410 or to_path is not null)
);

-- updated_at triggers
do $$ declare t text; begin
  foreach t in array array['countries','regions','cities','media','destinations','chefs','data_sources','restaurants','restaurant_translations','restaurant_awards','menus','menu_prices','wine_pairings','hotels','experiences','itineraries','articles','translations'] loop
    execute format('drop trigger if exists %I_touch on %I', t, t);
    execute format('create trigger %I_touch before update on %I for each row execute function touch_updated_at()', t, t);
  end loop;
end $$;
