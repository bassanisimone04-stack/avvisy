import type { ImageRef } from "@/db/types";

type Ctx = { name?: string; city?: string; locale?: "en" | "it" };

const EN: Record<ImageRef["subject"], (c: Required<Pick<Ctx, "name" | "city">> & { dish?: string }) => string> = {
  dish: (c) => (c.dish ? `${c.dish} at ${c.name}, ${c.city}` : `A plated course at ${c.name}, ${c.city}`),
  interior: (c) => `Dining room of ${c.name}, ${c.city}`,
  terrace: (c) => `Terrace tables at ${c.name}, ${c.city}`,
  skyline: (c) => `Evening view over ${c.city}`,
  hotel: (c) => `${c.name} in ${c.city}`,
  experience: (c) => `${c.name} in ${c.city}`,
  wine: (c) => `Wine glasses and bottles for ${c.name}, ${c.city}`,
  chef: (c) => `Chef at work for ${c.name}, ${c.city}`,
  landscape: (c) => `Landscape near ${c.city} for ${c.name}`,
  gift: (c) => `${c.name} gift card design`,
  table: (c) => `Set table at ${c.name}, ${c.city}`,
};
const IT: typeof EN = {
  dish: (c) => (c.dish ? `${c.dish} da ${c.name}, ${c.city}` : `Un piatto servito da ${c.name}, ${c.city}`),
  interior: (c) => `Sala di ${c.name}, ${c.city}`,
  terrace: (c) => `Tavoli in terrazza da ${c.name}, ${c.city}`,
  skyline: (c) => `Vista serale su ${c.city}`,
  hotel: (c) => `${c.name} a ${c.city}`,
  experience: (c) => `${c.name} a ${c.city}`,
  wine: (c) => `Calici e bottiglie per ${c.name}, ${c.city}`,
  chef: (c) => `Chef al lavoro per ${c.name}, ${c.city}`,
  landscape: (c) => `Paesaggio vicino a ${c.city} per ${c.name}`,
  gift: (c) => `Design della gift card ${c.name}`,
  table: (c) => `Tavola apparecchiata da ${c.name}, ${c.city}`,
};

/**
 * Descriptive alt text generated from structured data.
 * Pass `decorative: true` for purely decorative images (returns "").
 */
export function buildAlt(img: Pick<ImageRef, "subject" | "dish">, ctx: Ctx & { decorative?: boolean }): string {
  if (ctx.decorative) return "";
  const c = { name: ctx.name?.trim() || "the venue", city: ctx.city?.trim() || "", dish: img.dish };
  const s = (ctx.locale === "it" ? IT : EN)[img.subject](c);
  return s.replace(/,\s*$/, "").replace(/\s+/g, " ").trim();
}
