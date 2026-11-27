-- Price Index: materialised, verified prices only, with sample size and collection date.
create materialized view if not exists price_index_city as
select
  ci.id as city_id, ci.slug as city_slug, ci.name_en as city_name, mp.currency,
  m.service,
  round(avg(mp.amount), 0) as avg_amount,
  min(mp.amount) as min_amount,
  max(mp.amount) as max_amount,
  count(*)::int as sample_size,
  max(mp.collected_at) as collected_at
from menu_prices mp
join menus m on m.id = mp.menu_id
join restaurants r on r.id = m.restaurant_id
join cities ci on ci.id = r.city_id
where mp.status = 'verified' and m.kind = 'tasting' and r.publication_status = 'published'
group by ci.id, ci.slug, ci.name_en, mp.currency, m.service;
create unique index if not exists price_index_city_uidx on price_index_city (city_id, currency, service);

create or replace function public.refresh_price_index() returns void language sql security definer set search_path = public as $$
  refresh materialized view concurrently price_index_city;
$$;

-- Radius search helper for the map ("search this area" / distance sort)
create or replace function public.restaurants_within(lat double precision, lng double precision, radius_m double precision)
returns setof restaurants language sql stable as $$
  select * from restaurants
  where publication_status = 'published'
    and st_dwithin(location, st_setsrid(st_makepoint(lng, lat), 4326)::geography, radius_m)
  order by location <-> st_setsrid(st_makepoint(lng, lat), 4326)::geography
$$;

-- Typo-tolerant name search (pg_trgm) used when Typesense is not configured
create or replace function public.search_restaurants(q text, max_results int default 20)
returns table (id uuid, slug text, name text, score real) language sql stable as $$
  select r.id, r.slug, r.name,
    greatest(similarity(f_unaccent(lower(r.name)), f_unaccent(lower(q))), ts_rank(r.search, plainto_tsquery('simple', f_unaccent(q)))) as score
  from restaurants r
  where r.publication_status = 'published'
    and (f_unaccent(lower(r.name)) % f_unaccent(lower(q)) or r.search @@ plainto_tsquery('simple', f_unaccent(q)))
  order by score desc
  limit max_results
$$;

grant select on price_index_city to anon, authenticated;
