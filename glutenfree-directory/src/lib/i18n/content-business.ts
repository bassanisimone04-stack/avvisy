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
    shortDescription: "100% gluten-free Milanese cuisine with fresh house-made pasta.",
    description: "Contemporary Milanese cuisine, entirely gluten-free, with an in-house fresh pasta lab and a separate oven for bread. A landmark for the celiac community in Lombardy's capital, with a seasonal menu and meticulous attention to cross-contamination.",
    services: ["100% gluten-free kitchen", "Online booking", "Kid-friendly", "Wheelchair accessible"],
    glutenFreeMenu: ["Fresh house-made pasta", "Seasonal risottos", "Sliced beef tagliata", "Gluten-free tiramisù"],
  },
  "biz-2": {
    shortDescription: "AIC-certified dedicated oven, long-leavened dough.",
    description: "AIC-certified separate oven and long-leavened gluten-free dough, wood-fired. The pizzeria has become a gathering spot for celiac families in Brianza thanks to a wide menu and fast, reliable home delivery.",
    services: ["Dedicated oven", "Long-leavened dough", "Takeaway", "Delivery"],
    glutenFreeMenu: ["Gluten-free Margherita", "Pan pizza", "Gluten-free fried starters", "Stuffed calzone"],
  },
  "biz-3": {
    shortDescription: "Boutique hotel with 100% gluten-free breakfast and restaurant.",
    description: "Boutique hotel in the hills of Fiesole overlooking Florence, with breakfast entirely gluten-free prepared in a dedicated kitchen and an in-house restaurant with an AIC-certified menu. Perfect for a Tuscan getaway without compromises.",
    services: ["Gluten-free breakfast", "Dedicated in-house restaurant", "Pool", "Private parking"],
    glutenFreeMenu: ["Sweet and savory gluten-free breakfast", "Tasting dinner menu", "Certified baked goods"],
  },
  "biz-4": {
    shortDescription: "Dedicated section with AIC Formulary products and advice.",
    description: "A wide, constantly updated section with reimbursable and non-reimbursable products from the AIC Formulary. Staff are trained to advise on interactions and product safety for people with celiac disease and gluten sensitivity.",
    services: ["Dedicated section", "Nutritional advice", "Home delivery", "Online booking"],
    glutenFreeMenu: ["Gluten-free supplements", "Baby products", "Certified cosmetics"],
  },
  "biz-5": {
    shortDescription: "Large gluten-free corner and organic alternatives.",
    description: "A large corner dedicated to gluten-free products, with AIC-certified brands and organic alternatives. The store regularly hosts information days with nutritionists focused on celiac disease.",
    services: ["Gluten-free corner", "Home delivery", "Organic products", "Parking"],
    glutenFreeMenu: ["Bread and substitutes", "Corn and rice pasta", "Certified sweets and snacks"],
  },
  "biz-6": {
    shortDescription: "Traditional Neapolitan cuisine with a dedicated pasta lab.",
    description: "Traditional Neapolitan cuisine reinvented gluten-free, with a dedicated fresh pasta lab. The staff know celiac disease inside out and also offer classic Neapolitan desserts reworked gluten-free.",
    services: ["Separate kitchen", "Kids' menu", "Outdoor terrace", "Celiac and vegan friendly"],
    glutenFreeMenu: ["Gluten-free scialatielli", "Eggplant parmigiana", "Gluten-free babà"],
  },
  "biz-7": {
    shortDescription: "Authentic Neapolitan pizza with a certified separate oven.",
    description: "Authentic Neapolitan-style pizza in gluten-free form, with oven and dough completely separate from the rest of the kitchen. Great value for families and groups.",
    services: ["Separate oven", "Delivery", "Affordable prices"],
    glutenFreeMenu: ["Gluten-free Neapolitan pizza", "Gluten-free montanare", "Dedicated fried starters"],
  },
  "biz-8": {
    shortDescription: "Sea-view hotel on the Amalfi Coast with certified restaurant.",
    description: "A property overlooking the Amalfi Coast with a certified in-house restaurant and breakfast entirely gluten-free. Staff help celiac guests choose safe excursions and restaurants in the area.",
    services: ["Dedicated restaurant", "Sea view", "Gluten-free breakfast", "Spa"],
    glutenFreeMenu: ["Full gluten-free breakfast", "Coastal tasting menu"],
  },
  "biz-9": {
    shortDescription: "100% gluten-free shop with fresh bread and pastries daily.",
    description: "A shop entirely dedicated to gluten-free in the heart of Florence's Oltrarno, with fresh bread and pastries baked daily in an in-house lab free from contamination.",
    services: ["100% gluten-free", "Fresh products", "Personalized advice", "Shipping"],
    glutenFreeMenu: ["Daily fresh bread", "Artisan pastries", "Fresh pasta", "Ready-made deli food"],
  },
  "biz-10": {
    shortDescription: "Gluten-free breakfasts with fresh croissants every morning.",
    description: "A historic café in central Pisa with a gluten-free breakfast corner restocked every morning from a dedicated lab, for a worry-free start to the day.",
    services: ["Gluten-free breakfasts", "Fresh croissants every morning", "Dedicated area"],
    glutenFreeMenu: ["Gluten-free croissants", "Artisan cakes", "Deli sandwiches"],
  },
  "biz-11": {
    shortDescription: "Artisan gelato with dedicated tubs and cones.",
    description: "Artisan gelato made in-house with tubs entirely dedicated to gluten-free, avoiding any contamination risk even in cream-based flavors.",
    services: ["Artisan gelato", "Dedicated tubs", "Gluten-free and lactose-free flavors"],
    glutenFreeMenu: ["Gluten-free cream gelato", "Gluten-free cones", "Semifreddo"],
  },
  "biz-12": {
    shortDescription: "Sicilian panoramic cuisine with house-made gluten-free desserts.",
    description: "A panoramic restaurant in the heart of Taormina with a Sicilian menu entirely available gluten-free, including the famous cannolo made in a dedicated lab.",
    services: ["Panoramic terrace", "Gluten-free tasting menu", "Booking recommended"],
    glutenFreeMenu: ["Gluten-free pasta alla Norma", "Fresh catch of the day", "Gluten-free cannolo"],
  },
  "biz-13": {
    shortDescription: "Dedicated section with AIC Formulary products.",
    description: "A historic pharmacy in central Palermo with a section updated with AIC Formulary products and staff available to clarify doubts about labels and prescriptions.",
    services: ["Dedicated section", "Pharmacist advice", "Prescription booking"],
    glutenFreeMenu: ["AIC-reimbursable products", "Supplements", "Kids' line"],
  },
  "biz-14": {
    shortDescription: "Gluten-free Veneto cuisine with a view of the Adige.",
    description: "A restaurant overlooking the Adige river offering traditional Veneto cuisine entirely reworked gluten-free, with a cellar of selected local labels.",
    services: ["Gluten-free Veneto cuisine", "Selected wine cellar", "River view"],
    glutenFreeMenu: ["Gluten-free risotto all'Amarone", "Gluten-free bigoli", "Tiramisù"],
  },
  "biz-15": {
    shortDescription: "Large celiac-friendly corner in the heart of Bologna.",
    description: "An organic supermarket in central Bologna with a steadily growing dedicated section, much appreciated by the local celiac community for its range and freshness.",
    services: ["Celiac-friendly corner", "Home delivery", "Local products"],
    glutenFreeMenu: ["Corn tagliatelle", "Gluten-free tigelle", "Certified snacks"],
  },
  "biz-16": {
    shortDescription: "Dedicated oven and fast delivery in central Turin.",
    description: "A pizzeria in central Turin with an oven entirely dedicated to gluten-free and fast delivery across the city, very active on social media with the local celiac community.",
    services: ["Dedicated oven", "Fast delivery", "Family friendly"],
    glutenFreeMenu: ["Gluten-free round pizza", "Stuffed focaccia", "Gluten-free desserts"],
  },
  "biz-20": {
    shortDescription: "Traditional 100% gluten-free Roman cuisine in the heart of Trastevere.",
    description: "A trattoria in the heart of Trastevere specializing in classic Roman cuisine reinvented gluten-free: from house-made fresh pasta to suppli fried in dedicated oil, with an AIC-certified kitchen and staff trained on cross-contamination.",
    services: ["Dedicated kitchen", "Online booking", "Traditional Roman menu", "Kid-friendly"],
    glutenFreeMenu: ["Gluten-free cacio e pepe", "Amatriciana with gluten-free pasta", "Gluten-free suppli al telefono", "Gluten-free tiramisù"],
  },
  "biz-21": {
    shortDescription: "AIC-certified dedicated oven for crispy gluten-free Roman-style pizza.",
    description: "A pizzeria in the Testaccio district with a separate AIC-certified oven, specializing in crispy Roman-style gluten-free pizza and pizza by the slice, plus a selection of Roman fried snacks prepared in dedicated oil.",
    services: ["AIC-certified dedicated oven", "Round and by-the-slice pizza", "Delivery", "Family friendly"],
    glutenFreeMenu: ["Crispy Roman gluten-free pizza", "Gluten-free pizza by the slice", "Dedicated fried snacks", "Gluten-free trapizzino"],
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
