import type { Dataset } from "./types";
import { chefs, cities, countries, cuisines, regions } from "@/data/demo/geo";
import { restaurants } from "@/data/demo/restaurants";
import { affiliateLinks, experiences, giftCards, hotels, itineraries } from "@/data/demo/travel";
import { articles } from "@/data/demo/articles";

export function demoDataset(): Dataset {
  return { source: "demo", countries, regions, cities, chefs, cuisines, restaurants, hotels, experiences, itineraries, articles, giftCards, affiliateLinks };
}
