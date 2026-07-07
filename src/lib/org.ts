"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Salva le informazioni della struttura del gestore autenticato.
 * In modalità demo (Supabase spento) non persiste: ritorna comunque ok. */
export async function updateMyOrganization(input: {
  name: string;
  address: string;
  openingHours: string;
  queueOpen: boolean;
}): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    const { error } = await supabase
      .from("organizations")
      .update({
        name: input.name,
        address: input.address,
        opening_hours: input.openingHours,
        queue_open: input.queueOpen,
      })
      .eq("owner_id", user.id);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}

/** Salva i dati dell'onboarding: aggiorna la struttura del gestore e crea
 * il primo servizio. In demo non persiste ma ritorna ok. */
export async function completeOnboarding(input: {
  orgName: string;
  address: string;
  hours: string;
  svcName: string;
  svcDurationMin: number;
  svcPrice: string | null;
}): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const { data: org } = await supabase
      .from("organizations")
      .select("id")
      .eq("owner_id", user.id)
      .order("created_at")
      .limit(1)
      .maybeSingle();
    if (!org) return { ok: false };

    await supabase
      .from("organizations")
      .update({
        name: input.orgName,
        address: input.address,
        opening_hours: input.hours,
      })
      .eq("id", org.id);

    if (input.svcName.trim()) {
      await supabase.from("services").insert({
        org_id: org.id,
        name: input.svcName.trim(),
        description: "",
        duration_min: input.svcDurationMin,
        price: input.svcPrice,
      });
    }
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
