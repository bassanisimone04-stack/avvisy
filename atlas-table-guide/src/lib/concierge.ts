import type { Dataset, Restaurant } from "@/db/types";
import { t } from "@/db/types";
import { applyFilters, lowestEUR, parseFilters, sortRestaurants } from "./filters";
import { combinedEstimate, toEUR, type Rates } from "./price";
import { haversine } from "./geo";

export type ConciergeInput = {
  destination: string; // city slug
  days: number;
  guests: number;
  budgetPerPersonEUR?: number;
  cuisine?: string;
  dietary: ("vegetarian" | "vegan" | "glutenFree")[];
  minRecognition?: number;
  hotel: boolean;
  occasion?: string;
  restaurant?: string; // must-include
};

export type PlanItem = { day: number; time: string; type: "restaurant" | "hotel" | "experience"; slug: string; name: string; path: string; note: string; estimateEUR: number | null };
export type Plan = { title: string; items: PlanItem[]; totalEstimateEUR: number | null; caveats: string[]; source: "rules" | "llm" };

/** Deterministic, data-only planner used when no LLM key is configured (and as the LLM's tool backend). */
export function rulePlan(d: Dataset, input: ConciergeInput, rates: Rates, locale: "en" | "it" = "en"): Plan {
  const city = d.cities.find((c) => c.slug === input.destination);
  const caveats = ["Prices are estimates per person and exclude service, tax and transport.", "Availability is NOT confirmed — book each venue directly or ask our concierge."];
  if (!city) return { title: "No destination selected", items: [], totalEstimateEUR: null, caveats, source: "rules" };
  const f = parseFilters(new URLSearchParams());
  f.city = city.slug;
  f.diet = input.dietary;
  if (input.cuisine) f.cuisine = [input.cuisine];
  let pool = sortRestaurants(applyFilters(d.restaurants, f, rates), { sort: "recommended" }, rates)
    .filter((r) => (input.minRecognition ? r.recognition.level >= input.minRecognition : true))
    .filter((r) => (input.budgetPerPersonEUR ? (lowestEUR(r, rates) ?? Infinity) <= input.budgetPerPersonEUR : true));
  if (input.restaurant) {
    const must = d.restaurants.find((r) => r.slug === input.restaurant);
    if (must) pool = [must, ...pool.filter((r) => r.slug !== must.slug)];
  }
  if (!pool.length) caveats.unshift("No restaurant matched every criterion; try relaxing budget, cuisine or recognition.");
  const items: PlanItem[] = [];
  const est = (r: Restaurant) => { const e = combinedEstimate(r); return e ? toEUR(e.amount, e.currency, rates) : null; };
  for (let day = 1; day <= Math.max(1, Math.min(input.days, 7)); day++) {
    const dinner = pool[(day - 1) * 2];
    const lunch = pool[(day - 1) * 2 + 1];
    if (lunch) items.push({ day, time: "13:00", type: "restaurant", slug: lunch.slug, name: lunch.name, path: `/${locale}/restaurant/${lunch.slug}/`, note: t(lunch.style, locale), estimateEUR: lowestEUR(lunch, rates) });
    if (dinner) items.push({ day, time: "20:00", type: "restaurant", slug: dinner.slug, name: dinner.name, path: `/${locale}/restaurant/${dinner.slug}/`, note: `${t(dinner.style, locale)}${input.occasion ? ` — good for: ${input.occasion}` : ""}`, estimateEUR: est(dinner) });
    const exp = d.experiences.filter((x) => x.citySlug === city.slug).sort((a, b) => a.slug.localeCompare(b.slug))[day - 1];
    if (exp) items.push({ day, time: "10:00", type: "experience", slug: exp.slug, name: exp.name, path: `/${locale}/experience/${exp.slug}/`, note: t(exp.description, locale), estimateEUR: exp.price ? toEUR(exp.price.amount, exp.price.currency, rates) : null });
  }
  if (input.hotel) {
    const anchor = pool[0] ?? city;
    const hotel = [...d.hotels].sort((a, b) => haversine(anchor, a) - haversine(anchor, b))[0];
    if (hotel && haversine(anchor, hotel) < 60000) items.push({ day: 1, time: "16:00", type: "hotel", slug: hotel.slug, name: hotel.name, path: `/${locale}/hotel/${hotel.slug}/`, note: `Check in (${Math.max(1, input.days)} nights)`, estimateEUR: hotel.priceFrom ? toEUR(hotel.priceFrom.amount * Math.max(1, input.days) / Math.max(1, Math.ceil(input.guests / 2)), hotel.priceFrom.currency, rates) : null });
  }
  items.sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  const known = items.map((i) => i.estimateEUR).filter((x): x is number => x != null);
  return { title: `${input.days} day${input.days > 1 ? "s" : ""} in ${t(city.name, locale)}`, items, totalEstimateEUR: known.length ? Math.round(known.reduce((a, b) => a + b, 0)) : null, caveats, source: "rules" };
}
