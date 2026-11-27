"use server";

import { headers } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { insertRow } from "@/db/writes";
import { rateLimit } from "@/lib/rate-limit";
import { BRAND, SITE_URL } from "@/config/brand";

export type FormState = { status: "idle" | "success" | "error" | "not-configured" | "rate-limited" | "pending-no-email"; errors?: Record<string, string>; message?: string };

async function clientKey(action: string) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  return `${action}:${createHash("sha256").update(ip).digest("hex").slice(0, 16)}`;
}

/** CSRF defence for server actions: same-origin check on top of Next's built-in Origin/Host verification. */
async function sameOrigin() {
  const h = await headers();
  const origin = h.get("origin");
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!origin || !host) return true; // non-browser or same-origin navigation
  try { return new URL(origin).host === host; } catch { return false; }
}

const Newsletter = z.object({
  email: z.string().trim().toLowerCase().email(),
  consent: z.literal("on", { message: "consent" }),
  locale: z.enum(["en", "it"]).default("en"),
  topics: z.array(z.enum(["new-profiles", "prices", "travel", "interviews"])).max(4).default([]),
  cities: z.array(z.string().regex(/^[a-z0-9-]{2,40}$/)).max(10).default([]),
  website: z.string().max(0).optional(), // honeypot
});

export async function subscribeNewsletter(_: FormState, fd: FormData): Promise<FormState> {
  if (!(await sameOrigin())) return { status: "error", message: "origin" };
  if (!rateLimit(await clientKey("newsletter"), 5, 60_000).ok) return { status: "rate-limited" };
  const parsed = Newsletter.safeParse({ email: fd.get("email"), consent: fd.get("consent"), locale: fd.get("locale") ?? "en", topics: fd.getAll("topics"), cities: fd.getAll("cities"), website: fd.get("website") ?? "" });
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] = i.path[0] === "consent" ? "consent" : "email";
    return { status: "error", errors };
  }
  const token = randomBytes(24).toString("base64url");
  const res = await insertRow("newsletter_subscribers", {
    email: parsed.data.email, locale: parsed.data.locale, topics: parsed.data.topics, cities: parsed.data.cities, status: "pending",
    confirm_token_hash: createHash("sha256").update(token).digest("hex"), consent_text_version: "2026-11-v1",
  });
  if (res === "not-configured") return { status: "not-configured" };
  if (res === "error") return { status: "error", message: "store" };
  // duplicate: respond identically to avoid leaking whether an address is subscribed
  if (res === "stored" && process.env.RESEND_API_KEY) {
    const link = `${SITE_URL}/api/newsletter/confirm?token=${token}`;
    const ok = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM ?? `${BRAND.shortName} <${BRAND.supportEmail}>`, to: parsed.data.email, subject: `Confirm your ${BRAND.shortName} newsletter subscription`, text: `Please confirm your subscription to the ${BRAND.name} newsletter:\n\n${link}\n\nIf you did not request this, ignore this email.` }),
    }).then((r) => r.ok).catch(() => false);
    if (!ok) return { status: "pending-no-email" };
    return { status: "success" };
  }
  return process.env.RESEND_API_KEY ? { status: "success" } : { status: "pending-no-email" };
}

const Generic = z.object({
  kind: z.enum(["contact", "correction", "waitlist", "concierge", "claim", "partner-lead", "gift-interest"]),
  email: z.string().trim().toLowerCase().email(),
  name: z.string().trim().max(120).optional().default(""),
  subject_ref: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
  website: z.string().max(0).optional(),
});

export async function submitForm(_: FormState, fd: FormData): Promise<FormState> {
  if (!(await sameOrigin())) return { status: "error", message: "origin" };
  if (!rateLimit(await clientKey("form"), 6, 60_000).ok) return { status: "rate-limited" };
  const raw = Object.fromEntries([...fd.entries()].filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, String(v)]));
  const parsed = Generic.safeParse(raw);
  const errors: Record<string, string> = {};
  if (!parsed.success) for (const i of parsed.error.issues) errors[String(i.path[0])] = String(i.path[0]);
  const needsMessage = ["contact", "correction", "concierge", "claim", "partner-lead"].includes(String(raw.kind));
  if (needsMessage && String(raw.message ?? "").trim().length < 10) errors.message = "message";
  if (Object.keys(errors).length || !parsed.success) return { status: "error", errors };
  const { kind, email, name, subject_ref, message } = parsed.data;
  const payload = Object.fromEntries(Object.entries(raw).filter(([k]) => !["kind", "email", "name", "subject_ref", "message", "website"].includes(k)).slice(0, 30));
  const res = await insertRow("form_submissions", { kind, email, name, subject_ref, message, payload, status: "new" });
  if (res === "not-configured") return { status: "not-configured" };
  if (res === "error") return { status: "error", message: "store" };
  return { status: "success" };
}
