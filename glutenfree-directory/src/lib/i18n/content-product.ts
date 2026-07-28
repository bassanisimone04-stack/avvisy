import type { Product } from "../types";
import type { Locale } from "./locale";

interface ProductTranslation {
  name: string;
  description: string;
  tags: string[];
}

export const PRODUCT_EN: Record<string, ProductTranslation> = {
  "prod-1": { name: "Corn and rice fusilli", description: "A classic bronze-cut shape that holds up well when cooked, ideal for rich sauces.", tags: ["pasta", "lactose-free"] },
  "prod-2": { name: "Gluten-free sandwich bread", description: "Soft, long-life bread, great toasted too, with no eggs or milk.", tags: ["bread", "vegan"] },
  "prod-3": { name: "Pizza flour mix", description: "Ready-to-use mix for an elastic, light dough, very close to traditional pizza.", tags: ["flour", "pizza"] },
  "prod-4": { name: "Classic butter shortbread cookies", description: "Crumbly butter shortbread, perfect for breakfast or a snack for the little ones.", tags: ["sweets", "kids"] },
  "prod-5": { name: "Seed crackers", description: "Crunchy snack with flax and sesame seeds, ideal for a worry-free savory snack.", tags: ["snack", "seeds"] },
  "prod-6": { name: "Whole buckwheat flour", description: "100% stone-ground buckwheat flour, perfect for pancakes and rustic baked goods.", tags: ["flour", "whole grain"] },
  "prod-7": { name: "Gluten-free Apulian taralli", description: "Classic EVO oil taralli, crunchy and thin like the traditional Apulian recipe.", tags: ["snack", "tradition"] },
  "prod-8": { name: "Gluten-free breadcrumbs", description: "Fine breadcrumbs ideal for crunchy coatings, made from dried gluten-free bread.", tags: ["condiments"] },
  "prod-9": { name: "Red lentil penne rigate", description: "High-protein pasta made from red lentil flour, with no other grains.", tags: ["pasta", "protein"] },
  "prod-10": { name: "Ready-made chocolate cake mix", description: "Dark chocolate cake mix, just add eggs, oil and milk of your choice.", tags: ["sweets", "mixes"] },
  "prod-11": { name: "Gluten-free Romagna piadina", description: "Ready-to-warm piadina in a pan in a few minutes, soft and thin like the original.", tags: ["bread"] },
  "prod-12": { name: "Rustic bread flour mix", description: "Mix with whole rice flour and teff, for a rustic bread with a crunchy crust.", tags: ["flour", "bread"] },
};

export function getLocalizedProduct(product: Product, locale: Locale): Product {
  if (locale === "it") return product;
  const tr = PRODUCT_EN[product.id];
  if (!tr) return product;
  return { ...product, name: tr.name, description: tr.description, tags: tr.tags };
}
