import { normalize } from "./format";

export interface ClaimFlag { kind: "year" | "price" | "model_code" | "percentage" | "superlative" | "quote" | "attribution"; text: string; sentence: string }

/**
 * Heuristic detector of statements an editor must verify. It cannot prove a claim true — it surfaces
 * every specific, checkable token (year, price, model code, %, superlative, quote, attribution)
 * that is NOT present in the supplied verified FACTS text.
 */
export function checkClaims(body: string, facts: string, opts: { allowedPrices?: number[] } = {}): ClaimFlag[] {
  const flags: ClaimFlag[] = [];
  const factsN = normalize(facts);
  const plain = body.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*#]/g, "");
  const sentences = plain.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  const seen = new Set<string>();
  const add = (kind: ClaimFlag["kind"], text: string, sentence: string) => { const k = kind + text + sentence; if (!seen.has(k)) { seen.add(k); flags.push({ kind, text, sentence }); } };
  for (const s of sentences) {
    for (const m of s.matchAll(/\b(19[0-9]{2}|20[0-4][0-9])\b/g)) if (!factsN.includes(m[1])) add("year", m[1], s);
    for (const m of s.matchAll(/\$\s?(\d[\d,]*(?:\.\d{1,2})?)/g)) {
      const v = parseFloat(m[1].replace(/,/g, ""));
      if (!(opts.allowedPrices ?? []).includes(v)) add("price", m[0], s);
    }
    for (const m of s.matchAll(/\b(\d+(?:\.\d+)?)\s?%/g)) if (!factsN.includes(normalize(m[0]))) add("percentage", m[0], s);
    for (const m of s.matchAll(/\b([A-Z]{1,3}[\s-]?\d{3,5}[A-Z]{0,2})\b/g)) {
      const code = normalize(m[1]).replace(/ /g, "");
      if (!factsN.replace(/ /g, "").includes(code)) add("model_code", m[1], s);
    }
    for (const m of s.matchAll(/\b(first ever|first-ever|only|never|always|best-selling|bestselling|most popular|world's|of all time|invented|guaranteed|exclusive(?:ly)?)\b/gi)) add("superlative", m[1], s);
    for (const m of s.matchAll(/[“"]([^”"]{12,})[”"]/g)) add("quote", m[0], s);
    if (/\b(said|says|told|according to|confirmed|revealed|stated)\b/i.test(s)) add("attribution", (/\b(said|says|told|according to|confirmed|revealed|stated)\b/i.exec(s) ?? [""])[0], s);
  }
  return flags;
}

export const CLAIM_LABEL: Record<ClaimFlag["kind"], string> = {
  year: "Anno non presente nei fatti verificati", price: "Prezzo non supportato da un'offerta", model_code: "Codice modello non presente nei fatti",
  percentage: "Percentuale da verificare", superlative: "Affermazione assoluta/superlativo", quote: "Citazione da verificare", attribution: "Attribuzione da verificare nella fonte",
};
