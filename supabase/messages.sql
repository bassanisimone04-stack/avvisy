-- ===========================================================================
-- Scortvia — Messaggi reali tra aziende (chat in piattaforma)
-- Esegui questo UNA VOLTA nel SQL Editor di Supabase.
-- È idempotente: puoi rieseguirlo senza rischi.
-- ===========================================================================

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  lot_id text,
  sender_company uuid not null references public.companies(id) on delete cascade,
  recipient_company uuid not null references public.companies(id) on delete cascade,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists messages_participants_idx
  on public.messages (sender_company, recipient_company, created_at);

alter table public.messages enable row level security;

-- Leggo i messaggi in cui la mia azienda è mittente o destinatario.
drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages for select to authenticated
  using (
    sender_company in (select id from public.companies where owner = auth.uid())
    or recipient_company in (select id from public.companies where owner = auth.uid())
  );

-- Posso inviare solo a nome della mia azienda.
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert to authenticated
  with check (
    sender_company in (select id from public.companies where owner = auth.uid())
  );

-- Posso segnare come letti i messaggi che ho ricevuto.
drop policy if exists messages_update on public.messages;
create policy messages_update on public.messages for update to authenticated
  using (
    recipient_company in (select id from public.companies where owner = auth.uid())
  );
