-- RLS tests. Run with scripts/db-test.sh. Any failed assertion raises and aborts (ON_ERROR_STOP).
\set ON_ERROR_STOP on
begin;
-- Fixtures (as superuser)
insert into auth.users values ('00000000-0000-0000-0000-0000000000a1','alice@example.com'),('00000000-0000-0000-0000-0000000000b2','bob@example.com'),('00000000-0000-0000-0000-0000000000c3','partner@example.com'),('00000000-0000-0000-0000-0000000000d4','admin@example.com');
update profiles set role = 'partner' where id = '00000000-0000-0000-0000-0000000000c3';
update profiles set role = 'admin' where id = '00000000-0000-0000-0000-0000000000d4';
insert into countries (slug, code, name_en, currency, publication_status) values ('testland','TL','Testland','EUR','published');
insert into cities (slug, country_id, name_en, lat, lng, publication_status) select 'test-city', id, 'Test City', 45, 9, 'published' from countries where slug='testland';
insert into restaurants (slug, name, country_id, city_id, lat, lng, publication_status)
  select 'pub-r', 'Published R', co.id, ci.id, 45.0, 9.0, 'published' from countries co, cities ci where co.slug='testland' and ci.slug='test-city';
insert into restaurants (slug, name, country_id, city_id, lat, lng, publication_status)
  select 'draft-r', 'Draft R', co.id, ci.id, 45.01, 9.01, 'draft' from countries co, cities ci where co.slug='testland' and ci.slug='test-city';
insert into restaurants (slug, name, country_id, city_id, lat, lng, publication_status)
  select 'other-r', 'Other R', co.id, ci.id, 45.02, 9.02, 'published' from countries co, cities ci where co.slug='testland' and ci.slug='test-city';
insert into partners (user_id, company, contact_email, verified) values ('00000000-0000-0000-0000-0000000000c3','Pub Co','owner@pub.example', true);
insert into partner_claims (partner_id, restaurant_id, status, evidence_kind)
  select p.id, r.id, 'approved', 'email-domain' from partners p, restaurants r where r.slug='pub-r';
insert into menus (restaurant_id, name_en, kind, service) select id, 'Dinner', 'tasting', 'dinner' from restaurants where slug='pub-r';
insert into menu_prices (menu_id, amount, currency, status, source_url, collected_at) select id, 100, 'EUR', 'verified', 'https://example.com/m', '2026-01-01' from menus;
insert into favorites (user_id, entity_type, entity_slug) values ('00000000-0000-0000-0000-0000000000a1','restaurant','pub-r');

-- helper
create or replace function pg_temp.assert(cond boolean, msg text) returns void language plpgsql as $$
begin if not cond then raise exception 'ASSERTION FAILED: %', msg; end if; raise notice 'ok - %', msg; end $$;

-- 1. anon sees only published restaurants
set local role anon;
select pg_temp.assert((select count(*) from restaurants where slug in ('pub-r','draft-r','other-r')) = 2, 'anon reads only published restaurants');
select pg_temp.assert((select count(*) from favorites) = 0, 'anon cannot read favorites');
select pg_temp.assert((select count(*) from profiles) = 0, 'anon cannot read profiles');
reset role;

-- 2. users cannot read or write each other's data
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000b2';
select pg_temp.assert((select count(*) from favorites) = 0, 'bob cannot read alice favorites');
select pg_temp.assert((select count(*) from profiles) = 1, 'bob reads only his own profile');
do $$ begin
  insert into favorites (user_id, entity_type, entity_slug) values ('00000000-0000-0000-0000-0000000000a1','restaurant','other-r');
  raise exception 'ASSERTION FAILED: bob inserted a favorite for alice';
exception when insufficient_privilege or check_violation then raise notice 'ok - bob cannot write alice favorites'; end $$;
update favorites set entity_slug = 'hacked';
select pg_temp.assert(not exists (select 1 from favorites where entity_slug = 'hacked'), 'bob update on alice favorites affects 0 rows');
do $$ begin
  update profiles set role = 'admin' where id = auth.uid();
  raise exception 'ASSERTION FAILED: bob escalated his role';
exception when raise_exception then
  if sqlerrm like 'ASSERTION%' then raise; end if; raise notice 'ok - users cannot escalate their own role';
end $$;
update restaurants set name = 'pwned' where slug = 'pub-r';
select pg_temp.assert((select name from restaurants where slug='pub-r') = 'Published R', 'regular user cannot edit restaurants');
reset role;

-- 3. alice sees her own favorite
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000a1';
select pg_temp.assert((select count(*) from favorites) = 1, 'alice reads her own favorite');
reset role;

-- 4. partners: only the claimed, approved restaurant; never editorial fields
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000c3';
update restaurants set website = 'https://pub.example' where slug = 'pub-r';
reset role;
select pg_temp.assert((select website from restaurants where slug='pub-r') = 'https://pub.example', 'verified partner edits claimed restaurant');
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000c3';
update restaurants set website = 'https://evil.example' where slug = 'other-r';
reset role;
select pg_temp.assert((select website from restaurants where slug='other-r') is null, 'partner cannot edit unclaimed restaurant');
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000c3';
do $$ begin
  update restaurants set recognition_level = 3 where slug = 'pub-r';
  raise exception 'ASSERTION FAILED: partner changed recognition';
exception when raise_exception then
  if sqlerrm like 'ASSERTION%' then raise; end if; raise notice 'ok - partner cannot change recognition level';
end $$;
do $$ begin
  insert into menu_prices (menu_id, amount, currency, status, source_url, collected_at) select id, 120, 'EUR', 'verified', 'https://x', '2026-02-01' from menus where restaurant_id = (select id from restaurants where slug='pub-r');
  raise exception 'ASSERTION FAILED: partner self-verified a price';
exception when insufficient_privilege or check_violation then raise notice 'ok - partner cannot mark own price verified'; end $$;
insert into menu_prices (menu_id, amount, currency, status, source_url, collected_at) select id, 120, 'EUR', 'estimated', 'https://pub.example/menu', '2026-02-01' from menus where restaurant_id = (select id from restaurants where slug='pub-r');
reset role;

-- 4b. unverified partner cannot edit even with an approved claim
update partners set verified = false;
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000c3';
update restaurants set website = 'https://unverified.example' where slug = 'pub-r';
reset role;
select pg_temp.assert((select website from restaurants where slug='pub-r') = 'https://pub.example', 'unverified partner cannot edit');

-- 5. price_history is append-only and fed by trigger
select pg_temp.assert((select count(*) from price_history) >= 2, 'price_history appended by trigger');
do $$ begin
  update price_history set amount = 1;
  raise exception 'ASSERTION FAILED: price_history was updated';
exception when raise_exception then
  if sqlerrm like 'ASSERTION%' then raise; end if; raise notice 'ok - price_history rejects updates';
end $$;

-- 6. demo rows can never carry a real award
do $$ begin
  insert into restaurants (slug, name, country_id, city_id, lat, lng, is_demo, recognition_kind, recognition_level)
    select 'demo-x', 'Demo X', co.id, ci.id, 1, 1, true, 'award', 2 from countries co, cities ci limit 1;
  raise exception 'ASSERTION FAILED: demo venue accepted a real award';
exception when check_violation then raise notice 'ok - demo venues cannot carry real awards'; end $$;

-- 7. newsletter: anon can subscribe as pending only, cannot read list
set local role anon;
insert into newsletter_subscribers (email, consent_text_version) values ('new@example.com','v1');
select pg_temp.assert((select count(*) from newsletter_subscribers) = 0, 'anon cannot read newsletter list');
do $$ begin
  insert into newsletter_subscribers (email, consent_text_version, status) values ('x@example.com','v1','confirmed');
  raise exception 'ASSERTION FAILED: anon self-confirmed subscription';
exception when insufficient_privilege or check_violation then raise notice 'ok - anon cannot self-confirm subscription'; end $$;
reset role;

-- 8. admin sees drafts
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000d4';
select pg_temp.assert((select count(*) from restaurants where slug in ('pub-r','draft-r','other-r')) = 3, 'admin reads drafts');
reset role;

-- 8b. orders are admin-only
set local role anon;
do $$ begin perform 1 from orders; raise exception 'ASSERTION FAILED: anon read orders'; exception when insufficient_privilege then raise notice 'ok - anon cannot read orders'; end $$;
reset role;

-- 9. RLS is enabled on every public table
select pg_temp.assert(not exists (select 1 from pg_tables where schemaname='public' and tablename <> 'spatial_ref_sys' and not rowsecurity), 'RLS enabled on every table');

rollback;
\echo 'ALL RLS TESTS PASSED'
