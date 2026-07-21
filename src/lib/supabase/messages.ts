"use client";

import { createClient } from "./client";

export type ChatMessage = {
  id: string;
  lotId: string | null;
  senderCompany: string;
  recipientCompany: string;
  body: string;
  read: boolean;
  createdAt: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToMessage(r: any): ChatMessage {
  return {
    id: r.id,
    lotId: r.lot_id ?? null,
    senderCompany: r.sender_company,
    recipientCompany: r.recipient_company,
    body: r.body,
    read: !!r.read,
    createdAt: r.created_at,
  };
}

/** Tutti i messaggi in cui la mia azienda è mittente o destinatario. */
export async function fetchMessages(myCompanyId: string): Promise<ChatMessage[]> {
  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_company.eq.${myCompanyId},recipient_company.eq.${myCompanyId}`)
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map(rowToMessage);
}

/** Invia un messaggio (il body dovrebbe già essere ripulito dai contatti). */
export async function sendMessage(input: {
  from: string;
  to: string;
  body: string;
  lotId?: string | null;
}): Promise<ChatMessage | null> {
  const supabase = createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_company: input.from,
      recipient_company: input.to,
      body: input.body,
      lot_id: input.lotId ?? null,
    })
    .select("*")
    .single();
  if (error || !data) return null;

  // Notifica per il destinatario (best effort).
  await supabase
    .from("notifications")
    .insert({
      company_id: input.to,
      type: "messaggio",
      title: "Nuovo messaggio",
      detail: "Hai ricevuto un messaggio in piattaforma.",
      href: "/venditore/messaggi",
      audience: "both",
      read: false,
    })
    .then(
      () => {},
      () => {},
    );

  return rowToMessage(data);
}

/** Numero di messaggi ricevuti e non ancora letti dalla mia azienda. */
export async function countUnreadMessages(myCompanyId: string): Promise<number> {
  const supabase = createClient();
  if (!supabase) return 0;
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("recipient_company", myCompanyId)
    .eq("read", false);
  return count ?? 0;
}

/** Segna come letti i messaggi ricevuti da una specifica azienda. */
export async function markThreadRead(myCompanyId: string, otherCompanyId: string): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;
  await supabase
    .from("messages")
    .update({ read: true })
    .eq("recipient_company", myCompanyId)
    .eq("sender_company", otherCompanyId)
    .eq("read", false);
}
