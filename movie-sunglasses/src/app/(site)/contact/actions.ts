"use server";
import { headers } from "next/headers";
import { upsert } from "@/lib/store";
import { clientIp, rateLimit } from "@/lib/ratelimit";

export interface ContactState { ok: boolean; message: string }

export async function sendMessage(_: ContactState, form: FormData): Promise<ContactState> {
  const h = await headers();
  if (form.get("website")) return { ok: true, message: "Thank you — message received." }; // honeypot
  if (!rateLimit(`contact:${clientIp(h)}`, 3, 10 * 60_000)) return { ok: false, message: "Too many messages. Please try again later." };
  const name = String(form.get("name") ?? "").trim().slice(0, 100);
  const email = String(form.get("email") ?? "").trim().slice(0, 200);
  const subject = String(form.get("subject") ?? "").trim().slice(0, 150);
  const body = String(form.get("body") ?? "").trim().slice(0, 4000);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || body.length < 10) return { ok: false, message: "Please enter your name, a valid email and a message of at least 10 characters." };
  try {
    await upsert("messages", { id: `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`, at: new Date().toISOString(), name, email, subject: subject || "(no subject)", body, handled: false });
  } catch {
    return { ok: false, message: "We could not save your message right now. Please try again later." };
  }
  return { ok: true, message: "Thank you — your message has been received." };
}
