-- Extensions & enums
create extension if not exists postgis;
create extension if not exists pg_trgm;
create extension if not exists unaccent;
create extension if not exists pgcrypto;

do $$ begin
  create type verification_status as enum ('unverified','pending','verified','stale','rejected');
  create type publication_status  as enum ('draft','in_review','published','archived');
  create type price_status        as enum ('verified','estimated','missing');
  create type app_role            as enum ('admin','editor','data-verifier','partner-manager','viewer','partner','user');
  create type claim_status        as enum ('pending','approved','rejected');
  create type menu_kind           as enum ('tasting','a_la_carte','wine_pairing','set');
  create type menu_service        as enum ('lunch','dinner','any');
  create type reservation_method  as enum ('online','phone','email');
exception when duplicate_object then null; end $$;

-- immutable unaccent wrapper so it can be used in generated columns / indexes
create or replace function public.f_unaccent(text) returns text
language sql immutable parallel safe strict as $$ select public.unaccent('public.unaccent', $1) $$;

-- updated_at trigger
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
