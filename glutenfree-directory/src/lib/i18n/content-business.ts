import type { Business } from "../types";
import type { Locale } from "./locale";
import { getCategoryInfo, categoryLabelPlural } from "../categories";
import { cityName } from "./place-names";

interface BusinessTranslation {
  shortDescription: string;
  description: string;
  services: string[];
  glutenFreeMenu: string[];
}

export const BUSINESS_EN: Record<string, BusinessTranslation> = {
  "biz-1": {
    shortDescription: "AIC-certified fish restaurant, open since 2001 in Milan.",
    description: "Historic fish restaurant in the Sempione/Bullona area of Milan, open since 2001 and also featured in the Michelin Guide. AIC certified, it offers a selection of gluten-free dishes including bread and pasta.",
    services: ["AIC certified", "Fish-based cuisine", "Gluten-free menu"],
    glutenFreeMenu: ["Gluten-free bread and pasta", "Fish dishes"],
  },
  "biz-2": {
    shortDescription: "Restaurant and pizzeria near the Navigli, open since 1986, with gluten-free pizza.",
    description: "Restaurant and pizzeria a short walk from the Navigli, open since 1986, with a wide menu that includes pizza and traditional dishes in gluten-free versions as well as vegan options.",
    services: ["Restaurant and pizzeria", "Vegan options", "Near the Navigli"],
    glutenFreeMenu: ["Gluten-free pizza", "Traditional menu with gluten-free options"],
  },
  "biz-3": {
    shortDescription: "Pizzeria and bruschetteria in Ostiense, Rome, since 1999, dedicated gluten-free menu.",
    description: "Pizzeria and bruschetteria in the Ostiense district of Rome, open since 1999, known for its tall wood-fired pizzas. It offers a gluten-free menu prepared in a dedicated lab.",
    services: ["Pizzeria and bruschetteria", "Wood-fired oven", "Gluten-free menu in a dedicated lab"],
    glutenFreeMenu: ["Wood-fired gluten-free pizza", "Gluten-free bruschette"],
  },
  "biz-4": {
    shortDescription: "AIC-certified pizzeria, grill and burger restaurant in the Alessandrino district, Rome.",
    description: "Venue in Rome's Alessandrino district with a kitchen entirely AIC certified and separate from the rest of the premises. It offers gluten-free pizza, grilled meat and burgers, plus vegan and lactose-free options.",
    services: ["AIC certified", "Restaurant, grill, pizzeria, burger joint", "Vegan and lactose-free options"],
    glutenFreeMenu: ["Gluten-free pizza", "Grilled meat", "Gluten-free burgers"],
  },
  "biz-5": {
    shortDescription: "AIC-certified artisan pizzeria in the Isola district, awarded Best GF Pizza.",
    description: "Artisan pizzeria in Milan's Isola district, AIC certified. Known for high-hydration, slow-rise dough, it offers gluten-free pizza made with dedicated ingredients and awarded Best GF Pizza 2025.",
    services: ["AIC certified", "Slow-rise dough", "Award-winning gluten-free pizza"],
    glutenFreeMenu: ["Gluten-free pizza with dedicated dough", "Gluten-free fried appetizers"],
  },
  "biz-6": {
    shortDescription: "AIC-certified restaurant with a dual separate kitchen, zero cross-contamination.",
    description: "Restaurant-pizzeria with a completely separate dual kitchen ensuring zero cross-contamination. All menu items are available gluten-free and lactose-free, AIC certified.",
    services: ["AIC certified", "Dual separate kitchen", "Home delivery"],
    glutenFreeMenu: ["Neapolitan gluten-free pizza", "Neapolitan fried appetizers", "Gluten-free fresh pasta"],
  },
  "biz-7": {
    shortDescription: "AIC-certified restaurant in Turin specializing in Ligurian and Piedmontese gluten-free dishes.",
    description: "AIC-certified restaurant in the center of Turin, specializing in Ligurian and Piedmontese cuisine. It offers focaccia di Recco, farinata and first courses, all available gluten-free.",
    services: ["AIC certified", "Ligurian and Piedmontese cuisine", "Gluten-free focaccia"],
    glutenFreeMenu: ["Gluten-free focaccia di Recco", "Farinata", "Gluten-free first courses"],
  },
  "biz-8": {
    shortDescription: "AIC-certified pizzeria with over 25 years of gluten-free experience, near Turin.",
    description: "Historic AIC-certified pizzeria in Venaria Reale, near Turin, with over 25 years of experience in gluten-free preparation. Neapolitan pizza with dedicated dough and a full range of appetizers and desserts.",
    services: ["AIC certified", "Neapolitan pizza", "Over 25 years of gluten-free experience"],
    glutenFreeMenu: ["Neapolitan gluten-free pizza", "Gluten-free appetizers and desserts"],
  },
  "biz-9": {
    shortDescription: "AIC-certified trattoria in Bologna, exclusively gluten-free kitchen.",
    description: "Trattoria in Bologna with an exclusively gluten-free kitchen, AIC certified. It serves traditional Emilian cuisine — tagliatelle, tortellini, crescentine — all gluten-free. One of the few entirely dedicated restaurants in Italy.",
    services: ["AIC certified", "Exclusively gluten-free kitchen", "Emilian tradition"],
    glutenFreeMenu: ["Gluten-free tagliatelle al ragù", "Gluten-free tortellini", "Crescentine and tigelle"],
  },
  "biz-10": {
    shortDescription: "AIC-certified restaurant near the Vatican, dual separate kitchen for zero contamination.",
    description: "Mama Eat's Roman location at Borgo Pio, near the Vatican. Completely separate dual kitchen ensuring zero cross-contamination, AIC certified. Dishes served on different-colored tableware for identification.",
    services: ["AIC certified", "Dual separate kitchen", "Delivery via Glovo"],
    glutenFreeMenu: ["Neapolitan gluten-free pizza", "Linguine alla Nerano", "Neapolitan fried appetizers", "Gluten-free calzone"],
  },
  "biz-11": {
    shortDescription: "100% gluten-free bakery and pastry shop in the EUR district, with artisan lab.",
    description: "Bakery and pastry shop in Rome's EUR district, entirely dedicated to gluten-free production with an in-house lab. Every day it offers fresh pizza al taglio, artisan bread, pastries and a range of reimbursable packaged products.",
    services: ["100% gluten-free bakery", "In-house artisan lab", "Accepts ASL prescriptions"],
    glutenFreeMenu: ["Gluten-free pizza al taglio", "Fresh artisan bread", "Cakes and pastries", "Reimbursable packaged products"],
  },
  "biz-12": {
    shortDescription: "Historic Neapolitan pizzeria since 1901, gluten-free pizza with a dedicated oven.",
    description: "Historic Neapolitan pizzeria founded in 1901 in the Materdei district, run by the Starita family for generations. All pizzas are available gluten-free and baked in a separate dedicated oven.",
    services: ["Dedicated gluten-free oven", "Traditional Neapolitan pizza since 1901", "Home delivery"],
    glutenFreeMenu: ["Gluten-free margherita pizza", "Fried pizza", "Montanara", "Stuffed calzone"],
  },
  "biz-13": {
    shortDescription: "AIC-certified pizzeria in Naples with dedicated counter and oven for gluten-free.",
    description: "AIC-certified pizzeria with three locations in Naples, featuring a counter and oven entirely dedicated to gluten-free preparation. The full menu is available gluten-free, including fried items, first courses and desserts.",
    services: ["AIC certified", "Dedicated gluten-free counter and oven", "Delivery via Just Eat"],
    glutenFreeMenu: ["Neapolitan gluten-free pizza", "Fried seafood", "Baked pasta", "Neapolitan gluten-free desserts"],
  },
  "biz-14": {
    shortDescription: "Café-bar with exclusively gluten-free Neapolitan pastry, across from the MANN.",
    description: "The first gluten-free café-bar by Casa Infante, with a first-floor lab exclusively dedicated to gluten-free production. Located across from the MANN, it offers the full Neapolitan pastry tradition in a gluten-free version.",
    services: ["Exclusively gluten-free pastry", "Dedicated first-floor lab", "Online shop with shipping"],
    glutenFreeMenu: ["Gluten-free and lactose-free babà", "Gluten-free sfogliatella", "Neapolitan taralli", "Pastiera"],
  },
  "biz-15": {
    shortDescription: "AIC-certified pizzeria in Florence, world gluten-free pizza champion.",
    description: "Restaurant-pizzeria with over 70 years of history (since 1948), winner of the world gluten-free pizza championship. AIC and AVPN certified, it offers the full menu gluten-free with a separate oven.",
    services: ["AIC certified", "World gluten-free pizza champion", "Dedicated oven"],
    glutenFreeMenu: ["Neapolitan gluten-free pizza", "Cheese ravioli", "Calzone", "Homemade fresh pasta"],
  },
  "biz-16": {
    shortDescription: "Florence's first 100% gluten-free restaurant, AIC certified, in a Renaissance cloister.",
    description: "Florence's first 100% gluten-free restaurant, open since 2014 and AIC certified. Set in a charming 16th-century cloister with an urban garden, it offers gourmet cuisine blending Tuscan tradition with Asian flavors.",
    services: ["AIC certified", "100% gluten-free kitchen", "Sunday brunch", "Urban garden in the cloister"],
    glutenFreeMenu: ["Homemade potato gnocchi", "Quinoa and lentil burger", "Gluten-free Tuscan tradition", "Fusion dishes"],
  },
};

const REVIEW_EN: Record<string, { title: string; body: string }> = {
  "Chiara M.": { title: "Finally, no more worries", body: "Dedicated menu with a separate kitchen, staff extremely knowledgeable about celiac disease. Definitely coming back." },
  "Davide R.": { title: "Top quality", body: "Perfect dough and no cross-contamination, you can tell they care." },
  "Federica S.": { title: "Very good", body: "Great value for money, friendly and knowledgeable staff." },
  "Luca P.": { title: "Highly recommended", body: "Lovely setting and a wide gluten-free menu, nothing is missing compared to the regular menu." },
  "Martina B.": { title: "Great experience", body: "Easy booking, they asked right away about any intolerances. Well done." },
  "Giorgio T.": { title: "Best for celiacs", body: "AIC certification on display and trained staff. The perfect place for a worry-free dinner." },
};

function faqsEn(name: string, city: string, categorySlug: Business["category"]): Business["faqs"] {
  const cat = getCategoryInfo(categorySlug);
  const catLabel = (cat ? categoryLabelPlural(cat, "en") : "venues").toLowerCase();
  return [
    { question: `Does ${name} in ${city} really have a contamination-free kitchen?`, answer: "Yes, the business uses dedicated equipment, surfaces and, where indicated, separate areas for preparing gluten-free dishes, minimizing the risk of cross-contamination." },
    { question: `Do I need to book in advance at ${name}?`, answer: "We recommend booking, especially on weekends, and mentioning your need for a gluten-free menu when you reserve." },
    { question: `Are there other gluten-free ${catLabel} in ${city} besides ${name}?`, answer: `Yes, the Mappa Senza Glutine directory lists all the gluten-free ${catLabel} verified in ${city}, with AIC certification or community verification.` },
    { question: "Are there options for other intolerances too?", answer: "Many dishes can be adapted for lactose intolerance or vegetarian diets: check directly with the business for specific needs." },
  ];
}

const DAY_EN: Record<string, string> = {
  Lunedì: "Monday",
  Martedì: "Tuesday",
  Mercoledì: "Wednesday",
  Giovedì: "Thursday",
  Venerdì: "Friday",
  Sabato: "Saturday",
  Domenica: "Sunday",
};

export function getLocalizedBusiness(business: Business, locale: Locale): Business {
  if (locale === "it") return business;
  const tr = BUSINESS_EN[business.id];
  if (!tr) return business;
  return {
    ...business,
    shortDescription: tr.shortDescription,
    description: tr.description,
    services: tr.services,
    glutenFreeMenu: tr.glutenFreeMenu,
    hours: business.hours.map((h) => ({ ...h, day: DAY_EN[h.day] ?? h.day, hours: h.hours === "Chiuso" ? "Closed" : h.hours })),
    reviews: business.reviews.map((r) => ({ ...r, ...(REVIEW_EN[r.author] ?? {}) })),
    faqs: faqsEn(business.name, cityName(business.city, "en"), business.category),
  };
}
