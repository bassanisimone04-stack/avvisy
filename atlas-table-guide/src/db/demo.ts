import type { Dataset } from "./types";
import { chefs, cities, countries, cuisines, regions } from "@/data/demo/geo";
import { restaurants } from "@/data/demo/restaurants";
import { affiliateLinks, experiences, giftCards, hotels, itineraries } from "@/data/demo/travel";
import { articles } from "@/data/demo/articles";

import { AMENITY_IT, ARTICLE_IT, CHEF_IT, EXPERIENCE_IT, HOTEL_IT, RESTAURANT_IT } from "@/data/demo/it";

/** Demo records with their Italian translations merged in (the source arrays stay English-only). */
export function demoDataset(): Dataset {
  return {
    source: "demo", countries, regions, cities, cuisines, affiliateLinks, itineraries, giftCards,
    chefs: chefs.map((c) => ({ ...c, bio: { ...c.bio, it: CHEF_IT[c.slug] } })),
    restaurants: restaurants.map((r) => { const t = RESTAURANT_IT[r.slug]; return t ? { ...r, style: { ...r.style, it: t[0] }, description: { ...r.description, it: t[1] } } : r; }),
    hotels: hotels.map((h) => ({ ...h, description: { ...h.description, it: HOTEL_IT[h.slug] }, amenitiesIt: h.amenities.map((a) => AMENITY_IT[a] ?? a) })),
    experiences: experiences.map((x) => { const t = EXPERIENCE_IT[x.slug]; return t ? { ...x, nameIt: t[0], description: { ...x.description, it: t[1] } } : x; }),
    articles: articles.map((a) => { const t = ARTICLE_IT[a.slug]; return t ? { ...a, excerpt: { ...a.excerpt, it: t.excerpt }, sectionsIt: t.sections } : a; }),
  };
}
