"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/types";

type ServiceFields = {
  name: string;
  description: string;
  durationMin: number;
  price: string | null;
};

/** Crea un servizio. Ritorna il servizio salvato (con id reale) o null in demo. */
export async function createService(
  input: ServiceFields & { orgId: string }
): Promise<{ service: Service | null }> {
  if (!isSupabaseConfigured()) return { service: null };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .insert({
        org_id: input.orgId,
        name: input.name,
        description: input.description,
        duration_min: input.durationMin,
        price: input.price,
      })
      .select("*")
      .single();
    if (error || !data) return { service: null };
    return {
      service: {
        id: data.id,
        orgId: data.org_id,
        name: data.name,
        description: data.description,
        durationMin: data.duration_min,
        price: data.price,
      },
    };
  } catch {
    return { service: null };
  }
}

export async function updateService(
  id: string,
  fields: ServiceFields
): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("services")
      .update({
        name: fields.name,
        description: fields.description,
        duration_min: fields.durationMin,
        price: fields.price,
      })
      .eq("id", id);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}

export async function deleteService(id: string): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
