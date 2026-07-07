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
