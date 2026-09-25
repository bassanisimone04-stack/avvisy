import type { Product } from "../types";
import type { Locale } from "./locale";

interface ProductTranslation {
  name: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
}

export const PRODUCT_EN: Record<string, ProductTranslation> = {
  "prod-1": { name: "Gluten-Free Fusilli 400g", description: "White corn, yellow corn and whole rice fusilli, with no added starches. Cooks in 11 minutes, same quality as traditional Barilla pasta. Crossed Grain and Ministry of Health marks.", metaTitle: "Gluten-Free Fusilli Barilla 400g", metaDescription: "Gluten-free fusilli made from corn and rice, Crossed Grain certified: indicative price and where to find them on Mappa Senza Glutine.", tags: ["pasta", "lactose-free", "reimbursable"] },
  "prod-2": { name: "Corn Eliche 250g", description: "100% Italian corn pasta, made with the exclusive Molino di Ferro method passed down for 6 generations. Cooks in 8-9 minutes, holds sauces very well.", metaTitle: "Corn Eliche Le Veneziane 250g", metaDescription: "100% Italian corn pasta, made with the Molino di Ferro method passed down for 6 generations: price and where to find it on Mappa Senza Glutine.", tags: ["pasta", "lactose-free", "egg-free"] },
  "prod-3": { name: "Country Bread 240g", description: "Sliced bread with buckwheat flour (8%), soft with a rustic taste. Gluten-free, lactose-free and preservative-free. Shelf-stable at room temperature.", metaTitle: "Country Bread Schär 240g", metaDescription: "Sliced bread with buckwheat flour, gluten-free, lactose-free and preservative-free: indicative price and where to find it on Mappa Senza Glutine.", tags: ["bread", "lactose-free", "preservative-free"] },
  "prod-4": { name: "Sliced Country Bread 300g", description: "Soft sliced bread in single-serve packs of 2 slices, with extra virgin olive oil (2%). No wheat starch, soy, milk, eggs or preservatives.", metaTitle: "Sliced Country Bread Nutrifree 300g", metaDescription: "Single-serve sliced bread with no wheat starch, soy, milk or eggs: indicative price and where to find it on Mappa Senza Glutine.", tags: ["bread", "lactose-free", "soy-free"] },
  "prod-5": { name: "Chocolix 110g", description: "Wafer bar coated in milk chocolate (32%) with caramel filling (30%), individually wrapped in 5 portions. A gluten-free indulgent snack.", metaTitle: "Chocolix Schär 110g", metaDescription: "Wafer bar coated in milk chocolate with caramel filling, individually wrapped: indicative price and where to find it on Mappa Senza Glutine.", tags: ["snack", "chocolate", "single-serve"] },
  "prod-6": { name: "Chocolate Chip Cookies 150g", description: "Shortbread cookies with dark chocolate chips (9.1%), gluten-free, lactose-free and palm-oil-free. In single-serve packs of 3 cookies, ideal for breakfast or a snack.", metaTitle: "Chocolate Chip Cookies Céréal 150g", metaDescription: "Shortbread cookies with dark chocolate chips, gluten-free, lactose-free and palm-oil-free: price and where to find them on Mappa Senza Glutine.", tags: ["cookies", "lactose-free", "palm-oil-free"] },
  "prod-7": { name: "Mix It! All-Purpose Flour 1kg", description: "All-purpose gluten-free flour for any baking recipe: cakes, bread, focaccia, fresh pasta and breading. Made from corn starch, rice flour and sorghum flour.", metaTitle: "Mix It! All-Purpose Flour Schär 1kg", metaDescription: "All-purpose gluten-free flour for cakes, bread, focaccia and fresh pasta: indicative price and where to find it on Mappa Senza Glutine.", tags: ["flour", "versatile", "vegan"] },
  "prod-8": { name: "Cake Mix 1kg", description: "Gluten-free flour blend specifically for cakes and cookies, low in sugar and saturated fat. Lactose-free and free from milk proteins.", metaTitle: "Cake Mix Nutrifree 1kg", metaDescription: "Gluten-free flour blend for cakes and cookies, low in sugar and saturated fat: price and where to find it on Mappa Senza Glutine.", tags: ["flour", "for baking", "lactose-free"] },
  "prod-9": { name: "Crackers 210g", description: "Classic gluten-free crackers, light and crumbly, in single-serve 35g packs. Ideal as a bread substitute or appetizer base. Made from corn starch and multigrain flours.", metaTitle: "Crackers Schär 210g", metaDescription: "Classic gluten-free crackers in single-serve 35g packs, ideal as a bread substitute: price and where to find them on Mappa Senza Glutine.", tags: ["crackers", "single-serve", "lactose-free"] },
  "prod-10": { name: "Crispbread 125g", description: "Gluten-free and lactose-free crispbread, made from corn flour and rice flour, in single-serve packs of 3 slices. Crunchy with a delicate taste, a light alternative to traditional bread.", metaTitle: "Crispbread Céréal 125g", metaDescription: "Gluten-free and lactose-free crispbread made from corn and rice flour: indicative price and where to find it on Mappa Senza Glutine.", tags: ["crispbread", "lactose-free", "bread substitute"] },
  "prod-11": { name: "Genovese Pesto 190g", description: "Pesto with fresh Italian basil (30%) and Parmigiano Reggiano DOP (5%). Gluten-free, preservative-free ready sauce, ideal for gluten-free pasta.", metaTitle: "Genovese Pesto Barilla 190g", metaDescription: "Pesto with fresh Italian basil and Parmigiano Reggiano DOP, gluten-free: indicative price and where to find it on Mappa Senza Glutine.", tags: ["pesto", "preservative-free", "with Parmigiano Reggiano DOP"] },
  "prod-12": { name: "Organic Pesto 130g", description: "Organic pesto with fresh basil (55%), extra virgin olive oil and pine nuts. Garlic-free and cheese-free, ideal for pasta, bruschetta or salads. Certified organic and gluten-free.", metaTitle: "Organic Pesto Sarchio 130g", metaDescription: "Organic pesto with fresh basil, garlic-free and cheese-free, certified gluten-free: price and where to find it on Mappa Senza Glutine.", tags: ["organic", "vegan", "garlic-free"] },
};

export function getLocalizedProduct(product: Product, locale: Locale): Product {
  if (locale === "it") return product;
  const tr = PRODUCT_EN[product.id];
  if (!tr) return product;
  return { ...product, name: tr.name, description: tr.description, metaTitle: tr.metaTitle, metaDescription: tr.metaDescription, tags: tr.tags };
}
