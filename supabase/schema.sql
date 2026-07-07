-- ============================================================
--  Avvisy — schema database + sicurezza (RLS)
--  Eseguire nel SQL Editor di Supabase (una volta sola).
-- ============================================================

-- ---------- Tabelle ----------

create table if not exists organizations (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  category      text not null default '',
  address       text not null default '',
  city          text not null default '',
  description   text not null default '',
  opening_hours text not null default '',
  queue_open    boolean not null default true,
  phone         text,
  lat           double precision,
  lng           double precision,
  owner_id      uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now()
);

create table if not exists services (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references organizations (id) on delete cascade,
  name         text not null,
  description  text not null default '',
  duration_min integer not null default 30,
  price        text,
  created_at   timestamptz not null default now()
);

create table if not exists appointments (
  id             uuid primary key default gen_random_uuid(),
  org_id         uuid not null references organizations (id) on delete cascade,
  service_id     uuid references services (id) on delete set null,
  customer_name  text not null,
  customer_phone text not null,
  appt_date      date not null,
  appt_time      text not null,
  status         text not null default 'confermato'
                 check (status in ('confermato','check-in','in-corso','completato','annullato')),
  ticket         text,
  created_at     timestamptz not null default now()
);

create table if not exists queue_entries (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references organizations (id) on delete cascade,
  service_id    uuid references services (id) on delete set null,
  ticket        text not null,
  customer_name text not null default '',
  status        text not null default 'in-attesa'
                check (status in ('in-servizio','chiamato','in-attesa')),
  joined_at     timestamptz not null default now()
);

create index if not exists idx_services_org on services (org_id);
create index if not exists idx_appointments_org on appointments (org_id);
create index if not exists idx_appointments_date on appointments (org_id, appt_date);
create index if not exists idx_queue_org on queue_entries (org_id);

-- ---------- Row Level Security ----------

alter table organizations enable row level security;
alter table services       enable row level security;
alter table appointments   enable row level security;
alter table queue_entries  enable row level security;

-- Organizzazioni: chiunque le vede (vetrina); scrive solo il proprietario.
create policy "org pubbliche in lettura"
  on organizations for select using (true);
create policy "org: il proprietario inserisce"
  on organizations for insert with check (owner_id = auth.uid());
create policy "org: il proprietario modifica"
  on organizations for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "org: il proprietario elimina"
  on organizations for delete using (owner_id = auth.uid());

-- Servizi: pubblici in lettura; scrive solo il proprietario della struttura.
create policy "servizi pubblici in lettura"
  on services for select using (true);
create policy "servizi: gestiti dal proprietario"
  on services for all
  using (exists (select 1 from organizations o where o.id = services.org_id and o.owner_id = auth.uid()))
  with check (exists (select 1 from organizations o where o.id = services.org_id and o.owner_id = auth.uid()));

-- Appuntamenti: il cittadino può PRENOTARE (insert) senza login;
-- solo il proprietario della struttura può leggerli/gestirli in massa.
-- Il singolo cittadino accede al proprio tramite la funzione get_appointment (per id).
create policy "appuntamenti: chiunque prenota"
  on appointments for insert with check (status = 'confermato' and ticket is null);
create policy "appuntamenti: il proprietario legge"
  on appointments for select
  using (exists (select 1 from organizations o where o.id = appointments.org_id and o.owner_id = auth.uid()));
create policy "appuntamenti: il proprietario gestisce"
  on appointments for update
  using (exists (select 1 from organizations o where o.id = appointments.org_id and o.owner_id = auth.uid()));

-- Coda: il proprietario gestisce tutto; il pubblico vede una versione anonima
-- tramite la funzione get_public_queue (niente nomi esposti).
create policy "coda: gestita dal proprietario"
  on queue_entries for all
  using (exists (select 1 from organizations o where o.id = queue_entries.org_id and o.owner_id = auth.uid()))
  with check (exists (select 1 from organizations o where o.id = queue_entries.org_id and o.owner_id = auth.uid()));

-- ---------- Funzioni per il flusso cittadino (senza login) ----------

-- Legge un singolo appuntamento tramite id (link di check-in).
create or replace function get_appointment(p_id uuid)
returns setof appointments
language sql security definer stable
set search_path = public
as $$ select * from appointments where id = p_id $$;

-- Check-in: assegna un numero e mette in coda, in modo controllato.
create or replace function check_in_appointment(p_id uuid)
returns appointments
language plpgsql security definer
set search_path = public
as $$
declare a appointments; n integer;
begin
  select * into a from appointments where id = p_id;
  if not found then raise exception 'Appuntamento non trovato'; end if;
  if a.ticket is not null then return a; end if;
  select count(*) + 1 into n from appointments
    where org_id = a.org_id and appt_date = a.appt_date and ticket is not null;
  update appointments set ticket = 'A-' || lpad(n::text, 3, '0'), status = 'check-in'
    where id = p_id returning * into a;
  insert into queue_entries (org_id, service_id, ticket, customer_name, status)
    values (a.org_id, a.service_id, a.ticket, a.customer_name, 'in-attesa');
  return a;
end $$;

-- Coda pubblica anonimizzata (per lo schermo sala d'attesa / tracciamento).
create or replace function get_public_queue(p_org uuid)
returns table (ticket text, status text, service_id uuid, joined_at timestamptz)
language sql security definer stable
set search_path = public
as $$
  select ticket, status, service_id, joined_at
  from queue_entries where org_id = p_org order by joined_at
$$;

grant execute on function get_appointment(uuid) to anon, authenticated;
grant execute on function check_in_appointment(uuid) to anon, authenticated;
grant execute on function get_public_queue(uuid) to anon, authenticated;

-- ---------- Dati demo (strutture pubbliche, senza proprietario) ----------

insert into organizations (slug, name, category, address, city, description, opening_hours, queue_open, phone, lat, lng)
values
 ('demo-caf', 'CAF Navigli', 'CAF · Patronato', 'Ripa di Porta Ticinese 21', 'Milano',
  'Assistenza fiscale per famiglie e lavoratori: 730, ISEE, dichiarazioni e pratiche di patronato.',
  'Lun–Ven 9:00–13:00 / 14:30–18:00', true, '+39 02 1234 5678', 45.4515, 9.173),
 ('studio-brera', 'Studio Dentistico Brera', 'Studio medico', 'Via Fiori Chiari 8', 'Milano',
  'Igiene, visite di controllo e prime visite. Conferma immediata e promemoria automatici.',
  'Lun–Sab 8:30–19:00', false, '+39 02 8765 4321', 45.472, 9.187),
 ('salone-isola', 'Salone Isola', 'Parrucchiere', 'Via Thaon di Revel 3', 'Milano',
  'Taglio, colore e piega su appuntamento. Coda live per i clienti senza prenotazione.',
  'Mar–Sab 9:00–19:30', true, '+39 02 5555 1212', 45.488, 9.19)
on conflict (slug) do nothing;

insert into services (org_id, name, description, duration_min, price)
select o.id, s.name, s.descr, s.dur, s.price from organizations o
join (values
  ('demo-caf', 'Dichiarazione 730', 'Compilazione e invio del modello 730.', 30, '45 €'),
  ('demo-caf', 'ISEE', 'Calcolo e rilascio attestazione ISEE.', 20, '25 €'),
  ('demo-caf', 'Pratica di patronato', 'Pensioni, disoccupazione, invalidità.', 40, null),
  ('studio-brera', 'Visita di controllo', 'Controllo periodico e valutazione.', 30, '80 €'),
  ('studio-brera', 'Igiene dentale', 'Pulizia professionale e lucidatura.', 45, '90 €'),
  ('salone-isola', 'Taglio', 'Taglio e piega.', 45, '35 €'),
  ('salone-isola', 'Colore', 'Colore, taglio e piega.', 90, '75 €')
) as s(slug, name, descr, dur, price) on o.slug = s.slug
on conflict do nothing;
