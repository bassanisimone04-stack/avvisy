-- ===========================================================================
-- Scortvia — Ripara la visualizzazione delle foto dei lotti
-- Esegui questo UNA VOLTA nel SQL Editor di Supabase.
-- Risolve il caso in cui la foto viene caricata ma resta grigia:
--   1) assicura la colonna image_urls sulla tabella lots
--   2) rende PUBBLICO il bucket delle foto (lot-images)
--   3) (ri)crea le policy di lettura/scrittura sulle immagini
-- È idempotente: puoi rieseguirlo senza rischi.
-- ===========================================================================

-- 1) Colonna per gli URL delle foto (se già c'è non fa nulla)
alter table public.lots
  add column if not exists image_urls text[] not null default '{}';

-- 2) Bucket foto pubblico (crea se manca, altrimenti lo forza a pubblico)
insert into storage.buckets (id, name, public)
values ('lot-images', 'lot-images', true)
on conflict (id) do update set public = true;

-- 3) Policy: chiunque può leggere le foto; gli utenti autenticati le caricano
drop policy if exists lot_images_read on storage.objects;
create policy lot_images_read on storage.objects for select
  using (bucket_id = 'lot-images');

drop policy if exists lot_images_write on storage.objects;
create policy lot_images_write on storage.objects for insert to authenticated
  with check (bucket_id = 'lot-images');
