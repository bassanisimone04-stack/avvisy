"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { QueueEntry } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Promuove il primo in attesa a "in servizio". */
async function promoteFirstWaiting(sb: SupabaseClient, orgId: string) {
  const { data } = await sb
    .from("queue_entries")
    .select("id")
    .eq("org_id", orgId)
    .neq("status", "in-servizio")
    .order("joined_at")
    .limit(1)
    .maybeSingle();
  if (data) {
    await sb
      .from("queue_entries")
      .update({ status: "in-servizio" })
      .eq("id", data.id);
  }
}

/** Chiama il prossimo (nessuno allo sportello). */
export async function queueCallNext(orgId: string): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const sb = await createClient();
    await promoteFirstWaiting(sb, orgId);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Completa chi è in servizio ed eventualmente chiama il prossimo. */
export async function queueComplete(
  servingId: string,
  orgId: string
): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const sb = await createClient();
    await sb.from("queue_entries").delete().eq("id", servingId);
    await promoteFirstWaiting(sb, orgId);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Cliente assente: rimanda in fondo e chiama il prossimo. */
export async function queueSkip(
  servingId: string,
  orgId: string
): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const sb = await createClient();
    await sb
      .from("queue_entries")
      .update({ status: "in-attesa", joined_at: new Date().toISOString() })
      .eq("id", servingId);
    await promoteFirstWaiting(sb, orgId);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** Aggiunge un cliente "al volo" (walk-in). Ritorna la voce creata o null. */
export async function addWalkIn(input: {
  orgId: string;
  name: string;
  serviceId: string;
}): Promise<{ entry: QueueEntry | null }> {
  if (!isSupabaseConfigured()) return { entry: null };
  try {
    const sb = await createClient();
    const { count } = await sb
      .from("queue_entries")
      .select("*", { count: "exact", head: true })
      .eq("org_id", input.orgId);
    const ticket = "A-" + String((count ?? 0) + 1).padStart(3, "0");
    const { data, error } = await sb
      .from("queue_entries")
      .insert({
        org_id: input.orgId,
        service_id: input.serviceId,
        ticket,
        customer_name: input.name,
        status: "in-attesa",
      })
      .select("*")
      .single();
    if (error || !data) return { entry: null };
    return {
      entry: {
        id: data.id,
        orgId: data.org_id,
        ticket: data.ticket,
        customerName: data.customer_name,
        serviceId: data.service_id ?? "",
        joinedAt: new Date(data.joined_at).toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: data.status,
      },
    };
  } catch {
    return { entry: null };
  }
}
