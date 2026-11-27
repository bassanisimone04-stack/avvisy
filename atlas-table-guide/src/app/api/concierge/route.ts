import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDataset } from "@/db/repository";
import { localizeDataset } from "@/db/queries";
import { getRates } from "@/lib/fx";
import { rulePlan, type Plan } from "@/lib/concierge";
import { rateLimit } from "@/lib/rate-limit";

const Input = z.object({
  destination: z.string().regex(/^[a-z0-9-]{2,60}$/), days: z.coerce.number().int().min(1).max(7), guests: z.coerce.number().int().min(1).max(12),
  budgetPerPersonEUR: z.coerce.number().min(0).max(5000).optional(), cuisine: z.string().regex(/^[a-z0-9-]*$/).optional(),
  dietary: z.array(z.enum(["vegetarian", "vegan", "glutenFree"])).default([]), minRecognition: z.coerce.number().int().min(0).max(3).optional(),
  hotel: z.boolean().default(false), occasion: z.string().max(80).optional(), restaurant: z.string().regex(/^[a-z0-9-]*$/).optional(), locale: z.enum(["en", "it"]).default("en"),
});

/**
 * AI concierge. The LLM (server-side only) can ONLY see records returned by our own planner tool;
 * it may re-order and annotate but every item must link to an internal record. Without LLM_API_KEY
 * the rule-based planner answers directly.
 */
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(`concierge:${ip}`, 10, 60_000).ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const parsed = Input.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "invalid_input", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  const { locale, ...input } = parsed.data;
  const [raw, rates] = await Promise.all([getDataset(), getRates()]);
  const d = localizeDataset(raw, locale);
  const base = rulePlan(d, input, rates, locale);
  const key = process.env.LLM_API_KEY;
  if (!key || !base.items.length) return NextResponse.json({ plan: base, llm: key ? "skipped" : "not-configured" });
  try {
    const res = await fetch(`${process.env.LLM_BASE_URL ?? "https://api.openai.com/v1"}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model: process.env.LLM_MODEL ?? "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: `You are a dining concierge. You may ONLY use the records provided in the tool result. Never invent venues, prices, awards or availability. Return JSON {"intro": string, "notes": {slug: string}} with one short note per slug explaining the choice. Mention that availability is unconfirmed. Write ALL text in ${locale === "it" ? "Italian" : "English"}.` },
          { role: "user", content: JSON.stringify({ request: input, candidates: base.items.map((i) => ({ slug: i.slug, type: i.type, name: i.name, day: i.day, time: i.time, estimateEUR: i.estimateEUR, facts: i.note })) }) },
        ],
      }),
    });
    if (!res.ok) throw new Error(`LLM ${res.status}`);
    const j = (await res.json()) as { choices: { message: { content: string } }[] };
    const out = JSON.parse(j.choices[0]?.message.content ?? "{}") as { intro?: string; notes?: Record<string, string> };
    const slugs = new Set(base.items.map((i) => i.slug));
    const plan: Plan = { ...base, source: "llm", items: base.items.map((i) => ({ ...i, note: out.notes && slugs.has(i.slug) && typeof out.notes[i.slug] === "string" ? out.notes[i.slug]!.slice(0, 300) : i.note })), caveats: [...(out.intro ? [out.intro.slice(0, 400)] : []), ...base.caveats] };
    return NextResponse.json({ plan, llm: "ok" });
  } catch (e) {
    console.error("[concierge]", e);
    return NextResponse.json({ plan: base, llm: "error" });
  }
}
