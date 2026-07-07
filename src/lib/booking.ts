"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

/** Salva una prenotazione. Ritorna l'id reale se Supabase è attivo,
 * altrimenti null (il chiamante userà l'id demo generato lato client). */
export async function createBooking(input: {
  orgId: string;
  serviceId: string;
  name: string;
  phone: string;
  date: string;
  time: string;
}): Promise<{ id: string | null }> {
  if (!isSupabaseConfigured()) return { id: null };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appointments")
      .insert({
        org_id: input.orgId,
        service_id: input.serviceId,
        customer_name: input.name,
        customer_phone: input.phone,
        appt_date: input.date,
        appt_time: input.time,
        status: "confermato",
      })
      .select("id")
      .single();
    if (error || !data) return { id: null };
    return { id: data.id as string };
  } catch {
    return { id: null };
  }
}

/** Check-in: assegna il numero e mette in coda (funzione RPC lato database).
 * Ritorna il ticket assegnato, o null se in modalità demo. */
export async function checkInAppointment(
  id: string
): Promise<{ ticket: string | null }> {
  if (!isSupabaseConfigured()) return { ticket: null };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("check_in_appointment", {
      p_id: id,
    });
    if (error || !data) return { ticket: null };
    const row = Array.isArray(data) ? data[0] : data;
    return { ticket: (row?.ticket as string) ?? null };
  } catch {
    return { ticket: null };
  }
}
