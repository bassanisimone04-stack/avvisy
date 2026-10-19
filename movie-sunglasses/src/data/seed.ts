import type { Collections, CollectionName } from "@/lib/types";
import { actors, brands, characters, merchants, movies } from "./seed-core";
import { alternatives, appearances, evidence, models } from "./seed-models";
import { articles, keywords } from "./seed-articles";

/** Seed data. Prices/offers/clicks/photos are intentionally EMPTY: nothing is invented. */
export const seed: { [K in CollectionName]: Collections[K][] } = {
  movies, actors, characters, brands, models, appearances, evidence, alternatives, merchants,
  offers: [], articles, keywords, clicks: [], views: [], revenue: [], redirects: [], messages: [], photos: [],
};
