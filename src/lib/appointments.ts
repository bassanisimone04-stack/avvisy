"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/types";

/** Cambia lo stato di un appuntamento (es. completato, annullato). */
export async function setAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}

/** Sposta un appuntamento a un nuovo orario. */
export async function rescheduleAppointment(
  id: string,
  time: string
): Promise<{ ok: boolean }> {
  if (!isSupabaseConfigured()) return { ok: true };
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("appointments")
      .update({ appt_time: time })
      .eq("id", id);
    return { ok: !error };
  } catch {
    return { ok: false };
  }
}
