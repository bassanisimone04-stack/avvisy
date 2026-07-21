-- ===========================================================================
-- Scortvia — Abilita gli aggiornamenti in tempo reale sui messaggi
-- Esegui questo UNA VOLTA nel SQL Editor di Supabase (dopo messages.sql).
-- Con questo la chat si aggiorna all'istante; senza, resta il polling.
-- È idempotente.
-- ===========================================================================

alter publication supabase_realtime add table public.messages;
