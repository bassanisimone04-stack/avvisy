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
