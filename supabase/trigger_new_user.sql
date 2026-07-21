-- ===========================================================================
-- Scortvia — Crea automaticamente la scheda azienda alla registrazione utente
-- Esegui questo nel SQL Editor di Supabase (una volta sola, dopo schema.sql).
-- ===========================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.companies (
    owner, ragione_sociale, display_name, vat_number,
    sector, region, province, verification, logo
  )
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'ragione_sociale',''), 'Nuova Azienda'),
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''),
             nullif(new.raw_user_meta_data->>'ragione_sociale',''), 'Nuova Azienda'),
    coalesce(new.raw_user_meta_data->>'vat_number', ''),
    coalesce(new.raw_user_meta_data->>'sector', ''),
    coalesce(new.raw_user_meta_data->>'region', ''),
    coalesce(new.raw_user_meta_data->>'province', ''),
    'In verifica',
    upper(substr(coalesce(
      nullif(new.raw_user_meta_data->>'display_name',''),
      nullif(new.raw_user_meta_data->>'ragione_sociale',''), 'NA'), 1, 2))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
