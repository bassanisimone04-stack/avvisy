import "server-only";
import type { FaqItem } from "./types";

export const aiConfigured = () => Boolean(process.env.AI_API_KEY);
export const aiInfo = () => ({ provider: process.env.AI_PROVIDER || "anthropic", model: process.env.AI_MODEL || "claude-sonnet-5-5", configured: aiConfigured() });

export interface AiDraft { answer: string; body: string; faq: FaqItem[]; metaTitle: string; metaDescription: string; excerpt: string }

const SYSTEM = `You are a careful editor for a movie-sunglasses directory for US readers (American English).
RULES (strict):
1. Use ONLY the facts in the FACTS block. Never invent model numbers, years, prices, sales figures, quotes, designers or availability.
2. Respect the label of each appearance: if it is "unconfirmed", say the identification is unconfirmed and explain why using the SOURCE lines (including disputes). Never present it as certain.
3. Never state a price. Say prices are shown on the product page.
4. Answer the search intent in the first two sentences ("answer").
5. Link internally with markdown links ONLY to the page paths given in FACTS (format [text](/path)).
6. Allowed markdown: "## " headings, "- " lists, **bold**, [links](/path). No HTML.
7. If a fact you would like is missing, omit it or say it is not documented.
Return ONLY a JSON object: {"answer": string, "excerpt": string, "metaTitle": string (<=60 chars), "metaDescription": string (<=155 chars), "body": string, "faq": [{"q": string, "a": string}] (3-4 items)}`;

export async function generateDraft(input: { title: string; keyword: string; intent: string; facts: string; existingBody?: string }): Promise<AiDraft> {
  if (!aiConfigured()) throw new Error("API AI non configurata: imposta AI_API_KEY (e AI_PROVIDER / AI_MODEL) nelle variabili d'ambiente.");
  const user = `TITLE: ${input.title}\nTARGET KEYWORD: ${input.keyword}\nSEARCH INTENT: ${input.intent}\n${input.existingBody ? `EXISTING ARTICLE TO UPDATE (keep what is still supported by FACTS):\n${input.existingBody}\n` : ""}\nFACTS:\n${input.facts || "(none provided — write only a short outline and say facts are missing)"}`;
  const provider = process.env.AI_PROVIDER || "anthropic";
  const model = process.env.AI_MODEL || "claude-sonnet-5-5";
  let text = "";
  if (provider === "anthropic") {
    const r = await fetch((process.env.AI_BASE_URL || "https://api.anthropic.com") + "/v1/messages", {
      method: "POST", headers: { "content-type": "application/json", "x-api-key": process.env.AI_API_KEY!, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 4096, system: SYSTEM, messages: [{ role: "user", content: user }] }),
    });
    if (!r.ok) throw new Error(`Errore API AI (${r.status}): ${(await r.text()).slice(0, 300)}`);
    const j = await r.json() as { content?: { type: string; text?: string }[] };
    text = (j.content ?? []).filter((b) => b.type === "text").map((b) => b.text).join("");
  } else {
    const r = await fetch((process.env.AI_BASE_URL || "https://api.openai.com/v1") + "/chat/completions", {
      method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.AI_API_KEY}` },
      body: JSON.stringify({ model, messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }], temperature: 0.3 }),
    });
    if (!r.ok) throw new Error(`Errore API AI (${r.status}): ${(await r.text()).slice(0, 300)}`);
    text = ((await r.json()) as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message?.content ?? "";
  }
  return parseDraft(text);
}

export function parseDraft(text: string): AiDraft {
  const start = text.indexOf("{"), end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("La risposta AI non contiene JSON valido.");
  const o = JSON.parse(text.slice(start, end + 1)) as Partial<AiDraft>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return {
    answer: str(o.answer), excerpt: str(o.excerpt), body: str(o.body), metaTitle: str(o.metaTitle).slice(0, 70), metaDescription: str(o.metaDescription).slice(0, 170),
    faq: Array.isArray(o.faq) ? o.faq.filter((f) => f && typeof f.q === "string" && typeof f.a === "string").slice(0, 6) : [],
  };
}
