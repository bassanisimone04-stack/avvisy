-- Orders created by the Stripe webhook (test mode until merchant agreements exist).
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  kind text not null check (kind in ('gift-card','club','partner-plan')),
  amount_total numeric(12,2), currency char(3),
  status text not null default 'paid' check (status in ('paid','refunded','failed')),
  customer_email text, metadata jsonb not null default '{}'::jsonb,
  test_mode boolean not null default true,
  created_at timestamptz not null default now()
);
alter table orders enable row level security;
alter table orders force row level security;
drop policy if exists orders_admin_read on orders;
create policy orders_admin_read on orders for select using (public.is_staff(array['admin']::app_role[]));
grant select on orders to authenticated;
-- inserts happen only through the service role (webhook), which bypasses RLS

create index if not exists alerts_active_idx on alerts (active, restaurant_id);
