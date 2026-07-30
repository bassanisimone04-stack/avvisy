import type { Product } from "../types";
import type { Locale } from "./locale";

interface ProductTranslation {
  name: string;
  description: string;
  tags: string[];
}

export const PRODUCT_EN: Record<string, ProductTranslation> = {
  "prod-1": { name: "Gluten-Free Fusilli 400g", description: "White corn, yellow corn and whole rice fusilli, with no added starches. Cooks in 11 minutes, same quality as traditional Barilla pasta. Crossed Grain and Ministry of Health marks.", tags: ["pasta", "lactose-free", "reimbursable"] },
  "prod-2": { name: "Corn Eliche 250g", description: "100% Italian corn pasta, made with the exclusive Molino di Ferro method passed down for 6 generations. Cooks in 8-9 minutes, holds sauces very well.", tags: ["pasta", "lactose-free", "egg-free"] },
  "prod-3": { name: "Country Bread 240g", description: "Sliced bread with buckwheat flour (8%), soft with a rustic taste. Gluten-free, lactose-free and preservative-free. Shelf-stable at room temperature.", tags: ["bread", "lactose-free", "preservative-free"] },
  "prod-4": { name: "Sliced Country Bread 300g", description: "Soft sliced bread in single-serve packs of 2 slices, with extra virgin olive oil (2%). No wheat starch, soy, milk, eggs or preservatives.", tags: ["bread", "lactose-free", "soy-free"] },
  "prod-5": { name: "Chocolix 110g", description: "Wafer bar coated in milk chocolate (32%) with caramel filling (30%), individually wrapped in 5 portions. A gluten-free indulgent snack.", tags: ["snack", "chocolate", "single-serve"] },
  "prod-6": { name: "Chocolate Chip Cookies 150g", description: "Shortbread cookies with dark chocolate chips (9.1%), gluten-free, lactose-free and palm-oil-free. In single-serve packs of 3 cookies, ideal for breakfast or a snack.", tags: ["cookies", "lactose-free", "palm-oil-free"] },
  "prod-7": { name: "Mix It! All-Purpose Flour 1kg", description: "All-purpose gluten-free flour for any baking recipe: cakes, bread, focaccia, fresh pasta and breading. Made from corn starch, rice flour and sorghum flour.", tags: ["flour", "versatile", "vegan"] },
  "prod-8": { name: "Cake Mix 1kg", description: "Gluten-free flour blend specifically for cakes and cookies, low in sugar and saturated fat. Lactose-free and free from milk proteins.", tags: ["flour", "for baking", "lactose-free"] },
  "prod-9": { name: "Crackers 210g", description: "Classic gluten-free crackers, light and crumbly, in single-serve 35g packs. Ideal as a bread substitute or appetizer base. Made from corn starch and multigrain flours.", tags: ["crackers", "single-serve", "lactose-free"] },
  "prod-10": { name: "Crispbread 150g", description: "Gluten-free and lactose-free crispbread, made from corn flour and rice flour. Crunchy with a delicate taste, a light alternative to traditional bread.", tags: ["crispbread", "lactose-free", "bread substitute"] },
  "prod-11": { name: "Genovese Pesto 190g", description: "Pesto with fresh Italian basil (30%) and Parmigiano Reggiano DOP (5%). Gluten-free, preservative-free ready sauce, ideal for gluten-free pasta.", tags: ["pesto", "preservative-free", "with Parmigiano Reggiano DOP"] },
  "prod-12": { name: "Organic Pesto 130g", description: "Organic pesto with fresh basil (55%), extra virgin olive oil and pine nuts. Garlic-free and cheese-free, ideal for pasta, bruschetta or salads. Certified organic and gluten-free.", tags: ["organic", "vegan", "garlic-free"] },
};

export function getLocalizedProduct(product: Product, locale: Locale): Product {
  if (locale === "it") return product;
  const tr = PRODUCT_EN[product.id];
  if (!tr) return product;
  return { ...product, name: tr.name, description: tr.description, tags: tr.tags };
}
