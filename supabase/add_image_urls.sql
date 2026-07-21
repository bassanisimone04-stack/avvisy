-- ===========================================================================
-- Scortvia — Aggiunge il supporto alle foto reali dei lotti
-- Esegui questo nel SQL Editor di Supabase (una volta sola).
-- Serve se hai già eseguito schema.sql prima di questo aggiornamento.
-- ===========================================================================

alter table public.lots
  add column if not exists image_urls text[] not null default '{}';
