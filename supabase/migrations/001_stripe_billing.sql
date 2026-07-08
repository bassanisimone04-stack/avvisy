-- ============================================================
--  Avvisy — migrazione: colonne per la fatturazione Stripe
--  Eseguire nel SQL Editor di Supabase se il database è stato
--  creato prima dell'aggiunta degli abbonamenti. È idempotente.
-- ============================================================

alter table organizations add column if not exists stripe_customer_id  text;
alter table organizations add column if not exists subscription_status text not null default 'inactive';

-- Un cliente Stripe non può essere associato a due strutture diverse.
create unique index if not exists idx_org_stripe_customer on organizations (stripe_customer_id);
