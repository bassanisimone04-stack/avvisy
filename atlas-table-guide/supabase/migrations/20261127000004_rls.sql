-- ============ Row Level Security: enabled on EVERY table ============
do $$ declare t text; begin
  for t in select tablename from pg_tables where schemaname = 'public' and tablename <> 'spatial_ref_sys' loop
    execute format('alter table %I enable row level security', t);
    execute format('alter table %I force row level security', t);
  end loop;
end $$;

-- Public content: anyone may read published rows; staff may read/write everything.
do $$ declare t text; begin
  foreach t in array array['countries','regions','cities','destinations','chefs','restaurants','hotels','experiences','itineraries','articles','gift_cards'] loop
    execute format('drop policy if exists %I on %I', t || '_public_read', t);
    execute format('create policy %I on %I for select using (publication_status = ''published'' or public.is_staff(array[''admin'',''editor'',''data-verifier'',''partner-manager'',''viewer'']::app_role[]))', t || '_public_read', t);
    execute format('drop policy if exists %I on %I', t || '_staff_write', t);
    execute format('create policy %I on %I for insert with check (public.is_staff())', t || '_staff_write', t);
    execute format('drop policy if exists %I on %I', t || '_staff_update', t);
    execute format('create policy %I on %I for update using (public.is_staff()) with check (public.is_staff())', t || '_staff_update', t);
    execute format('drop policy if exists %I on %I', t || '_admin_delete', t);
    execute format('create policy %I on %I for delete using (public.is_staff(array[''admin'']::app_role[]))', t || '_admin_delete', t);
  end loop;
end $$;

-- Child tables of published parents: readable when the parent restaurant is readable.
do $$ declare t text; begin
  foreach t in array array['restaurant_translations','restaurant_cuisines','restaurant_images','restaurant_amenities','restaurant_awards','awards_history','opening_hours','menus','hotel_restaurants'] loop
    execute format('drop policy if exists %I on %I', t || '_read', t);
    execute format('create policy %I on %I for select using (exists (select 1 from restaurants r where r.id = %I.restaurant_id))', t || '_read', t, t);
    execute format('drop policy if exists %I on %I', t || '_staff_all', t);
    execute format('create policy %I on %I for all using (public.is_staff()) with check (public.is_staff())', t || '_staff_all', t);
  end loop;
end $$;

drop policy if exists menu_prices_read on menu_prices;
create policy menu_prices_read on menu_prices for select using (exists (select 1 from menus m where m.id = menu_prices.menu_id));
drop policy if exists wine_pairings_read on wine_pairings;
create policy wine_pairings_read on wine_pairings for select using (exists (select 1 from menus m where m.id = wine_pairings.menu_id));
drop policy if exists price_history_read on price_history;
create policy price_history_read on price_history for select using (exists (select 1 from menus m where m.id = price_history.menu_id));
drop policy if exists itinerary_items_read on itinerary_items;
create policy itinerary_items_read on itinerary_items for select using (exists (select 1 from itineraries i where i.id = itinerary_items.itinerary_id));

-- Taxonomy / reference: public read, staff write
do $$ declare t text; begin
  foreach t in array array['cuisines','amenities','article_categories','media','translations','redirects','data_sources'] loop
    execute format('drop policy if exists %I on %I', t || '_read', t);
    execute format('create policy %I on %I for select using (true)', t || '_read', t);
    execute format('drop policy if exists %I on %I', t || '_staff_all', t);
    execute format('create policy %I on %I for all using (public.is_staff()) with check (public.is_staff())', t || '_staff_all', t);
  end loop;
end $$;

-- Price writes: data verifiers / admins, and verified partners with an approved claim.
do $$ declare t text; begin
  foreach t in array array['menu_prices','wine_pairings'] loop
    execute format('drop policy if exists %I on %I', t || '_staff_all', t);
    execute format('create policy %I on %I for all using (public.is_staff(array[''admin'',''data-verifier'']::app_role[])) with check (public.is_staff(array[''admin'',''data-verifier'']::app_role[]))', t || '_staff_all', t);
  end loop;
end $$;

create or replace function public.partner_owns_restaurant(rid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from partners p join partner_claims c on c.partner_id = p.id
    where p.user_id = auth.uid() and p.verified and c.status = 'approved' and c.restaurant_id = rid
  )
$$;

drop policy if exists restaurants_partner_update on restaurants;
create policy restaurants_partner_update on restaurants for update
  using (public.partner_owns_restaurant(id)) with check (public.partner_owns_restaurant(id));

-- Partners may never change editorial fields (recognition, selection, status, demo flag)
create or replace function public.guard_partner_restaurant_update() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if public.auth_role() = 'partner' and (
    new.recognition_level is distinct from old.recognition_level or new.recognition_kind is distinct from old.recognition_kind or
    new.atlas_selection is distinct from old.atlas_selection or new.publication_status is distinct from old.publication_status or
    new.verification_status is distinct from old.verification_status or new.is_demo is distinct from old.is_demo or
    new.featured is distinct from old.featured or new.slug is distinct from old.slug
  ) then
    raise exception 'partners cannot change editorial fields';
  end if;
  return new;
end $$;
drop trigger if exists restaurants_partner_guard on restaurants;
create trigger restaurants_partner_guard before update on restaurants for each row execute function guard_partner_restaurant_update();

drop policy if exists menus_partner on menus;
create policy menus_partner on menus for all using (public.partner_owns_restaurant(restaurant_id)) with check (public.partner_owns_restaurant(restaurant_id));
drop policy if exists menu_prices_partner on menu_prices;
create policy menu_prices_partner on menu_prices for all
  using (exists (select 1 from menus m where m.id = menu_id and public.partner_owns_restaurant(m.restaurant_id)))
  with check (exists (select 1 from menus m where m.id = menu_id and public.partner_owns_restaurant(m.restaurant_id)) and status <> 'verified');

-- Profiles: own row only (admins see all)
drop policy if exists profiles_self_read on profiles;
create policy profiles_self_read on profiles for select using (id = auth.uid() or public.is_staff(array['admin','partner-manager']::app_role[]));
drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update on profiles for update using (id = auth.uid() or public.is_staff(array['admin']::app_role[])) with check (id = auth.uid() or public.is_staff(array['admin']::app_role[]));
drop policy if exists profiles_self_delete on profiles;
create policy profiles_self_delete on profiles for delete using (id = auth.uid());

-- Per-user data
do $$ declare t text; begin
  foreach t in array array['favorites','comparisons','alerts'] loop
    execute format('drop policy if exists %I on %I', t || '_own', t);
    execute format('create policy %I on %I for all using (user_id = auth.uid()) with check (user_id = auth.uid())', t || '_own', t);
  end loop;
end $$;

-- Partners
drop policy if exists partners_own on partners;
create policy partners_own on partners for select using (user_id = auth.uid() or public.is_staff(array['admin','partner-manager']::app_role[]));
drop policy if exists partners_insert on partners;
create policy partners_insert on partners for insert with check (user_id = auth.uid() and verified = false);
drop policy if exists partners_staff_update on partners;
create policy partners_staff_update on partners for update using (public.is_staff(array['admin','partner-manager']::app_role[]));

drop policy if exists claims_own_read on partner_claims;
create policy claims_own_read on partner_claims for select using (
  exists (select 1 from partners p where p.id = partner_id and p.user_id = auth.uid()) or public.is_staff(array['admin','partner-manager']::app_role[]));
drop policy if exists claims_insert on partner_claims;
create policy claims_insert on partner_claims for insert with check (
  status = 'pending' and reviewed_by is null and exists (select 1 from partners p where p.id = partner_id and p.user_id = auth.uid()));
drop policy if exists claims_staff_update on partner_claims;
create policy claims_staff_update on partner_claims for update using (public.is_staff(array['admin','partner-manager']::app_role[]));

drop policy if exists subscriptions_own on subscriptions;
create policy subscriptions_own on subscriptions for select using (
  user_id = auth.uid() or exists (select 1 from partners p where p.id = partner_id and p.user_id = auth.uid()) or public.is_staff(array['admin']::app_role[]));
-- subscriptions are written only by the Stripe webhook (service role bypasses RLS)

-- Affiliate & reservations
drop policy if exists affiliate_links_read on affiliate_links;
create policy affiliate_links_read on affiliate_links for select using (active or public.is_staff());
drop policy if exists affiliate_links_staff on affiliate_links;
create policy affiliate_links_staff on affiliate_links for all using (public.is_staff(array['admin','partner-manager']::app_role[])) with check (public.is_staff(array['admin','partner-manager']::app_role[]));
drop policy if exists affiliate_clicks_staff_read on affiliate_clicks;
create policy affiliate_clicks_staff_read on affiliate_clicks for select using (public.is_staff(array['admin','partner-manager','viewer']::app_role[]));
-- clicks are inserted by the /go/ route handler with the service role

drop policy if exists reservations_own on reservations;
create policy reservations_own on reservations for select using (user_id = auth.uid() or public.is_staff(array['admin']::app_role[]));

-- Audit log: append by staff; read by admins/editors/viewers
drop policy if exists audit_read on audit_logs;
create policy audit_read on audit_logs for select using (public.is_staff(array['admin','editor','viewer']::app_role[]));
drop policy if exists audit_insert on audit_logs;
create policy audit_insert on audit_logs for insert with check (public.is_staff(array['admin','editor','data-verifier','partner-manager']::app_role[]) and actor_id = auth.uid());

-- Inbound forms: anyone may submit, nobody but staff may read
drop policy if exists newsletter_insert on newsletter_subscribers;
create policy newsletter_insert on newsletter_subscribers for insert with check (status = 'pending' and confirmed_at is null);
drop policy if exists newsletter_staff on newsletter_subscribers;
create policy newsletter_staff on newsletter_subscribers for select using (public.is_staff(array['admin','editor']::app_role[]));
drop policy if exists forms_insert on form_submissions;
create policy forms_insert on form_submissions for insert with check (status = 'new');
drop policy if exists forms_staff on form_submissions;
create policy forms_staff on form_submissions for select using (public.is_staff(array['admin','editor','partner-manager']::app_role[]));

-- Grants (Supabase roles)
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant insert on newsletter_subscribers, form_submissions to anon;
grant usage, select on all sequences in schema public to anon, authenticated;
